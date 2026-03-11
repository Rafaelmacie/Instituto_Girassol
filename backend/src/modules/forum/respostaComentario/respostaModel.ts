export class RespostaComentario {
    constructor(
        public idResposta: number,
        public texto: string,
        public idUsuario: number,    // FK
        public idComentario: number,  // FK
        public criadoEm: Date
    ) {}
}