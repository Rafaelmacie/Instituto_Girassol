import { UsuarioRepository } from '../usuario/usuarioRepository';

export class UsuarioService {
    private repository = new UsuarioRepository();

    async autenticar(email: string, senha_enviada: string) {
        const usuario = await this.repository.buscarPorEmail(email);

        if (!usuario) {
            throw new Error("Usuário não encontrado.");
        }

        // Comparação simples de senha (depois vocês podem usar bcrypt aqui)
        if (usuario.senha !== senha_enviada) {
            throw new Error("Senha incorreta.");
        }

        // Retorna os dados do usuário logado (sem a senha por segurança)
        const { senha, ...dadosPublicos } = usuario;
        return dadosPublicos;
    }
}