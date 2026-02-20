import { Request, Response } from 'express';
import matriculaService from './matriculaService';

class MatriculaController {

    async criar(req: Request, res: Response): Promise<void> {
        try {
            const { idAluno, idCurso } = req.body;

            if (!idAluno || !idCurso) {
                res.status(400).json({ message: 'idAluno e idCurso são obrigatórios.' });
                return;
            }

            const novaMatricula = await matriculaService.matricular(idAluno, idCurso);
            res.status(201).json(novaMatricula);

        } catch (error: any) {
            // Tratamento de erro de FK (Aluno ou Curso não existem)
            if (error.code === '23503') {
                res.status(404).json({ message: 'Aluno ou Curso não encontrados.' });
            } else {
                res.status(400).json({ message: error.message });
            }
        }
    }

    async listarMeusCursos(req: Request, res: Response): Promise<void> {
        try {
            // No futuro, pegaremos o ID do token JWT (req.user.id).
            // Por enquanto, vamos pegar via params ou query para teste.
            const idAluno = parseInt(req.params.idAluno || '0');

            const cursos = await matriculaService.listarMeusCursos(idAluno);
            res.status(200).json(cursos);
        } catch (error: any) {
            res.status(500).json({ message: 'Erro ao buscar matrículas.' });
        }
    }

    async cancelar(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id || '0');
            // Chama o serviço para excluir
            await matriculaService.cancelar(id);
            res.status(200).json({ message: "Matrícula cancelada com sucesso!" });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async buscarPorId(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id || '0');
            const matricula = await matriculaService.buscarPorId(id);
            res.status(200).json(matricula);
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    }

    async solicitarCertificado(req: Request, res: Response): Promise<void> {
        try {
            const idMatricula = parseInt(req.params.id || '0');

            const resultado = await matriculaService.solicitarCertificado(idMatricula);

            res.status(200).json(resultado);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
}

export default new MatriculaController();