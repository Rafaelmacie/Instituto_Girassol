import { Router } from 'express';
import areaController from './areaController';

const router = Router();

router.post('/', areaController.criar);
router.get('/', areaController.listar);
router.get('/:id', areaController.buscarPorId);
router.delete('/:id', areaController.excluir);

export default router;