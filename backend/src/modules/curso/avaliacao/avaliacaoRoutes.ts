import { Router } from 'express';
import { AvaliacaoController } from './avaliacaoController';

const avaliacaoRoutes = Router();
const controller = new AvaliacaoController();

// Rota para Criar (POST http://localhost:3000/avaliacoes)
avaliacaoRoutes.post('/', controller.create);

// Rota para Listar por Módulo (GET http://localhost:3000/avaliacoes/modulo/1)
avaliacaoRoutes.get('/modulo/:idModulo', controller.listarPorModulo);

// Rota para Atualizar (PUT http://localhost:3000/avaliacoes/1)
avaliacaoRoutes.put('/:id', controller.update);

// Rota para Excluir (DELETE http://localhost:3000/avaliacoes/1)
avaliacaoRoutes.delete('/:id', controller.delete);

export { avaliacaoRoutes };