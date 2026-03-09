import { ComentarioRepository } from './comentarioRepository';

export class ComentarioService {
    private repo = new ComentarioRepository();

    async criarComentario(dados: any) {
        if (!dados.texto || !dados.idUsuario || !dados.idAula) {
            throw new Error("Texto, ID do Usuário e ID da Aula são obrigatórios.");
        }

        if (dados.texto.trim() === '') {
            throw new Error("O comentário não pode estar vazio.");
        }

        return await this.repo.criar(dados.texto, dados.idUsuario, dados.idAula);
    }

    async listarComentariosDaAula(idAula: number) {
        if (!idAula) {
            throw new Error("ID da aula é obrigatório.");
        }
        return await this.repo.listarPorAula(idAula);
    }

    async atualizarComentario(idComentario: number, novoTexto: string) {
        if (!novoTexto || novoTexto.trim() === '') {
            throw new Error("O texto do comentário não pode ficar vazio.");
        }

        const comentarioExiste = await this.repo.buscarPorId(idComentario);
        if (!comentarioExiste) {
            throw new Error("Comentário não encontrado.");
        }

        return await this.repo.atualizar(idComentario, novoTexto);
    }

    async excluirComentario(idComentario: number) {
        const comentarioExiste = await this.repo.buscarPorId(idComentario);
        if (!comentarioExiste) {
            throw new Error("Comentário não encontrado.");
        }

        return await this.repo.excluir(idComentario);
    }
}