import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, 'public');

async function processDirectory(directory) {
    const files = fs.readdirSync(directory);

    for (const file of files) {
        const filePath = path.join(directory, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            await processDirectory(filePath);
        } else {
            const ext = path.extname(file).toLowerCase();
            if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
                const webpPath = filePath.replace(ext, '.webp');
                console.log(`Converting ${file} to WebP...`);
                
                try {
                    await sharp(filePath)
                        .webp({ quality: 80 })
                        .toFile(webpPath);
                    
                    // Remove original file
                    fs.unlinkSync(filePath);
                    console.log(`Optimized: ${file} -> ${path.basename(webpPath)}`);
                } catch (err) {
                    console.error(`Error converting ${file}:`, err);
                }
            }
        }
    }
}

console.log('Starting image optimization...');
processDirectory(publicDir).then(() => {
    console.log('Image optimization complete.');
}).catch(err => {
    console.error('Optimization failed:', err);
});
