// src/models/matricula/matricula.ts
import { StatusMatricula } from '../../constants/statusMatricula';

export class Matricula {
    constructor(
        public idMatricula: number,
        public data: Date,
        public status: StatusMatricula,
        public idAluno: number,
        public idCurso: number,
        public favoritada: boolean = false,
        public aulasAssistidas: number = 0
    ) {}
}