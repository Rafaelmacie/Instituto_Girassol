import { CursoRepository } from './cursoRepository';

export class CursoService {
    private cursoRepository: CursoRepository;

    constructor() {
        this.cursoRepository = new CursoRepository();
    }

    async createCurso(data: any) {
        if (!data.titulo || !data.idProfessor || !data.idArea || !data.disciplina) {
            throw new Error("Campos obrigatórios faltando: titulo, idProfessor, idArea, disciplina");
        }
        
        return await this.cursoRepository.create(data);
    }

    async getCursos(filters: any) {
        return await this.cursoRepository.findAll(filters);
    }

    async getCursoById(id: number) {
        const curso = await this.cursoRepository.findById(id);
        if (!curso) throw new Error("Curso não encontrado");
        return curso;
    }

    async updateCurso(id: number, data: any) {
        return await this.cursoRepository.update(id, data);
    }

    async deleteCurso(id: number) {
        return await this.cursoRepository.delete(id);
    }
}