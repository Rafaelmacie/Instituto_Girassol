import { Request, Response } from 'express';
import { UsuarioService } from '../usuario/usuarioService';

export class UsuarioController {
    private service = new UsuarioService();

    public login = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { email, senha } = req.body;
            const usuario = await this.service.autenticar(email, senha);
            return res.status(200).json({ 
                mensagem: "Login realizado com sucesso!", 
                usuario 
            });
        } catch (error: any) {
            return res.status(401).json({ erro: error.message });
        }
    }
}