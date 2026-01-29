import { Router } from 'express';
import { CursoController } from './cursoController';

const cursoRoutes = Router();
const controller = new CursoController();

cursoRoutes.post('/', controller.create.bind(controller));
cursoRoutes.get('/', controller.getAll.bind(controller));
cursoRoutes.get('/:id', controller.getOne.bind(controller));
cursoRoutes.put('/:id', controller.update.bind(controller));
cursoRoutes.delete('/:id', controller.delete.bind(controller));

export { cursoRoutes };