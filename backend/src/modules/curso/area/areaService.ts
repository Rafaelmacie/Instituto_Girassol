import areaRepository from './areaRepository';
import { Area } from './areaModel';

export class AreaService {

    async criar(nome: string): Promise<Area> {
        if (!nome || nome.trim().length < 3) {
            throw new Error('O nome da área deve ter pelo menos 3 caracteres.');
        }

        // Verificar duplicidade (Case Insensitive)
        const areaExistente = await areaRepository.buscarPorNome(nome);
        if (areaExistente) {
            throw new Error(`Já existe uma área cadastrada com o nome "${nome}" (ou similar).`);
        }

        return await areaRepository.criar(nome);
    }

    async listarTodas(): Promise<Area[]> {
        return await areaRepository.listarTodas();
    }

    async buscarPorId(id: number): Promise<Area> {
        const area = await areaRepository.buscarPorId(id);
        if (!area) {
            throw new Error('Área não encontrada.');
        }
        return area;
    }

    async excluir(id: number): Promise<void> {
        // Verifica se a área existe
        const area = await areaRepository.buscarPorId(id);
        if (!area) {
            throw new Error('Área não encontrada para exclusão.');
        }

        // Bloqueio apenas se houver cursos disponíveis
        const cursosAtivos = await areaRepository.contarCursosPublicados(id);

        if (cursosAtivos > 0) {
            throw new Error(
                `Não é possível excluir esta área pois existem ${cursosAtivos} curso(s) ativo(S) vinculado(s) a ela. Desative os cursos antes de prosseguir.`
            );
        }

        // Desvincular cursos inativos (setar id_area = null) para não dar erro de FK no banco.
        await areaRepository.desvincularCursos(id);

        // Agora é seguro excluir a área
        const deletou = await areaRepository.excluir(id);
        if (!deletou) {
            throw new Error('Erro ao excluir a área.');
        }
    }
}

export default new AreaService();