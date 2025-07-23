/**
 * Sistema de limpeza de autenticação legada
 */

export function cleanupLegacyAuth() {
    // Limpar localStorage de sistemas legados
    const legacyKeys = ['forjador_auth_token', 'forjador_user_data', 'forjador_remember_me'];
    legacyKeys.forEach(key => {
        if (localStorage.getItem(key)) {
            localStorage.removeItem(key);
        }
    });
    
    // Marcar modo Supabase-only
    window.SUPABASE_ONLY_MODE = true;
    
    console.log('🧹 Sistema legado de auth limpo');
} 