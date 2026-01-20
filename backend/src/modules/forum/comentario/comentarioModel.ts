import { RespostaComentario } from '../respostaComentario/respostaComentarioModel';

export class Comentario {
    constructor(
        public idComentario: number,
        public texto: string,
        public idUsuario: number, // FK
        public idAula: number,    // FK
        public respostas: RespostaComentario[] = [] // Valor padrão direto no argumento
    ) {}
}