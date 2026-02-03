import multer from 'multer';

// Vamos usar armazenamento em memória. 
// O arquivo fica no buffer (RAM) antes de ir pro Cloudinary.
const storage = multer.memoryStorage();

export const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 100 * 1024 * 1024 // Limite de 100MB (Ajuste conforme necessidade para vídeos)
    }
});