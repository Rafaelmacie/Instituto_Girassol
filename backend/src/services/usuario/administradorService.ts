import administradorRepository from '../../persistence/usuario/administradorRepository';
import { Administrador } from '../../models/usuario/administrador';

export class AdministradorService {

    async criar(dados: any): Promise<Administrador> {
        // Aqui poderíamos validar se o email já existe, validar força da senha, etc.
        
        // Instancia o Model (padronizando os dados)
        const novoAdmin = new Administrador(
            0, // ID temporário, o banco vai gerar
            dados.nome,
            dados.ultimoNome,
            dados.email,
            dados.senha,
            dados.passe || false, // Default false
            dados.instagram
        );

        return await administradorRepository.criar(novoAdmin);
    }

    async atualizar(id: number, dados: any): Promise<Administrador> {
        // Instancia com o ID que veio da URL
        const adminEditado = new Administrador(
            id,
            dados.nome,
            dados.ultimoNome,
            dados.email,
            dados.senha,
            dados.passe,
            dados.instagram
        );

        return await administradorRepository.atualizar(adminEditado);
    }
}

export default new AdministradorService();