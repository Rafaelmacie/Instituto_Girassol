import matriculaRepository from './matriculaRepository';
import { Matricula } from './matriculaModel';
import { StatusMatricula } from '../../shared/constants/statusMatricula';

class MatriculaService {

    async matricular(idAluno: number, idCurso: number): Promise<Matricula> {
        // Verificar se já existe matrícula
        const matriculaExistente = await matriculaRepository.buscarPorAlunoECurso(idAluno, idCurso);
        
        if (matriculaExistente) {
            // Se já existe e está ativa ou concluída, barra
            if (matriculaExistente.statusMatricula !== StatusMatricula.CANCELADA) {
                throw new Error('Aluno já está matriculado neste curso.');
            }
            // Se estava cancelada, poderíamos reativar, mas por simplicidade vamos criar uma nova ou lançar erro
             throw new Error('Aluno possui uma matrícula cancelada neste curso. Contate o suporte.');
        }

        // Criar matrícula
        return await matriculaRepository.criar(idAluno, idCurso);
    }

    async listarMeusCursos(idAluno: number) {
        return await matriculaRepository.listarPorAluno(idAluno);
    }

    async cancelar(id: number): Promise<void> {
        // Chama o repositório que você editou antes
        return await matriculaRepository.excluir(id);
    }
}

export default new MatriculaService();