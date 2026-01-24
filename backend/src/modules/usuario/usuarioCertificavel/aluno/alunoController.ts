import { Request, Response } from 'express';
import { AlunoService } from './alunoService';

export class AlunoController {
    private service = new AlunoService();

    public criar = async (req: Request, res: Response): Promise<Response> => {
        try {
            const id = await this.service.cadastrar(req.body);
            return res.status(201).json({ id, mensagem: "Aluno criado com sucesso!" });
        } catch (error: any) {
            return res.status(400).json({ erro: error.message });
        }
    }

    public listar = async (req: Request, res: Response): Promise<Response> => {
        try {
            const alunos = await this.service.buscarComFiltros(req.query);
            return res.status(200).json(alunos);
        } catch (error: any) {
            return res.status(400).json({ erro: error.message });
        }
    }

    public editar = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params; // Pega o "1" da URL
        await this.service.atualizar(Number(id), req.body);
        return res.status(200).json({ mensagem: "Aluno atualizado com sucesso!" });
    } catch (error: any) {
        return res.status(400).json({ erro: error.message });
    }
}
    public excluir = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { id } = req.params;
            await this.service.remover(Number(id));
            return res.status(200).json({ mensagem: "Aluno excluído com sucesso!" });
        } catch (error: any) {
            return res.status(400).json({ erro: error.message });
        }
    }
}