/**
 * Arquivo principal da aplicação Forjador de Lendas
 * Importa e inicializa todos os módulos
 */

// Importações dos módulos core
import { characterStorage } from './core/storage.js';
import { hybridStorage } from './core/hybrid-storage.js';

// Importações dos módulos de lógica
import { 
  rollAllAttributes, 
  updateAttributeFields, 
  readAttributeFields 
} from './logic/attributes.js';

// Importações dos módulos de UI
import { 
  openModal, 
  closeModal, 
  showMessage, 
  setupModalCloseListeners 
} from './ui/modals.js';

// Importação do sistema de autenticação Supabase
import { supabaseAuth } from './core/supabase.js';

// Scripts legados serão carregados pelo HTML, não como modules
// import '../js/companion.js';
// import '../js/themeManager.js';
// import '../js/worldSelector.js';
// import '../js/worldManager.js';

/**
 * Classe principal da aplicação
 */
class ForjadorApp {
  constructor() {
    this.storage = hybridStorage; // Usando sistema híbrido (Supabase + Local)
    this.legacyStorage = characterStorage; // Backup do sistema local
    this.authSystem = supabaseAuth; // ⭐ MUDANÇA: Apenas Supabase Auth
    this.currentCharacterId = null;
    this.authListenersAdded = false;
    this.init();
  }

  /**
   * Inicializa a aplicação
   */
  async init() {
    this.setupEventListeners();
    this.setupAuthUI();
    await this.loadCharacters();
    this.setupModals();
    
    console.log('🧙‍♂️ Forjador de Lendas inicializado!');
  }

  /**
   * Configura os event listeners
   */
  setupEventListeners() {
    // Botão de rolar atributos
    const rollAttributesBtn = document.getElementById('rollAttributes');
    if (rollAttributesBtn) {
      rollAttributesBtn.addEventListener('click', () => this.rollAttributes());
    }

    // Botão de salvar personagem
    const saveCharacterBtn = document.getElementById('saveCharacter');
    if (saveCharacterBtn) {
      saveCharacterBtn.addEventListener('click', (e) => this.saveCharacter(e));
    }

    // Botão de limpar formulário
    const clearFormBtn = document.getElementById('clearForm');
    if (clearFormBtn) {
      clearFormBtn.addEventListener('click', () => this.clearForm());
    }

    // Botão de gerar história
    const generateLoreBtn = document.getElementById('generateLore');
    if (generateLoreBtn) {
      generateLoreBtn.addEventListener('click', () => this.generateCharacterLore());
    }
  }

  /**
   * Rola todos os atributos
   */
  rollAttributes() {
    const attributes = rollAllAttributes();
    updateAttributeFields(attributes);
    
    showMessage('Atributos rolados com sucesso!', 'is-success');
  }

  /**
   * Salva um personagem
   */
  async saveCharacter(e) {
    e.preventDefault();

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
    if (this.currentCharacterId) {
      characterData.id = this.currentCharacterId;
    }

    try {
      showMessage('Salvando personagem...', 'is-info');
      const savedCharacter = await this.storage.saveCharacter(characterData);
      
      if (this.currentCharacterId) {
        showMessage(`${savedCharacter.name} foi atualizado!`, 'is-success');
      } else {
        showMessage(`${savedCharacter.name} foi criado!`, 'is-success');
      }

      await this.loadCharacters();
      this.clearForm();
      
    } catch (error) {
      console.error('Erro ao salvar personagem:', error);
      showMessage('Erro ao salvar personagem!', 'is-danger');
    }
  }

  /**
   * Carrega e exibe a lista de personagens
   */
  async loadCharacters() {
    const savedCharactersList = document.getElementById('savedCharactersList');
    if (!savedCharactersList) return;

    try {
      const characters = await this.storage.getAllCharacters();
    const currentWorld = localStorage.getItem('selectedWorld') || 'dnd';
    
    // Filtrar por mundo atual
    const filteredCharacters = characters.filter(character => {
      if (!character.world && currentWorld === 'dnd') {
        return true;
      }
      return character.world === currentWorld;
    });

    if (filteredCharacters.length === 0) {
      savedCharactersList.innerHTML = '<p class="empty-list-message">Nenhum herói criado para este mundo ainda. Comece a forjar sua lenda!</p>';
      return;
    }

    savedCharactersList.innerHTML = '';
    filteredCharacters.forEach(character => {
      const characterCard = this.createCharacterCard(character);
      savedCharactersList.appendChild(characterCard);
    });
    } catch (error) {
      console.error('Erro ao carregar personagens:', error);
      savedCharactersList.innerHTML = '<p class="empty-list-message">Erro ao carregar personagens. Tente recarregar a página.</p>';
    }
  }

  /**
   * Cria um card de personagem
   */
  createCharacterCard(character) {
    const characterCard = document.createElement('div');
    characterCard.className = 'character-card';
    characterCard.dataset.id = character.id;
    
    const classIcons = this.getClassIcons();
    const classIcon = classIcons[character.class] || 'fa-user';
    
    characterCard.innerHTML = `
      <div class="has-text-centered mb-3">
        <div class="character-avatar">
          <i class="fas ${classIcon}"></i>
        </div>
      </div>
      <div class="has-text-centered">
        <p class="title is-5 medieval-title">${character.name}</p>
        <p class="subtitle is-6">${character.race} ${character.class}</p>
        <p class="is-size-7">${this.formatDate(character.createdAt)}</p>
      </div>
    `;
    
    characterCard.addEventListener('click', () => this.openCharacterModal(character.id));
    return characterCard;
  }

  /**
   * Abre o modal de detalhes do personagem
   */
  async openCharacterModal(characterId) {
    try {
      const character = await this.storage.getCharacterById(characterId);
    if (!character) {
      showMessage('Personagem não encontrado!', 'is-danger');
      return;
    }

    this.currentCharacterId = characterId;
    
    // Implementar modal de detalhes...
    showMessage(`Abrindo detalhes de ${character.name}`, 'is-info');
    } catch (error) {
      console.error('Erro ao abrir personagem:', error);
      showMessage('Erro ao carregar personagem!', 'is-danger');
    }
  }

  /**
   * Limpa o formulário
   */
  clearForm() {
    const form = document.querySelector('.character-form');
    if (form) {
      form.reset();
    }
    
    this.currentCharacterId = null;
    
    // Resetar botão de salvar
    const saveBtn = document.getElementById('saveCharacter');
    if (saveBtn) {
      saveBtn.innerHTML = '<i class="fas fa-save"></i>&nbsp; Salvar Personagem';
      saveBtn.classList.remove('is-warning');
    }
  }

  /**
   * Gera história do personagem (placeholder)
   */
  generateCharacterLore() {
    showMessage('Funcionalidade de geração de história em desenvolvimento!', 'is-info');
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
   * Retorna ícones das classes
   */
  getClassIcons() {
    return {
      'Guerreiro': 'fa-sword',
      'Mago': 'fa-hat-wizard',
      'Ladino': 'fa-mask',
      'Clérigo': 'fa-cross',
      'Ranger': 'fa-bow-arrow',
      'Bárbaro': 'fa-axe',
      'Bardo': 'fa-music',
      'Druida': 'fa-leaf',
      'Feiticeiro': 'fa-magic',
      'Paladino': 'fa-shield-alt',
      'Warlock': 'fa-fire',
      'Monge': 'fa-fist-raised'
    };
  }

  /**
   * Formata data para exibição
   */
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  }

  /**
   * Configura a UI de autenticação
   */
  setupAuthUI() {
    // Criar botão de autenticação se não existir
    this.createAuthButton();
    
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

  /**
   * Cria o botão de autenticação
   */
  createAuthButton() {
    // Verificar se já existe
    if (document.querySelector('.auth-button')) return;

    // Encontrar local para inserir o botão
    const worldSelector = document.querySelector('.world-selector');
    const container = document.querySelector('.container.is-fluid.main-container');
    
    if (!container) return;

    // Criar botão de autenticação





  /**
   * Executado quando usuário faz login via Supabase
   */
  onUserLogin(user) {
    // Extrair username do email ou metadata
    const username = user.user_metadata?.username || user.email?.split('@')[0] || 'Aventureiro';
    
    // Atualizar visual do botão
    const authButton = document.querySelector('.auth-button');
    if (authButton) {
      authButton.classList.add('user-logged');
      authButton.innerHTML = `
        <span class="icon">
          <i class="fas fa-user-circle"></i>
        </span>
        <span>${username}</span>
      `;
    }

    // Recarregar personagens com dados do usuário autenticado
    this.loadCharacters();

    // Mostrar mensagem de boas-vindas
    showMessage(`🏰 Bem-vindo ao Reino, ${username}!`, 'is-success');
  }

  /**
   * Mostra confirmação de logout
   */
  showLogoutConfirm() {
    const confirmed = confirm('Deseja realmente sair do Reino dos Aventureiros?');
    if (confirmed) {
      this.performLogout();
    }
  }

  /**
   * Executa logout via Supabase
   */
  async performLogout() {
    try {
      console.log('🚪 Realizando logout via Supabase...');
      const result = await this.authSystem.signOut();
      
      if (result.success) {
        console.log('✅ Logout Supabase bem-sucedido');
        showMessage('👋 Logout realizado com sucesso!', 'is-success');
      } else {
        console.error('❌ Erro no logout Supabase:', result.error);
        showMessage('❌ Erro ao fazer logout', 'is-danger');
      }
    } catch (error) {
      console.error('❌ Erro inesperado no logout:', error);
      showMessage('❌ Erro inesperado ao fazer logout', 'is-danger');
    }
  }

  /**
   * Executado quando usuário faz logout via Supabase
   */
  onUserLogout() {
    // Atualizar visual do botão
    const authButton = document.querySelector('.auth-button');
    if (authButton) {
      authButton.classList.remove('user-logged');
      authButton.innerHTML = `
        <span class="icon">
          <i class="fas fa-sign-in-alt"></i>
        </span>
        <span>Entrar</span>
      `;
    }

    // Mostrar mensagem de despedida
    showMessage('👋 Até logo, aventureiro!', 'is-info');
    
    // O redirecionamento será feito automaticamente pelo Supabase
  }
}

// Inicializar aplicação quando DOM estiver carregado
document.addEventListener('DOMContentLoaded', async () => {
  window.forjadorApp = new ForjadorApp();
  console.log('🚀 Aplicação híbrida Supabase+Local inicializada!');
}); 