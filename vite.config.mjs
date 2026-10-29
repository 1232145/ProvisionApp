import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react({ include: /\.[jt]sx?$/ })],
  base: './',
  publicDir: 'public',
  build: {
    outDir: 'build',
    emptyOutDir: true,
  },
  server: {
    watch: {
      ignored: ['**/dist/**', '**/coverage/**'],
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
  },
});
