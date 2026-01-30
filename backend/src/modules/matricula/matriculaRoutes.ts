import { Router } from 'express';
import matriculaController from './matriculaController';

const router = Router();

// POST /matriculas -> Cria
router.post('/', matriculaController.criar);

// GET /matriculas/aluno/:idAluno -> Lista cursos daquele aluno
router.get('/aluno/:idAluno', matriculaController.listarMeusCursos);

export default router;