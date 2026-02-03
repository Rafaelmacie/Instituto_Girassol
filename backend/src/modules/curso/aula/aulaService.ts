import aulaRepository from './aulaRepository';
import storageProvider from '../../../shared/providers/storageProvider';

// Interface para tipar o retorno do upload
interface CloudinaryResponse {
    url: string;
    duration: number;
}

export class AulaService {

    async criar(dados: any, arquivoVideo?: Express.Multer.File): Promise<any> {
        if (!dados.titulo || !dados.idModulo) {
            throw new Error("Titulo e idModulo são obrigatórios.");
        }

        let linkVideo = null;
        let duracaoFinal = Number(dados.duracao) || 0;

        // Lógica de Upload via Provider
        if (arquivoVideo) {

            const uploadResult = await storageProvider.salvarArquivo(arquivoVideo, 'aulas/videos');

            linkVideo = uploadResult.url;

            if (uploadResult.duration > 0) {
                duracaoFinal = Math.ceil(uploadResult.duration);
            }
        }
        else if (dados.linkExterno) {
            linkVideo = dados.linkExterno;
        }

        // Lógica de Ordem
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

    async buscarPorId(id: number) {
        const aula = await aulaRepository.buscarPorId(id);
        if (!aula) throw new Error("Aula não encontrada.");
        return aula;
    }

    async atualizar(id: number, dados: any, arquivoVideo?: Express.Multer.File) {
        const aulaAtual = await this.buscarPorId(id);

        let linkVideo = aulaAtual.linkVideo;
        let duracao = aulaAtual.duracao;

        if (arquivoVideo) {
            // Se já existia um vídeo antes, deleta o antigo da nuvem
            if (aulaAtual.linkVideo && aulaAtual.linkVideo.includes('cloudinary')) {
                await storageProvider.deletarArquivo(aulaAtual.linkVideo);
            }

            // Sobe o novo
            const uploadResult = await storageProvider.salvarArquivo(arquivoVideo, 'aulas/videos');
            linkVideo = uploadResult.url;

            if (uploadResult.duration > 0) {
                duracao = Math.ceil(uploadResult.duration);
            }
        } else if (dados.linkExterno) {
            linkVideo = dados.linkExterno;
            // Se mudou pra link externo, pode querer atualizar a duração manual
            if (dados.duracao) duracao = Number(dados.duracao);
        }

        if (dados.duracao && !arquivoVideo) {
            duracao = Number(dados.duracao);
        }

        const aulaAtualizada = {
            titulo: dados.titulo || aulaAtual.titulo,
            descricao: dados.descricao || aulaAtual.descricao,
            idModulo: Number(dados.idModulo) || aulaAtual.idModulo,
            linkVideo: linkVideo,
            duracao: duracao,
            ordem: Number(dados.ordem) || aulaAtual.ordem
        };

        return await aulaRepository.atualizar(id, aulaAtualizada);
    }

    async excluir(id: number) {
        const aula = await this.buscarPorId(id);

        // LIMPEZA: Remove o arquivo da nuvem
        if (aula.linkVideo && aula.linkVideo.includes('cloudinary')) {
            await storageProvider.deletarArquivo(aula.linkVideo);
        }

        // EXCLUSÃO: Remove do banco
        return await aulaRepository.excluir(id);
    }
}

export default new AulaService();