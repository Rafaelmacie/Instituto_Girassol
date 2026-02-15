import { QuestaoRepository } from './questaoRepository';
import { AvaliacaoRepository } from '../../avaliacao/avaliacaoRepository';

export class QuestaoService {
    private repo = new QuestaoRepository();
    private avaliacaoRepo = new AvaliacaoRepository();

    async criarQuestao(dados: any) {
        if (!dados.comando || !dados.tipoQuestao || !dados.idAvaliacao) {
            throw new Error("Comando, Tipo da Questão e ID da Avaliação são obrigatórios.");
        }

        const tiposPermitidos = ['Unica_Escolha', 'Multipla_Escolha'];

        if (!tiposPermitidos.includes(dados.tipoQuestao)) {
            throw new Error(`Tipo inválido. Use: ${tiposPermitidos.join(', ')}`);
        }
        const avaliacao = await this.avaliacaoRepo.buscarPorId(dados.idAvaliacao);

        if (!avaliacao) {
            throw new Error("Avaliação informada não existe.");
        }

        const qtdAtual = await this.repo.contarPorAvaliacao(dados.idAvaliacao);

        console.log('--- DEBUG ---');
        console.log('Limite da Avaliação:', avaliacao.numeroQuestoes);
        console.log('Quantas já existem:', qtdAtual);
        console.log('Tipo do Qtd:', typeof qtdAtual);
        console.log('Devo bloquear?', qtdAtual >= avaliacao.numeroQuestoes);
        console.log('-------------');

        if (qtdAtual >= avaliacao.numeroQuestoes) {
            throw new Error(`Limite atingido! Esta avaliação permite apenas ${avaliacao.numeroQuestoes} questões.`);
        }

        return await this.repo.create(dados.comando, dados.tipoQuestao, dados.idAvaliacao);
    }


    // ... restante dos métodos (listar, atualizar, excluir) continua igual ...
    async listarPorAvaliacao(idAvaliacao: number) {
        return await this.repo.findAllByAvaliacao(idAvaliacao);
    }

    async atualizarQuestao(id: number, dados: any) {
        const atual = await this.repo.findById(id);
        if (!atual) throw new Error("Questão não encontrada.");

        const comando = dados.comando || atual.comando;
        const tipoQuestao = dados.tipoQuestao || atual.tipoQuestao;

        return await this.repo.update(id, comando, tipoQuestao);
    }

    async excluirQuestao(id: number) {
        return await this.repo.delete(id);
    }
}