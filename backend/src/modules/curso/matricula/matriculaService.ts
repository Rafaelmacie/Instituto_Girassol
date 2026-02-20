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

    async solicitarCertificado(idMatricula: number): Promise<any> {
        // Busca a matrícula completa
        const matricula = await this.buscarPorId(idMatricula);

        // Validação da Nota Final
        // Assumindo que a nota de corte é 7.0 (>= 7)
        if (matricula.notaFinal === null || matricula.notaFinal < 7) {
            throw new Error(`Reprovado por Nota. Sua nota final é ${matricula.notaFinal || 0}, mas a nota mínima é 7.0.`);
        }

        // Validação do Progresso das Aulas
        const totalAulasDoCurso = await this.matriculaRepository.contarTotalAulasDoCurso(matricula.idCurso);
        
        if (totalAulasDoCurso === 0) {
            throw new Error("Este curso ainda não possui aulas cadastradas.");
        }

        if (matricula.aulasAssistidas < totalAulasDoCurso) {
            throw new Error(`Reprovado por Frequência. Você assistiu ${matricula.aulasAssistidas} de ${totalAulasDoCurso} aulas.`);
        }

        // Se passou nas duas validações, atualizamos o status da matrícula para CONCLUIDA
        await this.matriculaRepository.atualizarStatus(idMatricula, StatusMatricula.CONCLUIDO);

        // ToDo: disparar uma chamada para o serviço de Certificado
        // Ex: const linkCertificado = await certificadoService.gerar(idMatricula);

        return {
            aprovado: true,
            message: "Parabéns! Você foi aprovado e seu certificado já pode ser gerado.",
            notaFinal: matricula.notaFinal,
            frequencia: `${matricula.aulasAssistidas}/${totalAulasDoCurso}`
        };
    }
}

export default new MatriculaService();