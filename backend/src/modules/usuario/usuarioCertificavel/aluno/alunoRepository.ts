// Importe a instância padrão (que você exportou como default)
import database from '../../../../shared/config/db'; 

export class AlunoRepository {
    async criar(aluno: any) {
        const client = await database.getClient(); 
        
        try {
            await client.query('BEGIN');

            // 1. Inserir na tabela pai "Usuario"
            const queryUsuario = `
                INSERT INTO "Usuario" (nome, "ultimoNome", email, senha, "tipoUsuario", "passe")
                VALUES ($1, $2, $3, $4, 'Aluno', $5) RETURNING id_usuario
            `;
            // Define passe como false se não for enviado
            const passeValor = aluno.passe !== undefined ? aluno.passe : false;

            const resUser = await client.query(queryUsuario, [aluno.nome, aluno.ultimoNome, aluno.email, aluno.senha, passeValor]);
            const idUsuario = resUser.rows[0].id_usuario;

            // 2. Inserir na tabela "UsuarioCertificavel"
            const queryCert = `INSERT INTO "UsuarioCertificavel" (id_usuario, cpf, foto) VALUES ($1, $2, $3)`;
            await client.query(queryCert, [idUsuario, aluno.cpf, aluno.foto]);

            // 3. Inserir na tabela "Aluno"
            const queryAluno = `INSERT INTO "Aluno" (id_usuario) VALUES ($1)`;
            await client.query(queryAluno, [idUsuario]);

            await client.query('COMMIT');
            return idUsuario;

        } catch (e: any) { // Note o ": any" para o TypeScript aceitar
            await client.query('ROLLBACK');
            
            // Tratamento de erros de duplicidade
            if (e.code === '23505') {
                if (e.constraint === 'Usuario_email_key') throw new Error("Email já cadastrado.");
                if (e.constraint === 'UsuarioCertificavel_cpf_key') throw new Error("CPF já cadastrado.");
            }
            throw e;
        } finally {
            client.release(); 
        }
    }

async editar(id: number, dados: any): Promise<void> {
        const client = await database.getClient();
        try {
            await client.query('BEGIN');

            // 1. Verifica se o aluno existe antes de tentar editar
            const checkQuery = `SELECT id_usuario FROM "Aluno" WHERE id_usuario = $1`;
            const checkResult = await client.query(checkQuery, [id]);
            
            if (checkResult.rowCount === 0) {
                throw new Error("Aluno não encontrado.");
            }

            // 2. Atualiza dados básicos na tabela Pai ("Usuario")
            // COALESCE: Se o dado vir "undefined" ou "null", ele mantém o valor atual do banco
            const queryUsuario = `
                UPDATE "Usuario" 
                SET 
                    nome = COALESCE($1, nome), 
                    "ultimoNome" = COALESCE($2, "ultimoNome"), 
                    email = COALESCE($3, email),
                    passe = COALESCE($4, passe)
                WHERE id_usuario = $5
            `;
            await client.query(queryUsuario, [dados.nome, dados.ultimoNome, dados.email, dados.passe, id]);

            // 3. Atualiza dados específicos na tabela Intermediária ("UsuarioCertificavel")
            const queryCertificavel = `
                UPDATE "UsuarioCertificavel" 
                SET 
                    cpf = COALESCE($1, cpf), 
                    foto = COALESCE($2, foto)
                WHERE id_usuario = $3
            `;
            await client.query(queryCertificavel, [dados.cpf, dados.foto, id]);

            await client.query('COMMIT');
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
    }

    async listar(filtros: any) {
    // Começamos com a query base fazendo o JOIN nas 3 tabelas
    let sql = `
        SELECT u.id_usuario, u.nome, u."ultimoNome", u.email, uc.cpf, uc.foto 
        FROM "Usuario" u
        JOIN "UsuarioCertificavel" uc ON u.id_usuario = uc.id_usuario
        JOIN "Aluno" a ON uc.id_usuario = a.id_usuario
        WHERE 1=1
    `;
    const params: any[] = [];

    // Filtro por Nome (ILIKE ignora maiúsculas/minúsculas)
    if (filtros.nome) {
        params.push(`%${filtros.nome}%`);
        sql += ` AND u.nome ILIKE $${params.length}`;
    }

    // Filtro por CPF
    if (filtros.cpf) {
        params.push(filtros.cpf);
        sql += ` AND uc.cpf = $${params.length}`;
    }

    const result = await database.query(sql, params);
    return result.rows;
    }

    async excluir(id: number): Promise<void> {
        // Deletar da tabela PAI remove os filhos automaticamente (se configurado com Cascade no banco)
        // Caso contrário, precisaria deletar na ordem inversa
        const sql = `DELETE FROM "Usuario" WHERE id_usuario = $1`;
        const result = await database.query(sql, [id]);

        if (result.rowCount === 0) {
            throw new Error("Aluno não encontrado para exclusão.");
        }
    }
}