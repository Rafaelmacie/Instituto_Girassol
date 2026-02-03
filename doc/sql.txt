-- 1. CRIAÇÃO DOS TIPOS (ENUMS)
CREATE TYPE "status_matricula_enum" AS ENUM ('Cancelada', 'Em_andamento', 'Concluida');
CREATE TYPE "tipo_usuario_enum" AS ENUM ('Administrador', 'Professor', 'Aluno');
CREATE TYPE "tipo_certificado_enum" AS ENUM ('Docencia', 'Conclusao');
CREATE TYPE "tipo_material_enum" AS ENUM ('PDF', 'Zip', 'Link', 'xlsx', 'Csv');
CREATE TYPE "tipo_questao_enum" AS ENUM ('Unica_Escolha', 'Multipla_Escolha');

-- 2. TABELAS DE USUÁRIOS (HERANÇA ESTRATÉGIA JOINED)

-- Tabela Pai
CREATE TABLE "Usuario" (
  "id_usuario" SERIAL PRIMARY KEY, -- SERIAL cria o auto-incremento
  "nome" varchar(100) NOT NULL,
  "ultimoNome" varchar(100),
  "email" varchar(150) UNIQUE NOT NULL,
  "senha" varchar(255) NOT NULL,
  "tipoUsuario" "tipo_usuario_enum" NOT NULL,
  "passe" boolean DEFAULT false
);

-- Tabela Intermediária
CREATE TABLE "UsuarioCertificavel" (
  "id_usuario" int PRIMARY KEY,
  "cpf" varchar(14) UNIQUE,
  "foto" varchar(255),
  CONSTRAINT "FK_UsuarioCertificavel_Usuario"
    FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE CASCADE
);

-- Tabelas Finais (Filhas)
CREATE TABLE "Administrador" (
  "id_usuario" int PRIMARY KEY,
  "instagram" varchar(100),
  CONSTRAINT "FK_Admin_Usuario"
    FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE CASCADE
);

CREATE TABLE "Professor" (
  "id_usuario" int PRIMARY KEY,
  "curriculo" text,
  "telefone" varchar(20),
  CONSTRAINT "FK_Professor_Usuario"
    FOREIGN KEY ("id_usuario") REFERENCES "UsuarioCertificavel"("id_usuario") ON DELETE CASCADE
);

CREATE TABLE "Aluno" (
  "id_usuario" int PRIMARY KEY,
  CONSTRAINT "FK_Aluno_Usuario"
    FOREIGN KEY ("id_usuario") REFERENCES "UsuarioCertificavel"("id_usuario") ON DELETE CASCADE
);

-- 3. ESTRUTURA DE CURSOS

CREATE TABLE "Area" (
  "id_area" SERIAL PRIMARY KEY,
  "nome" varchar(100) NOT NULL
);

CREATE TABLE "Curso" (
  "id_curso" SERIAL PRIMARY KEY,
  "titulo" varchar(200) NOT NULL,
  "descricao" text,
  "id_professor" int,
  "id_area" int,
  "cargaHoraria" int, -- Em minutos, para facilitar cálculos
  "imagem" varchar(255),
  "disciplina" varchar(100),
  "disponivel" boolean DEFAULT false,
  "qtdAulas" int DEFAULT 0,
  CONSTRAINT "FK_Curso_Professor" FOREIGN KEY ("id_professor") REFERENCES "Professor"("id_usuario"),
  CONSTRAINT "FK_Curso_Area" FOREIGN KEY ("id_area") REFERENCES "Area"("id_area")
);

CREATE TABLE "Modulo" (
  "id_modulo" SERIAL PRIMARY KEY,
  "nome" varchar(150) NOT NULL,
  "id_curso" int NOT NULL,
  CONSTRAINT "FK_Modulo_Curso" FOREIGN KEY ("id_curso") REFERENCES "Curso"("id_curso") ON DELETE CASCADE
);

CREATE TABLE "Aula" (
  "id_aula" SERIAL PRIMARY KEY,
  "titulo" varchar(200) NOT NULL,
  "descricao" text,
  "ordem" int DEFAULT 1,
  "duracao" int, -- Duração em minutos
  "linkVideo" varchar(255),
  "id_modulo" int NOT NULL,
  CONSTRAINT "FK_Aula_Modulo" FOREIGN KEY ("id_modulo") REFERENCES "Modulo"("id_modulo") ON DELETE CASCADE
);

CREATE TABLE "Material" (
  "id_material" SERIAL PRIMARY KEY,
  "tipo_material" "tipo_material_enum" NOT NULL,
  "titulo" varchar(100) NOT NULL,
  "descricao" text,
  "url" varchar(255) NOT NULL,
  "id_aula" int NOT NULL,
  CONSTRAINT "FK_Material_Aula" FOREIGN KEY ("id_aula") REFERENCES "Aula"("id_aula") ON DELETE CASCADE
);

-- 4. MATRÍCULA E PROGRESSO

CREATE TABLE "Matricula" (
  "id_matricula" SERIAL PRIMARY KEY,
  "data" date DEFAULT CURRENT_DATE,
  "statusMatricula" "status_matricula_enum" DEFAULT 'Em_andamento',
  "id_aluno" int NOT NULL,
  "id_curso" int NOT NULL,
  "favoritada" boolean DEFAULT false,
  "aulasAssistidas" int DEFAULT 0,
  "nota_final" float,
  CONSTRAINT "FK_Matricula_Aluno" FOREIGN KEY ("id_aluno") REFERENCES "Aluno"("id_usuario"),
  CONSTRAINT "FK_Matricula_Curso" FOREIGN KEY ("id_curso") REFERENCES "Curso"("id_curso"),
  CONSTRAINT "UN_Aluno_Curso" UNIQUE ("id_aluno", "id_curso")
);

CREATE TABLE "ProgressoAula" (
  "id_progresso" SERIAL PRIMARY KEY,
  "assistida" boolean DEFAULT false,
  "id_matricula" int NOT NULL,
  "id_aula" int NOT NULL,
  "minutosAssistidos" int DEFAULT 0,
  CONSTRAINT "FK_Progresso_Matricula" FOREIGN KEY ("id_matricula") REFERENCES "Matricula"("id_matricula") ON DELETE CASCADE,
  CONSTRAINT "FK_Progresso_Aula" FOREIGN KEY ("id_aula") REFERENCES "Aula"("id_aula"),
  -- Constraint para garantir unicidade
  CONSTRAINT "UN_Progresso_Matricula_Aula" UNIQUE ("id_matricula", "id_aula")
);

-- 5. INTERAÇÃO (COMENTÁRIOS)
-- Ajuste Crítico: Mudado de id_aluno para id_usuario para permitir Professor/Admin comentar

CREATE TABLE "Comentario" (
  "id_comentario" SERIAL PRIMARY KEY,
  "texto" text NOT NULL,
  "id_aula" int NOT NULL,
  "id_usuario" int NOT NULL, -- Generalizado
  CONSTRAINT "FK_Comentario_Aula" FOREIGN KEY ("id_aula") REFERENCES "Aula"("id_aula") ON DELETE CASCADE,
  CONSTRAINT "FK_Comentario_Usuario" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario")
);

CREATE TABLE "RespostaComentario" (
  "id_resposta" SERIAL PRIMARY KEY,
  "texto" text NOT NULL,
  "id_usuario" int NOT NULL, -- Generalizado (Professor ou Aluno podem responder)
  "id_comentario" int NOT NULL,
  CONSTRAINT "FK_Resp_Usuario" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario"),
  CONSTRAINT "FK_Resp_Comentario" FOREIGN KEY ("id_comentario") REFERENCES "Comentario"("id_comentario") ON DELETE CASCADE
);

-- 6. MOTOR DE AVALIAÇÃO

CREATE TABLE "Avaliacao" (
  "id_avaliacao" SERIAL PRIMARY KEY,
  "nota_minima" int DEFAULT 7,
  "numero_questoes" int,
  "id_modulo" int NOT NULL,
  CONSTRAINT "FK_Avaliacao_Modulo" FOREIGN KEY ("id_modulo") REFERENCES "Modulo"("id_modulo") ON DELETE CASCADE
);

CREATE TABLE "Questao" (
  "id_questao" SERIAL PRIMARY KEY,
  "comando" text NOT NULL,
  "tipoQuestao" "tipo_questao_enum" NOT NULL,
  "id_avaliacao" int NOT NULL,
  CONSTRAINT "FK_Questao_Avaliacao" FOREIGN KEY ("id_avaliacao") REFERENCES "Avaliacao"("id_avaliacao") ON DELETE CASCADE
);

CREATE TABLE "Opcao" (
  "id_opcao" SERIAL PRIMARY KEY,
  "texto" text NOT NULL,
  "correta" boolean NOT NULL,
  "id_questao" int NOT NULL,
  CONSTRAINT "FK_Opcao_Questao" FOREIGN KEY ("id_questao") REFERENCES "Questao"("id_questao") ON DELETE CASCADE
);

CREATE TABLE "TentativaAvaliacao" (
  "id_tentativa" SERIAL PRIMARY KEY,
  "data_hora" timestamp DEFAULT CURRENT_TIMESTAMP, -- Mudei de date para timestamp
  "nota_adquirida" float,
  "id_matricula" int NOT NULL,
  "id_avaliacao" int NOT NULL,
  CONSTRAINT "FK_Tentativa_Matricula" FOREIGN KEY ("id_matricula") REFERENCES "Matricula"("id_matricula"),
  CONSTRAINT "FK_Tentativa_Avaliacao" FOREIGN KEY ("id_avaliacao") REFERENCES "Avaliacao"("id_avaliacao")
);

CREATE TABLE "RespostaQuestao" (
  "id_resposta_questao" SERIAL PRIMARY KEY,
  "eh_correta" boolean,
  "id_tentativa" int NOT NULL,
  "id_questao" int NOT NULL,
  "id_opcao" int NOT NULL,
  CONSTRAINT "FK_RQ_Tentativa" FOREIGN KEY ("id_tentativa") REFERENCES "TentativaAvaliacao"("id_tentativa") ON DELETE CASCADE,
  CONSTRAINT "FK_RQ_Questao" FOREIGN KEY ("id_questao") REFERENCES "Questao"("id_questao"),
  CONSTRAINT "FK_RQ_Opcao" FOREIGN KEY ("id_opcao") REFERENCES "Opcao"("id_opcao")
);

-- 7. CERTIFICADO

CREATE TABLE "Certificado" (
  "id_certificado" SERIAL PRIMARY KEY,
  "codigo" varchar(50) UNIQUE NOT NULL,
  "data" date DEFAULT CURRENT_DATE,
  "tipo_certificado" "tipo_certificado_enum" NOT NULL,
  "id_matricula" int,
  "id_usuario" int,
  CONSTRAINT "FK_Certificado_Matricula" FOREIGN KEY ("id_matricula") REFERENCES "Matricula"("id_matricula"),
  CONSTRAINT "FK_Certificado_Usuario" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario"),
  -- Garante que o certificado pertence a alguém (ou aluno via matricula, ou professor via usuario)
  CONSTRAINT "CK_Certificado_Dono" CHECK (
    ("id_matricula" IS NOT NULL AND "id_usuario" IS NULL) OR
    ("id_matricula" IS NULL AND "id_usuario" IS NOT NULL)
  )
);