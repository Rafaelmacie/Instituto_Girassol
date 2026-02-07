import { AvaliacaoRepository } from './avaliacaoRepository';

export class AvaliacaoService {
    private repo = new AvaliacaoRepository();

    async criarAvaliacao(dados: any) {
        if (!dados.idModulo) {
            throw new Error("O ID do Módulo é obrigatório.");
        }
        
        // Regra: Se não informar notaMinima, usa 7 (padrão do seu banco)
        // Se não informar numeroQuestoes, começa com 0 (preencherá depois)
        const notaMinima = dados.notaMinima !== undefined ? dados.notaMinima : 7;
        const numeroQuestoes = dados.numeroQuestoes !== undefined ? dados.numeroQuestoes : 0;
        
        return await this.repo.create(notaMinima, numeroQuestoes, dados.idModulo);
    }

    async listarPorModulo(idModulo: number) {
        return await this.repo.findAllByModulo(idModulo);
    }

    async atualizarAvaliacao(id: number, dados: any) {
        const atual = await this.repo.findById(id);
        if (!atual) throw new Error("Avaliação não encontrada.");

        // Mantém o valor antigo se o novo não for enviado
        const notaMinima = dados.notaMinima !== undefined ? dados.notaMinima : atual.nota_minima;
        const numeroQuestoes = dados.numeroQuestoes !== undefined ? dados.numeroQuestoes : atual.numero_questoes;

        return await this.repo.update(id, notaMinima, numeroQuestoes);
    }

    async excluirAvaliacao(id: number) {
        return await this.repo.delete(id);
    }
}