import fs from 'fs';
import path from 'path';
import { app } from 'electron';

export async function getImages() {
    const userDir = path.join(app.getPath('userData'), 'uploads');

    if (!fs.existsSync(userDir)) {
        return { error: 'Nenhuma imagem encontrada.' };
    }

    const files = fs.readdirSync(userDir);

    if (files.length === 0) {
        return { error: 'Nenhuma imagem encontrada.' };
    }

    const images = files.map((filename) => {
        const filePath = path.join(userDir, filename);
        const fileBuffer = fs.readFileSync(filePath);

        return {
            filename,
            buffer: fileBuffer.toString('base64'),
        };
    });

    return {
        message: 'Imagens buscadas com sucesso!',
        data: { images },
    };
}
