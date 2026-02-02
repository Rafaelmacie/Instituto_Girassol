export class Aula {
    constructor(
        public idAula: number,
        public titulo: string,
        public descricao: string,
        public idModulo: number, // FK para o Módulo
        public linkVideo: string,
        public duracao: number,
        public ordem: number = 1
    ) { }
}