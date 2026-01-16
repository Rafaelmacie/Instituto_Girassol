import { UsuarioCertificavel } from "./usuarioCertificavel";
import { TipoUsuario } from "../../../constants/tipoUsuario";

export class Aluno extends UsuarioCertificavel {
    constructor(
        idUsuario: number,
        nome: string,
        ultimoNome: string,
        email: string,
        senha: string,
        passe: boolean,
        foto: string,
        cpf: string
    ) {
        super(idUsuario, nome, ultimoNome, email, senha, TipoUsuario.ALUNO, passe, foto, cpf);
    }
}