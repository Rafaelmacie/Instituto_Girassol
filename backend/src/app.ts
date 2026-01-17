import express from 'express';
import cors from 'cors';
import administradorRoutes from './routes/usuario/administradorRoutes'

// Importando APENAS as interfaces/tipos explicitamente
import type { Application, Request, Response } from 'express';

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas gerais
app.use('/api/administradores', administradorRoutes);

// Rota teste
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'API rodando com sucesso!' });
});

export { app };