// src/models/matricula/tentativaAvaliacao.ts
export class TentativaAvaliacao {
    constructor(
        public idTentativa: number,
        public notaAdquirida: number,
        public dataHora: Date,
        public idMatricula: number,
        public idAvaliacao: number
    ) {}
}