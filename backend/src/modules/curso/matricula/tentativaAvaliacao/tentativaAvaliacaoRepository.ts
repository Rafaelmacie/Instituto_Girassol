import db from '../../../../shared/config/db';
import { TentativaAvaliacao } from './tentativaAvaliacaoModel';

export class TentativaAvaliacaoRepository {

    async criar(idMatricula: number, idAvaliacao: number): Promise<TentativaAvaliacao> {
        const query = `
            INSERT INTO "TentativaAvaliacao" (finalizada, id_matricula, id_avaliacao)
            VALUES (false, $1, $2)
            RETURNING *;
        `;
        const values = [idMatricula, idAvaliacao];

        const result = await db.query(query, values);
        const row = result.rows[0];

        return this.mapRowToModel(row);
    }

    async listarPorMatricula(idMatricula: number): Promise<TentativaAvaliacao[]> {
        const query = `SELECT * FROM "TentativaAvaliacao" WHERE id_matricula = $1 ORDER BY data_hora DESC`;
        const result = await db.query(query, [idMatricula]);
        return result.rows.map(row => this.mapRowToModel(row));
    }

    async buscarPorId(id: number): Promise<TentativaAvaliacao | null> {
        const query = `SELECT * FROM "TentativaAvaliacao" WHERE id_tentativa = $1`;
        const result = await db.query(query, [id]);
        if (result.rows.length === 0) return null;
        return this.mapRowToModel(result.rows[0]);
    }

    // Finaliza a tentativa e grava a nota
    async finalizar(idTentativa: number, notaFinal: number): Promise<TentativaAvaliacao> {
        const query = `
            UPDATE "TentativaAvaliacao"
            SET finalizada = true, nota_adquirida = $1
            WHERE id_tentativa = $2
            RETURNING *;
        `;
        const result = await db.query(query, [notaFinal, idTentativa]);

        if (result.rows.length === 0) {
            throw new Error("Tentativa não encontrada.");
        }

        return this.mapRowToModel(result.rows[0]);
    }

    // Helper para evitar repetição de código no mapeamento
    private mapRowToModel(row: any): TentativaAvaliacao {
        return new TentativaAvaliacao(
            row.id_tentativa,
            row.data_hora,
            row.finalizada,
            row.nota_adquirida,
            row.id_matricula,
            row.id_avaliacao
        );
    }

    async buscarAberta(idMatricula: number, idAvaliacao: number): Promise<TentativaAvaliacao | null> {
        const query = `
            SELECT * FROM "TentativaAvaliacao" 
            WHERE id_matricula = $1 
            AND id_avaliacao = $2 
            AND finalizada = false
            LIMIT 1;
        `;
        const result = await db.query(query, [idMatricula, idAvaliacao]);

        if (result.rows.length === 0) return null;
        return this.mapRowToModel(result.rows[0]);
    }

    // Busca quantas questões o aluno acertou nesta tentativa específica
    async contarRespostasCorretas(idTentativa: number): Promise<number> {
        const query = `
            SELECT COUNT(*) 
            FROM "RespostaQuestao" 
            WHERE id_tentativa = $1 AND eh_correta = true
        `;
        const result = await db.query(query, [idTentativa]);
        // O COUNT no Postgres retorna uma string, então usamos parseInt
        return parseInt(result.rows[0].count || '0');
    }

    // Busca o total de questões daquela prova
    async obterNumeroQuestoes(idAvaliacao: number): Promise<number> {
        const query = `SELECT numero_questoes FROM "Avaliacao" WHERE id_avaliacao = $1`;
        const result = await db.query(query, [idAvaliacao]);

        if (result.rows.length === 0) return 0;
        return parseInt(result.rows[0].numero_questoes || '0');
    }
}

export default new TentativaAvaliacaoRepository();