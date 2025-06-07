import { defineConfig } from 'vite';

export default defineConfig({
  // Diretório raiz do projeto
  root: '.',
  
  // Diretório de build
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    
    // Configurações de assets
    assetsDir: 'assets',
    
    // Configurações de rollup
    rollupOptions: {
      input: {
        main: './index.html'
      },
      output: {
        // Manter nomes de arquivos para facilitar debug
        entryFileNames: 'js/[name]-[hash].js',
        chunkFileNames: 'js/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    
    // Minificação
    minify: 'terser',
    
    // Source maps para desenvolvimento
    sourcemap: true
  },
  
  // Configurações do servidor de desenvolvimento
  server: {
    port: 3000,
    open: true,
    host: true
  },
  
  // Configurações de preview
  preview: {
    port: 4173,
    open: true
  },
  
  // Configurações de CSS
  css: {
    devSourcemap: true
  },
  
  // Configurações de assets
  assetsInclude: ['**/*.webp', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg']
}); 