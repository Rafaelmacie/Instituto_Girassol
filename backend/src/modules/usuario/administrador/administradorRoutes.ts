import { Router } from 'express';
import administradorController from './administradorController';


const router = Router();

// POST http/localhost:3000/administradores/ -> Cria
router.post('/', administradorController.criar);

// PUT http/localhost:3000/administradores/:id -> Edita
router.put('/:id', administradorController.atualizar);

router.get('/', administradorController.listar.bind(administradorController));

export default router;