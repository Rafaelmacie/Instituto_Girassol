/**
 * Enum para padronizar os tipos de usuário no sistema.
 * Facilita a validação e evita "magic strings".
 */
export enum TipoUsuario {
    ADMINISTRADOR = 'Administrador',
    PROFESSOR = 'Professor',
    ALUNO = 'Aluno'
}