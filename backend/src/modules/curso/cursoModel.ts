export class Curso {
    constructor(
        public idCurso: number,
        public titulo: string,
        public descricao: string,
        public idProfessor: number, // Apenas o ID para não depender da classe Professor agora
        public idArea: number,
        public cargaHoraria: number, // Em minutos (inteiro)
        public imagem: string,
        public disciplina: string,
        public disponivel: boolean = false,
        public qtdAulas: number = 0
    ) {}
}