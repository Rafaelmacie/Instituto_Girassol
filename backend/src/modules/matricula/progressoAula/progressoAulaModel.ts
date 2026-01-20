// src/models/matricula/progressoAula.ts
export class ProgressoAula {
    constructor(
        public idProgresso: number,
        public minutosAssistidos: string,
        public assistida: boolean,
        public idMatricula: number,
        public idAula: number
    ) {}
}