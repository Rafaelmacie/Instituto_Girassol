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

    // ToDo: Métodos excluir e atualizar
}

export default new AulaRepository();