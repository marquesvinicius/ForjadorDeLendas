/**
 * Configuração do Supabase para Forjador de Lendas
 * Sistema de autenticação robusto e escalável
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Configurações do Supabase
const SUPABASE_URL = 'https://zeiemqbillfiwlecjdtl.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplaWVtcWJpbGxmaXdsZWNqZHRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0MjkzMDUsImV4cCI6MjA2NTAwNTMwNX0.LPDa6NT4LK09wV2TonjiXoE-KSrLzFW9Dx4wVluKPDQ'

// Inicializar cliente Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
})

export class SupabaseAuth {
    constructor() {
        this.client = supabase
        this.currentUser = null
        this.init()
    }

    /**
     * Inicializa o sistema de autenticação
     */
    async init() {
        // Verificar sessão atual
        const { data: { session } } = await this.client.auth.getSession()
        
        if (session?.user) {
            this.currentUser = session.user
            console.log('🔐 Usuário autenticado:', session.user.email)
        }

        // Escutar mudanças de autenticação
        this.client.auth.onAuthStateChange((event, session) => {
            console.log('🔄 Auth state changed:', event)
            
            switch (event) {
                case 'SIGNED_IN':
                    this.currentUser = session?.user || null
                    this.onSignIn(session?.user)
                    break
                case 'SIGNED_OUT':
                    this.currentUser = null
                    this.onSignOut()
                    break
                case 'TOKEN_REFRESHED':
                    console.log('🔄 Token refreshed')
                    break
            }
        })
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
        console.log('🎉 Usuário logado:', user.email)
        
        // Dispatch evento customizado
        const event = new CustomEvent('supabaseSignIn', {
            detail: { user }
        })
        document.dispatchEvent(event)

        // Redirecionar para página principal se estiver na página de login
        if (window.location.pathname.includes('login.html')) {
            window.location.href = 'index.html'
        }
    }

    /**
     * Callback quando usuário faz logout
     */
    onSignOut() {
        console.log('👋 Usuário deslogado')
        
        // Dispatch evento customizado
        const event = new CustomEvent('supabaseSignOut')
        document.dispatchEvent(event)

        // Redirecionar para página de login
        window.location.href = 'login.html'
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
export { supabase } 