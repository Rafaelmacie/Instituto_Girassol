import { Request, Response } from 'express';
import { OpcaoService } from './opcaoService'; 

export class OpcaoController {
    private service: OpcaoService;

    constructor() {
        this.service = new OpcaoService();
    }

    // 1. CRIAR OPÇÃO
    async criar(req: Request, res: Response) {
        try {
            // O idQuestao vem no corpo para saber a quem essa opção pertence
            const { texto, correta, idQuestao } = req.body;

            if (!texto || !idQuestao) {
                return res.status(400).json({ error: "Texto e ID da Questão são obrigatórios." });
            }

            // Garante que 'correta' seja um booleano
            const novaOpcao = await this.service.criar(texto, Boolean(correta), Number(idQuestao));

            return res.status(201).json(novaOpcao);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    // 2. LISTAR OPÇÕES DE UMA QUESTÃO
    async listarPorQuestao(req: Request, res: Response) {
        try {
            const { idQuestao } = req.params; // Pegaremos da URL ex: /opcoes/questao/10

            if (!idQuestao) {
                return res.status(400).json({ error: "ID da Questão é obrigatório." });
            }

            const opcoes = await this.service.listarPorQuestao(Number(idQuestao));
            return res.status(200).json(opcoes);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    // 3. EXCLUIR OPÇÃO
    async excluir(req: Request, res: Response) {
        try {
            const { id } = req.params; // ID da própria opção

            await this.service.excluir(Number(id));

            return res.status(200).json({ message: "Opção excluída com sucesso." });
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }
}

export default new OpcaoController();