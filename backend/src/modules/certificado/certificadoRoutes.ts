import { Router } from 'express';
import certificadoController from './certificadoController';

const router = Router();

router.get('/:codigo/download', certificadoController.baixarPdf);

export default router;
