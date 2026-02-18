import tentativaAvaliacaoRepository from './tentativaAvaliacaoRepository';

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

        if (!tentativa) {
            throw new Error("Tentativa não encontrada.");
        }

        if (tentativa.finalizada) {
            throw new Error("Esta tentativa já foi finalizada anteriormente.");
        }

        // Validação de tempo
        const agora = new Date().getTime();
        const inicio = new Date(tentativa.dataHora).getTime();
        if ((agora - inicio) > this.TEMPO_LIMITE_MS) {
            console.warn(`⚠️ Aluno finalizou a tentativa ${idTentativa} fora do prazo.`);
        }

        // Calcula a nota internamente
        const notaFinal = await this.calcularNota(idTentativa);

        return await tentativaAvaliacaoRepository.finalizar(idTentativa, notaFinal);
    }

    /**
     * Lógica de Correção da Prova.
     * Atualmente é um esqueleto esperando a implementação das Questões.
     */
    private async calcularNota(idTentativa: number): Promise<number> {
        // TODO: Quando a tabela 'RespostaQuestao' existir:
        // 1. Buscar todas as respostas do aluno para esta tentativa (SELECT * FROM RespostaQuestao WHERE id_tentativa = ...)
        // 2. Buscar o gabarito (Opcao.correta = true)
        // 3. Comparar e somar pontos

        console.log(`🧮 Calculando nota para tentativa ${idTentativa}... (Lógica pendente)`);

        return 0; // Por enquanto retorna 0 até termos questões reais.
    }

    async listarHistoricoAluno(idMatricula: number) {
        if (!idMatricula) throw new Error("ID da Matrícula obrigatório.");
        return await tentativaAvaliacaoRepository.listarPorMatricula(idMatricula);
    }
}

export default new TentativaAvaliacaoService();