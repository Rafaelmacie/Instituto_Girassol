import { StatusMatricula } from "../../../shared/constants/statusMatricula";

export class Matricula {
    constructor(
        public idMatricula: number,
        public data: Date,
        public statusMatricula: StatusMatricula,
        public idAluno: number,
        public idCurso: number,
        public favoritada: boolean = false,
        public aulasAssistidas: number = 0,
        public notaFinal: number | null = null
    ) {}
}