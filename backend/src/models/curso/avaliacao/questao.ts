import { TipoQuestao } from '../../../constants/tipoQuestao'; // Ajuste o caminho conforme necessário

export class Questao {
    constructor(
        public idQuestao: number,
        public comando: string,
        public tipoQuestao: TipoQuestao,
        public idAvaliacao: number
    ) {}
}