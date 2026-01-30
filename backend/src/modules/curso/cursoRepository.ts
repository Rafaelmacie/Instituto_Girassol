import db from '../../shared/config/db'; 

export class CursoRepository {
    
    async create(curso: any): Promise<void> {
        const query = `
            INSERT INTO "Curso" (
                titulo, descricao, id_professor, id_area, 
                "cargaHoraria", imagem, disciplina, disponivel, "qtdAulas"
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `;
        
        const values = [
            curso.titulo, 
            curso.descricao, 
            curso.idProfessor, 
            curso.idArea, 
            curso.cargaHoraria, 
            curso.imagem, 
            curso.disciplina, 
            curso.disponivel || false, 
            curso.qtdAulas || 0        
        ];

        await db.query(query, values);
    }

    async findAll(filters: any): Promise<any[]> {
        let query = `
            SELECT 
                c.id_curso, c.titulo, c.descricao, c.disciplina, 
                c."cargaHoraria", c.imagem, c.disponivel, c."qtdAulas",
                c.id_professor, c.id_area
            FROM "Curso" c
            WHERE 1=1
        `;
        
        const values: any[] = [];
        let count = 1;

        if (filters.titulo) {
            query += ` AND c.titulo ILIKE $${count}`;
            values.push(`%${filters.titulo}%`);
            count++;
        }
        if (filters.disciplina) {
            query += ` AND c.disciplina ILIKE $${count}`;
            values.push(`%${filters.disciplina}%`);
            count++;
        }
        if (filters.idProfessor) {
            query += ` AND c.id_professor = $${count}`;
            values.push(filters.idProfessor);
            count++;
        }
        if (filters.idArea) {
            query += ` AND c.id_area = $${count}`;
            values.push(filters.idArea);
            count++;
        }

        const result = await db.query(query, values);
        return result.rows;
    }

    async findById(id: number): Promise<any> {
        const query = `SELECT * FROM "Curso" WHERE id_curso = $1`;
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    async update(id: number, dados: any): Promise<void> {
        const check = await db.query(`SELECT id_curso FROM "Curso" WHERE id_curso = $1`, [id]);
        if (check.rowCount === 0) throw new Error("Curso não encontrado.");

        const fields: string[] = [];
        const values: any[] = [];
        let count = 1;

        if (dados.titulo) { fields.push(`titulo = $${count}`); values.push(dados.titulo); count++; }
        if (dados.descricao) { fields.push(`descricao = $${count}`); values.push(dados.descricao); count++; }
        if (dados.idProfessor) { fields.push(`id_professor = $${count}`); values.push(dados.idProfessor); count++; }
        if (dados.idArea) { fields.push(`id_area = $${count}`); values.push(dados.idArea); count++; }
        if (dados.disciplina) { fields.push(`disciplina = $${count}`); values.push(dados.disciplina); count++; }
        if (dados.cargaHoraria) { fields.push(`"cargaHoraria" = $${count}`); values.push(dados.cargaHoraria); count++; }
        if (dados.imagem) { fields.push(`imagem = $${count}`); values.push(dados.imagem); count++; }
        if (dados.disponivel !== undefined) { fields.push(`disponivel = $${count}`); values.push(dados.disponivel); count++; }
        if (dados.qtdAulas !== undefined) { fields.push(`"qtdAulas" = $${count}`); values.push(dados.qtdAulas); count++; }
        if (fields.length === 0) {
            throw new Error("Nenhum dado válido enviado. Verifique se as chaves do JSON estão escritas corretamente (ex: 'cargaHoraria' e não 'cargahoraria').");
        }

        if (fields.length === 0) return;

        values.push(id);
        const query = `UPDATE "Curso" SET ${fields.join(', ')} WHERE id_curso = $${count}`;

        await db.query(query, values);
    }

    async delete(id: number): Promise<void> {
        const result = await db.query(`DELETE FROM "Curso" WHERE id_curso = $1`, [id]);
        if (result.rowCount === 0) {
            throw new Error("Curso não existe ou já foi excluído.");
        }
    }
}