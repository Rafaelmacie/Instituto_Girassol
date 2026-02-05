import { Request, Response } from 'express';
import materialService from './materialService';

export class MaterialController {

    async criar(req: Request, res: Response): Promise<void> {
        try {
            // O arquivo vem no campo 'arquivo'
            const material = await materialService.criar(req.body, req.file);
            res.status(201).json(material);
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ message: error.message || 'Erro ao criar material.' });
        }
    }

    async listarPorAula(req: Request, res: Response): Promise<void> {
        try {
            const idAula = parseInt(req.params.idAula || '0');
            const materiais = await materialService.listarPorAula(idAula);
            res.status(200).json(materiais);
        } catch (error: any) {
            res.status(500).json({ message: 'Erro ao listar materiais.' });
        }
    }

    async excluir(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id || '0');
            await materialService.excluir(id);
            res.status(200).json({ message: "Material excluído com sucesso." });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default new MaterialController();