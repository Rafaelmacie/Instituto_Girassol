import { ModuloRepository } from './moduloRepository';

export class ModuloService {
    private repo = new ModuloRepository();

    async criarModulo(nome: string, idCurso: number) {
        if (!nome || !idCurso) throw new Error("Nome e ID do Curso são obrigatórios.");
        return await this.repo.create(nome, idCurso);
    }

    async listarModulosDoCurso(idCurso: number) {
        return await this.repo.findAllByCurso(idCurso);
    }

    async atualizarModulo(id: number, nome: string) {
        return await this.repo.update(id, nome);
    }

    async excluirModulo(id: number) {
        return await this.repo.delete(id);
    }
}