import { TipoUsuario } from "../../shared/constants/tipoUsuario";

export abstract class Usuario {
    constructor(
        public idUsuario: number,
        public nome: string,
        public ultimoNome: string,
        public email: string,
        public senha: string,
        public tipo: TipoUsuario,
        public passe: boolean
    ) {}
}