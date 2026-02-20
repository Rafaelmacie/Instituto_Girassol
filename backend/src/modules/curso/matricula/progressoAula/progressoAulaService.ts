import { ProgressoAulaRepository } from './progressoAulaRepository';
import { MatriculaRepository }  from '../matriculaRepository';

export class ProgressoAulaService {
    private repository: ProgressoAulaRepository;
    private matriculaRepository: MatriculaRepository;

    constructor() {
        this.repository = new ProgressoAulaRepository();
        this.matriculaRepository = new MatriculaRepository();
    }

    // Método para registrar que o aluno assistiu a aula
    async registrarProgresso(idMatricula: number, idAula: number, minutos: number) {
        if (!idMatricula) throw new Error("Matrícula é obrigatória.");
        if (!idAula) throw new Error("ID da Aula é obrigatório.");

        const progresso = await this.repository.marcarComoAssistida(idMatricula, idAula, minutos);

        // 2. Conta quantas aulas esse aluno já viu no total nessa matrícula
        const totalAssistidas = await this.repository.contarAulasConcluidas(idMatricula);

        // 3. Atualiza a tabela de Matrícula com o novo número
        await this.matriculaRepository.atualizarAulasAssistidas(idMatricula, totalAssistidas);

        return progresso;
    
    }

    async consultarProgresso(idMatricula: number, idAula: number) {
        // Já tínhamos criado o método buscarPorMatriculaEAula no Repositório antes?
        // Se sim, usamos ele:
        return await this.repository.buscarPorMatriculaEAula(idMatricula, idAula);
    }
}