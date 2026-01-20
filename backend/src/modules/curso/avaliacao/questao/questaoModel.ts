import { TipoQuestao } from "../../../../shared/constants/tipoQuestao";

export class Questao {
    constructor(
        public idQuestao: number,
        public comando: string,
        public tipoQuestao: TipoQuestao,
        public idAvaliacao: number
    ) {}
}