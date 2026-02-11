// 1. MUDANÇA NO IMPORT: Adicione as chaves { }
import { MatriculaRepository } from './matriculaRepository';
import { Matricula } from './matriculaModel';
import { StatusMatricula } from '../../shared/constants/statusMatricula';

class MatriculaService {
    // 2. ADICIONE ESSA PROPRIEDADE
    private matriculaRepository: MatriculaRepository;

    // 3. ADICIONE O CONSTRUTOR PARA DAR O "NEW"
    constructor() {
        this.matriculaRepository = new MatriculaRepository();
    }

    async matricular(idAluno: number, idCurso: number): Promise<Matricula> {
        // 4. USE "this.matriculaRepository" EM VEZ DE SÓ O NOME
        const matriculaExistente = await this.matriculaRepository.buscarPorAlunoECurso(idAluno, idCurso);
        
        if (matriculaExistente) {
            if (matriculaExistente.statusMatricula !== StatusMatricula.CANCELADA) {
                throw new Error('Aluno já está matriculado neste curso.');
            }
             throw new Error('Aluno possui uma matrícula cancelada neste curso. Contate o suporte.');
        }

        // USE "this.matriculaRepository" AQUI TAMBÉM
        return await this.matriculaRepository.criar(idAluno, idCurso);
    }

    async listarMeusCursos(idAluno: number) {
        // USE "this.matriculaRepository"
        return await this.matriculaRepository.listarPorAluno(idAluno);
    }

    async cancelar(id: number): Promise<void> {
        // USE "this.matriculaRepository"
        return await this.matriculaRepository.excluir(id);
    }
}

export default new MatriculaService();