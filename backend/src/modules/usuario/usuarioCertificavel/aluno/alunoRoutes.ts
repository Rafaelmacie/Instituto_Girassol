import { Router } from 'express';
import { AlunoController } from './alunoController';

const router = Router();
const controller = new AlunoController();

router.post('/', controller.criar);
router.get('/', controller.listar);
router.put('/:id', controller.editar);
router.delete('/:id', controller.excluir);

export default router;