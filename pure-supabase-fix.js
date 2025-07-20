/**
 * Fix para forçar 100% Supabase Auth
 * Remove sistemas de auth legados que estão causando conflito
 */

export class PureSupabaseFix {
    /**
     * Aplica correções para usar exclusivamente Supabase Auth
     */
    static applyFix() {
        console.log('🔧 Aplicando fix para 100% Supabase Auth...');
        
        // 1. Limpar localStorage de sistemas legados
        this.clearLegacyStorage();
        
        // 2. Desabilitar sistemas de auth concorrentes
        this.disableLegacyAuth();
        
        // 3. Forçar uso exclusivo do Supabase
        this.enforceSupabaseOnly();
        
        // 4. Limpar sessões conflitantes
        this.clearConflictingSessions();
        
        console.log('✅ Fix aplicado - sistema agora usa 100% Supabase');
    }
    
    /**
     * Remove dados de sistemas de auth legados
     */
    static clearLegacyStorage() {
        const legacyKeys = [
            'forjador_auth_token',
            'forjador_user_data', 
            'forjador_remember_me',
            'forjador_legacy_auth',
            'rpg_auth_data',
            'user_session'
        ];
        
        legacyKeys.forEach(key => {
            if (localStorage.getItem(key)) {
                localStorage.removeItem(key);
                console.log(`🗑️ Removido: ${key}`);
            }
        });
    }
    
    /**
     * Desabilita sistemas de auth concorrentes
     */
    static disableLegacyAuth() {
        // Desabilitar authSystem legado se existir
        if (window.authSystem && window.authSystem !== window.supabaseAuth) {
            console.log('🚫 Desabilitando authSystem legado');
            window.authSystem = null;
        }
        
        // Marcar que estamos em modo Supabase-only
        window.SUPABASE_ONLY_MODE = true;
        
        // Redirecionar chamadas legadas para Supabase
        if (window.forjadorApp && window.forjadorApp.authSystem !== window.supabaseAuth) {
            console.log('🔄 Redirecionando authSystem do app para Supabase');
            window.forjadorApp.authSystem = window.supabaseAuth;
        }
    }
    
    /**
     * Força uso exclusivo do Supabase
     */
    static enforceSupabaseOnly() {
        // Interceptar tentativas de usar auth legado
        const originalSetItem = localStorage.setItem;
        localStorage.setItem = function(key, value) {
            if (key.includes('forjador_auth') && !key.includes('supabase')) {
                console.warn(`🚫 Bloqueado localStorage legado: ${key}`);
                return;
            }
            return originalSetItem.call(this, key, value);
        };
        
        // Marcar flag global
        window.PURE_SUPABASE_MODE = true;
    }
    
    /**
     * Limpa sessões conflitantes
     */
    static clearConflictingSessions() {
        // Limpar cookies de auth se existirem
        document.cookie.split(";").forEach(cookie => {
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            if (name.trim().includes('auth') || name.trim().includes('session')) {
                document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
                console.log(`🍪 Cookie removido: ${name.trim()}`);
            }
        });
        
        // Limpar sessionStorage de conflitos
        const sessionKeys = Object.keys(sessionStorage);
        sessionKeys.forEach(key => {
            if (key.includes('auth') && !key.includes('supabase')) {
                sessionStorage.removeItem(key);
                console.log(`🗑️ SessionStorage removido: ${key}`);
            }
        });
    }
    
    /**
     * Força logout completo e limpo via Supabase
     */
    static async forceCleanLogout() {
        console.log('🧹 Forçando logout completo via Supabase...');
        
        try {
            // 1. Primeiro, aplicar fix
            this.applyFix();
            
            // 2. Logout via Supabase
            if (window.supabaseAuth && window.supabaseAuth.signOut) {
                const result = await window.supabaseAuth.signOut();
                console.log('✅ Logout Supabase resultado:', result);
                
                // 3. Aguardar processamento
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // 4. Verificar se realmente fez logout
                const isStillAuth = window.supabaseAuth.isAuthenticated();
                console.log(`Ainda autenticado? ${isStillAuth}`);
                
                if (isStillAuth) {
                    console.warn('⚠️ Usuário ainda autenticado após logout');
                    return { success: false, stillAuthenticated: true };
                } else {
                    console.log('✅ Logout completo bem-sucedido');
                    return { success: true, stillAuthenticated: false };
                }
                
            } else {
                console.error('❌ supabaseAuth não disponível');
                return { success: false, error: 'supabaseAuth não disponível' };
            }
            
        } catch (error) {
            console.error('❌ Erro no logout limpo:', error);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Diagnostica problemas de auth híbrido
     */
    static diagnoseAuthIssues() {
        const diagnosis = {
            timestamp: new Date().toISOString(),
            supabaseAuth: {
                available: !!window.supabaseAuth,
                initialized: window.supabaseAuth?.initialized,
                isAuthenticated: window.supabaseAuth?.isAuthenticated(),
                currentUser: window.supabaseAuth?.getCurrentUser()?.email || null
            },
            legacyAuth: {
                authSystemExists: !!window.authSystem,
                authSystemIsSupabase: window.authSystem === window.supabaseAuth,
                forjadorAppAuth: window.forjadorApp?.authSystem === window.supabaseAuth
            },
            storage: {
                legacyKeys: Object.keys(localStorage).filter(k => k.includes('forjador_auth') || k.includes('rpg_auth')),
                supabaseKeys: Object.keys(localStorage).filter(k => k.includes('supabase'))
            },
            flags: {
                supabaseOnlyMode: window.SUPABASE_ONLY_MODE,
                pureSupabaseMode: window.PURE_SUPABASE_MODE
            }
        };
        
        console.log('🔍 Diagnóstico de Auth:', diagnosis);
        return diagnosis;
    }
}

// Expor para uso global
window.PureSupabaseFix = PureSupabaseFix; 