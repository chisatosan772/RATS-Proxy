// @ts-check
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'server',
  adapter: vercel(),
  integrations: [react(), tailwind()],
  vite: {
    server: {
      proxy: {
        '/auth': { target: 'https://api.ratsstore.my.id', changeOrigin: true },
        '/api': { target: 'https://api.ratsstore.my.id', changeOrigin: true },
      },
    },
  },
});
