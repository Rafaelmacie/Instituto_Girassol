import { Router } from 'express';
import materialController from './materialController';
import { upload } from '../../../../shared/middlewares/multerConfig';

const router = Router();

// POST - Criar Material (Campo do form-data: 'arquivo')
router.post('/', upload.single('arquivo'), (req, res) => materialController.criar(req, res));

// GET - Listar materiais de uma aula
router.get('/aula/:idAula', (req, res) => materialController.listarPorAula(req, res));

// DELETE - Excluir material
router.delete('/:id', (req, res) => materialController.excluir(req, res));

export default router;