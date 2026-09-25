import { RespostaRepository } from './respostaRepository';

export class RespostaService {
    private repo = new RespostaRepository();

    async criarResposta(dados: any) {
        if (!dados.texto || !dados.idUsuario || !dados.idComentario) {
            throw new Error("Texto, ID do Usuário e ID do Comentário são obrigatórios.");
        }
        return await this.repo.create(dados.texto, dados.idUsuario, dados.idComentario);
    }

    async listarPorComentario(idComentario: number) {
        return await this.repo.findAllByComentario(idComentario);
    }

    async atualizarResposta(id: number, dados: any) {
        if (!dados.texto) {
             throw new Error("Informe o novo texto da resposta.");
        }
        return await this.repo.update(id, dados.texto);
    }

    async excluirResposta(id: number) {
        return await this.repo.delete(id);
    }
}