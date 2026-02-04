import db from '../../../shared/config/db';
import { Administrador } from './administradorModel';
import { TipoUsuario } from '../../../shared/constants/tipoUsuario';

export class AdministradorRepository {

    /**
     * Insere em Usuario -> Pega ID -> Insere em Administrador.
     */
    async criar(admin: Administrador): Promise<Administrador> {
        const client = await db.getClient();

        try {
            await client.query('BEGIN'); // Inicia a transação

            // Insere na tabela Pai (Usuario)
            const queryUsuario = `
                INSERT INTO "Usuario" (nome, "ultimoNome", email, senha, "tipoUsuario", passe)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id_usuario;
            `;
            const valuesUsuario = [
                admin.nome,
                admin.ultimoNome,
                admin.email,
                admin.senha,
                TipoUsuario.ADMINISTRADOR,
                admin.passe
            ];
            
            const resUsuario = await client.query(queryUsuario, valuesUsuario);
            const novoId = resUsuario.rows[0].id_usuario;

            // Insere na tabela Filha (Administrador)
            const queryAdmin = `
                INSERT INTO "Administrador" (id_usuario, instagram)
                VALUES ($1, $2);
            `;
            await client.query(queryAdmin, [novoId, admin.instagram]);

            await client.query('COMMIT'); // Confirma tudo
            
            // Atualiza o ID do objeto para retornar
            admin.idUsuario = novoId;
            return admin;

        } catch (error) {
            await client.query('ROLLBACK'); // Desfaz tudo se der erro
            throw error;
        } finally {
            client.release(); // Libera a conexão volta pro pool
        }
    }

    /**
     * Atualiza dados do Administrador.
     * Precisa atualizar tanto a tabela Pai quanto a Filha.
     */
async atualizar(admin: Administrador): Promise<void> {
        const client = await db.getClient();
        try {
            await client.query('BEGIN');

            // 1. Atualiza a tabela PAI (Usuario)
            // Usamos COALESCE para manter o valor antigo se o novo for null/undefined
            const queryUsuario = `
                UPDATE "Usuario"
                SET 
                    nome = COALESCE($1, nome),
                    "ultimoNome" = COALESCE($2, "ultimoNome"),
                    email = COALESCE($3, email),
                    passe = COALESCE($4, passe)
                WHERE id_usuario = $5
            `;
            const valuesUsuario = [admin.nome, admin.ultimoNome, admin.email, admin.passe, admin.idUsuario];
            const resultUsuario = await client.query(queryUsuario, valuesUsuario);

            // --- AQUI ESTÁ A CORREÇÃO ---
            // Se nenhuma linha foi afetada na tabela de usuários, o ID não existe.
            if (resultUsuario.rowCount === 0) {
                throw new Error('Administrador não encontrado.');
            }
            // -----------------------------

            // 2. Atualiza a tabela FILHA (Administrador)
            // Assumindo que o campo 'instagram' fica nesta tabela
            if (admin.instagram) {
                const queryAdmin = `
                    UPDATE "Administrador"
                    SET instagram = $1
                    WHERE id_usuario = $2
                `;
                await client.query(queryAdmin, [admin.instagram, admin.idUsuario]);
            }

            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async listar(): Promise<any[]> {
        // Faz o JOIN para pegar dados do Usuario (Nome, Email) + dados do Admin (Instagram)
        const query = `
            SELECT u.id_usuario, u.nome, u."ultimoNome", u.email, u.passe, a.instagram
            FROM "Administrador" a
            JOIN "Usuario" u ON a.id_usuario = u.id_usuario
        `;
        const result = await db.query(query, []);
        return result.rows;
    }
}

export default new AdministradorRepository();