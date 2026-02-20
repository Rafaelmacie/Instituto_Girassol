import { Request, Response } from 'express';
import { RespostaService } from './respostaService';

export class RespostaController {
    private service = new RespostaService();

    createOrUpdate = async (req: Request, res: Response) => {
        try {
            const resposta = await this.service.registrarResposta(req.body);
            return res.status(200).json({ message: "Resposta salva com sucesso!", resposta });
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    listar = async (req: Request, res: Response) => {
        try {
            const { idTentativa } = req.params;
            const respostas = await this.service.buscarRespostasDaTentativa(Number(idTentativa));
            return res.status(200).json(respostas);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}