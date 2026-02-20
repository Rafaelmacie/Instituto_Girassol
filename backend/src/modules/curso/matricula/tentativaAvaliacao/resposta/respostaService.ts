import { RespostaRepository } from './respostaRepository';

export class RespostaService {
    private repo = new RespostaRepository();

    async registrarResposta(dados: any) {
        const { idTentativa, idQuestao, idOpcao } = dados;

        if (!idTentativa || !idQuestao || !idOpcao) {
            throw new Error("IDs da Tentativa, Questão e Opção são obrigatórios.");
        }

        // Descobre se a opção que o aluno marcou é a certa
        const ehCorreta = await this.repo.verificarOpcaoCorreta(idOpcao, idQuestao);

        // Salva a resposta no banco
        return await this.repo.salvarResposta(idTentativa, idQuestao, idOpcao, ehCorreta);
    }

    async buscarRespostasDaTentativa(idTentativa: number) {
        return await this.repo.listarPorTentativa(idTentativa);
    }
}