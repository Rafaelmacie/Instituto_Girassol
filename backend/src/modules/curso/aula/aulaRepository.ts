import db from '../../../shared/config/db';
import { Aula } from './aulaModel';

export class AulaRepository {

    async criar(aula: any): Promise<Aula> {
        const query = `
            INSERT INTO "Aula" (titulo, descricao, id_modulo, "linkVideo", duracao, ordem)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;
        const values = [
            aula.titulo,
            aula.descricao,
            aula.idModulo,
            aula.linkVideo,
            aula.duracao,
            aula.ordem
        ];

        const result = await db.query(query, values);
        const row = result.rows[0];
        return new Aula(row.id_aula, row.titulo, row.descricao, row.id_modulo, row.linkVideo, row.duracao, row.ordem);
    }

    async listarPorModulo(idModulo: number): Promise<Aula[]> {
        const query = `SELECT * FROM "Aula" WHERE id_modulo = $1 ORDER BY ordem ASC`;
        const result = await db.query(query, [idModulo]);
        return result.rows.map(row => new Aula(
            row.id_aula, row.titulo, row.descricao, row.id_modulo, row.linkVideo, row.duracao, row.ordem
        ));
    }


    /* Calcula automaticamente a próxima ordem para um módulo. */
    async obterProximaOrdem(idModulo: number): Promise<number> {
        // COALESCE(MAX(ordem), 0) faz o seguinte:
        // Pega o maior valor. Se for null (não tem aulas), considera 0.
        // Depois somamos + 1.
        const query = `
            SELECT COALESCE(MAX(ordem), 0) + 1 as proxima_ordem 
            FROM "Aula" 
            WHERE id_modulo = $1
        `;
        const result = await db.query(query, [idModulo]);
        return parseInt(result.rows[0].proxima_ordem);
    }

    async buscarPorId(id: number): Promise<Aula | null> {
        const query = `SELECT * FROM "Aula" WHERE id_aula = $1`;
        const result = await db.query(query, [id]);

        if (result.rows.length === 0) return null;

        const row = result.rows[0];
        return new Aula(row.id_aula, row.titulo, row.descricao, row.id_modulo, row.linkVideo, row.duracao, row.ordem);
    }

    async atualizar(id: number, aula: any): Promise<Aula> {
        const query = `
            UPDATE "Aula"
            SET titulo = $1, descricao = $2, id_modulo = $3, "linkVideo" = $4, duracao = $5, ordem = $6
            WHERE id_aula = $7
            RETURNING *;
        `;
        const values = [
            aula.titulo,
            aula.descricao,
            aula.idModulo,
            aula.linkVideo,
            aula.duracao,
            aula.ordem,
            id
        ];

        const result = await db.query(query, values);
        const row = result.rows[0];
        return new Aula(row.id_aula, row.titulo, row.descricao, row.id_modulo, row.linkVideo, row.duracao, row.ordem);
    }

    async excluir(id: number): Promise<void> {
        const result = await db.query(`DELETE FROM "Aula" WHERE id_aula = $1`, [id]);
        if (result.rowCount === 0) {
            throw new Error("Aula não encontrada ou já excluída.");
        }
    }
}

export default new AulaRepository();