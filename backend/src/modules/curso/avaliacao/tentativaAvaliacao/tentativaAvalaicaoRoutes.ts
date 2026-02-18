import { Router } from 'express';
import tentativaAvaliacaoController from './tentativaAvaliacaoController';

const router = Router();

// POST - Aluno clica em "Começar Prova"
router.post('/', (req, res) => tentativaAvaliacaoController.iniciar(req, res));

// GET - Verificar se tem prova aberta (Use Query Params: ?idMatricula=1&idAvaliacao=2)
router.get('/aberta', (req, res) => tentativaAvaliacaoController.buscarAberta(req, res));

// GET - Ver histórico de tentativas de uma matrícula
router.get('/matricula/:idMatricula', (req, res) => tentativaAvaliacaoController.historico(req, res));

// PATCH - Finalizar Tentativa
router.patch('/:id/finalizar', (req, res) => tentativaAvaliacaoController.finalizar(req, res));

export default router;