import crypto from 'crypto';
import db from '../../shared/config/db';
import { CertificadoRepository } from './certificadoRepository';
import { TipoCertificado } from '../../shared/constants/tipoCertificado';
import puppeteer from 'puppeteer-core';

class CertificadoService {
    private certificadoRepository: CertificadoRepository;

    constructor() {
        this.certificadoRepository = new CertificadoRepository();
    }

    async gerar(idMatricula: number): Promise<string> {
        // Verifica se já existe certificado para esta matrícula
        const certificadoExistente = await this.certificadoRepository.buscarPorMatricula(idMatricula);
        if (certificadoExistente) {
            return certificadoExistente.codigo;
        }

        // Gera um código único
        const codigo = crypto.randomBytes(8).toString('hex').toUpperCase();

        const novoCertificado = await this.certificadoRepository.criarParaMatricula(
            codigo,
            TipoCertificado.CONCLUSAO,
            idMatricula
        );

        return novoCertificado.codigo;
    }

    async gerarPdf(codigo: string): Promise<Buffer> {
        const certificado = await this.certificadoRepository.buscarPorCodigo(codigo);
        if (!certificado) {
            throw new Error('Certificado não encontrado.');
        }

        if (!certificado.idMatricula) {
            throw new Error('Geração de PDF para este tipo de certificado ainda não implementada.');
        }

        // Busca os dados do aluno e do curso
        const query = `
            SELECT u.nome, u."ultimoNome", c.titulo as curso, c."cargaHoraria"
            FROM "Matricula" m
            JOIN "Usuario" u ON u.id_usuario = m.id_aluno
            JOIN "Curso" c ON c.id_curso = m.id_curso
            WHERE m.id_matricula = $1
        `;
        const result = await db.query(query, [certificado.idMatricula]);
        if (result.rows.length === 0) {
            throw new Error('Dados da matrícula não encontrados.');
        }

        const data = result.rows[0];
        const nomeCompleto = `${data.nome} ${data.ultimoNome || ''}`.trim();
        const cursoNome = data.curso;
        const cargaHoraria = data.cargaHoraria ? Math.floor(data.cargaHoraria / 60) : 0; // converter minutos p/ horas
        const dataEmissao = new Date(certificado.data).toLocaleDateString('pt-BR');

        // Template Básico
        const html = `
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: 'Arial', sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background-color: #f0f0f0; }
                    .certificado { background-color: white; border: 10px solid #333; padding: 50px; width: 800px; text-align: center; box-shadow: 0 0 20px rgba(0,0,0,0.2); }
                    .titulo { font-size: 50px; font-weight: bold; margin-bottom: 20px; color: #333; }
                    .subtitulo { font-size: 24px; margin-bottom: 30px; }
                    .nome { font-size: 40px; font-style: italic; color: #2c3e50; margin-bottom: 30px; }
                    .texto { font-size: 20px; line-height: 1.6; margin-bottom: 40px; }
                    .footer { display: flex; justify-content: space-between; margin-top: 50px; border-top: 1px solid #ccc; padding-top: 20px; }
                    .codigo { font-size: 14px; color: #777; margin-top: 20px; text-align: left; }
                </style>
            </head>
            <body>
                <div class="certificado">
                    <div class="titulo">CERTIFICADO DE CONCLUSÃO</div>
                    <div class="subtitulo">Instituto Girassol</div>
                    <div class="texto">Certificamos que</div>
                    <div class="nome">${nomeCompleto}</div>
                    <div class="texto">concluiu com sucesso o curso <strong>${cursoNome}</strong>, com carga horária de <strong>${cargaHoraria} horas</strong>.</div>
                    <div class="footer" style="justify-content: center;">
                        <div>Data de Emissão: ${dataEmissao}</div>
                    </div>
                    <div class="codigo">Código de Verificação: ${codigo}</div>
                </div>
            </body>
            </html>
        `;

        const BROWSERLESS_WS = process.env.BROWSERLESS_WS || 'ws://localhost:3000';

        let browser;
        try {
            browser = await puppeteer.connect({ browserWSEndpoint: BROWSERLESS_WS });
            const page = await browser.newPage();
            await page.setContent(html, { waitUntil: 'domcontentloaded' });
            
            // @ts-ignore
            const pdfBuffer = await page.pdf({ format: 'A4', landscape: true, printBackground: true });
            
            return Buffer.from(pdfBuffer);
        } catch (error) {
            console.error('Erro ao gerar PDF via Browserless:', error);
            throw new Error('Falha ao gerar o PDF do certificado.');
        } finally {
            if (browser) {
                await browser.close();
            }
        }
    }
}

export default new CertificadoService();
