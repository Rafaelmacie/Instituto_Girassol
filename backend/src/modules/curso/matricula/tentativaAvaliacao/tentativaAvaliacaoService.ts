import tentativaAvaliacaoRepository from './tentativaAvaliacaoRepository';
import calculadoraNotaService from '../calculadoraNota/calculadoraNotaService';

export class TentativaAvaliacaoService {

    // Constante de tempo (1 hora em milissegundos)
    private readonly TEMPO_LIMITE_MS = 60 * 60 * 1000;


    //Método para iniciar a tentativa
    async iniciarTentativa(dados: any) {
        if (!dados.idMatricula || !dados.idAvaliacao) {
            throw new Error("ID da Matrícula e ID da Avaliação são obrigatórios.");
        }

        const tentativaExistente = await this.buscarTentativaAtiva(
            Number(dados.idMatricula),
            Number(dados.idAvaliacao)
        );

        if (tentativaExistente) {
            throw new Error("Você já possui uma avaliação em andamento. Retome-a em vez de iniciar uma nova.");
        }

        return await tentativaAvaliacaoRepository.criar(
            Number(dados.idMatricula),
            Number(dados.idAvaliacao)
        );
    }


    //Método para identificar e buscar tentativas ativas
    async buscarTentativaAtiva(idMatricula: number, idAvaliacao: number) {
        if (!idMatricula || !idAvaliacao) throw new Error("Dados obrigatórios.");

        const tentativa = await tentativaAvaliacaoRepository.buscarAberta(idMatricula, idAvaliacao);

        if (!tentativa) return null;

        // Verificação de tempo
        const agora = new Date().getTime();
        const inicio = new Date(tentativa.dataHora).getTime();
        const tempoDecorrido = agora - inicio;
        const tempoRestante = this.TEMPO_LIMITE_MS - tempoDecorrido;

        // Se o tempo estourou (> 1h)
        if (tempoDecorrido > this.TEMPO_LIMITE_MS) {
            console.log(`⏱️ Auto-finalizando tentativa ${tentativa.idTentativa} por estouro de tempo.`);

            // Finaliza com nota 0
            await tentativaAvaliacaoRepository.finalizar(tentativa.idTentativa, 0);

            // Retorna null pois não é mais uma tentativa "ativa"
            return null;
        }

        // Se ainda está válida, adicionamos o tempo restante para ajudar o frontend (timer)
        return {
            ...tentativa,
            tempoRestanteMs: tempoRestante // Front pode usar isso pra mostrar "Faltam 15min"
        };
    }

    async finalizarTentativa(idTentativa: number) {
        const tentativa = await tentativaAvaliacaoRepository.buscarPorId(idTentativa);

        if (!tentativa) throw new Error("Tentativa não encontrada.");
        if (tentativa.finalizada) throw new Error("Esta tentativa já foi finalizada.");

        // Calcula a nota da prova
        const notaFinal = await this.calcularNota(tentativa);

        // Finaliza a tentativa no banco
        const tentativaFinalizada = await tentativaAvaliacaoRepository.finalizar(idTentativa, notaFinal);

        // Recalcula a nota geral do curso em background
        // Mandamos o idMatricula para a calculadora fazer o trabalho dela
        await calculadoraNotaService.atualizarNotaFinal(tentativa.idMatricula);

        return tentativaFinalizada;
    }

    /**
     * Calcula a nota final baseada nas respostas gravadas no banco.
     */
    private async calcularNota(tentativa: any): Promise<number> {
        try {
            // Quantas questões a prova tem no total?
            const totalQuestoes = await tentativaAvaliacaoRepository.obterNumeroQuestoes(tentativa.idAvaliacao);

            if (totalQuestoes === 0) {
                console.warn(`A avaliação ${tentativa.idAvaliacao} não tem 'numero_questoes' definido.`);
                return 0; // Evita divisão por zero
            }

            // Quantas questões o aluno acertou?
            const acertos = await tentativaAvaliacaoRepository.contarRespostasCorretas(tentativa.idTentativa);

            console.log(`📊 Correção da Tentativa ${tentativa.idTentativa}: Acertou ${acertos} de ${totalQuestoes}`);

            // Regra de 3 para nota de 0 a 10
            const notaCalculada = (acertos / totalQuestoes) * 10;

            // Retorna arredondado para 2 casas decimais (ex: 8.33333 -> 8.33)
            return Number(notaCalculada.toFixed(2));

        } catch (error) {
            console.error(`Erro ao calcular nota da tentativa ${tentativa.idTentativa}:`, error);
            return 0;
        }
    }

    async listarHistoricoAluno(idMatricula: number) {
        if (!idMatricula) throw new Error("ID da Matrícula obrigatório.");
        return await tentativaAvaliacaoRepository.listarPorMatricula(idMatricula);
    }
}

export default new TentativaAvaliacaoService();