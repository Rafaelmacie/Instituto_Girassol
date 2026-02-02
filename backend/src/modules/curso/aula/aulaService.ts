import aulaRepository from './aulaRepository';
import cloudinary from '../../../shared/config/cloudinary';
import { Readable } from 'stream';

export class AulaService {

    /**
     * Método privado para gerenciar o upload stream para o Cloudinary
     */
    private async uploadToCloudinary(file: Express.Multer.File, folder: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { 
                    // Caminho organizado: conselho > girassol > aulas > videos
                    folder: `conselho/instituto-girassol/${folder}`,
                    resource_type: 'auto' // Detecta se é video/imagem/pdf automaticamente
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result?.secure_url || '');
                }
            );

            const stream = Readable.from(file.buffer);
            stream.pipe(uploadStream);
        });
    }

    async criar(dados: any, arquivoVideo?: Express.Multer.File): Promise<any> {
        // Validação básica
        if (!dados.titulo || !dados.idModulo) {
            throw new Error("Titulo e idModulo são obrigatórios.");
        }

        let linkVideo = '';

        // 1. Se veio arquivo, faz upload
        if (arquivoVideo) {
            // Enviamos para a pasta 'aulas/videos'
            linkVideo = await this.uploadToCloudinary(arquivoVideo, 'aulas/videos');
        } 
        // 2. Se não veio arquivo, verifica se o professor mandou um link externo (Youtube/Vimeo)
        else if (dados.linkExterno) {
            linkVideo = dados.linkExterno;
        }

        const novaAula = {
            titulo: dados.titulo,
            descricao: dados.descricao || '',
            idModulo: Number(dados.idModulo),
            duracao: Number(dados.duracao) || 0,
            linkVideo: linkVideo,
            ordem: Number(dados.ordem) || 1
        };

        return await aulaRepository.criar(novaAula);
    }

    async listarPorModulo(idModulo: number) {
        return await aulaRepository.listarPorModulo(idModulo);
    }
}

export default new AulaService();