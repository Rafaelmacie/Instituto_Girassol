import bcrypt from 'bcrypt'; 

export const hashSenha = async (senha: string): Promise<string> => {
    const saltRounds = 10;
    return await bcrypt.hash(senha, saltRounds);
};

export const compararSenha = async (senhaDigitada: string, hashBanco: string): Promise<boolean> => {
    return await bcrypt.compare(senhaDigitada, hashBanco);
};