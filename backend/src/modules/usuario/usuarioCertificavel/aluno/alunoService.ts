import { AlunoRepository } from './alunoRepository';
import { hashSenha } from '../../../../shared/utils/senhaUtils';

export class AlunoService {
    private repository = new AlunoRepository();

    async cadastrar(dados: any) {
        // Regra de negócio: Aluno sempre começa com passe livre
        dados.passe = true; 
        dados.senha = await hashSenha(dados.senha);
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