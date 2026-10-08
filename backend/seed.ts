import db from './src/shared/config/db';
import bcrypt from 'bcrypt';
import { StatusMatricula } from './src/shared/constants/statusMatricula';
import { TipoCertificado } from './src/shared/constants/tipoCertificado';

async function seed() {
    try {
        console.log("Iniciando seed...");

        // 1. Criar Usuário Aluno
        const senhaHash = await bcrypt.hash('123456', 10);
        const userQuery = `
            INSERT INTO "Usuario" (nome, "ultimoNome", email, senha, "tipoUsuario")
            VALUES ('Erlano', '', 'erlano@teste.com', $1, 'Aluno')
            RETURNING id_usuario;
        `;
        const userResult = await db.query(userQuery, [senhaHash]);
        const idUsuario = userResult.rows[0].id_usuario;

        await db.query(`
            INSERT INTO "UsuarioCertificavel" (id_usuario, cpf)
            VALUES ($1, '98765432100')
        `, [idUsuario]);

        await db.query(`
            INSERT INTO "Aluno" (id_usuario)
            VALUES ($1)
        `, [idUsuario]);

        // 2. Criar Área e Curso
        const areaResult = await db.query(`
            INSERT INTO "Area" (nome) VALUES ('Tecnologia') RETURNING id_area;
        `);
        const idArea = areaResult.rows[0].id_area;

        const cursoQuery = `
            INSERT INTO "Curso" (titulo, descricao, id_area, "cargaHoraria", disponivel, "qtdAulas")
            VALUES ('Curso de Teste para Certificado', 'Descrição', $1, 600, true, 1)
            RETURNING id_curso;
        `;
        const cursoResult = await db.query(cursoQuery, [idArea]);
        const idCurso = cursoResult.rows[0].id_curso;

        // 3. Criar Módulo e Aula
        const moduloResult = await db.query(`
            INSERT INTO "Modulo" (nome, id_curso) VALUES ('Módulo 1', $1) RETURNING id_modulo;
        `, [idCurso]);
        const idModulo = moduloResult.rows[0].id_modulo;

        const aulaResult = await db.query(`
            INSERT INTO "Aula" (titulo, id_modulo) VALUES ('Aula 1', $1) RETURNING id_aula;
        `, [idModulo]);
        const idAula = aulaResult.rows[0].id_aula;

        // 4. Criar Matrícula (Com 100% de frequência e nota 10)
        const matriculaQuery = `
            INSERT INTO "Matricula" (id_aluno, id_curso, "statusMatricula", "aulasAssistidas", nota_final)
            VALUES ($1, $2, 'Em_andamento', 1, 10.0)
            RETURNING id_matricula;
        `;
        const matriculaResult = await db.query(matriculaQuery, [idUsuario, idCurso]);
        const idMatricula = matriculaResult.rows[0].id_matricula;

        // 5. Progresso da Aula
        await db.query(`
            INSERT INTO "ProgressoAula" (assistida, id_matricula, id_aula)
            VALUES (true, $1, $2)
        `, [idMatricula, idAula]);

        console.log("Seed finalizado com sucesso!");
        console.log("-----------------------------------------");
        console.log("Use os seguintes dados para testar no Insomnia:");
        console.log("Email: erlano@teste.com");
        console.log("Senha: 123456");
        console.log(`ID da Matrícula para solicitar certificado: ${idMatricula}`);
        console.log("-----------------------------------------");
        
        process.exit(0);
    } catch (error) {
        console.error("Erro no seed:", error);
        process.exit(1);
    }
}

seed();
