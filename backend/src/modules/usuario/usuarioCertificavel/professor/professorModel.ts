import { UsuarioCertificavel } from "../usuarioCertificavel";
import { TipoUsuario } from "../../../../shared/constants/tipoUsuario";
export class ProfessorModel extends UsuarioCertificavel {
    constructor(
        idUsuario: number,
        nome: string,
        ultimoNome: string,
        email: string,
        senha: string,
        passe: boolean,
        foto: string,
        cpf: string,
        // Propriedades específicas de Professor
        public curriculo: string,
        public telefone: string
    ) {
        super(idUsuario, nome, ultimoNome, email, senha, TipoUsuario.PROFESSOR, passe, foto, cpf);
    }
}