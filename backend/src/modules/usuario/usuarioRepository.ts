import database from '../../shared/config/db';

export class UsuarioRepository {
    // Busca um usuário pelo email para validar o login
    async buscarPorEmail(email: string) {
        const sql = 'SELECT * FROM "Usuario" WHERE email = $1';
        const result = await database.query(sql, [email]);
        return result.rows[0]; // Retorna o usuário ou undefined
    }
}