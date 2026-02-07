import { Request, Response } from 'express';
import { AvaliacaoService } from './avalicaoService';

export class AvaliacaoController {
    private service = new AvaliacaoService();

    create = async (req: Request, res: Response) => {
        try {
            // Espera receber: { "idModulo": 1, "notaMinima": 7, "numeroQuestoes": 10 }
            const avaliacao = await this.service.criarAvaliacao(req.body);
            return res.status(201).json({ message: "Avaliação criada!", avaliacao });
        } catch (error: any) {
            if (error.code === '23503') { // Erro de FK
                return res.status(400).json({ error: "O Módulo informado não existe." });
            }
            return res.status(400).json({ error: error.message });
        }
    }

    listarPorModulo = async (req: Request, res: Response) => {
        try {
            const { idModulo } = req.params;
            const avaliacoes = await this.service.listarPorModulo(Number(idModulo));
            return res.status(200).json(avaliacoes);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    update = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const atualizado = await this.service.atualizarAvaliacao(Number(id), req.body);
            return res.status(200).json({ message: "Avaliação atualizada!", atualizado });
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    delete = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            await this.service.excluirAvaliacao(Number(id));
            return res.status(200).json({ message: "Avaliação excluída com sucesso." });
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}