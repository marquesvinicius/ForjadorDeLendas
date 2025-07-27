/**
 * Configuração do Supabase para Forjador de Lendas
 * Sistema de autenticação robusto e escalável
 */

// src/core/supabase.js

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Classe de autenticação (se quiser manter)
export class SupabaseAuth {
    constructor() {
        this.client = null;
        this.currentUser = null;
        this.initialized = false;
        this.lastEventTime = 0;
        this.eventDebounceTime = 1000; // 1 segundo
        this.authStateSubscription = null;
        this.init();
    }

    /**
     * Inicializa o sistema de autenticação
     */
    async init() {
        try {
            // Aguardar Supabase estar disponível
            // await waitForSupabase(); // Removido
            this.client = supabase;

            // Verificar sessão atual
            const { data: { session } } = await this.client.auth.getSession();

            if (session?.user) {
                this.currentUser = session.user;
            }

            // Marcar como inicializado
            this.initialized = true;

        } catch (error) {
            console.error('❌ Erro ao inicializar Supabase Auth:', error);
            this.initialized = true; // Marcar como inicializado mesmo com erro
        }

        // Escutar mudanças de autenticação (com proteção contra duplicatas)
        if (this.authStateSubscription) {
            this.authStateSubscription.unsubscribe();
        }

        this.authStateSubscription = this.client.auth.onAuthStateChange((event, session) => {
            const now = Date.now();

            // Debouncing para evitar eventos duplicados
            if (event === 'SIGNED_IN' && now - this.lastEventTime < this.eventDebounceTime) {
                return;
            }

            switch (event) {
                case 'SIGNED_IN':
                    this.lastEventTime = now;
                    this.currentUser = session?.user || null;
                    this.onSignIn(session?.user);
                    break;
                case 'SIGNED_OUT':
                    this.currentUser = null;
                    this.onSignOut();
                    break;
                case 'TOKEN_REFRESHED':
                    break;
                case 'INITIAL_SESSION':
                    this.currentUser = session?.user || null;
                    // Se há um usuário na sessão inicial, disparar evento de sign in
                    if (session?.user) {
                        this.onSignIn(session.user);
                    }
                    break;
            }
        });
    }

    /**
     * Registrar novo usuário
     */
    async signUp(email, password, userData = {}) {
        try {
            const { data, error } = await this.client.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        username: userData.username || email.split('@')[0],
                        full_name: userData.fullName || '',
                        avatar_url: userData.avatarUrl || '',
                        ...userData
                    }
                }
            })

            if (error) {
                throw error
            }

            if (data?.user && !data?.session) {
                // Usuário criado mas precisa confirmar email
                return {
                    success: true,
                    user: data.user,
                    needsConfirmation: true,
                    message: 'Verifique seu email para confirmar a conta!'
                }
            }

            return {
                success: true,
                user: data.user,
                session: data.session,
                message: 'Conta criada com sucesso!'
            }
        } catch (error) {
            console.error('❌ Erro no registro:', error)
            return {
                success: false,
                error: error.message,
                message: this.getErrorMessage(error.message)
            }
        }
    }

    /**
     * Login do usuário
     */
    async signIn(email, password) {
        try {
            const { data, error } = await this.client.auth.signInWithPassword({
                email,
                password
            })

            if (error) {
                throw error
            }

            return {
                success: true,
                user: data.user,
                session: data.session,
                message: 'Login realizado com sucesso!'
            }
        } catch (error) {
            console.error('❌ Erro no login:', error)
            return {
                success: false,
                error: error.message,
                message: this.getErrorMessage(error.message)
            }
        }
    }

    /**
     * Login com OAuth (Google, GitHub, etc.)
     */
    async signInWithOAuth(provider) {
        try {
            const { data, error } = await this.client.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: window.location.origin
                }
            })

            if (error) {
                throw error
            }

            return {
                success: true,
                data,
                message: `Login com ${provider} iniciado!`
            }
        } catch (error) {
            console.error('❌ Erro no OAuth:', error)
            return {
                success: false,
                error: error.message,
                message: this.getErrorMessage(error.message)
            }
        }
    }

    /**
     * Logout do usuário
     */
    async signOut() {
        try {
            const { error } = await this.client.auth.signOut()

            if (error) {
                throw error
            }

            return {
                success: true,
                message: 'Logout realizado com sucesso!'
            }
        } catch (error) {
            console.error('❌ Erro no logout:', error)
            return {
                success: false,
                error: error.message,
                message: 'Erro ao fazer logout'
            }
        }
    }

    /**
     * Reset de senha
     */
    async resetPassword(email) {
        try {
            const { error } = await this.client.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/login.html?mode=reset`
            })

            if (error) {
                throw error
            }

            return {
                success: true,
                message: 'Email de recuperação enviado!'
            }
        } catch (error) {
            console.error('❌ Erro no reset:', error)
            return {
                success: false,
                error: error.message,
                message: this.getErrorMessage(error.message)
            }
        }
    }

    /**
     * Atualizar senha
     */
    async updatePassword(newPassword) {
        try {
            const { error } = await this.client.auth.updateUser({
                password: newPassword
            })

            if (error) {
                throw error
            }

            return {
                success: true,
                message: 'Senha atualizada com sucesso!'
            }
        } catch (error) {
            console.error('❌ Erro ao atualizar senha:', error)
            return {
                success: false,
                error: error.message,
                message: this.getErrorMessage(error.message)
            }
        }
    }

    /**
     * Atualizar perfil do usuário
     */
    async updateProfile(userData) {
        try {
            const { error } = await this.client.auth.updateUser({
                data: userData
            })

            if (error) {
                throw error
            }

            return {
                success: true,
                message: 'Perfil atualizado com sucesso!'
            }
        } catch (error) {
            console.error('❌ Erro ao atualizar perfil:', error)
            return {
                success: false,
                error: error.message,
                message: this.getErrorMessage(error.message)
            }
        }
    }

    /**
     * Verificar se usuário está autenticado
     */
    isAuthenticated() {
        return !!this.currentUser
    }

    /**
     * Obter usuário atual
     */
    getCurrentUser() {
        return this.currentUser
    }

    /**
     * Obter token de autenticação
     */
    async getAuthToken() {
        const { data: { session } } = await this.client.auth.getSession()
        return session?.access_token || null
    }

    /**
     * Callback quando usuário faz login
     */
    onSignIn(user) {
        // Verificar se já há um evento recente para este usuário (mais agressivo)
        const now = Date.now();
        const eventKey = `signin_${user.email}`;
        const lastEventTime = window.lastSignInEvents?.[eventKey] || 0;

        // Bloquear eventos duplicados em uma janela maior (5 segundos)
        if (now - lastEventTime < 5000) {
            return
        }

        // Salvar timestamp do evento
        if (!window.lastSignInEvents) window.lastSignInEvents = {};
        window.lastSignInEvents[eventKey] = now;

        // Verificar se há muitos eventos em sequência
        if (!window.signInEventCount) window.signInEventCount = 0;
        window.signInEventCount++;

        if (window.signInEventCount > 10) {
            console.error('🚨 MUITOS EVENTOS SIGNIN - PARANDO PARA PREVENIR LOOP!');
            return;
        }

        // Reset contador após um tempo
        setTimeout(() => {
            if (window.signInEventCount > 0) {
                window.signInEventCount = Math.max(0, window.signInEventCount - 1);
            }
        }, 10000);

        // Dispatch evento customizado
        const event = new CustomEvent('supabaseSignIn', {
            detail: { user }
        })
        document.dispatchEvent(event)
    }

    /**
     * Callback quando usuário faz logout
     */
    onSignOut() {
        console.log('🚪 Supabase: Usuário fez logout');
        
        // Dispatch evento customizado
        const event = new CustomEvent('supabaseSignOut')
        document.dispatchEvent(event)

        // ⭐ REDIRECIONAMENTO EXPLÍCITO PARA LOGIN
        // Se estiver em qualquer página que não seja login, redirecionar
        if (!window.location.pathname.includes('login.html')) {
            console.log('🔄 Supabase: Redirecionando para login após logout');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 500); // Pequeno delay para garantir que o evento seja processado
        }
    }

    /**
     * Traduzir mensagens de erro para português
     */
    getErrorMessage(errorMessage) {
        const errorMap = {
            'Invalid login credentials': 'Email ou senha incorretos',
            'Email not confirmed': 'Email não confirmado. Verifique sua caixa de entrada',
            'Password should be at least 6 characters': 'A senha deve ter pelo menos 6 caracteres',
            'User already registered': 'Usuário já registrado',
            'Invalid email': 'Email inválido',
            'Signup is disabled': 'Cadastro desabilitado',
            'Email already exists': 'Email já existe',
            'Weak password': 'Senha muito fraca',
            'Rate limit exceeded': 'Muitas tentativas. Tente novamente mais tarde'
        }

        return errorMap[errorMessage] || errorMessage || 'Erro desconhecido'
    }
}

// Exportar instância única
export const supabaseAuth = new SupabaseAuth() 