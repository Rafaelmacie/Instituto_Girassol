import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import { interfaceStorageProvider } from './interfaceStorageProvider';
import '../../shared/config/cloudinary';

export class CloudinaryStorageProvider implements interfaceStorageProvider {

    async salvarArquivo(file: Express.Multer.File, folder: string): Promise<{ url: string; duration: number }> {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: `conselho/instituto-girassol/${folder}`,
                    resource_type: 'auto'
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve({
                        url: result?.secure_url || '',
                        duration: result?.duration || 0
                    });
                }
            );
            const stream = Readable.from(file.buffer);
            stream.pipe(uploadStream);
        });
    }

    async deletarArquivo(url: string): Promise<void> {
        if (!url) return;

        try {
            const publicId = this.extrairPublicId(url);

            const result = await cloudinary.uploader.destroy(publicId, {
                resource_type: 'video',
                invalidate: true
            });

        } catch (error) {
            console.error(`❌ Erro ao deletar arquivo do Cloudinary:`, error);
        }
    }

    /**
     * Extrai o Public ID completo (incluindo pastas)
     */
    private extrairPublicId(url: string): string {
        try {
            // 1. Tentativa via Regex (Mais robusta)
            const regex = /\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/;
            const match = url.match(regex);

            if (match && match[1]) {
                return match[1];
            }

            // Fallback Manual (Correção do erro TS)
            const partesUrl = url.split('/conselho/');

            // Verificamos se existe a segunda parte
            if (partesUrl.length > 1) {
                const parteRelevante = partesUrl[1]; // Guardamos numa variável

                if (parteRelevante) {
                    const caminhoSemExtensao = parteRelevante.substring(0, parteRelevante.lastIndexOf('.'));
                    return `conselho/${caminhoSemExtensao}`;
                }
            }

            return "";
        } catch (error) {
            console.error("Erro ao fazer parse da URL do Cloudinary", error);
            return "";
        }
    }
}

export default new CloudinaryStorageProvider();