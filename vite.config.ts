import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";
import viteCompression from 'vite-plugin-compression';

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: '/',
  build: {
    sourcemap: 'hidden',
    outDir: 'docs',
  },
  plugins: [
    react({
      babel: command === 'serve'
        ? {
            plugins: [
              'react-dev-locator',
            ],
          }
        : undefined,
    }),
    tsconfigPaths(),
    viteCompression()
  ],
}))
