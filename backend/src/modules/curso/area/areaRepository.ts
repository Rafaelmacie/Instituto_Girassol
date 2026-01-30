import db from '../../../shared/config/db';
import { Area } from './areaModel';

export class AreaRepository {

    async criar(nome: string): Promise<Area> {
        const query = `
            INSERT INTO "Area" (nome)
            VALUES ($1)
            RETURNING *;
        `;
        const result = await db.query(query, [nome]);
        const row = result.rows[0];
        return new Area(row.id_area, row.nome);
    }

    async listarTodas(): Promise<Area[]> {
        const query = 'SELECT * FROM "Area" ORDER BY nome ASC';
        const result = await db.query(query);
        return result.rows.map(row => new Area(row.id_area, row.nome));
    }

    async buscarPorId(id: number): Promise<Area | null> {
        const query = 'SELECT * FROM "Area" WHERE id_area = $1';
        const result = await db.query(query, [id]);

        if (result.rows.length === 0) return null;

        const row = result.rows[0];
        return new Area(row.id_area, row.nome);
    }

    async buscarPorNome(nome: string): Promise<Area | null> {
        const query = 'SELECT * FROM "Area" WHERE LOWER(nome) = LOWER($1)';
        const result = await db.query(query, [nome]);

        if (result.rows.length === 0) return null;

        const row = result.rows[0];
        return new Area(row.id_area, row.nome);
    }

    async excluir(id: number): Promise<boolean> {
        const query = 'DELETE FROM "Area" WHERE id_area = $1';
        const result = await db.query(query, [id]);
        return result.rowCount !== null && result.rowCount > 0;
    }

    async contarCursosPublicados(idArea: number): Promise<number> {
        const query = `
            SELECT COUNT(*) as total 
            FROM "Curso" 
            WHERE id_area = $1 AND disponivel = true
        `;
        const result = await db.query(query, [idArea]);
        return parseInt(result.rows[0].total);
    }

    async desvincularCursos(idArea: number): Promise<void> {
        const query = `
            UPDATE "Curso" 
            SET id_area = NULL 
            WHERE id_area = $1
        `;
        await db.query(query, [idArea]);
    }
}

export default new AreaRepository();