import { MatriculaRepository } from './matriculaRepository';
import { Matricula } from './matriculaModel';
import { StatusMatricula } from '../../../shared/constants/statusMatricula';

class MatriculaService {
    private matriculaRepository: MatriculaRepository;

    constructor() {
        this.matriculaRepository = new MatriculaRepository();
    }

    async matricular(idAluno: number, idCurso: number): Promise<Matricula> {
        const matriculaExistente = await this.matriculaRepository.buscarPorAlunoECurso(idAluno, idCurso);

        if (matriculaExistente) {
            if (matriculaExistente.statusMatricula !== StatusMatricula.CANCELADA) {
                throw new Error('Aluno já está matriculado neste curso.');
            }
            throw new Error('Aluno possui uma matrícula cancelada neste curso. Contate o suporte.');
        }

        return await this.matriculaRepository.criar(idAluno, idCurso);
    }

    async listarMeusCursos(idAluno: number) {
        return await this.matriculaRepository.listarPorAluno(idAluno);
    }

    async cancelar(id: number): Promise<void> {
        return await this.matriculaRepository.excluir(id);
    }

    async buscarPorId(id: number): Promise<Matricula> {
        const matricula = await this.matriculaRepository.buscarPorId(id);
        if (!matricula) {
            throw new Error('Matrícula não encontrada.');
        }
        return matricula;
    }
}

export default new MatriculaService();