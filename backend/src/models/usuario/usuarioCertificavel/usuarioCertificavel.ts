import { Usuario } from "../usuario";
import { TipoUsuario } from "../../../constants/tipoUsuario";

export abstract class UsuarioCertificavel extends Usuario {
    constructor(
        idUsuario: number,
        nome: string,
        ultimoNome: string,
        email: string,
        senha: string,
        tipo: TipoUsuario,
        passe: boolean,
        // Propriedades específicas desta camada intermediária
        public foto: string,
        public cpf: string
    ) {
        super(idUsuario, nome, ultimoNome, email, senha, tipo, passe);
    }
}