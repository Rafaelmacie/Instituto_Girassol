// src/models/matricula/respostaQuestao.ts
export class RespostaQuestao {
    constructor(
        public idResposta: number,
        public ehCorreta: boolean,
        public idTentativa: number,
        public idQuestao: number
    ) {}
}