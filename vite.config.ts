import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: "/",
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  optimizeDeps: {
    include: [
      '@tanstack/react-query',
      '@tanstack/react-query-devtools',
    ],
  },
  build: {
    chunkSizeWarningLimit: 1000, // Opcional: eleva el límite a 1MB
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          tanstack: ['@tanstack/react-query', '@tanstack/react-query-devtools'],
        },
      },
    },
  },
});
