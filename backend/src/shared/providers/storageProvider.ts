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
                    resource_type: 'auto' // Cloudinary decide se é raw, video ou image
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
            const resourceType = this.detectarResourceType(url);

            await cloudinary.uploader.destroy(publicId, { 
                resource_type: resourceType, 
                invalidate: true 
            });

        } catch (error) {
            console.error(`❌ Erro ao deletar arquivo do Cloudinary: ${url}`, error);
        }
    }

    private extrairPublicId(url: string): string {
        try {
            const regex = /\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/;
            const match = url.match(regex);
            if (match && match[1]) return match[1];

            // Fallback manual
            const partesUrl = url.split('/conselho/');
            if (partesUrl.length > 1) {
                const parteRelevante = partesUrl[1];
                if (parteRelevante) {
                    const caminhoSemExtensao = parteRelevante.substring(0, parteRelevante.lastIndexOf('.'));
                    return `conselho/${caminhoSemExtensao}`;
                }
            }
            return ""; 
        } catch (error) {
            return "";
        }
    }

    /* Descobre se é 'video', 'image' ou 'raw' olhando a URL */
    private detectarResourceType(url: string): string {
        if (url.includes('/video/upload')) return 'video';
        if (url.includes('/image/upload')) return 'image'; // PDFs costumam cair aqui
        if (url.includes('/raw/upload')) return 'raw'; // Zips, CSVs caem aqui
        return 'image'; // Padrão seguro
    }
}

export default new CloudinaryStorageProvider();