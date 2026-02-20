import db from '../../../../shared/config/db';

export class ProgressoAulaRepository {

    // Cria o registro ou atualiza se já existir
    async marcarComoAssistida(idMatricula: number, idAula: number, minutos: number) {
        const client = await db.getClient();
        try {
            const query = `
                INSERT INTO "ProgressoAula" ("id_matricula", "id_aula", "assistida", "minutosAssistidos")
                VALUES ($1, $2, true, $3)
                ON CONFLICT ON CONSTRAINT "UN_Progresso_Matricula_Aula"
                DO UPDATE SET 
                    "assistida" = true,
                    "minutosAssistidos" = EXCLUDED."minutosAssistidos"
                RETURNING *;
            `;
            
            // Repare que usei 'number' para minutos, pois no seu SQL está como 'int'
            const values = [idMatricula, idAula, minutos];
            
            const result = await client.query(query, values);
            return result.rows[0];

        } finally {
            client.release();
        }
    }

    // Método extra para consultar (será útil depois)
    async buscarPorMatriculaEAula(idMatricula: number, idAula: number) {
        const query = `
            SELECT * FROM "ProgressoAula" 
            WHERE "id_matricula" = $1 AND "id_aula" = $2
        `;
        const result = await db.query(query, [idMatricula, idAula]);
        return result.rows[0];
    }

    async contarAulasConcluidas(idMatricula: number): Promise<number> {
    const query = `
        SELECT COUNT(*)::int as total 
        FROM "ProgressoAula" 
        WHERE "id_matricula" = $1 AND "assistida" = true
    `;
    const result = await db.query(query, [idMatricula]);
    return result.rows[0].total;
}
}