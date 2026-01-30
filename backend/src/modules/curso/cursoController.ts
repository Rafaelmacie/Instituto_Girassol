// backend/src/modules/curso/cursoController.ts
import { Request, Response } from 'express';
import { CursoService } from './cursoService';

export class CursoController {
    private cursoService: CursoService;

    constructor() {
        this.cursoService = new CursoService();
    }

    async create(req: Request, res: Response) {
        try {
            await this.cursoService.createCurso(req.body);
            res.status(201).json({ message: "Curso criado com sucesso" });
        } catch (error: any) {
            // TRATAMENTO ESPECIAL: Erro de chave estrangeira (Foreign Key)
            // Acontece se enviar um idArea ou idProfessor que não existe no banco
            if (error.code === '23503') {
                if (error.constraint?.includes('fk_curso_area') || error.detail?.includes('id_area')) {
                    return res.status(400).json({ error: "A Área informada não existe." });
                }
                if (error.constraint?.includes('fk_curso_professor') || error.detail?.includes('id_professor')) {
                    return res.status(400).json({ error: "O Professor informado não existe." });
                }
                return res.status(400).json({ error: "Dados inválidos (Professor ou Área não encontrados)." });
            }
            res.status(400).json({ error: error.message });
        }
    }

    async getAll(req: Request, res: Response) {
        try {
            const cursos = await this.cursoService.getCursos(req.query);
            res.status(200).json(cursos);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getOne(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id || '0');
            const curso = await this.cursoService.getCursoById(id);
            res.status(200).json(curso);
        } catch (error: any) {
            res.status(404).json({ error: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id || '0');
            await this.cursoService.updateCurso(id, req.body);
            res.status(200).json({ message: "Curso atualizado com sucesso" });
        } catch (error: any) {
            // Também trata erro de FK no update (caso tente mudar para uma área inexistente)
            if (error.code === '23503') {
                return res.status(400).json({ error: "Professor ou Área informados não existem." });
            }
            res.status(400).json({ error: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id || '0');
            await this.cursoService.deleteCurso(id);
            res.status(200).json({ message: "Curso excluído com sucesso" });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}