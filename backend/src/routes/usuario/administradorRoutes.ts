import { Router } from 'express';
import administradorController from '../../controllers/usuario/administradorController';

const router = Router();

// POST /api/administradores -> Cria
router.post('/', administradorController.criar);

// PUT /api/administradores/:id -> Edita
router.put('/:id', administradorController.atualizar);

export default router;