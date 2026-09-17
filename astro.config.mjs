import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://mikkelsenphotonics.com',
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file' }
});
