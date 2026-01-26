// backend/src/modules/usuario/usuarioCertificavel/professor/professorRepository.ts
import db from '../../../../shared/config/db'; // Importação sem chaves (export default)

export class ProfessorRepository {
    
    // CRIAÇÃO COM TRANSAÇÃO (Usuario -> Certificavel -> Professor)
    async create(professor: any): Promise<void> {
        // CORREÇÃO AQUI: Usamos getClient() em vez de connect()
        const client = await db.getClient(); 
        
        try {
            await client.query('BEGIN'); // Inicia a transação

            // 1. Insere na tabela pai (Usuario)
            const usuarioQuery = `
                INSERT INTO "Usuario" (nome, "ultimoNome", email, senha, "tipoUsuario", passe)
                VALUES ($1, $2, $3, $4, 'Professor', $5)
                RETURNING id_usuario;
            `;
            // Ajuste: garanta que 'passe' tenha valor padrão
            const passeValor = professor.passe !== undefined ? professor.passe : false;
            
            const usuarioValues = [professor.nome, professor.ultimoNome, professor.email, professor.senha, passeValor];
            const usuarioResult = await client.query(usuarioQuery, usuarioValues);
            const idUsuario = usuarioResult.rows[0].id_usuario;

            // 2. Insere na tabela intermediária (UsuarioCertificavel)
            const certificavelQuery = `
                INSERT INTO "UsuarioCertificavel" (id_usuario, cpf, foto)
                VALUES ($1, $2, $3);
            `;
            await client.query(certificavelQuery, [idUsuario, professor.cpf, professor.foto]);

            // 3. Insere na tabela específica (Professor)
            const professorQuery = `
                INSERT INTO "Professor" (id_usuario, curriculo, telefone)
                VALUES ($1, $2, $3);
            `;
            await client.query(professorQuery, [idUsuario, professor.curriculo, professor.telefone]);

            await client.query('COMMIT'); // Salva tudo
        } catch (error: any) {
            await client.query('ROLLBACK'); // Desfaz tudo se der erro
            // --- TRATAMENTO DE ERRO PERSONALIZADO ---
            
            // O código '23505' é o código padrão do PostgreSQL para "Unique Violation"
            if (error.code === '23505') {
                // Verifica qual campo duplicou
                if (error.constraint === 'Usuario_email_key') {
                    throw new Error("Professor já existe (Email já utilizado).");
                }
                if (error.constraint === 'UsuarioCertificavel_cpf_key') {
                    throw new Error("Professor já existe (CPF já utilizado).");
                }
                // Fallback genérico caso seja outra chave
                throw new Error("Professor já existe.");
            }
            
            // Se for outro erro (ex: banco fora do ar), repassa o erro original
            throw error;
        } finally {
            client.release(); // Libera a conexão de volta para o Pool
        }
    }

    // LEITURA (Usamos db.query direto pois não precisa de transação)
    async findAll(filters: any): Promise<any[]> {
        let query = `
            SELECT 
                u.id_usuario, u.nome, u."ultimoNome", u.email, u.passe,
                uc.cpf, uc.foto,
                p.curriculo, p.telefone
            FROM "Professor" p
            JOIN "UsuarioCertificavel" uc ON p.id_usuario = uc.id_usuario
            JOIN "Usuario" u ON p.id_usuario = u.id_usuario
            WHERE 1=1
        `;
        
        const values: any[] = [];
        let count = 1;

        if (filters.nome) {
            query += ` AND u.nome ILIKE $${count}`;
            values.push(`%${filters.nome}%`);
            count++;
        }
        if (filters.email) {
            query += ` AND u.email = $${count}`;
            values.push(filters.email);
            count++;
        }

        const result = await db.query(query, values);
        return result.rows;
    }

    async findById(id: number): Promise<any> {
        const query = `
            SELECT 
                u.id_usuario, u.nome, u."ultimoNome", u.email,
                uc.cpf, uc.foto,
                p.curriculo, p.telefone
            FROM "Professor" p
            JOIN "UsuarioCertificavel" uc ON p.id_usuario = uc.id_usuario
            JOIN "Usuario" u ON p.id_usuario = u.id_usuario
            WHERE p.id_usuario = $1
        `;
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    async update(id: number, dados: any): Promise<void> {
        
        const client = await db.getClient();
        try {
            await client.query('BEGIN');

            const checkQuery = `SELECT id_usuario FROM "Professor" WHERE id_usuario = $1`;
            const checkResult = await client.query(checkQuery, [id]);

            if (checkResult.rowCount === 0) {
                throw new Error("Este usuário não foi cadastrado ou não é um professor.");
            }

            // 2. Atualiza tabela PAI ("Usuario")
            // Incluído: ultimoNome e passe
            if (dados.nome || dados.email || dados.ultimoNome || dados.passe !== undefined) {
                await client.query(
                    `UPDATE "Usuario" SET 
                        nome = COALESCE($1, nome), 
                        email = COALESCE($2, email),
                        "ultimoNome" = COALESCE($3, "ultimoNome"),
                        passe = COALESCE($4, passe)
                     WHERE id_usuario = $5`,
                    [dados.nome, dados.email, dados.ultimoNome, dados.passe, id]
                );
            }

            // 3. Atualiza tabela INTERMEDIÁRIA ("UsuarioCertificavel") - NOVO
            // Incluído: cpf e foto
            if (dados.cpf || dados.foto) {
                await client.query(
                    `UPDATE "UsuarioCertificavel" SET 
                        cpf = COALESCE($1, cpf), 
                        foto = COALESCE($2, foto) 
                     WHERE id_usuario = $3`,
                    [dados.cpf, dados.foto, id]
                );
            }

            // 4. Atualiza tabela FILHA ("Professor")
            if (dados.curriculo || dados.telefone) {
                await client.query(
                    `UPDATE "Professor" SET 
                        curriculo = COALESCE($1, curriculo), 
                        telefone = COALESCE($2, telefone) 
                     WHERE id_usuario = $3`,
                    [dados.curriculo, dados.telefone, id]
                );
            }

            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            throw error; // Se o CPF novo já existir no banco, o erro de "Unique Constraint" estoura aqui
        } finally {
            client.release();
        }
    }

    async delete(id: number): Promise<void> {

        // Tenta deletar da tabela PAI (Usuario). O CASCADE apaga o resto.
        const result = await db.query(`DELETE FROM "Usuario" WHERE id_usuario = $1`, [id]);

        // Se rowCount for 0, ninguém foi deletado.
        if (result.rowCount === 0) {
            throw new Error("Usuário não existe ou já foi excluído.");
        }
    }
}