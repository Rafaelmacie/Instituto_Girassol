// backend/src/modules/usuario/usuarioCertificavel/professor/professorController.ts
import { Request, Response } from 'express';
import { ProfessorService } from './professorService';

export class ProfessorController {
    private professorService: ProfessorService;

    constructor() {
        this.professorService = new ProfessorService();
    }

    // Create
    async create(req: Request, res: Response) {
        try {
            await this.professorService.createProfessor(req.body);
            res.status(201).json({ message: "Professor criado com sucesso" });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    // Read (com Query Params)
    async getAll(req: Request, res: Response) {
        try {
            // req.query pega filtros como ?nome=Joao&email=teste@gmail.com
            const professores = await this.professorService.getProfessores(req.query);
            res.status(200).json(professores);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // Read One
    async getOne(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id || '0');
            const professor = await this.professorService.getProfessorById(id);
            res.status(200).json(professor);
        } catch (error: any) {
            res.status(404).json({ error: error.message });
        }
    }

    // Update
    async update(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id || '0');
            await this.professorService.updateProfessor(id, req.body);
            res.status(200).json({ message: "Professor atualizado com sucesso" });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    // Delete
    async delete(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id || '0');
            await this.professorService.deleteProfessor(id);
            res.status(200).json({ message: "Professor excluído com sucesso" });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}