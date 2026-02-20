import { Router } from 'express';
import progressoAulaController from './progressoAulaController'; 

const router = Router();

// Rota para marcar aula como assistida
router.post('/:idAula/concluir', (req, res) => progressoAulaController.marcarAssistida(req, res));
router.get('/:idMatricula/:idAula', (req, res) => progressoAulaController.buscarProgresso(req, res));

export default router;