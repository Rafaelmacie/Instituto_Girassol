import { Router } from 'express';
import { ComentarioController } from './comentarioController';

const comentarioRoutes = Router();
const controller = new ComentarioController();

// 1. Criar um comentário
// Rota: POST /comentarios
comentarioRoutes.post('/', controller.criar.bind(controller));

// 2. Listar comentários de uma aula específica
// Rota: GET /comentarios/aula/1
comentarioRoutes.get('/aula/:idAula', controller.listarPorAula.bind(controller));

// 3. Atualizar um comentário
// Rota: PUT /comentarios/1
comentarioRoutes.put('/:id', controller.atualizar.bind(controller));

// 4. Excluir um comentário
// Rota: DELETE /comentarios/1
comentarioRoutes.delete('/:id', controller.excluir.bind(controller));

export { comentarioRoutes };