import { Router } from 'express';
import matriculaController from './matriculaController';

const matriculaRoutes = Router();

// POST /matriculas -> Cria
matriculaRoutes.post('/', matriculaController.criar);

// GET /matriculas/aluno/:idAluno -> Lista cursos daquele aluno
matriculaRoutes.get('/aluno/:idAluno', matriculaController.listarMeusCursos);

matriculaRoutes.delete('/:id', matriculaController.cancelar.bind(matriculaController));

export { matriculaRoutes };