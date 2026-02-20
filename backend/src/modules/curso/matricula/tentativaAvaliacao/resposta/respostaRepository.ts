import db from '../../../../../shared/config/db';

export class RespostaRepository {
    // Busca se a opção é correta para podermos salvar a flag 'eh_correta'
    async verificarOpcaoCorreta(idOpcao: number, idQuestao: number): Promise<boolean> {
        const query = `
            SELECT correta 
            FROM "Opcao" 
            WHERE id_opcao = $1 AND id_questao = $2
        `;
        const result = await db.query(query, [idOpcao, idQuestao]);

        // Se a query retornar vazio, significa que ou a opção não existe, 
        // ou existe mas pertence a outra questão.
        if ((result.rowCount || 0) === 0) {
            throw new Error("Opção inválida ou não pertence a esta questão.");
        }

        return result.rows[0].correta;
    }

    async salvarResposta(idTentativa: number, idQuestao: number, idOpcao: number, ehCorreta: boolean) {
        // Primeiro, verifica se o aluno já tinha respondido essa questão nessa tentativa
        const checkQuery = `SELECT id_resposta_questao FROM "RespostaQuestao" WHERE id_tentativa = $1 AND id_questao = $2`;
        const checkResult = await db.query(checkQuery, [idTentativa, idQuestao]);

        if ((checkResult.rowCount || 0) > 0) {
            // Se já respondeu e mudou de ideia, a gente atualiza a resposta
            const updateQuery = `
                UPDATE "RespostaQuestao" 
                SET id_opcao = $1, eh_correta = $2 
                WHERE id_tentativa = $3 AND id_questao = $4 
                RETURNING *
            `;
            const result = await db.query(updateQuery, [idOpcao, ehCorreta, idTentativa, idQuestao]);
            return result.rows[0];
        } else {
            // Se é a primeira vez marcando essa questão, a gente insere
            const insertQuery = `
                INSERT INTO "RespostaQuestao" (id_tentativa, id_questao, id_opcao, eh_correta)
                VALUES ($1, $2, $3, $4)
                RETURNING *
            `;
            const result = await db.query(insertQuery, [idTentativa, idQuestao, idOpcao, ehCorreta]);
            return result.rows[0];
        }
    }

    // Útil para depois listarmos o que o aluno marcou
    async listarPorTentativa(idTentativa: number) {
        const query = `SELECT * FROM "RespostaQuestao" WHERE id_tentativa = $1`;
        const result = await db.query(query, [idTentativa]);
        return result.rows;
    }
}