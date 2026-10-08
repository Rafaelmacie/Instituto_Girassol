import express from 'express';
import cors from 'cors';
import { router } from './routes';

// Importando APENAS as interfaces/tipos explicitamente
import type { Application } from 'express';

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas da aplicação centralizadas
app.use(router);

export { app };