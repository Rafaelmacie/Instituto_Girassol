import db from '../../../shared/config/db'; 

export class ModuloRepository {
    async create(nome: string, idCurso: number): Promise<void> {
        const query = `INSERT INTO "Modulo" (nome, id_curso) VALUES ($1, $2)`;
        await db.query(query, [nome, idCurso]);
    }

    async findAllByCurso(idCurso: number): Promise<any[]> {
        const query = `SELECT * FROM "Modulo" WHERE id_curso = $1 ORDER BY id_modulo ASC`;
        const result = await db.query(query, [idCurso]);
        return result.rows;
    }

    async findById(id: number): Promise<any> {
        const query = `SELECT * FROM "Modulo" WHERE id_modulo = $1`;
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    async update(id: number, nome: string): Promise<void> {
        const query = `UPDATE "Modulo" SET nome = $1 WHERE id_modulo = $2`;
        const result = await db.query(query, [nome, id]);
        if (result.rowCount === 0) throw new Error("Módulo não encontrado.");
    }

    async delete(id: number): Promise<void> {
        const result = await db.query(`DELETE FROM "Modulo" WHERE id_modulo = $1`, [id]);
        if (result.rowCount === 0) throw new Error("Módulo não encontrado.");
    }
}