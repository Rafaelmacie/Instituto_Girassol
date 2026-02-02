import { Router } from 'express';
import { ModuloController } from './moduloController';

const moduloRoutes = Router();
const controller = new ModuloController();

moduloRoutes.post('/', controller.create.bind(controller));
moduloRoutes.get('/curso/:idCurso', controller.getByCurso.bind(controller));
moduloRoutes.put('/:id', controller.update.bind(controller));
moduloRoutes.delete('/:id', controller.delete.bind(controller));

export { moduloRoutes };