import { ProfessorRepository } from './professorRepository';
// 1. Importar a ferramenta de hash
import { hashSenha } from '../../../../shared/utils/senhaUtils'; 

export class ProfessorService {
    private professorRepository: ProfessorRepository;

    constructor() {
        this.professorRepository = new ProfessorRepository();
    }

    async createProfessor(data: any) {
        // Validações básicas
        if (!data.email || !data.senha || !data.nome || !data.cpf) {
            throw new Error("Campos obrigatórios faltando: email, senha, nome, cpf");
        }

        // --- A CORREÇÃO MÁGICA ---
        // 2. Criptografa a senha que veio do formulário
        const senhaHash = await hashSenha(data.senha);

        // 3. SUBSTITUI a senha original ("123") pela criptografada ("$2b$10$...")
        // Se pularmos essa linha, o banco salva "123" e o login falha.
        data.senha = senhaHash; 

        // 4. Agora mandamos o objeto 'data' com a senha segura para o repositório
        return await this.professorRepository.create(data);
    }

    // ... Resto dos métodos continua igual ...
    async getProfessores(filters: any) {
        return await this.professorRepository.findAll(filters);
    }

    async getProfessorById(id: number) {
        const professor = await this.professorRepository.findById(id);
        if (!professor) throw new Error("Professor não encontrado");
        return professor;
    }

    async updateProfessor(id: number, data: any) {
        return await this.professorRepository.update(id, data);
    }

    async deleteProfessor(id: number) {
        return await this.professorRepository.delete(id);
    }
}