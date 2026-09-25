import { Router } from 'express';
import { RespostaController } from './respostaController';

const respostaRoutes = Router();
const controller = new RespostaController();

respostaRoutes.post('/', controller.create);
respostaRoutes.get('/comentario/:idComentario', controller.listarPorComentario);
respostaRoutes.put('/:id', controller.update);
respostaRoutes.delete('/:id', controller.delete);

export { respostaRoutes };