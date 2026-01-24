import { AlunoRepository } from './alunoRepository';

export class AlunoService {
    private repository = new AlunoRepository();

    async cadastrar(dados: any) {
        // Regra de negócio: Aluno sempre começa com passe livre
        dados.passe = true; 
        return await this.repository.criar(dados);
    }

    async buscarComFiltros(params: any) {
        return await this.repository.listar(params);
    }

    async atualizar(id: number, dados: any) {
        return await this.repository.editar(id, dados);
    }

    async remover(id: number) {
        return await this.repository.excluir(id);
    }
}