import db from '../../../shared/config/db';

export class RespostaRepository {
    async create(texto: string, idUsuario: number, idComentario: number) {
        const query = `
            INSERT INTO "RespostaComentario" (texto, id_usuario, id_comentario)
            VALUES ($1, $2, $3)
            RETURNING *
        `;
        const result = await db.query(query, [texto, idUsuario, idComentario]);
        return result.rows[0];
    }

    async findAllByComentario(idComentario: number) {
        // Traz as respostas e, se possível, já puxa o nome de quem respondeu via JOIN
        const query = `
            SELECT rc.*, u.nome as nome_usuario 
            FROM "RespostaComentario" rc
            INNER JOIN "Usuario" u ON rc.id_usuario = u.id_usuario
            WHERE rc.id_comentario = $1 
            ORDER BY rc.criado_em ASC
        `;
        const result = await db.query(query, [idComentario]);
        return result.rows;
    }

    async update(id: number, texto: string) {
        const query = `
            UPDATE "RespostaComentario" 
            SET texto = $1
            WHERE id_resposta = $2
            RETURNING *
        `;
        const result = await db.query(query, [texto, id]);
        if (result.rowCount === 0) throw new Error("Resposta não encontrada.");
        return result.rows[0];
    }

    async delete(id: number) {
        const result = await db.query(`DELETE FROM "RespostaComentario" WHERE id_resposta = $1`, [id]);
        if (result.rowCount === 0) throw new Error("Resposta não encontrada.");
    }
}