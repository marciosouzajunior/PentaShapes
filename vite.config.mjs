import { defineConfig } from 'vite';

export default defineConfig({
  publicDir: 'src/static',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
