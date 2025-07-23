/**
 * Inicializador central da aplicação
 */

import { cleanupLegacyAuth } from './legacy-cleanup.js';
import { setupThemeListeners } from '../ui/themeManager.js';
import { initializeCompanionFallback } from '../ui/companion-fallback.js';
import { LogoutManager } from '../ui/logout-manager.js';

/**
 * Inicializa todos os sistemas da aplicação
 */
export function initializeApp() {
    console.log('🚀 Iniciando aplicação...');
    
    // Garantir que o DOM está carregado
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeComponents);
    } else {
        initializeComponents();
    }
}

/**
 * Inicializa os componentes na ordem correta
 */
async function initializeComponents() {
    try {
        console.log('🔄 Inicializando componentes...');
        
        // 1. Limpar sistema legado
        cleanupLegacyAuth();
        console.log('✅ Sistema legado limpo');
        
        // 2. Configurar tema (antes de qualquer UI)
        setupThemeListeners();
        console.log('✅ Tema configurado');
        
        // 3. Aguardar um pouco para garantir que os scripts carregaram
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // 4. Inicializar companion
        initializeCompanionFallback();
        console.log('✅ Companion inicializado');
        
        // 5. Configurar logout
        new LogoutManager();
        console.log('✅ Sistema de logout configurado');
        
        console.log('✨ Aplicação inicializada com sucesso!');
        
    } catch (error) {
        console.error('❌ Erro ao inicializar aplicação:', error);
    }
} 