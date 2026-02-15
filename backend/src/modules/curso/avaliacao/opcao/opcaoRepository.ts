import db from '../../../../shared/config/db';
import { Opcao } from './opcaoModel';

export class OpcaoRepository {

    // 1. CRIAR
    async criar(texto: string, correta: boolean, idQuestao: number): Promise<Opcao> {
        // CORREÇÃO: Mudei "idQuestao" para "id_questao" (snake_case é o padrão do SQL)
        const query = `
            INSERT INTO "Opcao" ("texto", "correta", "id_questao")
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
        
        const result = await db.query(query, [texto, correta, idQuestao]);
        const row = result.rows[0];

        // CORREÇÃO: O banco retorna 'id_questao', passamos para o Model
        return new Opcao(
            row.id_opcao, 
            row.texto, 
            row.correta, 
            row.id_questao
        );
    }

    // 2. LISTAR (Busca todas as opções de uma questão específica)
    async listarPorQuestao(idQuestao: number): Promise<Opcao[]> {
        // CORREÇÃO: WHERE busca por "id_questao"
        const query = `
            SELECT * FROM "Opcao" 
            WHERE id_questao = $1
            ORDER BY id_Opcao ASC
        `;
        
        // CORREÇÃO CRÍTICA: A variável aqui deve ser 'idQuestao' (igual ao argumento da função), e não 'id_Questao'
        const result = await db.query(query, [idQuestao]);

        return result.rows.map(row => new Opcao(
            row.id_opcao, 
            row.texto, 
            row.correta, 
            row.id_questao // Mapeando o retorno do banco
        ));
    }

    // 3. EXCLUIR
    async excluir(idOpcao: number): Promise<void> {
        const query = `DELETE FROM "Opcao" WHERE id_opcao = $1`;
        await db.query(query, [idOpcao]);
    }

    // Método extra para o Service verificar se existe antes de excluir
    async buscarPorId(idOpcao: number): Promise<Opcao | null> {
        const query = `SELECT * FROM "Opcao" WHERE id_opcao = $1`;
        const result = await db.query(query, [idOpcao]);

        if (result.rows.length === 0) return null;
        
        const row = result.rows[0];
        // CORREÇÃO: row.id_questao no final
        return new Opcao(
            row.id_opcao, 
            row.texto, 
            row.correta, 
            row.id_questao
        );
    }
}