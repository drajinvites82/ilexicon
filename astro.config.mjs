// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://ilexicon.com',
  output: 'static',
  // Apache serves services.html for /services (public/.htaccess)
  build: { format: 'file' },
  trailingSlash: 'never',
  integrations: [
    sitemap({
      filter: (page) => !page.endsWith('/404'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
