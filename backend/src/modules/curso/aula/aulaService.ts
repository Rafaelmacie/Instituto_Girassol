import aulaRepository from './aulaRepository';
import cloudinary from '../../../shared/config/cloudinary';
import { Readable } from 'stream';

// Interface para tipar o retorno do upload
interface CloudinaryResponse {
    url: string;
    duration: number; // Cloudinary retorna em segundos (ex: 154.5)
}

export class AulaService {

    private async uploadToCloudinary(file: Express.Multer.File, folder: string): Promise<CloudinaryResponse> {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: `conselho/instituto-girassol/${folder}`,
                    resource_type: 'auto'
                },
                (error, result) => {
                    if (error) return reject(error);

                    // O Cloudinary retorna 'duration' em segundos
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

    async criar(dados: any, arquivoVideo?: Express.Multer.File): Promise<any> {
        if (!dados.titulo || !dados.idModulo) {
            throw new Error("Titulo e idModulo são obrigatórios.");
        }

        let linkVideo = null;
        let duracaoFinal = Number(dados.duracao) || 0; // Começa com o que o usuário digitou (ou 0)

        // Se veio arquivo, faz upload e pega a duração automática
        if (arquivoVideo) {
            const uploadResult = await this.uploadToCloudinary(arquivoVideo, 'aulas/videos');

            linkVideo = uploadResult.url;

            // Arredondamos para cima (Math.ceil) para não ter segundos quebrados
            if (uploadResult.duration > 0) {
                duracaoFinal = Math.ceil(uploadResult.duration / 60);
            }
        }
        // Link Externo (YouTube/Vimeo) - Depende da digitação manual
        else if (dados.linkExterno) {
            linkVideo = dados.linkExterno;
            // Mantém a duracaoFinal que veio do req.body (dados.duracao)
        }

        let ordemFinal = Number(dados.ordem);

        if (!ordemFinal) {
            ordemFinal = await aulaRepository.obterProximaOrdem(Number(dados.idModulo));
        }

        const novaAula = {
            titulo: dados.titulo,
            descricao: dados.descricao || '',
            idModulo: Number(dados.idModulo),
            duracao: duracaoFinal,
            linkVideo: linkVideo,
            ordem: ordemFinal
        };

        return await aulaRepository.criar(novaAula);
    }

    async listarPorModulo(idModulo: number) {
        return await aulaRepository.listarPorModulo(idModulo);
    }
}

export default new AulaService();