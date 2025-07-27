/**
 * Inicializador central da aplicação
 */

import { cleanupLegacyAuth } from './legacy-cleanup.js';
import { setupThemeListeners } from '../ui/themeManager.js';
import { initializeCompanionFallback } from '../ui/companion-fallback.js';
import { LogoutManager } from '../ui/logout-manager.js';
import { supabaseAuth } from './supabase.js';

/**
 * Sistema unificado de verificação de autenticação
 */
class AuthVerifier {
    constructor() {
        this.initialized = false;
    }

    /**
     * Verificar autenticação e redirecionar se necessário
     */
    async verifyAuth() {
        console.log('🔐 AuthVerifier: Verificando autenticação...');
        
        // Aguardar Supabase inicializar
        await this.waitForSupabase();
        
        const isAuthenticated = supabaseAuth.isAuthenticated();
        const currentUser = supabaseAuth.getCurrentUser();
        const isLoginPage = window.location.pathname.includes('login.html');
        
        console.log('🔐 AuthVerifier:', {
            isAuthenticated,
            hasUser: !!currentUser,
            isLoginPage,
            currentPath: window.location.pathname
        });

        // ⭐ DELAY MÍNIMO PARA FEEDBACK VISUAL
        await this.minimumLoadingDelay();

        // Se autenticado e na página de login, redirecionar para index
        if (isAuthenticated && currentUser && isLoginPage) {
            console.log('🔄 AuthVerifier: Usuário logado na página de login, redirecionando...');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
            return;
        }

        // Se não autenticado e na página principal, redirecionar para login
        if (!isAuthenticated && !isLoginPage) {
            console.log('🔄 AuthVerifier: Usuário não autenticado na página principal, redirecionando...');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 100);
            return;
        }

        // Se chegou aqui, usuário está autenticado na página correta
        // Mostrar conteúdo principal
        this.showMainContent();
        
        console.log('✅ AuthVerifier: Verificação concluída - usuário autenticado');
    }

    /**
     * Delay mínimo para feedback visual adequado
     */
    async minimumLoadingDelay() {
        return new Promise((resolve) => {
            // Delay mínimo de 1.5 segundos para feedback visual
            setTimeout(() => {
                console.log('⏱️ AuthVerifier: Delay mínimo concluído');
                resolve();
            }, 1500);
        });
    }

    /**
     * Mostrar conteúdo principal após verificação de autenticação
     */
    showMainContent() {
        const loadingOverlay = document.getElementById('authLoading');
        const mainContent = document.getElementById('mainContent');
        
        if (loadingOverlay && mainContent) {
            // Ocultar loading com transição suave
            loadingOverlay.classList.add('hidden');
            
            // Mostrar conteúdo principal
            mainContent.classList.remove('auth-hidden');
            mainContent.classList.add('visible');
            
            // Remover loading do DOM após transição
            setTimeout(() => {
                if (loadingOverlay.parentNode) {
                    loadingOverlay.parentNode.removeChild(loadingOverlay);
                }
            }, 300);
            
            console.log('✅ AuthVerifier: Conteúdo principal exibido');
        }
    }

    /**
     * Aguardar Supabase inicializar
     */
    async waitForSupabase() {
        return new Promise((resolve) => {
            let attempts = 0;
            const maxAttempts = 50;
            
            const checkAuth = () => {
                attempts++;
                
                if (supabaseAuth?.initialized) {
                    console.log('✅ AuthVerifier: Supabase pronto');
                    resolve();
                } else if (attempts >= maxAttempts) {
                    console.warn('⚠️ AuthVerifier: Timeout aguardando Supabase');
                    resolve();
                } else {
                    setTimeout(checkAuth, 100);
                }
            };
            checkAuth();
        });
    }
}

/**
 * Inicializa todos os sistemas da aplicação
 */
export function initializeApp() {
    document.addEventListener('DOMContentLoaded', async () => {
        console.log('🚀 App: Inicializando sistemas...');
        
        // Limpar sistema legado
        cleanupLegacyAuth();
        
        // Configurar tema
        setupThemeListeners();
        
        // Inicializar companion fallback
        initializeCompanionFallback();
        
        // Inicializar gerenciador de logout
        new LogoutManager();
        
        // Verificar autenticação
        const authVerifier = new AuthVerifier();
        await authVerifier.verifyAuth();
        
        console.log('✅ Sistemas base inicializados');
    });
} 