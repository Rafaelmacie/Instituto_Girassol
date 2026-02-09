import { Request, Response } from 'express';
import { QuestaoService } from './questaoService';

export class QuestaoController {
    private service = new QuestaoService();

    create = async (req: Request, res: Response) => {
        try {
            const questao = await this.service.criarQuestao(req.body);
            return res.status(201).json({ message: "Questão criada!", questao });
        } catch (error: any) {
            if (error.code === '23503') { 
                return res.status(400).json({ error: "A Avaliação informada não existe." });
            }
            // Erro de ENUM inválido vindo do banco (caso passe pelo service)
            if (error.code === '22P02') { 
                return res.status(400).json({ error: "Tipo de questão inválido para o banco de dados." });
            }
            return res.status(400).json({ error: error.message });
        }
    }

    listarPorAvaliacao = async (req: Request, res: Response) => {
        try {
            const { idAvaliacao } = req.params;
            const questoes = await this.service.listarPorAvaliacao(Number(idAvaliacao));
            return res.status(200).json(questoes);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    update = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const atualizado = await this.service.atualizarQuestao(Number(id), req.body);
            return res.status(200).json({ message: "Questão atualizada!", atualizado });
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    delete = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            await this.service.excluirQuestao(Number(id));
            return res.status(200).json({ message: "Questão excluída com sucesso." });
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}