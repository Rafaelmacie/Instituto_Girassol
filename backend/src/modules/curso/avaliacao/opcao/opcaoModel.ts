export class Opcao {
    constructor(
        public idOpcao: number,
        public texto: string,
        public correta: boolean,
        public idQuestao: number
    ) {}
}