import { Router } from 'express';
import opcaoController from './opcaoController'; 

const router = Router();

// ROTA 1: CRIAR OPÇÃO
// POST http://localhost:3000/opcoes
router.post('/', (req, res) => opcaoController.criar(req, res));

// ROTA 2: LISTAR OPÇÕES DE UMA QUESTÃO
// GET http://localhost:3000/opcoes/questao/10 (Onde 10 é o ID da questão)
router.get('/questao/:idQuestao', (req, res) => opcaoController.listarPorQuestao(req, res));

// ROTA 3: EXCLUIR OPÇÃO
// DELETE http://localhost:3000/opcoes/5 (Onde 5 é o ID da opção a ser excluída)
router.delete('/:id', (req, res) => opcaoController.excluir(req, res));

export default router;