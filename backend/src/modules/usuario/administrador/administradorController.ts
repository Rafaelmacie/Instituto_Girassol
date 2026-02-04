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
            const id = parseInt(req.params.id || '0');

            if (isNaN(id) || id === 0) {
                res.status(400).json({ message: 'ID inválido fornecido.' });
                return;
            }

            // O service executa a atualização, mas não retorna nada (void)
            await administradorService.atualizar(id, req.body);

            // Então, retornamos uma mensagem de confirmação manual
            res.status(200).json({ message: "Administrador atualizado com sucesso!" });
            
        } catch (error: any) {
            if (error.message === 'Administrador não encontrado.') {
                 res.status(404).json({ message: error.message });
                 return;
            }
            console.error(error);
            res.status(500).json({ message: 'Erro ao atualizar administrador.' });
        }
    }

    async listar(req: Request, res: Response): Promise<void> {
        try {
            const lista = await administradorService.listar();
            res.status(200).json(lista);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro ao listar administradores.' });
        }
    }
}

export default new AdministradorController();