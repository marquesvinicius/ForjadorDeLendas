import { defineConfig } from 'vite';
import { copyFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';

export default defineConfig({
  // Diretório raiz do projeto
  root: '.',
  
  // Diretório público para assets estáticos
  publicDir: 'public',
  
  // ⭐ Plugin para garantir sincronização de assets
  plugins: [
    {
      name: 'copy-assets',
      buildStart() {
        // Garantir que assets da raiz sejam copiados para public durante desenvolvimento
        const assetsRoot = path.resolve('./assets');
        const assetsPublic = path.resolve('./public/assets');
        
        if (existsSync(assetsRoot)) {
          if (!existsSync(assetsPublic)) {
            mkdirSync(assetsPublic, { recursive: true });
          }
          
        }
      }
    }
  ],
  
  // Diretório de build
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    
    // Configurações de assets
    assetsDir: 'assets',
    
    // Configurações de rollup
    rollupOptions: {
      input: {
        main: './index.html',
        login: './login.html'
      },
      output: {
        // Manter nomes de arquivos para facilitar debug
        entryFileNames: 'js/[name]-[hash].js',
        chunkFileNames: 'js/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      },
      // Configurar scripts externos que não devem ser bundled
      external: [],
      preserveEntrySignatures: 'strict'
    },
    
    // Minificação simplificada
    minify: 'terser',
    
    // Source maps para desenvolvimento
    sourcemap: false, // Desabilitar em produção para reduzir tamanho
    
    // Configurações para lidar com scripts legacy
    target: 'es2015',
    
    // Configurações de assets
    assetsInlineLimit: 4096
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