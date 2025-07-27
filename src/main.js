/**
 * Arquivo principal da aplicação Forjador de Lendas
 * Importa e inicializa todos os módulos
 */

// Importações dos módulos core
import { supabaseOnlyStorage } from './core/hybrid-storage.js';
import { initWorldManager } from './logic/worldManager.js';
import { supabaseAuth } from './core/supabase.js';
import { companionEvents } from './core/companionBridge.js';

// Importações dos módulos de lógica
import { 
  rollAllAttributes, 
  updateAttributeFields, 
  readAttributeFields 
} from './logic/attributes.js';

import { generateCharacterLore } from './logic/loreGeneration.js';

// Importações dos módulos de UI
import { 
  openModal, 
  closeModal, 
  showMessage, 
  setupModalCloseListeners 
} from './ui/modals.js';

import { renderCharactersList, highlightNewCard } from './ui/characterCards.js';
import { openCharacterModal, getCurrentCharacterId, setCurrentCharacterId } from './ui/characterModal.js';
import { MagoCompanion } from './ui/companion.js';

/**
 * Classe principal da aplicação
 */
class ForjadorApp {
  constructor() {
    this.storage = supabaseOnlyStorage; // Usando apenas Supabase
    this.authSystem = supabaseAuth;
    this.currentCharacterId = null;
    this.authListenersAdded = false;
    this.storageReady = false;
    
    // Inicializar o Mago Companion
    this.magoCompanion = new MagoCompanion();
    window.magoCompanion = this.magoCompanion;
    
    this.init();
  }

  /**
   * Inicializa a aplicação
   */
  async init() {
    // Aguardar um pouco para garantir que o DOM esteja completamente carregado
    await this.waitForElements();
    
    this.setupEventListeners();
    this.setupAuthUI();
    
    // Aguardar que o storage esteja pronto
    await this.waitForStorage();
    
    // Aguardar a verificação inicial da sessão antes de carregar personagens
    await this.waitForAuthCheck();
    
    await this.loadCharacters();
    this.setupModals();
  }

  /**
   * Aguarda que o storage esteja pronto
   */
  async waitForStorage() {
    return new Promise((resolve) => {
      let resolved = false;
      const resolveOnce = (reason) => {
        if (!resolved) {
          resolved = true;
          resolve();
        }
      };

      // Verificar se o storage já está pronto
      const checkStorage = () => {
        if (this.storage && this.storage.isOnline !== undefined) {
          this.storageReady = true;
          resolveOnce('storage inicializado');
          return true;
        }
        return false;
      };

      // Se já está pronto, resolver imediatamente
      if (checkStorage()) return;

      // Verificar periodicamente (a cada 50ms por até 2 segundos)
      let attempts = 0;
      const maxAttempts = 40;
      const checkInterval = setInterval(() => {
        attempts++;
        if (checkStorage() || attempts >= maxAttempts) {
          clearInterval(checkInterval);
          clearTimeout(timeoutId);
          if (attempts >= maxAttempts) {
            resolveOnce('timeout');
          }
        }
      }, 50);

      // Timeout de segurança (2 segundos)
      const timeoutId = setTimeout(() => {
        clearInterval(checkInterval);
        resolveOnce('timeout de segurança');
      }, 2000);
    });
  }

  /**
   * Aguarda a verificação inicial da autenticação
   */
  async waitForAuthCheck() {
    return new Promise((resolve) => {
      let resolved = false;
      const resolveOnce = (reason) => {
        if (!resolved) {
          resolved = true;
          console.log('🔐 Main: Verificação de auth concluída:', reason);
          resolve();
        }
      };

      // Verificar imediatamente se já há usuário
      const checkCurrentUser = () => {
        // Verificar múltiplas fontes de autenticação
        const supabaseUser = this.authSystem?.getCurrentUser();
        const storageUser = this.storage?.authService?.getCurrentUser();
        
        if (supabaseUser || storageUser) {
          console.log('✅ Main: Usuário autenticado encontrado');
          resolveOnce('usuário já autenticado');
          return true;
        }
        return false;
      };

      // Se já tem usuário, resolver imediatamente
      if (checkCurrentUser()) return;

      // Handlers para eventos
      const authHandler = () => {
        document.removeEventListener('supabaseSignIn', authHandler);
        clearTimeout(timeoutId);
        resolveOnce('evento supabaseSignIn');
      };

      // Escutar evento de login
      document.addEventListener('supabaseSignIn', authHandler);

      // Verificar periodicamente (a cada 100ms por até 3 segundos)
      let attempts = 0;
      const maxAttempts = 30;
      const checkInterval = setInterval(() => {
        attempts++;
        if (checkCurrentUser() || attempts >= maxAttempts) {
          clearInterval(checkInterval);
          clearTimeout(timeoutId);
          document.removeEventListener('supabaseSignIn', authHandler);
          if (attempts >= maxAttempts) {
            console.warn('⚠️ Main: Timeout na verificação de auth');
            resolveOnce('timeout após verificações periódicas');
          }
        }
      }, 100);

      // Timeout de segurança final (3 segundos)
      const timeoutId = setTimeout(() => {
        clearInterval(checkInterval);
        document.removeEventListener('supabaseSignIn', authHandler);
        console.warn('⚠️ Main: Timeout de segurança na verificação de auth');
        resolveOnce('timeout de segurança');
      }, 3000);
    });
  }

  /**
   * Aguarda os elementos essenciais estarem disponíveis
   */
  async waitForElements() {
    const requiredElements = [
      'rollAttributes',
      'saveCharacter', 
      'clearForm',
      'generateLore'
    ];
    
    return new Promise((resolve) => {
      const checkElements = () => {
        const missingElements = requiredElements.filter(id => !document.getElementById(id));
        
        if (missingElements.length === 0) {
          resolve();
        } else {
          setTimeout(checkElements, 100);
        }
      };
      
      checkElements();
    });
  }

  /**
   * Configura os event listeners
   */
  setupEventListeners() {
    // Botão de rolar atributos
    const rollAttributesBtn = document.getElementById('rollAttributes');
    if (rollAttributesBtn) {
      rollAttributesBtn.addEventListener('click', () => {
        this.rollAttributes();
      });
    } else {
      console.error('❌ Botão rollAttributes não encontrado!');
    }

    // Botão de salvar personagem
    const saveCharacterBtn = document.getElementById('saveCharacter');
    if (saveCharacterBtn) {
      saveCharacterBtn.addEventListener('click', (e) => {
        this.saveCharacter(e);
      });
    } else {
      console.error('❌ Botão saveCharacter não encontrado!');
    }

    // Botão de limpar formulário
    const clearFormBtn = document.getElementById('clearForm');
    if (clearFormBtn) {
      clearFormBtn.addEventListener('click', () => {
        this.clearForm();
      });
    } else {
      console.error('❌ Botão clearForm não encontrado!');
    }

    // Botão de gerar história
    const generateLoreBtn = document.getElementById('generateLore');
    if (generateLoreBtn) {
      generateLoreBtn.addEventListener('click', () => {
        this.generateCharacterLore();
      });
    } else {
      console.error('❌ Botão generateLore não encontrado!');
    }

    // Evento de exclusão de personagem
    document.addEventListener('characterDeleted', () => this.loadCharacters());
    
    // Teste adicional: adicionar listeners diretamente nos elementos
    this.addDirectListeners();
  }

  /**
   * Adiciona listeners diretos como fallback
   */
  addDirectListeners() {
    // Tentar adicionar listeners diretamente
    const buttons = document.querySelectorAll('#rollAttributes, #saveCharacter, #clearForm, #generateLore');
    
    buttons.forEach(button => {
      // Remover listeners existentes para evitar duplicação
      const newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);
      
      newButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        switch(newButton.id) {
          case 'rollAttributes':
            this.rollAttributes();
            break;
          case 'saveCharacter':
            this.saveCharacter(e);
            break;
          case 'clearForm':
            this.clearForm();
            break;
          case 'generateLore':
            this.generateCharacterLore();
            break;
        }
      });
    });
  }

  /**
   * Rola todos os atributos
   */
  rollAttributes() {
    try {
      const attributes = rollAllAttributes();
      updateAttributeFields(attributes);
      
      showMessage('Atributos rolados com sucesso!', 'is-success');
    } catch (error) {
      console.error('❌ Erro ao rolar atributos:', error);
      showMessage('Erro ao rolar atributos!', 'is-danger');
    }
  }

  /**
   * Salva um personagem
   */
  async saveCharacter(e) {
    e.preventDefault();

    // Verificar se o usuário está autenticado
    if (!this.authSystem.isAuthenticated()) {
      showMessage('Faça login para salvar personagens!', 'is-warning');
      return;
    }

    // Ler dados do formulário
    const characterData = {
      name: document.getElementById('charName')?.value || '',
      race: document.getElementById('charRace')?.value || '',
      class: document.getElementById('charClass')?.value || '',
      alignment: document.getElementById('charAlignment')?.value || '',
      attributes: readAttributeFields(),
      background: document.getElementById('charBackground')?.value || '',
      world: localStorage.getItem('selectedWorld') || 'dnd'
    };

    // Validar dados básicos
    if (!characterData.name.trim()) {
      showMessage('Nome do personagem é obrigatório!', 'is-danger');
      return;
    }

    // Se estamos editando, manter o ID
    const currentCharacterId = getCurrentCharacterId();
    if (currentCharacterId) {
      characterData.id = currentCharacterId;
    }

    try {
      showMessage('Salvando personagem...', 'is-info');
      const savedCharacter = await this.storage.saveCharacter(characterData);
      
      if (currentCharacterId) {
        showMessage(`${savedCharacter.name} foi atualizado!`, 'is-success');
        companionEvents.onCharacterUpdate(savedCharacter.name);
      } else {
        showMessage(`${savedCharacter.name} foi criado!`, 'is-success');
        companionEvents.onCharacterSave(savedCharacter.name);
      }

      await this.loadCharacters();
      this.clearForm();

      // Destacar novo card
      if (!currentCharacterId) {
        const container = document.getElementById('savedCharactersList');
        highlightNewCard(savedCharacter.id, container);
      }
      
    } catch (error) {
      console.error('Erro ao salvar personagem:', error);
      showMessage(error.message || 'Erro ao salvar personagem!', 'is-danger');
    }
  }

  /**
   * Carrega e exibe a lista de personagens
   */
  async loadCharacters() {
    const savedCharactersList = document.getElementById('savedCharactersList');
    if (!savedCharactersList) return;

    // Verifique se o usuário está autenticado
    if (!this.authSystem.isAuthenticated()) {
      savedCharactersList.innerHTML = '<p class="empty-list-message">Faça login para ver seus personagens.</p>';
      return;
    }

    try {
      const currentWorld = localStorage.getItem('selectedWorld') || 'dnd';
      const characters = await this.storage.getAllCharacters(currentWorld);
      renderCharactersList(characters, savedCharactersList);
    } catch (error) {
      console.error('Erro ao carregar personagens:', error);
      const errorMessage = error.message || 'Erro ao carregar personagens. Tente recarregar a página.';
      savedCharactersList.innerHTML = `<p class="empty-list-message">${errorMessage}</p>`;
    }
  }

  /**
   * Limpa o formulário
   */
  clearForm() {
    const form = document.querySelector('#characterForm');
    if (form) {
      form.reset();
    }
    // Limpar manualmente a textarea de história de fundo
    const backgroundTextarea = document.getElementById('charBackground');
    if (backgroundTextarea) {
      backgroundTextarea.value = '';
    }
    
    setCurrentCharacterId(null);
    
    // Resetar botão de salvar
    const saveBtn = document.getElementById('saveCharacter');
    if (saveBtn) {
      saveBtn.innerHTML = '<i class="fas fa-save"></i>&nbsp; Salvar Personagem';
      saveBtn.classList.remove('is-warning');
    }
  }

  /**
   * Gera história do personagem
   */
  async generateCharacterLore() {
    const backgroundTextArea = document.getElementById('charBackground');
    const currentCharacterId = getCurrentCharacterId();

    let characterData;
    if (currentCharacterId) {
      try {
        characterData = await this.storage.getCharacterById(currentCharacterId);
      } catch (error) {
        console.error('Erro ao buscar personagem:', error);
        showMessage('Erro ao buscar dados do personagem!', 'is-danger');
        return;
      }
    } else {
      characterData = {
        name: document.getElementById('charName').value,
        race: document.getElementById('charRace').value,
        class: document.getElementById('charClass').value,
        alignment: document.getElementById('charAlignment').value,
        attributes: {
          strength: parseInt(document.getElementById('attrStr').value),
          dexterity: parseInt(document.getElementById('attrDex').value),
          constitution: parseInt(document.getElementById('attrCon').value),
          intelligence: parseInt(document.getElementById('attrInt').value),
          wisdom: parseInt(document.getElementById('attrWis').value),
          charisma: parseInt(document.getElementById('attrCha').value)
        },
        background: backgroundTextArea.value
      };
    }

    await generateCharacterLore(characterData, backgroundTextArea, this.storage, currentCharacterId);
  }

  /**
   * Configura os modais
   */
  setupModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
      setupModalCloseListeners(modal);
    });
  }

  /**
   * Configura a UI de autenticação
   */
  setupAuthUI() {
    // Configurar listeners de eventos Supabase (apenas uma vez)
    if (!this.authListenersAdded) {
      document.addEventListener('supabaseSignIn', (e) => {
        this.onUserLogin(e.detail.user);
      });

      document.addEventListener('supabaseSignOut', () => {
        this.onUserLogout();
      });
      
      this.authListenersAdded = true;
    }
  }

  onUserLogin(user) {
    this.loadCharacters();
  }

  onUserLogout() {
    this.loadCharacters(); // Vai mostrar mensagem de login
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initWorldManager();
  window.forjadorAppInstance = new ForjadorApp();
});

document.addEventListener('worldChanged', () => {
  if (window.forjadorAppInstance) {
    window.forjadorAppInstance.loadCharacters();
  }
});
