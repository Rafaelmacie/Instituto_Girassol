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
                admin.senha, // TODO: Em produção, lembre-se de hashear a senha antes (bcrypt)
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
    async atualizar(admin: Administrador): Promise<Administrador> {
        const client = await db.getClient();

        try {
            await client.query('BEGIN');

            // Atualiza a Tabela Pai
            const queryUsuario = `
                UPDATE "Usuario"
                SET nome = $1, "ultimoNome" = $2, email = $3, senha = $4
                WHERE id_usuario = $5
            `;
            await client.query(queryUsuario, [
                admin.nome, 
                admin.ultimoNome, 
                admin.email, 
                admin.senha, 
                admin.idUsuario
            ]);

            // Atualiza a Tabela Filha
            const queryAdmin = `
                UPDATE "Administrador"
                SET instagram = $1
                WHERE id_usuario = $2
            `;
            await client.query(queryAdmin, [admin.instagram, admin.idUsuario]);

            await client.query('COMMIT');
            return admin;

        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
}

export default new AdministradorRepository();