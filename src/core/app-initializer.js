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
    document.addEventListener('DOMContentLoaded', () => {
        // Limpar sistema legado
        cleanupLegacyAuth();
        
        // Configurar tema
        setupThemeListeners();
        
        // Inicializar companion fallback
        initializeCompanionFallback();
        
        // Inicializar gerenciador de logout
        new LogoutManager();
        
        console.log('✅ Sistemas base inicializados');
    });
} 