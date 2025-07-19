/**
 * Gerenciador de Login com Supabase Auth
 * Sistema moderno de autenticação para Forjador de Lendas
 */

import { supabaseAuth } from '../src/core/supabase.js';

export class LoginManager {
    constructor() {
        this.isLoading = false;
        this.init();
    }

    /**
     * Inicializar o gerenciador de login
     */
    async init() {
        // Verificar se já está logado
        if (supabaseAuth.isAuthenticated()) {
            // Se já estiver logado e estiver na página de login, redirecionar
            if (window.location.pathname.includes('login.html')) {
                window.location.href = 'index.html';
                return;
            }
        }

        // Configurar event listeners
        this.setupEventListeners();
        
        // Configurar handlers de autenticação
        this.setupAuthHandlers();
        
        // Verificar se há processo de reset de senha
        this.checkPasswordReset();
    }

    /**
     * Configurar event listeners do formulário
     */
    setupEventListeners() {
        // Formulário de login
        const loginForm = document.getElementById('guardForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Botão de registro
        const registerLink = document.getElementById('registerLink');
        if (registerLink) {
            registerLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showRegisterForm();
            });
        }

        // Botão de esqueci senha
        const forgotPasswordLink = document.getElementById('forgotPasswordLink');
        if (forgotPasswordLink) {
            forgotPasswordLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showForgotPasswordForm();
            });
        }

        // Botão de voltar ao login
        const backToLoginBtns = document.querySelectorAll('.back-to-login');
        backToLoginBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showLoginForm();
            });
        });

        // OAuth providers
        this.setupOAuthListeners();
    }

    /**
     * Configurar listeners para OAuth
     */
    setupOAuthListeners() {
        // Google OAuth
        const googleBtn = document.getElementById('googleLogin');
        if (googleBtn) {
            googleBtn.addEventListener('click', () => this.handleOAuthLogin('google'));
        }

        // GitHub OAuth
        const githubBtn = document.getElementById('githubLogin');
        if (githubBtn) {
            githubBtn.addEventListener('click', () => this.handleOAuthLogin('github'));
        }
    }

    /**
     * Configurar handlers de eventos de autenticação
     */
    setupAuthHandlers() {
        // Escutar eventos do Supabase
        document.addEventListener('supabaseSignIn', (event) => {
            console.log('🎉 Login bem-sucedido!', event.detail.user);
            this.onLoginSuccess(event.detail.user);
        });

        document.addEventListener('supabaseSignOut', () => {
            console.log('👋 Logout realizado');
            this.onLogoutSuccess();
        });
    }

    /**
     * Manipular login com email/senha OU username/senha
     */
    async handleLogin(event) {
        event.preventDefault();

        if (this.isLoading) return;

        const formData = new FormData(event.target);
        let emailOrUsername = formData.get('email') || formData.get('username');
        const password = formData.get('password');

        // 🎯 MELHORIA: Converter username para email se necessário
        if (emailOrUsername && !emailOrUsername.includes('@')) {
            console.log(`🔄 Convertendo username "${emailOrUsername}" para email`);
            emailOrUsername = `${emailOrUsername}@test.com`;
        }

        if (!this.validateLoginForm(emailOrUsername, password)) return;

        this.setLoading(true);
        this.showMessage('Verificando suas credenciais...', 'loading');

        try {
            const result = await supabaseAuth.signIn(emailOrUsername, password);

            if (result.success) {
                this.showMessage(result.message, 'success');
                // O redirecionamento será feito pelo evento supabaseSignIn
            } else {
                this.showMessage(result.message, 'error');
            }
        } catch (error) {
            console.error('❌ Erro no login:', error);
            this.showMessage('Erro inesperado. Tente novamente.', 'error');
        } finally {
            this.setLoading(false);
        }
    }

    /**
     * Manipular login com OAuth
     */
    async handleOAuthLogin(provider) {
        if (this.isLoading) return;

        this.setLoading(true);
        this.showMessage(`Conectando com ${provider}...`, 'loading');

        try {
            const result = await supabaseAuth.signInWithOAuth(provider);

            if (result.success) {
                this.showMessage(result.message, 'success');
                // O OAuth redirecionará automaticamente
            } else {
                this.showMessage(result.message, 'error');
            }
        } catch (error) {
            console.error('❌ Erro no OAuth:', error);
            this.showMessage('Erro na autenticação. Tente novamente.', 'error');
        } finally {
            this.setLoading(false);
        }
    }

    /**
     * Mostrar formulário de registro
     */
    showRegisterForm() {
        console.log('🔄 Mostrando formulário de registro');
        
        // Esconder todos os cards
        this.hideAllCards();
        
        // Mostrar card de registro
        const registerCard = document.getElementById('registerCard');
        if (registerCard) {
            registerCard.classList.remove('hidden');
            
            // Auto-focus no primeiro campo
            setTimeout(() => {
                const firstInput = registerCard.querySelector('input');
                if (firstInput) firstInput.focus();
            }, 300);
        }
        
        // Configurar event listener do formulário se ainda não existir
        this.setupRegisterFormListeners();
    }

    /**
     * Mostrar formulário de esqueci senha
     */
    showForgotPasswordForm() {
        console.log('🔄 Mostrando formulário de esqueci senha');
        
        // Esconder todos os cards
        this.hideAllCards();
        
        // Mostrar card de forgot password
        const forgotCard = document.getElementById('forgotPasswordCard');
        if (forgotCard) {
            forgotCard.classList.remove('hidden');
            
            // Auto-focus no campo de email
            setTimeout(() => {
                const emailInput = forgotCard.querySelector('input[type="email"]');
                if (emailInput) emailInput.focus();
            }, 300);
        }
        
        // Configurar event listener do formulário se ainda não existir
        this.setupForgotPasswordFormListeners();
    }

    /**
     * Mostrar formulário de login
     */
    showLoginForm() {
        console.log('🔄 Voltando ao formulário de login');
        
        // Esconder todos os cards
        this.hideAllCards();
        
        // Mostrar card de login
        const loginCard = document.getElementById('loginCard');
        if (loginCard) {
            loginCard.classList.remove('hidden');
        }
    }

    /**
     * Esconder todos os cards
     */
    hideAllCards() {
        const cards = ['loginCard', 'registerCard', 'forgotPasswordCard'];
        cards.forEach(cardId => {
            const card = document.getElementById(cardId);
            if (card) {
                card.classList.add('hidden');
            }
        });
    }

    /**
     * Configurar listeners do formulário de registro
     */
    setupRegisterFormListeners() {
        const registerForm = document.getElementById('registrationForm');
        if (registerForm && !registerForm.dataset.listenerAdded) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
            registerForm.dataset.listenerAdded = 'true';
        }

        // Botão de voltar ao login
        const backToLoginBtns = document.querySelectorAll('#backToLogin, #backToLoginFromRegister');
        backToLoginBtns.forEach(btn => {
            if (btn && !btn.dataset.listenerAdded) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.showLoginForm();
                });
                btn.dataset.listenerAdded = 'true';
            }
        });
    }

    /**
     * Configurar listeners do formulário de forgot password
     */
    setupForgotPasswordFormListeners() {
        const forgotForm = document.getElementById('forgotPasswordForm');
        if (forgotForm && !forgotForm.dataset.listenerAdded) {
            forgotForm.addEventListener('submit', (e) => this.handleForgotPassword(e));
            forgotForm.dataset.listenerAdded = 'true';
        }

        // Botão de voltar ao login
        const backToLoginBtns = document.querySelectorAll('#backToLoginFromForgot');
        backToLoginBtns.forEach(btn => {
            if (btn && !btn.dataset.listenerAdded) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.showLoginForm();
                });
                btn.dataset.listenerAdded = 'true';
            }
        });
    }

    /**
     * Manipular registro de usuário
     */
    async handleRegister(event) {
        event.preventDefault();

        if (this.isLoading) return;

        const formData = new FormData(event.target);
        const username = formData.get('username')?.trim();
        const email = formData.get('email')?.trim();
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');

        // Validações
        if (!username || !email || !password || !confirmPassword) {
            this.showMessage('Por favor, preencha todos os campos', 'error');
            return;
        }

        if (!this.validateEmail(email)) {
            this.showMessage('Por favor, insira um email válido', 'error');
            return;
        }

        if (password.length < 6) {
            this.showMessage('A senha deve ter pelo menos 6 caracteres', 'error');
            return;
        }

        if (password !== confirmPassword) {
            this.showMessage('As senhas não coincidem', 'error');
            return;
        }

        this.setLoading(true);
        this.showMessage('Criando sua conta...', 'loading');

        try {
            const result = await supabaseAuth.signUp(email, password, {
                username: username,
                full_name: username
            });

            if (result.success) {
                if (result.needsConfirmation) {
                    this.showMessage('Conta criada! Verifique seu email para confirmar.', 'success');
                } else {
                    this.showMessage(`Conta criada com sucesso! Bem-vindo, ${username}!`, 'success');
                    
                    // Aguardar um pouco e voltar ao login
                    setTimeout(() => {
                        this.showLoginForm();
                        const usernameInput = document.getElementById('username');
                        if (usernameInput) {
                            usernameInput.value = username;
                        }
                    }, 2000);
                }
            } else {
                this.showMessage(result.message, 'error');
            }
        } catch (error) {
            console.error('❌ Erro no registro:', error);
            this.showMessage('Erro inesperado. Tente novamente.', 'error');
        } finally {
            this.setLoading(false);
        }
    }

    /**
     * Manipular esqueci senha
     */
    async handleForgotPassword(event) {
        event.preventDefault();

        if (this.isLoading) return;

        const formData = new FormData(event.target);
        const email = formData.get('email')?.trim();

        if (!email) {
            this.showMessage('Por favor, insira seu email', 'error');
            return;
        }

        if (!this.validateEmail(email)) {
            this.showMessage('Por favor, insira um email válido', 'error');
            return;
        }

        this.setLoading(true);
        this.showMessage('Enviando email de recuperação...', 'loading');

        try {
            const result = await supabaseAuth.resetPassword(email);

            if (result.success) {
                this.showMessage('Email de recuperação enviado! Verifique sua caixa de entrada.', 'success');
                
                // Voltar ao login após alguns segundos
                setTimeout(() => {
                    this.showLoginForm();
                }, 3000);
            } else {
                this.showMessage(result.message, 'error');
            }
        } catch (error) {
            console.error('❌ Erro no reset de senha:', error);
            this.showMessage('Erro inesperado. Tente novamente.', 'error');
        } finally {
            this.setLoading(false);
        }
    }

    /**
     * Verificar se há processo de reset de senha na URL
     */
    checkPasswordReset() {
        const urlParams = new URLSearchParams(window.location.search);
        const type = urlParams.get('type');
        
        if (type === 'recovery') {
            // Redirecionar para página de nova senha
            window.location.href = 'reset-password.html' + window.location.search;
        }
    }

    /**
     * Validar formulário de login
     */
    validateLoginForm(email, password) {
        if (!email || !password) {
            this.showMessage('Por favor, preencha todos os campos', 'error');
            return false;
        }

        if (!this.validateEmail(email)) {
            this.showMessage('Por favor, insira um email válido', 'error');
            return false;
        }

        return true;
    }

    /**
     * Validar email
     */
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    /**
     * Definir estado de loading
     */
    setLoading(loading) {
        this.isLoading = loading;
        
        const submitBtn = document.getElementById('guardSubmit');
        if (submitBtn) {
            submitBtn.disabled = loading;
            
            if (loading) {
                submitBtn.innerHTML = `
                    <span class="icon">
                        <i class="fas fa-spinner fa-spin"></i>
                    </span>
                    <span>Aguarde...</span>
                `;
            } else {
                submitBtn.innerHTML = `
                    <span class="icon">
                        <i class="fas fa-shield-alt"></i>
                    </span>
                    <span>Entrar no Reino</span>
                `;
            }
        }
    }

    /**
     * Mostrar mensagem
     */
    showMessage(message, type = 'info') {
        const messageEl = document.getElementById('guardMessage');
        if (!messageEl) {
            console.log(`[${type.toUpperCase()}] ${message}`);
            return;
        }

        messageEl.textContent = message;
        messageEl.className = `guard-notification ${type}`;
        messageEl.style.display = 'block';

        // Auto-hide para mensagens de sucesso e erro
        if (type === 'success' || type === 'error') {
            setTimeout(() => {
                messageEl.style.display = 'none';
            }, 5000);
        }
    }

    /**
     * Callback de login bem-sucedido
     */
    onLoginSuccess(user) {
        console.log('🎉 Bem-vindo,', user.email);
        
        // Mostrar mensagem de boas-vindas
        this.showMessage(`Bem-vindo de volta, ${user.email}!`, 'success');
        
        // Redirecionar para página principal
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }

    /**
     * Callback de logout bem-sucedido
     */
    onLogoutSuccess() {
        // Limpar mensagens
        const messageEl = document.getElementById('guardMessage');
        if (messageEl) {
            messageEl.style.display = 'none';
        }
        
        // Resetar formulários
        this.showLoginForm();
    }
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    new LoginManager();
}); 