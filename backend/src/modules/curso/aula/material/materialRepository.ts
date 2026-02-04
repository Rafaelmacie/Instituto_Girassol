import db from '../../../../shared/config/db';
import { Material } from './materialModel';

export class MaterialRepository {

    async criar(material: any): Promise<Material> {
        const query = `
            INSERT INTO "Material" (titulo, descricao, tipo_material, url, id_aula)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const values = [
            material.titulo,
            material.descricao,
            material.tipoMaterial,
            material.url,
            material.idAula
        ];

        const result = await db.query(query, values);
        const row = result.rows[0];

        return new Material(
            row.id_material,
            row.titulo,
            row.url,
            row.descricao,
            row.tipo_material,
            row.id_aula
        );
    }

    async listarPorAula(idAula: number): Promise<Material[]> {
        const query = `SELECT * FROM "Material" WHERE id_aula = $1`;
        const result = await db.query(query, [idAula]);

        return result.rows.map(row => new Material(
            row.id_material,
            row.titulo,
            row.url,
            row.descricao,
            row.tipo_material,
            row.id_aula
        ));
    }

    async buscarPorId(id: number): Promise<Material | null> {
        const query = `SELECT * FROM "Material" WHERE id_material = $1`;
        const result = await db.query(query, [id]);

        if (result.rows.length === 0) return null;

        const row = result.rows[0];

        return new Material(
            row.id_material,
            row.titulo,
            row.url,
            row.descricao,
            row.tipo_material,
            row.id_aula
        );
    }

    async excluir(id: number): Promise<void> {
        await db.query(`DELETE FROM "Material" WHERE id_material = $1`, [id]);
    }
}

export default new MaterialRepository();