import materialRepository from './materialRepository';
import storageProvider from '../../../../shared/providers/storageProvider';

export class MaterialService {

    async criar(dados: any, arquivo?: Express.Multer.File) {
        if (!dados.titulo || !dados.idAula || !dados.tipoMaterial) {
            throw new Error("Titulo, idAula e tipoMaterial são obrigatórios.");
        }

        let urlFinal = '';

        // Se veio arquivo, faz upload
        if (arquivo) {
            const uploadResult = await storageProvider.salvarArquivo(arquivo, 'aulas/materiais');
            urlFinal = uploadResult.url;
        } 
        // Se é um material do tipo Link e o usuário mandou a URL
        else if (dados.url) {
            urlFinal = dados.url;
        }
        else {
            throw new Error("É necessário enviar um arquivo ou uma URL válida.");
        }

        const novoMaterial = {
            titulo: dados.titulo,
            descricao: dados.descricao || '',
            tipoMaterial: dados.tipoMaterial, // 'PDF', 'Zip', etc.
            url: urlFinal,
            idAula: Number(dados.idAula)
        };

        return await materialRepository.criar(novoMaterial);
    }

    async listarPorAula(idAula: number) {
        return await materialRepository.listarPorAula(idAula);
    }

    async excluir(id: number) {
        const material = await materialRepository.buscarPorId(id);
        if (!material) throw new Error("Material não encontrado.");

        // LIMPEZA: Remove do Cloudinary se for um arquivo hospedado lá
        if (material.url && material.url.includes('cloudinary')) {
            await storageProvider.deletarArquivo(material.url);
        }

        return await materialRepository.excluir(id);
    }
}

export default new MaterialService();