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
        
        // Fechar modal ao clicar no background
        if (this.logoutModal) {
            const modalBackground = this.logoutModal.querySelector('.modal-background');
            if (modalBackground) {
                modalBackground.addEventListener('click', () => this.hideLogoutModal());
            }
        }
        
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
    }
    
    /**
     * Esconde o modal de logout
     */
    hideLogoutModal() {
        this.logoutModal.classList.remove('is-active');
    }
    
    /**
     * Executa o logout
     */
    async performLogout() {
        try {
            console.log('🚪 Fazendo logout via Supabase...');
            
            // Fechar modal antes do logout
            this.hideLogoutModal();
            
            // ⭐ LOGOUT EXCLUSIVAMENTE VIA SUPABASE
            const result = await supabaseAuth.signOut();
            console.log('✅ Logout Supabase realizado:', result);
            
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
            this.hideLogoutModal();
            // Fallback apenas em caso de erro crítico
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        }
    }
} 