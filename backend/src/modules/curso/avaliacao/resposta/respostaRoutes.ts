import { Router } from 'express';
import { RespostaController } from './respostaController';

const respostaRoutes = Router();
const controller = new RespostaController();

// POST http://localhost:3000/respostas
respostaRoutes.post('/', controller.createOrUpdate);

// GET http://localhost:3000/respostas/tentativa/1
respostaRoutes.get('/tentativa/:idTentativa', controller.listar);

export { respostaRoutes };