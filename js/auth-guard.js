/**
 * Auth Guard - Verificação de autenticação modular
 * Sistema limpo sem JavaScript inline no HTML
 */

import { supabaseAuth } from '../src/core/supabase.js';

export class AuthGuard {
    constructor() {
        this.init();
    }

    /**
     * Inicializar Auth Guard
     */
    async init() {
        // Verificar se já está na página de login
        if (window.location.pathname.includes('login.html')) {
            console.log('🛡️ Auth Guard: Na página de login, pulando verificação');
            return;
        }

        console.log('🛡️ Auth Guard: Verificando autenticação...');

        try {
            // Aguardar Supabase inicializar completamente
            await this.waitForSupabaseInit();
            
            // Verificar autenticação
            const isAuthenticated = supabaseAuth.isAuthenticated();
            const currentUser = supabaseAuth.getCurrentUser();
            
            if (!isAuthenticated || !currentUser) {
                console.log('❌ Auth Guard: Usuário não autenticado, redirecionando...');
                this.redirectToLogin();
                return;
            }

            console.log('✅ Auth Guard: Usuário autenticado:', currentUser.email);
            
        } catch (error) {
            console.error('❌ Auth Guard: Erro ao verificar autenticação:', error);
            this.redirectToLogin();
        }
    }

    /**
     * Aguardar Supabase inicializar
     */
    async waitForSupabaseInit() {
        return new Promise((resolve) => {
            const checkAuth = () => {
                if (supabaseAuth.initialized) {
                    console.log('✅ Auth Guard: Supabase pronto');
                    resolve();
                } else {
                    console.log('⏳ Auth Guard: Aguardando Supabase...');
                    setTimeout(checkAuth, 50);
                }
            };
            checkAuth();
        });
    }

    /**
     * Redirecionar para login
     */
    redirectToLogin() {
        // Salvar URL atual para redirecionar depois do login
        sessionStorage.setItem('forjador_redirect_after_login', window.location.href);
        window.location.href = 'login.html';
    }

    /**
     * Limpar cache e dados de autenticação
     */
    static clearAuthData() {
        console.log('🧹 Limpando dados de autenticação...');
        
        // Limpar localStorage
        const keysToRemove = [
            'forjador_auth_token',
            'forjador_user_data',
            'forjador_characters',
            'forjador_worlds',
            'forjador_settings'
        ];
        
        keysToRemove.forEach(key => {
            localStorage.removeItem(key);
        });
        
        // Limpar sessionStorage
        sessionStorage.clear();
        
        // Fazer logout do Supabase
        if (supabaseAuth && supabaseAuth.signOut) {
            supabaseAuth.signOut();
        }
        
        console.log('✅ Dados de autenticação limpos!');
    }
}

// Inicializar Auth Guard quando DOM carregar
document.addEventListener('DOMContentLoaded', () => {
    new AuthGuard();
});

// Expor função para limpar cache
window.clearAuthData = AuthGuard.clearAuthData; 