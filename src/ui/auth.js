/**
 * Sistema de Autenticação - Forjador de Lendas
 * Modal de login medieval com gerenciamento de tokens
 */

import { showModal, hideModal, createModal } from './modals.js';

export class AuthSystem {
    constructor() {
        this.isAuthenticated = false;
        this.currentUser = null;
        this.token = null;
        this.loginModalId = 'authLoginModal';
        this.init();
    }

      /**
   * Inicializa o sistema de autenticação
   */
  init() {
    this.checkStoredAuth();
    this.checkAuthRequired();
    this.createLoginModal();
    this.setupEventListeners();
  }

      /**
   * Verifica se há autenticação armazenada
   */
  checkStoredAuth() {
    const storedToken = localStorage.getItem('forjador_auth_token');
    const storedUser = localStorage.getItem('forjador_user_data');
    
    if (storedToken && storedUser) {
      try {
        this.token = storedToken;
        this.currentUser = JSON.parse(storedUser);
        this.isAuthenticated = true;
        this.updateUIState();
        console.log('🔐 Usuário autenticado:', this.currentUser.username);
      } catch (error) {
        console.error('Erro ao recuperar dados de autenticação:', error);
        this.clearAuth();
      }
    }
  }

  /**
   * Verifica se autenticação é necessária e redireciona se não estiver logado
   */
  checkAuthRequired() {
    // Só verificar se estamos na página principal (não na página de login)
    if (window.location.pathname.includes('login.html')) {
      return;
    }

    // Se não estiver autenticado, redirecionar para login
    if (!this.isAuthenticated) {
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 100);
    }
  }

    /**
     * Cria o modal de login medieval
     */
    createLoginModal() {
        const modalContent = `
            <div class="auth-modal-content">
                <div class="auth-header">
                    <h2 class="medieval-title">
                        <i class="fas fa-shield-alt"></i>
                        Bem-vindo, Aventureiro!
                    </h2>
                    <p class="auth-subtitle">
                        Identifique-se para acessar o Reino do Forjador
                    </p>
                </div>

                <form id="loginForm" class="auth-form">
                    <div class="field">
                        <label class="label medieval-label">
                            <i class="fas fa-user"></i>
                            Nome do Herói
                        </label>
                        <div class="control has-icons-left">
                            <input 
                                id="username" 
                                class="input medieval-input" 
                                type="text" 
                                placeholder="Digite seu nome de usuário"
                                required
                                autocomplete="username"
                            >
                            <span class="icon is-small is-left">
                                <i class="fas fa-user"></i>
                            </span>
                        </div>
                    </div>

                    <div class="field">
                        <label class="label medieval-label">
                            <i class="fas fa-key"></i>
                            Palavra Secreta
                        </label>
                        <div class="control has-icons-left">
                            <input 
                                id="password" 
                                class="input medieval-input" 
                                type="password" 
                                placeholder="Digite sua senha"
                                required
                                autocomplete="current-password"
                            >
                            <span class="icon is-small is-left">
                                <i class="fas fa-key"></i>
                            </span>
                        </div>
                    </div>

                    <div class="field">
                        <div class="control">
                            <label class="checkbox medieval-checkbox">
                                <input type="checkbox" id="rememberMe">
                                <span class="checkmark"></span>
                                Lembrar desta jornada
                            </label>
                        </div>
                    </div>

                    <div class="auth-actions">
                        <button 
                            type="submit" 
                            class="button is-primary medieval-button"
                            id="loginButton"
                        >
                            <span class="icon">
                                <i class="fas fa-sign-in-alt"></i>
                            </span>
                            <span>Entrar no Reino</span>
                        </button>
                        
                        <button 
                            type="button" 
                            class="button is-link is-light medieval-button-secondary"
                            id="registerButton"
                        >
                            <span class="icon">
                                <i class="fas fa-user-plus"></i>
                            </span>
                            <span>Criar Conta</span>
                        </button>
                    </div>

                    <div class="auth-footer">
                        <p class="has-text-centered">
                            <a href="#" class="medieval-link" id="forgotPassword">
                                <i class="fas fa-question-circle"></i>
                                Esqueceu a palavra secreta?
                            </a>
                        </p>
                    </div>
                </form>

                <div id="authMessage" class="auth-message" style="display: none;"></div>
            </div>
        `;

        createModal(this.loginModalId, modalContent, 'auth-modal');
        this.addAuthStyles();
    }

    /**
     * Adiciona estilos medievais para o modal de autenticação
     */
    addAuthStyles() {
        const styleId = 'auth-modal-styles';
        if (document.getElementById(styleId)) return;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .auth-modal .modal-content {
                background: linear-gradient(135deg, rgba(20, 20, 20, 0.95), rgba(40, 30, 20, 0.95));
                border: 2px solid var(--primary-color, #d4af37);
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8);
                max-width: 450px;
                margin: 0 auto;
                padding: 2rem;
            }

            .auth-header {
                text-align: center;
                margin-bottom: 2rem;
            }

            .auth-header h2 {
                color: var(--primary-color, #d4af37);
                margin-bottom: 0.5rem;
                font-size: 1.8rem;
            }

            .auth-subtitle {
                color: var(--text-color, #e8e8e8);
                font-style: italic;
                opacity: 0.9;
            }

            .medieval-label {
                color: var(--primary-color, #d4af37) !important;
                font-weight: bold;
                font-size: 1rem;
                margin-bottom: 0.5rem;
            }

            .medieval-input {
                background: rgba(30, 30, 30, 0.8) !important;
                border: 1px solid var(--primary-color, #d4af37) !important;
                color: var(--text-color, #e8e8e8) !important;
                border-radius: 8px !important;
                transition: all 0.3s ease;
            }

            .medieval-input:focus {
                border-color: var(--accent-color, #ffd700) !important;
                box-shadow: 0 0 10px rgba(212, 175, 55, 0.3) !important;
            }

            .medieval-input::placeholder {
                color: rgba(232, 232, 232, 0.6) !important;
            }

            .medieval-checkbox {
                color: var(--text-color, #e8e8e8);
                display: flex;
                align-items: center;
                cursor: pointer;
            }

            .medieval-checkbox input[type="checkbox"] {
                margin-right: 0.5rem;
                transform: scale(1.2);
            }

            .medieval-button {
                background: linear-gradient(135deg, var(--primary-color, #d4af37), var(--accent-color, #b8941f)) !important;
                border: none !important;
                color: #1a1a1a !important;
                font-weight: bold;
                border-radius: 8px !important;
                padding: 0.75rem 1.5rem !important;
                transition: all 0.3s ease;
                width: 100%;
                margin-bottom: 1rem;
            }

            .medieval-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(212, 175, 55, 0.4);
            }

            .medieval-button-secondary {
                background: transparent !important;
                border: 1px solid var(--primary-color, #d4af37) !important;
                color: var(--primary-color, #d4af37) !important;
                width: 100%;
            }

            .medieval-button-secondary:hover {
                background: var(--primary-color, #d4af37) !important;
                color: #1a1a1a !important;
            }

            .medieval-link {
                color: var(--primary-color, #d4af37);
                text-decoration: none;
                transition: color 0.3s ease;
            }

            .medieval-link:hover {
                color: var(--accent-color, #ffd700);
            }

            .auth-message {
                margin-top: 1rem;
                padding: 1rem;
                border-radius: 8px;
                text-align: center;
                font-weight: bold;
            }

            .auth-message.success {
                background: rgba(76, 175, 80, 0.2);
                border: 1px solid #4caf50;
                color: #4caf50;
            }

            .auth-message.error {
                background: rgba(244, 67, 54, 0.2);
                border: 1px solid #f44336;
                color: #f44336;
            }

            .auth-message.loading {
                background: rgba(33, 150, 243, 0.2);
                border: 1px solid #2196f3;
                color: #2196f3;
            }

            @media (max-width: 768px) {
                .auth-modal .modal-content {
                    margin: 1rem;
                    padding: 1.5rem;
                }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Configura os event listeners
     */
    setupEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            // Listener para o formulário de login
            const loginForm = document.getElementById('loginForm');
            if (loginForm) {
                loginForm.addEventListener('submit', (e) => this.handleLogin(e));
            }

            // Listener para botão de registro
            const registerButton = document.getElementById('registerButton');
            if (registerButton) {
                registerButton.addEventListener('click', () => this.showRegisterForm());
            }

            // Listener para "esqueci a senha"
            const forgotPassword = document.getElementById('forgotPassword');
            if (forgotPassword) {
                forgotPassword.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.showForgotPasswordForm();
                });
            }
        });
    }

    /**
     * Manipula o processo de login
     */
    async handleLogin(event) {
        event.preventDefault();
        
        const username = document.getElementById('username')?.value;
        const password = document.getElementById('password')?.value;
        const rememberMe = document.getElementById('rememberMe')?.checked;

        if (!username || !password) {
            this.showMessage('Por favor, preencha todos os campos!', 'error');
            return;
        }

        this.showMessage('Verificando credenciais...', 'loading');
        
        try {
            const result = await this.authenticate(username, password);
            
            if (result.success) {
                this.setAuthData(result.token, result.user, rememberMe);
                this.showMessage('Bem-vindo ao Reino!', 'success');
                
                setTimeout(() => {
                    this.hideLoginModal();
                    this.onLoginSuccess();
                }, 1500);
            } else {
                this.showMessage(result.message || 'Credenciais inválidas!', 'error');
            }
        } catch (error) {
            console.error('Erro no login:', error);
            this.showMessage('Erro de conexão. Tente novamente.', 'error');
        }
    }

    /**
     * Simula autenticação (substituir por API real)
     */
    async authenticate(username, password) {
        // Simulação - substituir por chamada real da API
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simulação de usuários válidos
                const validUsers = {
                    'admin': 'admin123',
                    'forjador': 'lendas123',
                    'mestre': 'rpg2024'
                };

                if (validUsers[username] === password) {
                    resolve({
                        success: true,
                        token: 'mock_jwt_token_' + Date.now(),
                        user: {
                            id: Math.floor(Math.random() * 1000),
                            username: username,
                            email: `${username}@forjador.com`,
                            role: username === 'admin' ? 'admin' : 'user',
                            createdAt: new Date().toISOString()
                        }
                    });
                } else {
                    resolve({
                        success: false,
                        message: 'Nome de usuário ou senha incorretos!'
                    });
                }
            }, 1000); // Simula delay de rede
        });
    }

    /**
     * Define dados de autenticação
     */
    setAuthData(token, user, remember = false) {
        this.token = token;
        this.currentUser = user;
        this.isAuthenticated = true;

        // Armazenar no localStorage
        localStorage.setItem('forjador_auth_token', token);
        localStorage.setItem('forjador_user_data', JSON.stringify(user));
        
        if (remember) {
            localStorage.setItem('forjador_remember_me', 'true');
        }

        this.updateUIState();
    }

    /**
     * Limpa dados de autenticação
     */
    clearAuth() {
        this.token = null;
        this.currentUser = null;
        this.isAuthenticated = false;

        localStorage.removeItem('forjador_auth_token');
        localStorage.removeItem('forjador_user_data');
        localStorage.removeItem('forjador_remember_me');

        this.updateUIState();
    }

    /**
     * Atualiza estado da UI baseado na autenticação
     */
    updateUIState() {
        const authButton = document.querySelector('.auth-button');
        const userInfo = document.querySelector('.user-info');

        if (this.isAuthenticated) {
            // Usuário logado
            if (authButton) {
                authButton.innerHTML = `
                    <span class="icon">
                        <i class="fas fa-user-circle"></i>
                    </span>
                    <span>${this.currentUser.username}</span>
                `;
                authButton.onclick = () => this.showUserMenu();
            }

            // Info do usuário removida - sem exibição de mensagem
        } else {
            // Usuário não logado
            if (authButton) {
                authButton.innerHTML = `
                    <span class="icon">
                        <i class="fas fa-sign-in-alt"></i>
                    </span>
                    <span>Entrar</span>
                `;
                authButton.onclick = () => this.showLoginModal();
            }

            if (userInfo) {
                userInfo.remove();
            }
        }
    }

      /**
   * Redireciona para página de login
   */
  showLoginModal() {
    window.location.href = 'login.html';
  }

    /**
     * Esconde modal de login
     */
    hideLoginModal() {
        hideModal(this.loginModalId);
    }

    /**
     * Mostra mensagem no modal
     */
    showMessage(message, type = 'info') {
        const messageEl = document.getElementById('authMessage');
        if (messageEl) {
            messageEl.textContent = message;
            messageEl.className = `auth-message ${type}`;
            messageEl.style.display = 'block';

            if (type === 'success' || type === 'error') {
                setTimeout(() => {
                    messageEl.style.display = 'none';
                }, 3000);
            }
        }
    }

    /**
     * Callback executado após login bem-sucedido
     */
    onLoginSuccess() {
        console.log('🎉 Login realizado com sucesso!');
        
        // Disparar evento customizado
        const loginEvent = new CustomEvent('userLoggedIn', {
            detail: { user: this.currentUser }
        });
        document.dispatchEvent(loginEvent);
    }

    /**
     * Logout do usuário
     */
    logout() {
        if (confirm('Tem certeza que deseja sair do Reino?')) {
            this.clearAuth();
            console.log('👋 Usuário deslogado');
            
            // Disparar evento customizado
            const logoutEvent = new CustomEvent('userLoggedOut');
            document.dispatchEvent(logoutEvent);
            
            // Recarregar página para limpar estado
            window.location.reload();
        }
    }

    /**
     * Mostra formulário de registro (placeholder)
     */
    showRegisterForm() {
        alert('🏗️ Funcionalidade de registro em desenvolvimento!\n\nPor enquanto, use as credenciais de teste:\n• admin / admin123\n• forjador / lendas123\n• mestre / rpg2024');
    }

    /**
     * Mostra formulário de recuperação de senha (placeholder)
     */
    showForgotPasswordForm() {
        alert('🔧 Recuperação de senha em desenvolvimento!\n\nEntre em contato com o administrador do sistema.');
    }

    /**
     * Mostra menu do usuário (placeholder)
     */
    showUserMenu() {
        const options = [
            'Perfil',
            'Configurações', 
            'Meus Personagens',
            'Sair'
        ];
        
        const choice = prompt('Escolha uma opção:\n' + options.map((opt, i) => `${i + 1}. ${opt}`).join('\n'));
        
        if (choice === '4') {
            this.logout();
        } else if (choice) {
            alert('🚧 Funcionalidade em desenvolvimento!');
        }
    }

    /**
     * Cria informações do usuário na UI (removido - sem exibição de mensagem)
     */
    createUserInfo() {
        // Método vazio - não exibe mais mensagem de boas-vindas
    }

    /**
     * Verifica se o usuário está autenticado
     */
    isUserAuthenticated() {
        return this.isAuthenticated;
    }

    /**
     * Obtém dados do usuário atual
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * Obtém token de autenticação
     */
    getAuthToken() {
        return this.token;
    }
}

// Criar instância global do sistema de autenticação
export const authSystem = new AuthSystem();

// Para compatibilidade com código não-modular
if (typeof window !== 'undefined') {
    window.authSystem = authSystem;
} 