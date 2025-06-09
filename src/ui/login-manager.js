/**
 * Gerenciador de Login com Supabase Auth
 * Sistema moderno de autenticação para Forjador de Lendas
 */

import { supabaseAuth } from '../core/supabase.js';

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
     * Manipular login com email/senha
     */
    async handleLogin(event) {
        event.preventDefault();

        if (this.isLoading) return;

        const formData = new FormData(event.target);
        const email = formData.get('email');
        const password = formData.get('password');

        if (!this.validateLoginForm(email, password)) return;

        this.setLoading(true);
        this.showMessage('Verificando suas credenciais...', 'loading');

        try {
            const result = await supabaseAuth.signIn(email, password);

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
        const loginForm = document.getElementById('loginFormContainer');
        const registerForm = document.getElementById('registerFormContainer');
        
        if (loginForm && registerForm) {
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
            
            // Configurar formulário de registro se ainda não foi feito
            this.setupRegisterForm();
        }
    }

    /**
     * Configurar formulário de registro
     */
    setupRegisterForm() {
        const registerForm = document.getElementById('registerForm');
        if (registerForm && !registerForm.hasAttribute('data-setup')) {
            registerForm.setAttribute('data-setup', 'true');
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }
    }

    /**
     * Manipular registro de novo usuário
     */
    async handleRegister(event) {
        event.preventDefault();

        if (this.isLoading) return;

        const formData = new FormData(event.target);
        const email = formData.get('email');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');
        const username = formData.get('username');
        const fullName = formData.get('fullName');

        if (!this.validateRegisterForm(email, password, confirmPassword, username)) return;

        this.setLoading(true);
        this.showMessage('Criando sua conta de aventureiro...', 'loading');

        try {
            const result = await supabaseAuth.signUp(email, password, {
                username,
                fullName
            });

            if (result.success) {
                this.showMessage(result.message, 'success');
                
                if (result.needsConfirmation) {
                    this.showEmailConfirmationMessage();
                } else {
                    // Login automático após registro
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 2000);
                }
            } else {
                this.showMessage(result.message, 'error');
            }
        } catch (error) {
            console.error('❌ Erro no registro:', error);
            this.showMessage('Erro ao criar conta. Tente novamente.', 'error');
        } finally {
            this.setLoading(false);
        }
    }

    /**
     * Mostrar formulário de esqueci senha
     */
    showForgotPasswordForm() {
        const loginForm = document.getElementById('loginFormContainer');
        const forgotForm = document.getElementById('forgotPasswordContainer');
        
        if (loginForm && forgotForm) {
            loginForm.style.display = 'none';
            forgotForm.style.display = 'block';
            
            this.setupForgotPasswordForm();
        }
    }

    /**
     * Configurar formulário de esqueci senha
     */
    setupForgotPasswordForm() {
        const forgotForm = document.getElementById('forgotPasswordForm');
        if (forgotForm && !forgotForm.hasAttribute('data-setup')) {
            forgotForm.setAttribute('data-setup', 'true');
            forgotForm.addEventListener('submit', (e) => this.handleForgotPassword(e));
        }
    }

    /**
     * Manipular reset de senha
     */
    async handleForgotPassword(event) {
        event.preventDefault();

        if (this.isLoading) return;

        const formData = new FormData(event.target);
        const email = formData.get('email');

        if (!this.validateEmail(email)) {
            this.showMessage('Por favor, insira um email válido', 'error');
            return;
        }

        this.setLoading(true);
        this.showMessage('Enviando email de recuperação...', 'loading');

        try {
            const result = await supabaseAuth.resetPassword(email);

            if (result.success) {
                this.showMessage(result.message, 'success');
                this.showPasswordResetSentMessage();
            } else {
                this.showMessage(result.message, 'error');
            }
        } catch (error) {
            console.error('❌ Erro no reset:', error);
            this.showMessage('Erro ao enviar email. Tente novamente.', 'error');
        } finally {
            this.setLoading(false);
        }
    }

    /**
     * Mostrar formulário de login
     */
    showLoginForm() {
        const containers = [
            'loginFormContainer',
            'registerFormContainer', 
            'forgotPasswordContainer'
        ];

        containers.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.style.display = id === 'loginFormContainer' ? 'block' : 'none';
            }
        });
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
     * Validar formulário de registro
     */
    validateRegisterForm(email, password, confirmPassword, username) {
        if (!email || !password || !confirmPassword || !username) {
            this.showMessage('Por favor, preencha todos os campos', 'error');
            return false;
        }

        if (!this.validateEmail(email)) {
            this.showMessage('Por favor, insira um email válido', 'error');
            return false;
        }

        if (password.length < 6) {
            this.showMessage('A senha deve ter pelo menos 6 caracteres', 'error');
            return false;
        }

        if (password !== confirmPassword) {
            this.showMessage('As senhas não coincidem', 'error');
            return false;
        }

        if (username.length < 3) {
            this.showMessage('O nome de usuário deve ter pelo menos 3 caracteres', 'error');
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
        
        const submitBtns = document.querySelectorAll('button[type="submit"]');
        submitBtns.forEach(btn => {
            btn.disabled = loading;
            
            if (loading) {
                btn.innerHTML = `
                    <span class="icon">
                        <i class="fas fa-spinner fa-spin"></i>
                    </span>
                    <span>Aguarde...</span>
                `;
            } else {
                // Restaurar texto original do botão
                this.restoreButtonText(btn);
            }
        });
    }

    /**
     * Restaurar texto original do botão
     */
    restoreButtonText(btn) {
        const originalTexts = {
            'loginButton': 'Entrar no Reino',
            'registerButton': 'Criar Conta',
            'forgotPasswordButton': 'Enviar Email'
        };

        const text = originalTexts[btn.id] || 'Enviar';
        btn.innerHTML = `
            <span class="icon">
                <i class="fas fa-sign-in-alt"></i>
            </span>
            <span>${text}</span>
        `;
    }

    /**
     * Mostrar mensagem
     */
    showMessage(message, type = 'info') {
        const messageEl = document.getElementById('guardMessage');
        if (!messageEl) return;

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
     * Mostrar mensagem de confirmação de email
     */
    showEmailConfirmationMessage() {
        this.showMessage(
            '📧 Enviamos um email de confirmação! Verifique sua caixa de entrada.',
            'success'
        );
        
        // Voltar para o formulário de login após alguns segundos
        setTimeout(() => {
            this.showLoginForm();
        }, 3000);
    }

    /**
     * Mostrar mensagem de reset enviado
     */
    showPasswordResetSentMessage() {
        this.showMessage(
            '📧 Email de recuperação enviado! Verifique sua caixa de entrada.',
            'success'
        );
        
        // Voltar para o formulário de login após alguns segundos
        setTimeout(() => {
            this.showLoginForm();
        }, 3000);
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