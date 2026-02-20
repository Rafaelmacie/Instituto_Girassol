export class RespostaQuestao {
    constructor(
        public idRespostaQuestao: number,
        public ehCorreta: boolean,
        public idTentativa: number,
        public idQuestao: number,
        public idOpcao: number
    ) {}
}