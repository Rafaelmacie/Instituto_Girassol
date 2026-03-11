import { Request, Response } from 'express';
import { RespostaService } from './respostaService';

export class RespostaController {
    private service = new RespostaService();

    create = async (req: Request, res: Response) => {
        try {
            const resposta = await this.service.criarResposta(req.body);
            return res.status(201).json({ message: "Resposta enviada!", resposta });
        } catch (error: any) {
            if (error.code === '23503') {
                return res.status(400).json({ error: "Usuário ou Comentário original não encontrados." });
            }
            return res.status(400).json({ error: error.message });
        }
    }

    listarPorComentario = async (req: Request, res: Response) => {
        try {
            const { idComentario } = req.params;
            const respostas = await this.service.listarPorComentario(Number(idComentario));
            return res.status(200).json(respostas);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    update = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const atualizado = await this.service.atualizarResposta(Number(id), req.body);
            return res.status(200).json({ message: "Resposta atualizada!", atualizado });
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    delete = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            await this.service.excluirResposta(Number(id));
            return res.status(200).json({ message: "Resposta excluída com sucesso." });
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}