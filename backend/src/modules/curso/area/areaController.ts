import { Request, Response } from 'express';
import areaService from './areaService';

export class AreaController {

    async criar(req: Request, res: Response): Promise<void> {
        try {
            const { nome } = req.body;
            const novaArea = await areaService.criar(nome);
            res.status(201).json(novaArea);
        } catch (error: any) {
            res.status(400).json({ message: error.message || 'Erro ao criar área.' });
        }
    }

    async listar(req: Request, res: Response): Promise<void> {
        try {
            const areas = await areaService.listarTodas();
            res.status(200).json(areas);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao listar áreas.' });
        }
    }

    async buscarPorId(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id || '0');
            const area = await areaService.buscarPorId(id);
            res.status(200).json(area);
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    }

    async excluir(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id || '0');
            await areaService.excluir(id);
            res.status(204).send(); // 204 No Content
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    }
}

export default new AreaController();