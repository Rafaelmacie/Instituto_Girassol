export interface interfaceStorageProvider {
    salvarArquivo(file: Express.Multer.File, folder: string): Promise<{ url: string; duration: number }>;
    deletarArquivo(url: string): Promise<void>;
}