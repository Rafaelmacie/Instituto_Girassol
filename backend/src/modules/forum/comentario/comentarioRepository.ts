import db from '../../../shared/config/db'; // Ajuste as '../' conforme a sua pasta
import { Comentario } from './comentarioModel';

export class ComentarioRepository {

    // 1. CRIAR
    async criar(texto: string, idUsuario: number, idAula: number): Promise<Comentario> {
        const query = `
            INSERT INTO "Comentario" (texto, id_usuario, id_aula)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
        
        const result = await db.query(query, [texto, idUsuario, idAula]);
        const row = result.rows[0];

        // Mapeando do banco (snake_case) para o Model
        return new Comentario(row.id_comentario, row.texto, row.id_usuario, row.id_aula);
    }

    // 2. LISTAR POR AULA (Mostra os mais recentes primeiro)
    async listarPorAula(idAula: number): Promise<Comentario[]> {
        const query = `
            SELECT * FROM "Comentario" 
            WHERE id_aula = $1
            ORDER BY id_comentario DESC
        `;
        
        const result = await db.query(query, [idAula]);

        return result.rows.map(row => new Comentario(
            row.id_comentario, 
            row.texto, 
            row.id_usuario, 
            row.id_aula
        ));
    }

    // BUSCAR POR ID (Método auxiliar para validações)
    async buscarPorId(idComentario: number): Promise<Comentario | null> {
        const query = `SELECT * FROM "Comentario" WHERE id_comentario = $1`;
        const result = await db.query(query, [idComentario]);

        if (result.rows.length === 0) return null;

        const row = result.rows[0];
        return new Comentario(row.id_comentario, row.texto, row.id_usuario, row.id_aula);
    }

    // 3. ATUALIZAR
    async atualizar(idComentario: number, texto: string): Promise<Comentario> {
        const query = `
            UPDATE "Comentario"
            SET texto = $1
            WHERE id_comentario = $2
            RETURNING *;
        `;
        
        const result = await db.query(query, [texto, idComentario]);
        const row = result.rows[0];

        return new Comentario(row.id_comentario, row.texto, row.id_usuario, row.id_aula);
    }

    // 4. EXCLUIR
    async excluir(idComentario: number): Promise<void> {
        const query = `DELETE FROM "Comentario" WHERE id_comentario = $1`;
        await db.query(query, [idComentario]);
    }
}