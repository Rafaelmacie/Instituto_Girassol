import { Usuario } from '../usuario';
import { TipoUsuario } from '../../../shared/constants/tipoUsuario';

export class Administrador extends Usuario {
    constructor(
        idUsuario: number,
        nome: string,
        ultimoNome: string,
        email: string,
        senha: string,
        passe: boolean,
        public instagram: string
    ) {
        // Passamos os dados para o pai, fixando o TipoUsuario
        super(idUsuario, nome, ultimoNome, email, senha, TipoUsuario.ADMINISTRADOR, passe);
    }
}