import { Router } from 'express';
import aulaController from './aulaController';
import { upload } from '../../../shared/middlewares/multerConfig';

const router = Router();

// POST com upload de arquivo único. O campo no Insomnia deve ser "video"
router.post('/', upload.single('linkVideo'), (req, res) => aulaController.criar(req, res));

// GET aulas de um módulo
router.get('/modulo/:idModulo', (req, res) => aulaController.listarPorModulo(req, res));

// GET - Buscar uma aula
router.get('/:id', (req, res) => aulaController.buscarPorId(req, res));

// PUT - Atualizar (Com upload opcional)
router.put('/:id', upload.single('linkVideo'), (req, res) => aulaController.atualizar(req, res));

// DELETE - Excluir
router.delete('/:id', (req, res) => aulaController.excluir(req, res));

export default router;