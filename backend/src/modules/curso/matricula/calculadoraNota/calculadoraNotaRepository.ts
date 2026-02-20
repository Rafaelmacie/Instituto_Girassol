import db from "../../../../shared/config/db";

export class CalculadoraNotaRepository {

    // Calcula a média real do curso, considerando provas não feitas como 0
    async obterMediaCursoDaMatricula(idMatricula: number): Promise<number> {
        const query = `
            SELECT COALESCE(AVG(media_modulo), 0) as media_final
            FROM (
                SELECT m.id_modulo, COALESCE(AVG(COALESCE(max_notas.maior_nota, 0)), 0) as media_modulo
                FROM "Matricula" mat
                JOIN "Modulo" m ON m.id_curso = mat.id_curso
                LEFT JOIN "Avaliacao" a ON a.id_modulo = m.id_modulo
                LEFT JOIN (
                    -- Subquery: Pega só a maior nota de cada avaliação que o aluno já finalizou
                    SELECT id_avaliacao, MAX(nota_adquirida) as maior_nota
                    FROM "TentativaAvaliacao"
                    WHERE id_matricula = $1 AND finalizada = true
                    GROUP BY id_avaliacao
                ) max_notas ON max_notas.id_avaliacao = a.id_avaliacao
                WHERE mat.id_matricula = $1
                GROUP BY m.id_modulo
            ) as medias_por_modulo;
        `;
        const result = await db.query(query, [idMatricula]);
        return parseFloat(result.rows[0].media_final);
    }

    // Grava a nota definitiva na tabela Matrícula
    async atualizarNotaFinalMatricula(idMatricula: number, notaFinal: number): Promise<void> {
        const query = `
            UPDATE "Matricula"
            SET "nota_final" = $1
            WHERE id_matricula = $2;
        `;
        await db.query(query, [notaFinal, idMatricula]);
    }
}

export default new CalculadoraNotaRepository();