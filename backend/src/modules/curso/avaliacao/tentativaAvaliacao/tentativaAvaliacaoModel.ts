export class TentativaAvaliacao {
    constructor(
        public idTentativa: number,
        public dataHora: Date,
        public finalizada: boolean,
        public notaAdquirida: number | null,
        public idMatricula: number,
        public idAvaliacao: number
    ) { }
}