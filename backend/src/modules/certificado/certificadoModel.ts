import { TipoCertificado } from "../../shared/constants/tipoCertificado";

export class Certificado {
    constructor(
        public idCertificado: number,
        public codigo: string,
        public data: Date,
        public tipoCertificado: TipoCertificado,
        public idMatricula?: number | null, // Opcional (para Alunos)
        public idUsuario?: number | null    // Opcional (para Professores/Docência)
    ) {}
}