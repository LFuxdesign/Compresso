import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { app } from 'electron';

export async function uploadImage({ imagesBase64, format = 'jpeg', quality = 50 }) {
    const compressionQuality = parseInt(quality) || 50;
    const userDir = path.join(app.getPath('userData'), 'uploads');

    if (!fs.existsSync(userDir)) {
        fs.mkdirSync(userDir, { recursive: true });
    }

    const processedImages = [];

    for (const base64 of imagesBase64) {
        const buffer = Buffer.from(base64.data, 'base64');
        const originalName = base64.filename || `image_${Date.now()}`;
        const image = sharp(buffer).rotate().withMetadata();

        let outputBuffer;
        let ext;

        if (format === 'webp') {
            outputBuffer = await image.webp({ quality: compressionQuality }).toBuffer();
            ext = '.webp';
        } else {
            outputBuffer = await image.jpeg({ quality: compressionQuality }).toBuffer();
            ext = '.jpeg';
        }

        const finalFilename = path.parse(originalName).name + "_" + Date.now() + ext;
        const finalPath = path.join(userDir, finalFilename);

        fs.writeFileSync(finalPath, outputBuffer);

        processedImages.push({
            filename: finalFilename,
            buffer: outputBuffer.toString('base64'),
        });
    }

    return {
        message: 'Imagens comprimidas com sucesso!',
        data: { images: processedImages },
    };
}
