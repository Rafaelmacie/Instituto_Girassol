import db from '../../../shared/config/db';

export class AvaliacaoRepository {
    async create(notaMinima: number, numeroQuestoes: number, idModulo: number) {
        const query = `
            INSERT INTO "Avaliacao" ("nota_minima", "numero_questoes", "id_modulo")
            VALUES ($1, $2, $3)
            RETURNING *
        `;
        // Se numeroQuestoes não for enviado, salva como 0 ou null
        const values = [notaMinima, numeroQuestoes, idModulo];
        
        const result = await db.query(query, values);
        return result.rows[0];
    }

    async findAllByModulo(idModulo: number) {
        const query = `SELECT * FROM "Avaliacao" WHERE "id_modulo" = $1 ORDER BY "id_avaliacao" ASC`;
        const result = await db.query(query, [idModulo]);
        return result.rows;
    }

    async findById(id: number) {
        const query = `SELECT * FROM "Avaliacao" WHERE "id_avaliacao" = $1`;
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    async update(id: number, notaMinima: number, numeroQuestoes: number) {
        const query = `
            UPDATE "Avaliacao" 
            SET "nota_minima" = $1, "numero_questoes" = $2
            WHERE "id_avaliacao" = $3
            RETURNING *
        `;
        const result = await db.query(query, [notaMinima, numeroQuestoes, id]);
        if (result.rowCount === 0) throw new Error("Avaliação não encontrada.");
        return result.rows[0];
    }

    async delete(id: number) {
        const result = await db.query(`DELETE FROM "Avaliacao" WHERE "id_avaliacao" = $1`, [id]);
        if (result.rowCount === 0) throw new Error("Avaliação não encontrada.");
    }
}