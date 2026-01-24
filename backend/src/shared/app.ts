import express from 'express';
import cors from 'cors';
import administradorRoutes from '../modules/usuario/administrador/administradorRoutes'
import alunoRoutes from '../modules/usuario/UsuarioCertificavel/aluno/alunoRoutes';

// Importando APENAS as interfaces/tipos explicitamente
import type { Application, Request, Response } from 'express';

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas gerais
app.use('/administradores', administradorRoutes);
app.use('/alunos', alunoRoutes);

// Rota teste
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'API rodando com sucesso!' });
});

export { app };