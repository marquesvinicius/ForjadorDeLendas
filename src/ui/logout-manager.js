/**
 * Gerenciador de logout da aplicação
 */

import { supabaseAuth } from '../core/supabase.js';

export class LogoutManager {
    constructor() {
        this.logoutButton = document.getElementById('logoutButton');
        this.logoutModal = document.getElementById('logoutModal');
        this.confirmLogout = document.getElementById('confirmLogout');
        this.cancelLogout = document.getElementById('cancelLogout');
        this.closeLogoutModal = document.getElementById('closeLogoutModal');
        this.loadingModal = document.getElementById('logoutLoadingModal');
        
        this.setupEventListeners();
    }
    
    /**
     * Configura os event listeners
     */
    setupEventListeners() {
        // Event listeners principais
        if (this.logoutButton) this.logoutButton.addEventListener('click', () => this.showLogoutModal());
        if (this.confirmLogout) this.confirmLogout.addEventListener('click', () => this.performLogout());
        if (this.cancelLogout) this.cancelLogout.addEventListener('click', () => this.hideLogoutModal());
        if (this.closeLogoutModal) this.closeLogoutModal.addEventListener('click', () => this.hideLogoutModal());
        
        // ⭐ MODAL PERSISTENTE - NÃO FECHA AO CLICAR FORA
        // Removido event listener que fechava modal ao clicar no background
        
        // Fechar modal com ESC
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.logoutModal && this.logoutModal.classList.contains('is-active')) {
                this.hideLogoutModal();
            }
        });
    }
    
    /**
     * Mostra o modal de logout
     */
    showLogoutModal() {
        this.logoutModal.classList.add('is-active');
        document.body.classList.add('modal-open');
        
        // ⭐ BLOQUEAR INTERAÇÕES FORA DO MODAL
        this.blockBackgroundInteractions();
        
        // ⭐ FOCUS NO MODAL PARA ACESSIBILIDADE
        const modalContent = this.logoutModal.querySelector('.modal-card');
        if (modalContent) {
            modalContent.focus();
        }
        
        // ⭐ PREVENIR FECHAMENTO AO CLICAR FORA (MODAL PERSISTENTE)
        const modalBackground = this.logoutModal.querySelector('.modal-background');
        if (modalBackground) {
        }
    }
    
    /**
     * Esconde o modal de logout
     */
    hideLogoutModal() {
        this.logoutModal.classList.remove('is-active');
        document.body.classList.remove('modal-open');
        
        // ⭐ RESTAURAR INTERAÇÕES APÓS FECHAR MODAL
        this.unblockBackgroundInteractions();
    }

    /**
     * Mostra o modal de loading
     */
    showLoadingModal() {
        if (this.loadingModal) {
            this.loadingModal.classList.add('is-active');
            document.body.classList.add('modal-open');
        }
    }

    /**
     * Esconde o modal de loading
     */
    hideLoadingModal() {
        if (this.loadingModal) {
            this.loadingModal.classList.remove('is-active');
            document.body.classList.remove('modal-open');
        }
    }

    /**
     * Bloqueia interações com o conteúdo de fundo
     */
    blockBackgroundInteractions() {
        // Adicionar classe para bloquear interações
        document.body.classList.add('modal-background-blocked');
        
        // Bloquear scroll do body
        document.body.style.overflow = 'hidden';
        
        // Bloquear interações com elementos fora do modal
        const elements = document.querySelectorAll('body > *:not(.modal)');
        elements.forEach(element => {
            if (!element.classList.contains('modal')) {
                element.style.pointerEvents = 'none';
                element.setAttribute('aria-hidden', 'true');
            }
        });
    }

    /**
     * Restaura interações com o conteúdo de fundo
     */
    unblockBackgroundInteractions() {
        // Remover classe de bloqueio
        document.body.classList.remove('modal-background-blocked');
        
        // Restaurar scroll do body
        document.body.style.overflow = '';
        
        // Restaurar interações com elementos
        const elements = document.querySelectorAll('body > *');
        elements.forEach(element => {
            element.style.pointerEvents = '';
            element.removeAttribute('aria-hidden');
        });
    }
    
    /**
     * Executa o logout com feedback instantâneo
     */
    async performLogout() {
        try {
            console.log('🚪 Iniciando processo de logout...');
            
            // ⭐ FEEDBACK INSTANTÂNEO - Mostrar loading imediatamente
            this.showLoadingModal();
            
            // Fechar modal de confirmação
            this.hideLogoutModal();
            
            // ⭐ VALIDAÇÕES EM BACKGROUND
            // Aguardar um pequeno delay para garantir que o loading seja exibido
            await new Promise(resolve => setTimeout(resolve, 100));
            
            console.log('🚪 Fazendo logout via Supabase...');
            
            // ⭐ LOGOUT EXCLUSIVAMENTE VIA SUPABASE
            const result = await supabaseAuth.signOut();
            console.log('✅ Logout Supabase realizado:', result);
            
            // ⭐ MARCAR QUE É UM LOGOUT PARA A TELA DE LOGIN
            sessionStorage.setItem('logout_redirect', 'true');
            
            // ⭐ NÃO LIMPAR localStorage MANUALMENTE - Deixar o Supabase controlar
            // ⭐ NÃO FORÇAR REDIRECIONAMENTO - Deixar o Supabase callback controlar
            
            if (!result.success) {
                console.error('❌ Falha no logout Supabase:', result.error);
                // Apenas em caso de falha, tentar redirecionamento manual
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            }
            
        } catch (error) {
            console.error('❌ Erro no logout:', error);
            this.hideLoadingModal();
            // Fallback apenas em caso de erro crítico
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        }
    }
} 