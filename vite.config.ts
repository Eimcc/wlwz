import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: '/wlwz/',
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
      exclude: [
        /\/resources\//,
        /\/services\//,
        /\/main\.js$/
      ],
    }),
    tsconfigPaths()
  ],
}))
