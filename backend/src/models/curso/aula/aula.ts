// src/models/curso/aula.ts
export class Aula {
    constructor(
        public idAula: number,
        public titulo: string,
        public descricao: string,
        public minutos: string, // Representando o tipo 'time'
        public idModulo: number
    ) {}
}