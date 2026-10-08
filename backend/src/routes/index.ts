import { Router, Request, Response } from 'express';
import administradorRoutes from '../modules/usuario/administrador/administradorRoutes';
import { professorRoutes } from '../modules/usuario/usuarioCertificavel/professor/professorRoutes';
import alunoRoutes from '../modules/usuario/usuarioCertificavel/aluno/alunoRoutes';
import areaRoutes from '../modules/curso/area/areaRoutes';
import { cursoRoutes } from '../modules/curso/cursoRoutes';
import { UsuarioController } from '../modules/usuario/usuarioController';
import { matriculaRoutes } from '../modules/curso/matricula/matriculaRoutes';
import aulaRoutes from '../modules/curso/aula/aulaRoutes';
import { moduloRoutes } from '../modules/curso/modulo/moduloRoutes';
import { avaliacaoRoutes } from '../modules/curso/avaliacao/avaliacaoRoutes';
import materialRoutes from '../modules/curso/aula/material/materialRoutes';
import { questaoRoutes } from '../modules/curso/avaliacao/questao/questaoRoutes';
import progressoAulaRoutes from '../modules/curso/matricula/progressoAula/progressoAulaRoutes';
import opcaoRoutes from '../modules/curso/avaliacao/opcao/opcaoRoutes';
import tentativaRoutes from '../modules/curso/matricula/tentativaAvaliacao/tentativaAvalaicaoRoutes';
import { respostaRoutes } from '../modules/curso/matricula/tentativaAvaliacao/resposta/respostaRoutes';
import { comentarioRoutes } from '../modules/forum/comentario/comentarioRoutes'; 
import { respostaRoutes as respostaComentarioRoutes } from '../modules/forum/respostaComentario/respostaComentarioRoutes';

const router = Router();
const usuarioController = new UsuarioController();

// Rotas gerais
router.use('/administradores', administradorRoutes);
router.use('/alunos', alunoRoutes);
router.use('/professores', professorRoutes);
router.use('/areas', areaRoutes);
router.use('/cursos', cursoRoutes);
router.use('/matriculas', matriculaRoutes);
router.use('/aulas', aulaRoutes);
router.use('/modulos', moduloRoutes);
router.use('/avaliacoes', avaliacaoRoutes);
router.use('/materiais', materialRoutes);
router.use('/questoes', questaoRoutes);
router.use('/progresso', progressoAulaRoutes); 
router.use('/opcoes', opcaoRoutes);
router.use('/tentativas', tentativaRoutes);
router.use('/respostas', respostaRoutes);
router.use('/comentarios', comentarioRoutes);
router.use('/respostas-comentarios', respostaComentarioRoutes);

// Rota teste
router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'API rodando com sucesso!' });
});

router.post('/login', usuarioController.login);

export { router };
