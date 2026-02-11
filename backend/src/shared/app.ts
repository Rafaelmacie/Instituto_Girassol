import express from 'express';
import cors from 'cors';
import administradorRoutes from '../modules/usuario/administrador/administradorRoutes'
import { professorRoutes } from '../modules/usuario/usuarioCertificavel/professor/professorRoutes'; // Importe a rota
import alunoRoutes from '../modules/usuario/usuarioCertificavel/aluno/alunoRoutes'
import areaRoutes from '../modules/curso/area/areaRoutes'
import { cursoRoutes } from '../modules/curso/cursoRoutes';
import { UsuarioController } from '../modules/usuario/usuarioController';
import { matriculaRoutes } from '../modules/matricula/matriculaRoutes';
import aulaRoutes from '../modules/curso/aula/aulaRoutes';
import { moduloRoutes } from '../modules/curso/modulo/moduloRoutes';
import { avaliacaoRoutes } from '../modules/curso/avaliacao/avaliacaoRoutes';
import materialRoutes from '../modules/curso/aula/material/materialRoutes';
import { questaoRoutes } from '../modules/curso/avaliacao/questao/questaoRoutes';
import progressoAulaRoutes from '../modules/matricula/progressoAula/progressoAulaRoutes';

// Importando APENAS as interfaces/tipos explicitamente
import type { Application, Request, Response } from 'express';


const app: Application = express();

const usuarioController = new UsuarioController();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas gerais
app.use('/administradores', administradorRoutes);
app.use('/alunos', alunoRoutes);
app.use('/professores', professorRoutes);
app.use('/areas', areaRoutes);
app.use('/cursos', cursoRoutes);
app.use('/matriculas', matriculaRoutes);
app.use('/aulas', aulaRoutes);
app.use('/modulos', moduloRoutes);
app.use('/avaliacoes', avaliacaoRoutes);
app.use('/materiais', materialRoutes);
app.use('/questoes', questaoRoutes);
app.use('/progresso', progressoAulaRoutes); 


// Rota teste
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'API rodando com sucesso!' });
});

app.post('/login', usuarioController.login);



export { app };