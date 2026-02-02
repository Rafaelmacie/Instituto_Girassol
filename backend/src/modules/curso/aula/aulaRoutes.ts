import { Router } from 'express';
import aulaController from './aulaController';
import { upload } from '../../../shared/middlewares/multerConfig';

const router = Router();

// POST com upload de arquivo único. O campo no Insomnia deve ser "video"
router.post('/', upload.single('video'), (req, res) => aulaController.criar(req, res));

// GET aulas de um módulo
router.get('/modulo/:idModulo', (req, res) => aulaController.listarPorModulo(req, res));

export default router;