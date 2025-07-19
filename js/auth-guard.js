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
            
            // ⭐ VERIFICAÇÃO DUPLA: Primeiro tentar método padrão, depois fallback
            let isAuthenticated = false;
            let currentUser = null;
            
            if (supabaseAuth?.initialized) {
                // Verificação normal
                isAuthenticated = supabaseAuth.isAuthenticated();
                currentUser = supabaseAuth.getCurrentUser();
                console.log('🔍 Auth Guard: Verificação padrão -', { isAuthenticated, user: currentUser?.email });
            }
            
            // Se não funcionar, usar verificação direta
            if (!isAuthenticated) {
                console.log('⚠️ Auth Guard: Tentando verificação direta...');
                const sessionResult = await this.checkSessionDirectly();
                isAuthenticated = sessionResult.isAuthenticated;
                currentUser = sessionResult.user;
                console.log('🔍 Auth Guard: Verificação direta -', { isAuthenticated, user: currentUser?.email });
            }
            
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
            let attempts = 0;
            const maxAttempts = 60; // 3 segundos máximo (mais rápido)
            
            const checkAuth = () => {
                attempts++;
                
                // Debug simplificado
                if (attempts % 10 === 0) { // Log a cada 10 tentativas
                    console.log(`⏳ Auth Guard: Aguardando Supabase... (${attempts}/${maxAttempts})`);
                }
                
                if (supabaseAuth?.initialized) {
                    console.log('✅ Auth Guard: Supabase pronto');
                    resolve();
                } else if (attempts >= maxAttempts) {
                    console.warn('⚠️ Auth Guard: Timeout aguardando Supabase, usando verificação direta');
                    resolve(); // Continuar mesmo assim
                } else {
                    setTimeout(checkAuth, 50);
                }
            };
            checkAuth();
        });
    }

    /**
     * Verificar sessão diretamente no Supabase (bypass da flag initialized)
     */
    async checkSessionDirectly() {
        try {
            // Verificar diretamente no cliente Supabase
            const { data: { session }, error } = await supabaseAuth.client.auth.getSession();
            
            if (error) {
                console.error('❌ Auth Guard: Erro ao verificar sessão:', error);
                return { isAuthenticated: false };
            }
            
            if (session?.user) {
                return { 
                    isAuthenticated: true, 
                    email: session.user.email,
                    user: session.user 
                };
            }
            
            return { isAuthenticated: false };
            
        } catch (error) {
            console.error('❌ Auth Guard: Erro na verificação direta:', error);
            return { isAuthenticated: false };
        }
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

// ⭐ ESCUTAR EVENTOS DE LOGIN PARA CONTROLAR REDIRECIONAMENTO
document.addEventListener('supabaseSignIn', (event) => {
    console.log('🎉 Auth Guard: Login detectado!', event.detail?.user?.email);
    
    if (window.location.pathname.includes('login.html')) {
        // Verificar se há URL para redirecionamento
        const redirectUrl = sessionStorage.getItem('forjador_redirect_after_login');
        
        if (redirectUrl && redirectUrl !== window.location.href) {
            console.log('🔄 Redirecionando para URL salva:', redirectUrl);
            sessionStorage.removeItem('forjador_redirect_after_login');
            window.location.href = redirectUrl;
        } else {
            console.log('🔄 Redirecionando para index.html');
            window.location.href = 'index.html';
        }
    }
});

// Expor função para limpar cache
window.clearAuthData = AuthGuard.clearAuthData; 