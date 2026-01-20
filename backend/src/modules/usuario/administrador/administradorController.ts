import { Request, Response } from 'express';
import administradorService from './administradorService';

export class AdministradorController {

    async criar(req: Request, res: Response): Promise<void> {
        try {
            const administrador = await administradorService.criar(req.body);
            res.status(201).json(administrador);
        } catch (error: any) {
            console.error(error);
            if (error.code === '23505') {
                 res.status(409).json({ message: 'Email já cadastrado.' });
            } else {
                 res.status(500).json({ message: 'Erro ao criar administrador.' });
            }
        }
    }

    async atualizar(req: Request, res: Response): Promise<void> {
        try {
            // O "|| '0'" garante que sempre passamos uma string para o parseInt,
            // mesmo que o params.id venha (impossivelmente) undefined.
            const id = parseInt(req.params.id || '0');

            // Boa prática: Verificar se o ID é válido antes de chamar o serviço
            if (isNaN(id) || id === 0) {
                res.status(400).json({ message: 'ID inválido fornecido.' });
                return;
            }

            const administrador = await administradorService.atualizar(id, req.body);
            res.status(200).json(administrador);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro ao atualizar administrador.' });
        }
    }
}

export default new AdministradorController();