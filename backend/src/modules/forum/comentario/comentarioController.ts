import { Request, Response } from 'express';
import { ComentarioService } from './comentarioService';

const service = new ComentarioService();

export class ComentarioController {
    
    async criar(req: Request, res: Response) {
        try {
            const novoComentario = await service.criarComentario(req.body);
            return res.status(201).json({ message: "Comentário adicionado!", comentario: novoComentario });
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async listarPorAula(req: Request, res: Response) {
        try {
            const idAula = Number(req.params.idAula);
            const comentarios = await service.listarComentariosDaAula(idAula);
            return res.status(200).json(comentarios);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async atualizar(req: Request, res: Response) {
        try {
            const idComentario = Number(req.params.id);
            const { texto } = req.body;
            const comentarioAtualizado = await service.atualizarComentario(idComentario, texto);
            return res.status(200).json({ message: "Comentário editado!", comentario: comentarioAtualizado });
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async excluir(req: Request, res: Response) {
        try {
            const idComentario = Number(req.params.id);
            await service.excluirComentario(idComentario);
            return res.status(200).json({ message: "Comentário excluído com sucesso." });
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}