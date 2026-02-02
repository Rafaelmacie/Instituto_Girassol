import { Request, Response } from 'express';
import { ModuloService } from './moduloService';

export class ModuloController {
    private service = new ModuloService();

    async create(req: Request, res: Response) {
        try {
            const { nome, idCurso } = req.body;
            await this.service.criarModulo(nome, idCurso);
            res.status(201).json({ message: "Módulo criado com sucesso" });
        } catch (error: any) {
            // Tratamento de erro de FK caso o curso não exista
            if (error.code === '23503') {
                return res.status(400).json({ error: "O Curso informado não existe." });
            }
            res.status(400).json({ error: error.message });
        }
    }

    async getByCurso(req: Request, res: Response) {
        try {
            const idCurso = parseInt(req.params.idCurso);
            const modulos = await this.service.listarModulosDoCurso(idCurso);
            res.status(200).json(modulos);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const { nome } = req.body;
            await this.service.atualizarModulo(id, nome);
            res.status(200).json({ message: "Módulo atualizado com sucesso" });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            await this.service.excluirModulo(id);
            res.status(200).json({ message: "Módulo excluído com sucesso" });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}