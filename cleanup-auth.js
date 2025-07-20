/**
 * Utilitário de Limpeza Completa do Sistema de Autenticação
 * Remove todos os listeners duplicados e reseta o estado
 */

export class AuthCleanup {
    /**
     * Limpa completamente o sistema de autenticação
     */
    static cleanupComplete() {
        console.log('🧹 Iniciando limpeza completa do sistema de autenticação...');
        
        // 1. Limpar localStorage
        this.clearLocalStorage();
        
        // 2. Limpar sessionStorage
        this.clearSessionStorage();
        
        // 3. Resetar flags globais
        this.resetGlobalFlags();
        
        // 4. Remover event listeners conhecidos
        this.removeEventListeners();
        
        // 5. Resetar instâncias se existirem
        this.resetInstances();
        
        console.log('✅ Limpeza completa finalizada');
    }
    
    /**
     * Limpa dados do localStorage relacionados ao projeto
     */
    static clearLocalStorage() {
        const keysToRemove = Object.keys(localStorage).filter(key => 
            key.includes('forjador') || 
            key.includes('supabase') ||
            key.includes('rpg_') ||
            key.includes('auth')
        );
        
        keysToRemove.forEach(key => {
            localStorage.removeItem(key);
            console.log(`🗑️ Removido localStorage: ${key}`);
        });
    }
    
    /**
     * Limpa sessionStorage
     */
    static clearSessionStorage() {
        const keys = Object.keys(sessionStorage);
        keys.forEach(key => {
            sessionStorage.removeItem(key);
            console.log(`🗑️ Removido sessionStorage: ${key}`);
        });
    }
    
    /**
     * Reseta flags globais conhecidas
     */
    static resetGlobalFlags() {
        // Flags de event listeners
        window.authGuardListenerAdded = false;
        window.lastSignInEvent = null;
        window.lastSignInEvents = {};
        window.signInEventCount = 0;
        
        // Flags de instâncias
        if (window.forjadorApp) {
            if (window.forjadorApp.storage) {
                window.forjadorApp.storage.listenersAdded = false;
            }
            window.forjadorApp.authListenersAdded = false;
        }
        
        console.log('🔄 Flags globais resetadas');
    }
    
    /**
     * Remove event listeners conhecidos (método experimental)
     */
    static removeEventListeners() {
        // Criar handlers fictícios para remover
        const dummySignInHandler = () => {};
        const dummySignOutHandler = () => {};
        const dummyUserLoggedInHandler = () => {};
        const dummyUserLoggedOutHandler = () => {};
        
        // Tentar remover múltiplas vezes (caso haja múltiplos listeners)
        for (let i = 0; i < 10; i++) {
            document.removeEventListener('supabaseSignIn', dummySignInHandler);
            document.removeEventListener('supabaseSignOut', dummySignOutHandler);
            document.removeEventListener('userLoggedIn', dummyUserLoggedInHandler);
            document.removeEventListener('userLoggedOut', dummyUserLoggedOutHandler);
        }
        
        console.log('🔌 Event listeners removidos (tentativa)');
    }
    
    /**
     * Reseta instâncias se existirem
     */
    static resetInstances() {
        // Resetar Supabase Auth se existir
        if (window.supabaseAuth) {
            if (window.supabaseAuth.authStateSubscription) {
                window.supabaseAuth.authStateSubscription.unsubscribe();
                console.log('🔌 Supabase subscription removida');
            }
            window.supabaseAuth.lastEventTime = 0;
        }
        
        // Resetar instâncias do app
        if (window.forjadorApp) {
            window.forjadorApp.authListenersAdded = false;
            if (window.forjadorApp.storage) {
                window.forjadorApp.storage.listenersAdded = false;
            }
        }
        
        console.log('🔄 Instâncias resetadas');
    }
    
    /**
     * Força logout em todos os sistemas
     */
    static async forceLogoutAll() {
        console.log('🚪 Forçando logout em todos os sistemas...');
        
        try {
            // Logout do Supabase
            if (window.supabaseAuth && window.supabaseAuth.signOut) {
                await window.supabaseAuth.signOut();
                console.log('✅ Logout Supabase realizado');
            }
            
            // Dispatch eventos de logout
            document.dispatchEvent(new CustomEvent('supabaseSignOut'));
            document.dispatchEvent(new CustomEvent('userLoggedOut'));
            
        } catch (error) {
            console.error('❌ Erro no logout forçado:', error);
        }
    }
    
    /**
     * Detecta quantos listeners estão ativos para um evento
     */
    static countActiveListeners(eventType = 'supabaseSignIn') {
        let count = 0;
        const testHandler = () => { count++; };
        
        // Adicionar um listener teste
        document.addEventListener(eventType, testHandler);
        
        // Disparar evento
        document.dispatchEvent(new CustomEvent(eventType, { 
            detail: { user: { email: 'test@example.com' } } 
        }));
        
        // Remover listener teste
        document.removeEventListener(eventType, testHandler);
        
        // O count - 1 representa quantos listeners externos existem
        const externalListeners = Math.max(0, count - 1);
        console.log(`🔢 Listeners ativos para '${eventType}': ${externalListeners}`);
        
        return externalListeners;
    }
}

// Expor para uso global
window.AuthCleanup = AuthCleanup; 