import db from '../../shared/config/db';
import { Certificado } from './certificadoModel';
import { TipoCertificado } from '../../shared/constants/tipoCertificado';

export class CertificadoRepository {
    async criarParaMatricula(codigo: string, tipoCertificado: TipoCertificado, idMatricula: number): Promise<Certificado> {
        const query = `
            INSERT INTO "Certificado" (codigo, tipo_certificado, id_matricula)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
        const result = await db.query(query, [codigo, tipoCertificado, idMatricula]);
        const row = result.rows[0];

        return new Certificado(
            row.id_certificado,
            row.codigo,
            row.data,
            row.tipo_certificado,
            row.id_matricula,
            row.id_usuario
        );
    }

    async buscarPorCodigo(codigo: string): Promise<Certificado | null> {
        const query = `SELECT * FROM "Certificado" WHERE codigo = $1`;
        const result = await db.query(query, [codigo]);

        if (result.rows.length === 0) return null;

        const row = result.rows[0];
        return new Certificado(
            row.id_certificado,
            row.codigo,
            row.data,
            row.tipo_certificado,
            row.id_matricula,
            row.id_usuario
        );
    }
    
    async buscarPorMatricula(idMatricula: number): Promise<Certificado | null> {
        const query = `SELECT * FROM "Certificado" WHERE id_matricula = $1 LIMIT 1`;
        const result = await db.query(query, [idMatricula]);

        if (result.rows.length === 0) return null;

        const row = result.rows[0];
        return new Certificado(
            row.id_certificado,
            row.codigo,
            row.data,
            row.tipo_certificado,
            row.id_matricula,
            row.id_usuario
        );
    }
}
