// backend/src/modules/usuario/usuarioCertificavel/professor/professorService.ts
import { ProfessorRepository } from './professorRepository';
import bcrypt from 'bcrypt'; // Lembre de instalar: npm install bcrypt

export class ProfessorService {
    private professorRepository: ProfessorRepository;

    constructor() {
        this.professorRepository = new ProfessorRepository();
    }

    async createProfessor(data: any) {
        // 1. Validação básica
        if (!data.email || !data.senha || !data.nome || !data.cpf) {
            throw new Error("Campos obrigatórios faltando: email, senha, nome, cpf");
        }

        // 2. Criptografia da senha
        const salt = await bcrypt.genSalt(10);
        data.senha = await bcrypt.hash(data.senha, salt);

        // 3. Chama repository
        return await this.professorRepository.create(data);
    }

    async getProfessores(filters: any) {
        return await this.professorRepository.findAll(filters);
    }

    async getProfessorById(id: number) {
        const professor = await this.professorRepository.findById(id);
        if (!professor) throw new Error("Professor não encontrado");
        return professor;
    }

    async updateProfessor(id: number, data: any) {
        // Se for atualizar senha, precisaria re-hash. Aqui simplifiquei.
        return await this.professorRepository.update(id, data);
    }

    async deleteProfessor(id: number) {
        return await this.professorRepository.delete(id);
    }
}