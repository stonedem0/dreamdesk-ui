import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: './',
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: () => 'dreamdesk.js',
    },
    outDir: 'js',
    emptyOutDir: true,
    copyPublicDir: false,
  },
});
