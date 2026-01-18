import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";
import { traeBadgePlugin } from 'vite-plugin-trae-solo-badge';

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
    traeBadgePlugin({
      variant: 'dark',
      position: 'bottom-right',
      prodOnly: true,
      clickable: true,
      clickUrl: 'https://www.trae.ai/solo?showJoin=1',
      autoTheme: true,
      autoThemeTarget: '#root'
    }), 
    tsconfigPaths()
  ],
}))
