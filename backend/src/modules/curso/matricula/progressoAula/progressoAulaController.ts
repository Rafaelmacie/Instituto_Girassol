import { Request, Response } from 'express';
import { ProgressoAulaService } from './progressoAulaService';

export class ProgressoAulaController {
    private service: ProgressoAulaService;

    constructor() {
        this.service = new ProgressoAulaService();
    }

    async marcarAssistida(req: Request, res: Response) {
        try {
            // Pegamos o ID da aula da URL (ex: /aulas/10/concluir)
            const { idAula } = req.params; 
            
            // Pegamos o ID da matricula e os minutos do corpo da requisição (JSON)
            const { idMatricula, minutosAssistidos } = req.body;

            // Validação simples
            if (!idAula || !idMatricula) {
                return res.status(400).json({ error: "ID da Aula e ID da Matrícula são obrigatórios." });
            }

            const progresso = await this.service.registrarProgresso(
                Number(idMatricula), 
                Number(idAula), 
                Number(minutosAssistidos || 0) // Se não mandar minutos, assume 0
            );

            return res.status(200).json({
                message: "Progresso salvo com sucesso!",
                progresso
            });

        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    async buscarProgresso(req: Request, res: Response) {
        try {
            const { idMatricula, idAula } = req.params;

            if (!idMatricula || !idAula) {
                return res.status(400).json({ error: "IDs obrigatórios." });
            }

            // Chama o service (que já tem acesso ao repo.buscarPorMatriculaEAula)
            const progresso = await this.service.consultarProgresso(
                Number(idMatricula), 
                Number(idAula)
            );

            // Se não tiver progresso (null), retorna que não foi assistida
            if (!progresso) {
                return res.status(200).json({ assistida: false, minutos: 0 });
            }

            return res.status(200).json({ 
                assistida: progresso.assistida, 
                minutos: progresso.minutosAssistidos 
            });

        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }
}



export default new ProgressoAulaController();