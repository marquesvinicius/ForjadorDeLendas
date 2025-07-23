/**
 * Arquivo principal da aplicação Forjador de Lendas
 * Importa e inicializa todos os módulos
 */

console.log('📦 Carregando módulos...');

// Importações dos módulos core
import { supabaseOnlyStorage } from './core/hybrid-storage.js';
import { initWorldManager } from './logic/worldManager.js';
import { supabaseAuth } from './core/supabase.js';
import { companionEvents } from './core/companionBridge.js';

console.log('✅ Módulos core carregados');

// Importações dos módulos de lógica
import { 
  rollAllAttributes, 
  updateAttributeFields, 
  readAttributeFields 
} from './logic/attributes.js';

import { generateCharacterLore } from './logic/loreGeneration.js';

console.log('✅ Módulos de lógica carregados');

// Importações dos módulos de UI
import { 
  openModal, 
  closeModal, 
  showMessage, 
  setupModalCloseListeners 
} from './ui/modals.js';

import { renderCharactersList, highlightNewCard } from './ui/characterCards.js';
import { openCharacterModal, getCurrentCharacterId, setCurrentCharacterId } from './ui/characterModal.js';

console.log('✅ Módulos de UI carregados');

/**
 * Classe principal da aplicação
 */
class ForjadorApp {
  constructor() {
    this.storage = supabaseOnlyStorage; // Usando apenas Supabase
    this.authSystem = supabaseAuth;
    this.currentCharacterId = null;
    this.authListenersAdded = false;
    this.init();
  }

  /**
   * Inicializa a aplicação
   */
  async init() {
    console.log('🧙‍♂️ Inicializando ForjadorApp...');
    
    // Aguardar um pouco para garantir que o DOM esteja completamente carregado
    await this.waitForElements();
    
    this.setupEventListeners();
    this.setupAuthUI();
    await this.loadCharacters();
    this.setupModals();
    
    console.log('🧙‍♂️ Forjador de Lendas inicializado!');
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
    
    console.log('⏳ Aguardando elementos essenciais...');
    
    return new Promise((resolve) => {
      const checkElements = () => {
        const missingElements = requiredElements.filter(id => !document.getElementById(id));
        
        if (missingElements.length === 0) {
          console.log('✅ Todos os elementos encontrados!');
          resolve();
        } else {
          console.log('⏳ Elementos faltando:', missingElements);
          console.log('🔍 Tentando novamente em 100ms...');
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
    console.log('🔍 Configurando event listeners...');
    
    // Botão de rolar atributos
    const rollAttributesBtn = document.getElementById('rollAttributes');
    console.log('🎲 Botão rollAttributes:', rollAttributesBtn);
    if (rollAttributesBtn) {
      rollAttributesBtn.addEventListener('click', () => {
        console.log('🎲 Botão rollAttributes clicado!');
        this.rollAttributes();
      });
      console.log('✅ Event listener adicionado: rollAttributes');
    } else {
      console.error('❌ Botão rollAttributes não encontrado!');
    }

    // Botão de salvar personagem
    const saveCharacterBtn = document.getElementById('saveCharacter');
    console.log('💾 Botão saveCharacter:', saveCharacterBtn);
    if (saveCharacterBtn) {
      saveCharacterBtn.addEventListener('click', (e) => {
        console.log('💾 Botão saveCharacter clicado!');
        this.saveCharacter(e);
      });
      console.log('✅ Event listener adicionado: saveCharacter');
    } else {
      console.error('❌ Botão saveCharacter não encontrado!');
    }

    // Botão de limpar formulário
    const clearFormBtn = document.getElementById('clearForm');
    console.log('🧹 Botão clearForm:', clearFormBtn);
    if (clearFormBtn) {
      clearFormBtn.addEventListener('click', () => {
        console.log('🧹 Botão clearForm clicado!');
        this.clearForm();
      });
      console.log('✅ Event listener adicionado: clearForm');
    } else {
      console.error('❌ Botão clearForm não encontrado!');
    }

    // Botão de gerar história
    const generateLoreBtn = document.getElementById('generateLore');
    console.log('📖 Botão generateLore:', generateLoreBtn);
    if (generateLoreBtn) {
      generateLoreBtn.addEventListener('click', () => {
        console.log('📖 Botão generateLore clicado!');
        this.generateCharacterLore();
      });
      console.log('✅ Event listener adicionado: generateLore');
    } else {
      console.error('❌ Botão generateLore não encontrado!');
    }

    // Evento de exclusão de personagem
    document.addEventListener('characterDeleted', () => this.loadCharacters());
    console.log('✅ Event listener adicionado: characterDeleted');
    
    // Teste adicional: adicionar listeners diretamente nos elementos
    this.addDirectListeners();
  }

  /**
   * Adiciona listeners diretos como fallback
   */
  addDirectListeners() {
    console.log('🔄 Adicionando listeners diretos como fallback...');
    
    // Tentar adicionar listeners diretamente
    const buttons = document.querySelectorAll('#rollAttributes, #saveCharacter, #clearForm, #generateLore');
    console.log('🔍 Botões encontrados:', buttons.length);
    
    buttons.forEach(button => {
      console.log('🔗 Adicionando listener direto para:', button.id);
      
      // Remover listeners existentes para evitar duplicação
      const newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);
      
      newButton.addEventListener('click', (e) => {
        console.log('🎯 Clique direto detectado em:', newButton.id);
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
    console.log('🎲 Função rollAttributes chamada!');
    try {
      const attributes = rollAllAttributes();
      updateAttributeFields(attributes);
      
      showMessage('Atributos rolados com sucesso!', 'is-success');
      console.log('✅ Atributos rolados:', attributes);
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
        console.log('🎉 ForjadorApp: Usuário logado via Supabase:', e.detail.user.email);
        this.onUserLogin(e.detail.user);
      });

      document.addEventListener('supabaseSignOut', () => {
        console.log('👋 ForjadorApp: Usuário deslogado via Supabase');
        this.onUserLogout();
      });
      
      this.authListenersAdded = true;
      console.log('✅ Supabase listeners do ForjadorApp registrados');
    }
  }

  onUserLogin(user) {
    console.log('✅ Usuário autenticado:', user.email);
    this.loadCharacters();
  }

  onUserLogout() {
    console.log('👋 Usuário deslogado');
    this.loadCharacters(); // Vai mostrar mensagem de login
  }
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 DOM carregado, inicializando ForjadorApp...');
  
  // Teste simples para verificar se os elementos existem
  const testElements = ['rollAttributes', 'saveCharacter', 'clearForm', 'generateLore'];
  testElements.forEach(id => {
    const element = document.getElementById(id);
    console.log(`🔍 Teste elemento ${id}:`, element ? '✅ Encontrado' : '❌ Não encontrado');
  });
  
  // Teste adicional: verificar se os elementos estão no DOM
  console.log('🔍 Verificando estrutura do DOM...');
  const characterPanel = document.querySelector('.character-panel');
  console.log('📦 Character panel:', characterPanel);
  
  if (characterPanel) {
    const buttons = characterPanel.querySelectorAll('button');
    console.log('🔘 Botões encontrados no character-panel:', buttons.length);
    buttons.forEach(btn => {
      console.log('  -', btn.id, btn.textContent.trim());
    });
  }
  
  initWorldManager();
  window.forjadorAppInstance = new ForjadorApp();
  console.log('✅ ForjadorApp inicializado:', window.forjadorAppInstance);
});

document.addEventListener('worldChanged', () => {
  console.log('🌍 Mundo alterado, recarregando personagens...');
  if (window.forjadorAppInstance) {
    window.forjadorAppInstance.loadCharacters();
  }
});
