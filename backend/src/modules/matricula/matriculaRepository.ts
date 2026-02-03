import db from '../../shared/config/db';
import { Matricula } from './matriculaModel';
import { StatusMatricula } from '../../shared/constants/statusMatricula';

class MatriculaRepository {

    async criar(idAluno: number, idCurso: number): Promise<Matricula> {
        const query = `
            INSERT INTO "Matricula" (id_aluno, id_curso, "statusMatricula")
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
        // Status inicial é sempre Em_andamento
        const result = await db.query(query, [idAluno, idCurso, StatusMatricula.EM_ANDAMENTO]);
        const row = result.rows[0];

        return new Matricula(
            row.id_matricula, row.data, row.statusMatricula,
            row.id_aluno, row.id_curso, row.favoritada, row.aulasAssistidas, row.nota_final
        );
    }

    async buscarPorAlunoECurso(idAluno: number, idCurso: number): Promise<Matricula | null> {
        const query = `SELECT * FROM "Matricula" WHERE id_aluno = $1 AND id_curso = $2`;
        const result = await db.query(query, [idAluno, idCurso]);

        if (result.rows.length === 0) return null;

        const row = result.rows[0];
        return new Matricula(
            row.id_matricula, row.data, row.statusMatricula,
            row.id_aluno, row.id_curso, row.favoritada, row.aulasAssistidas, row.nota_final
        );
    }

    /**
     * Lista todas as matrículas de um aluno específico.
     */
    async listarPorAluno(idAluno: number): Promise<any[]> {
        // Fazemos um JOIN para trazer o título do curso junto
        const query = `
            SELECT m.*, c.titulo as nome_curso, c.imagem 
            FROM "Matricula" m
            JOIN "Curso" c ON c.id_curso = m.id_curso
            WHERE m.id_aluno = $1
        `;
        const result = await db.query(query, [idAluno]);
        return result.rows;
    }

    // Método para cancelar matrícula
    async atualizarStatus(idMatricula: number, status: StatusMatricula): Promise<void> {
        await db.query(`UPDATE "Matricula" SET "statusMatricula" = $1 WHERE id_matricula = $2`, [status, idMatricula]);
    }

    async excluir(idMatricula: number): Promise<void> {
        const result = await db.query(`DELETE FROM "Matricula" WHERE id_matricula = $1`, [idMatricula]);

        if (result.rowCount === 0) {
            throw new Error("Matrícula não encontrada.");
        }
    }
}

export default new MatriculaRepository();