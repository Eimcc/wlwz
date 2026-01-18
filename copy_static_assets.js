import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { cpSync, existsSync, mkdirSync } = fs;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = __dirname;
const docsDir = path.join(projectRoot, 'docs');

function ensureDir(dir) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

function safeCopy(src, dest, options = {}) {
  if (!existsSync(src)) {
    return;
  }
  const parent = path.dirname(dest);
  ensureDir(parent);
  cpSync(src, dest, options);
}

ensureDir(docsDir);

const filesToCopy = [
  'character.html',
  'relations.html',
  'activities.html',
  'main.js',
];

filesToCopy.forEach((file) => {
  const src = path.join(projectRoot, file);
  const dest = path.join(docsDir, file);
  safeCopy(src, dest);
});

const dirsToCopy = [
  'resources',
  'services',
  'characters',
];

dirsToCopy.forEach((dir) => {
  const src = path.join(projectRoot, dir);
  const dest = path.join(docsDir, dir);
  safeCopy(src, dest, { recursive: true });
});
