import { defineConfig } from 'vite';
import { cpSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  publicDir: 'src/static',
  plugins: [{
    name: 'include-legacy-app',
    closeBundle() {
      cpSync(
        fileURLToPath(new URL('./legacy', import.meta.url)),
        fileURLToPath(new URL('./dist/legacy', import.meta.url)),
        { recursive: true },
      );
    },
  }],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
