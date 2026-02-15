import { OpcaoRepository } from './opcaoRepository';

export class OpcaoService {
    private repository: OpcaoRepository;

    constructor() {
        this.repository = new OpcaoRepository();
    }

    // 1. CRIAR
    async criar(texto: string, correta: boolean, idQuestao: number) {
        if (!texto) {
            throw new Error("O texto da opção não pode ser vazio.");
        }
        if (!idQuestao) {
            throw new Error("A opção precisa estar vinculada a uma questão.");
        }

        // Aqui poderíamos validar se a Questão existe, mas vamos confiar no ID por enquanto
        return await this.repository.criar(texto, correta, idQuestao);
    }

    // 2. LISTAR POR QUESTÃO
    async listarPorQuestao(idQuestao: number) {
        if (!idQuestao) {
            throw new Error("ID da questão inválido.");
        }
        return await this.repository.listarPorQuestao(idQuestao);
    }

    // 3. EXCLUIR
    async excluir(idOpcao: number) {
        if (!idOpcao) {
            throw new Error("ID da opção é obrigatório.");
        }
        
        // Verifica se existe antes de excluir (opcional, mas boa prática)
        const existe = await this.repository.buscarPorId(idOpcao);
        if (!existe) {
            throw new Error("Opção não encontrada para exclusão.");
        }

        return await this.repository.excluir(idOpcao);
    }
}