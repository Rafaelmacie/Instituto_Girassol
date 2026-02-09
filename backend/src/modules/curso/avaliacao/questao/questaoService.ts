import { QuestaoRepository } from './questaoRepository';

export class QuestaoService {
    private repo = new QuestaoRepository();

    async criarQuestao(dados: any) {
        if (!dados.comando || !dados.tipoQuestao || !dados.idAvaliacao) {
            throw new Error("Comando, Tipo da Questão e ID da Avaliação são obrigatórios.");
        }
        
        // CORREÇÃO: Usar exatamente os nomes do seu banco (Case Sensitive)
        const tiposPermitidos = ['Unica_Escolha', 'Multipla_Escolha'];
        
        if (!tiposPermitidos.includes(dados.tipoQuestao)) {
            throw new Error(`Tipo inválido. Use: ${tiposPermitidos.join(', ')}`);
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