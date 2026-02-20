import { Request, Response } from 'express';
import tentativaAvaliacaoService from './tentativaAvaliacaoService';

export class TentativaAvaliacaoController {

    async iniciar(req: Request, res: Response): Promise<void> {
        try {
            const tentativa = await tentativaAvaliacaoService.iniciarTentativa(req.body);
            res.status(201).json(tentativa);
        } catch (error: any) {
            console.error(error);
            // Tratamento de erro de FK do Postgres (se passar ID errado)
            if (error.code === '23503') {
                res.status(400).json({ message: 'Matrícula ou Avaliação não encontrada.' });
            } else {
                res.status(500).json({ message: error.message || 'Erro ao iniciar tentativa.' });
            }
        }
    }

    async historico(req: Request, res: Response): Promise<void> {
        try {
            const idMatricula = parseInt(req.params.idMatricula || '0');
            const historico = await tentativaAvaliacaoService.listarHistoricoAluno(idMatricula);
            res.status(200).json(historico);
        } catch (error: any) {
            res.status(500).json({ message: 'Erro ao buscar histórico.' });
        }
    }

    async finalizar(req: Request, res: Response): Promise<void> {
        try {
            const idTentativa = parseInt(req.params.id || '0');

            // Chamamos o service apenas com o ID. A nota é calculada lá dentro!
            const resultado = await tentativaAvaliacaoService.finalizarTentativa(idTentativa);

            res.status(200).json(resultado);
        } catch (error: any) {
            res.status(400).json({ message: error.message || 'Erro ao finalizar tentativa.' });
        }
    }

    // Rota para o Frontend verificar se deve mostrar o botão "Continuar Prova"
    async buscarAberta(req: Request, res: Response): Promise<void> {
        try {
            // Pegamos via Query Params ou Params. 
            // tentativas/aberta?idMatricula=1&idAvaliacao=5
            const idMatricula = parseInt(req.query.idMatricula as string);
            const idAvaliacao = parseInt(req.query.idAvaliacao as string);

            if (!idMatricula || !idAvaliacao) {
                res.status(400).json({ message: 'idMatricula e idAvaliacao são obrigatórios na query.' });
                return;
            }

            const tentativa = await tentativaAvaliacaoService.buscarTentativaAtiva(idMatricula, idAvaliacao);

            // Retorna 200 com a tentativa (ou null se não tiver)
            res.status(200).json(tentativa);
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Erro ao buscar tentativa aberta.' });
        }
    }
}

export default new TentativaAvaliacaoController();