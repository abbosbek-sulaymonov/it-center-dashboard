import { fileURLToPath, URL } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const API_TARGET = process.env.VITE_API_TARGET || 'http://localhost:5001';

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  server: {
    port: 3000,
    // The Express API owns /api; everything else is served by Vite.
    proxy: {
      '/api': { target: API_TARGET, changeOrigin: true },
    },
  },

  build: {
    outDir: 'dist',
    sourcemap: false,
    // antd ships as one large chunk by design; it is cached separately and
    // never re-downloaded on an app-code change.
    chunkSizeWarningLimit: 1400,
    rollupOptions: {
      output: {
        // Keep the big vendors in their own long-lived chunks. Vite 8 builds on
        // rolldown, which only accepts the function form here.
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (/[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom)[\\/]/.test(id)) {
            return 'react';
          }
          if (/[\\/]node_modules[\\/](antd|@ant-design|rc-[^\\/]+)[\\/]/.test(id)) return 'antd';
          return 'vendor';
        },
      },
    },
  },
});
