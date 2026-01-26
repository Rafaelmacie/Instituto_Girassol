import areaRepository from './areaRepository';
import { Area } from './areaModel';

export class AreaService {

    async criar(nome: string): Promise<Area> {
        if (!nome || nome.trim().length < 3) {
            throw new Error('O nome da área deve ter pelo menos 3 caracteres.');
        }
        
        // ToDo: Poderíamos verificar se já existe uma área com esse nome aqui.
        
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
        // ToDo: Verificar se existem cursos vinculados a esta área antes de excluir (Integridade Referencial).
        const deletou = await areaRepository.excluir(id);
        if (!deletou) {
            throw new Error('Área não encontrada para exclusão.');
        }
    }
}

export default new AreaService();