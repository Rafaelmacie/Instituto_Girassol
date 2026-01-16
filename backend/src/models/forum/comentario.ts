import { RespostaComentario } from './respostaComentario';

export class Comentario {
    constructor(
        public idComentario: number,
        public texto: string,
        public idUsuario: number, // FK
        public idAula: number,    // FK
        public respostas: RespostaComentario[] = [] // Valor padrão direto no argumento
    ) {}
}