import { Router } from 'express';
import matriculaController from './matriculaController';

const matriculaRoutes = Router();

// POST /matriculas -> Cria
matriculaRoutes.post('/', matriculaController.criar);

// GET /matriculas/aluno/:idAluno -> Lista cursos daquele aluno
matriculaRoutes.get('/aluno/:idAluno', matriculaController.listarMeusCursos);

// GET /matriculas/:id -> Busca uma matrícula específica (Excelente para ver a nota final!)
matriculaRoutes.get('/:id', matriculaController.buscarPorId.bind(matriculaController));

// DELETE /matriculas/:id -> Cancela a matrícula
matriculaRoutes.delete('/:id', matriculaController.cancelar.bind(matriculaController));

export { matriculaRoutes };