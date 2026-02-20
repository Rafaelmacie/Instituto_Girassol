import calculadoraNotaRepository from './calculadoraNotaRepository';

export class CalculadoraNotaService {

    /**
     * Recalcula a nota final do curso inteiro e atualiza a Matrícula.
     * Ideal para ser chamado toda vez que uma nova prova é finalizada.
     */
    async atualizarNotaFinal(idMatricula: number): Promise<number> {
        if (!idMatricula) throw new Error("ID da Matrícula é obrigatório.");

        // Pega a média real cruzando tudo no banco
        const mediaFinalCrua = await calculadoraNotaRepository.obterMediaCursoDaMatricula(idMatricula);
        
        // Arredonda para 2 casas decimais
        const mediaFinal = Number(mediaFinalCrua.toFixed(2));

        // Salva no banco
        await calculadoraNotaRepository.atualizarNotaFinalMatricula(idMatricula, mediaFinal);

        console.log(`🎓 Matrícula ${idMatricula} recalculada. Nota Final Atual: ${mediaFinal}`);

        return mediaFinal;
    }
}

export default new CalculadoraNotaService();