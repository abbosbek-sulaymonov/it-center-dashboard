import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: false,
    host: true,
    open: true,
    hmr: {
      overlay: false,
    },
    proxy: {
      // Proxy all /api requests to Express server
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path, // Keep the path as is
      },
    },
  },
  ssr: {
    noExternal: ['react-router-dom'],
  },
  resolve: {
    alias: {
      '@': '/src',
      '@api': '/api',
      '@server': '/server',
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
