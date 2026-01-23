// backend/src/modules/usuario/usuarioCertificavel/professor/professorRoutes.ts
import { Router } from 'express';
import { ProfessorController } from './professorController';

const professorRoutes = Router();
const controller = new ProfessorController();

// A sintaxe .bind(controller) é necessária para não perder o "this" dentro do controller
professorRoutes.post('/', controller.create.bind(controller));
professorRoutes.get('/', controller.getAll.bind(controller));       // Aceita query params
professorRoutes.get('/:id', controller.getOne.bind(controller));
professorRoutes.put('/:id', controller.update.bind(controller));
professorRoutes.delete('/:id', controller.delete.bind(controller));

export { professorRoutes };