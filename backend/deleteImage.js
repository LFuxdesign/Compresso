import fs from 'fs';
import path from 'path';
import { app } from 'electron';

export async function deleteImage(filename) {
    const userDir = path.join(app.getPath('userData'), 'uploads');
    const imagePath = path.join(userDir, filename);

    if (!fs.existsSync(imagePath)) {
        return { error: 'Imagem não encontrada.' };
    }

    fs.unlinkSync(imagePath);

    return {
        message: 'Imagem deletada com sucesso!',
    };
}
