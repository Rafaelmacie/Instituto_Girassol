import { Request, Response } from 'express';
import aulaService from './aulaService';

export class AulaController {

    async criar(req: Request, res: Response): Promise<void> {
        try {
            // req.file contém o arquivo de vídeo processado pelo Multer
            const aula = await aulaService.criar(req.body, req.file);
            res.status(201).json(aula);
        } catch (error: any) {
            console.error("Erro no upload:", error);

            // Tratamento de FK (Módulo não existe)
            if (error.code === '23503') {
                res.status(400).json({ message: 'O Módulo informado não existe.' });
            } else {
                res.status(500).json({ message: error.message || 'Erro ao criar aula.' });
            }
        }
    }

    async listarPorModulo(req: Request, res: Response): Promise<void> {
        try {
            const idModulo = parseInt(req.params.idModulo || '0');
            const aulas = await aulaService.listarPorModulo(idModulo);
            res.status(200).json(aulas);
        } catch (error: any) {
            res.status(500).json({ message: 'Erro ao listar aulas.' });
        }
    }

    async atualizar(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id || '0');
            // req.file pode vir ou não (update parcial)
            const aula = await aulaService.atualizar(id, req.body, req.file);
            res.status(200).json(aula);
        } catch (error: any) {
            res.status(400).json({ message: error.message || 'Erro ao atualizar aula.' });
        }
    }

    async excluir(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id || '0');
            await aulaService.excluir(id);
            res.status(200).json({ message: "Aula excluída com sucesso." });
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    }

    async buscarPorId(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id || '0');
            const aula = await aulaService.buscarPorId(id);
            res.status(200).json(aula);
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    }
}

export default new AulaController();