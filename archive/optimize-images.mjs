import sharp from 'sharp';
import path from 'path';
import { promises as fs } from 'fs';

const projectRoot = path.resolve(process.cwd());

const imageConfigs = [
  {
    file: 'resources/backgrounds/inn-interior.png',
    options: { resizeTo: 1920 },
  },
  {
    file: 'resources/characters/chef-portrait.png',
    options: { resizeTo: 512 },
  },
  {
    file: 'resources/characters/hero-portrait.png',
    options: { resizeTo: 512 },
  },
  {
    file: 'resources/characters/heroine-portrait.png',
    options: { resizeTo: 512 },
  },
  {
    file: 'resources/characters/innkeeper-portrait.png',
    options: { resizeTo: 512 },
  },
  {
    file: 'resources/characters/scholar-portrait.png',
    options: { resizeTo: 512 },
  },
  {
    file: 'characters/avatars/portraits/chef-portrait.png',
    options: { resizeTo: 512 },
  },
  {
    file: 'characters/avatars/portraits/default.png',
    options: { resizeTo: 512 },
  },
  {
    file: 'characters/avatars/portraits/hero-portrait.png',
    options: { resizeTo: 512 },
  },
  {
    file: 'characters/avatars/portraits/heroine-portrait.png',
    options: { resizeTo: 512 },
  },
  {
    file: 'characters/avatars/portraits/innkeeper-portrait.png',
    options: { resizeTo: 512 },
  },
  {
    file: 'characters/avatars/portraits/scholar-portrait.png',
    options: { resizeTo: 512 },
  },
];

async function optimizePng(absolutePath, resizeTo) {
  const image = sharp(absolutePath);
  const metadata = await image.metadata();

  const targetWidth =
    resizeTo && metadata.width && metadata.width > resizeTo
      ? resizeTo
      : undefined;

  const pipeline = targetWidth
    ? image.resize({ width: targetWidth })
    : image;

  const optimized = await pipeline
    .png({
      compressionLevel: 9,
      palette: true,
      quality: 80,
    })
    .toBuffer();

  await fs.writeFile(absolutePath, optimized);

  const kb = (optimized.length / 1024).toFixed(1);
  console.log(`Optimized: ${absolutePath} -> ${kb} KB`);
}

async function run() {
  for (const { file, options } of imageConfigs) {
    const absolutePath = path.join(projectRoot, file);
    try {
      await fs.access(absolutePath);
    } catch {
      console.warn(`Skip missing file: ${absolutePath}`);
      continue;
    }

    try {
      await optimizePng(absolutePath, options.resizeTo);
    } catch (error) {
      console.error(`Failed to optimize ${absolutePath}`, error);
    }
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});

