import { Request, Response } from 'express';
import certificadoService from './certificadoService';

class CertificadoController {
    async baixarPdf(req: Request, res: Response): Promise<void> {
        try {
            const { codigo } = req.params;
            if (!codigo) {
                res.status(400).json({ error: 'Código do certificado não fornecido' });
                return;
            }

            const pdfBuffer = await certificadoService.gerarPdf(codigo);

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=certificado_${codigo}.pdf`);
            res.send(pdfBuffer);
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ error: error.message || 'Erro ao gerar certificado' });
        }
    }
}

export default new CertificadoController();
