import db from '../../../../shared/config/db';

export class QuestaoRepository {
    async create(comando: string, tipoQuestao: string, idAvaliacao: number) {
        const query = `
            INSERT INTO "Questao" (comando, "tipoQuestao", id_avaliacao)
            VALUES ($1, $2, $3)
            RETURNING *
        `;
        const result = await db.query(query, [comando, tipoQuestao, idAvaliacao]);
        return result.rows[0];
    }

    async findAllByAvaliacao(idAvaliacao: number) {
        const query = `SELECT * FROM "Questao" WHERE id_avaliacao = $1 ORDER BY id_questao ASC`;
        const result = await db.query(query, [idAvaliacao]);
        return result.rows;
    }

    async findById(id: number) {
        const query = `SELECT * FROM "Questao" WHERE id_questao = $1`;
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    async update(id: number, comando: string, tipoQuestao: string) {
        const query = `
            UPDATE "Questao" 
            SET comando = $1, "tipoQuestao" = $2
            WHERE id_questao = $3
            RETURNING *
        `;
        const result = await db.query(query, [comando, tipoQuestao, id]);
        if (result.rowCount === 0) throw new Error("Questão não encontrada.");
        return result.rows[0];
    }

    async delete(id: number) {
        const result = await db.query(`DELETE FROM "Questao" WHERE id_questao = $1`, [id]);
        if (result.rowCount === 0) throw new Error("Questão não encontrada.");
    }
}