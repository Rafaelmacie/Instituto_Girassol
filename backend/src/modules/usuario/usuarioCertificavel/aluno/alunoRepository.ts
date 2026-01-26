// Importe a instância padrão (que você exportou como default)
import database from '../../../../shared/config/db'; 

export class AlunoRepository {
    async criar(aluno: any) {
        // Use o método getClient() da sua classe Database
        const client = await database.getClient(); 
        
        try {
            await client.query('BEGIN');

            // 1. Inserir na tabela pai "Usuario"
            const queryUsuario = `
                INSERT INTO "Usuario" (nome, "ultimoNome", email, senha, "tipoUsuario", "passe")
                VALUES ($1, $2, $3, $4, 'Aluno', true) RETURNING id_usuario
            `;
            const resUser = await client.query(queryUsuario, [aluno.nome, aluno.ultimoNome, aluno.email, aluno.senha]);
            const idUsuario = resUser.rows[0].id_usuario;

            // 2. Inserir na tabela "UsuarioCertificavel"
            const queryCert = `INSERT INTO "UsuarioCertificavel" (id_usuario, cpf, foto) VALUES ($1, $2, $3)`;
            await client.query(queryCert, [idUsuario, aluno.cpf, aluno.foto]);

            // 3. Inserir na tabela "Aluno"
            const queryAluno = `INSERT INTO "Aluno" (id_usuario) VALUES ($1)`;
            await client.query(queryAluno, [idUsuario]);

            await client.query('COMMIT');
            return idUsuario;
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release(); // Libera o cliente de volta para o pool
        }
    }

    async editar(id: number, dados: any): Promise<void> {
    const client = await database.getClient();
    try {
        await client.query('BEGIN');

        // 1. Atualiza dados básicos na tabela Pai
        const queryUsuario = `
            UPDATE "Usuario" 
            SET nome = $1, "ultimoNome" = $2, email = $3
            WHERE id_usuario = $4
        `;
        await client.query(queryUsuario, [dados.nome, dados.ultimoNome, dados.email, id]);

        // 2. Atualiza dados específicos na tabela Intermediária
        const queryCertificavel = `
            UPDATE "UsuarioCertificavel" 
            SET cpf = $1, foto = $2
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
    const sql = `DELETE FROM "Usuario" WHERE id_usuario = $1`;
    await database.query(sql, [id]);
}
}