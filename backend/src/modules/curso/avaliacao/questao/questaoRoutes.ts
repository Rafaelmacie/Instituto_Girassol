import { Router } from 'express';
import { QuestaoController } from './questaoController';

const questaoRoutes = Router();
const controller = new QuestaoController();

questaoRoutes.post('/', controller.create);
questaoRoutes.get('/avaliacao/:idAvaliacao', controller.listarPorAvaliacao);
questaoRoutes.put('/:id', controller.update);
questaoRoutes.delete('/:id', controller.delete);

export { questaoRoutes };