/**
 * Arquivo principal da aplicação Forjador de Lendas
 * Importa e inicializa todos os módulos
 */

// Importações dos módulos core
import { characterStorage } from './core/storage.js';

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

// Importações dos módulos existentes (mantendo compatibilidade)
import '../js/companion.js';
import '../js/themeManager.js';
import '../js/worldSelector.js';
import '../js/worldManager.js';

/**
 * Classe principal da aplicação
 */
class ForjadorApp {
  constructor() {
    this.storage = characterStorage;
    this.currentCharacterId = null;
    this.init();
  }

  /**
   * Inicializa a aplicação
   */
  init() {
    this.setupEventListeners();
    this.loadCharacters();
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
  saveCharacter(e) {
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
      const savedCharacter = this.storage.saveCharacter(characterData);
      
      if (this.currentCharacterId) {
        showMessage(`${savedCharacter.name} foi atualizado!`, 'is-success');
      } else {
        showMessage(`${savedCharacter.name} foi criado!`, 'is-success');
      }

      this.loadCharacters();
      this.clearForm();
      
    } catch (error) {
      console.error('Erro ao salvar personagem:', error);
      showMessage('Erro ao salvar personagem!', 'is-danger');
    }
  }

  /**
   * Carrega e exibe a lista de personagens
   */
  loadCharacters() {
    const savedCharactersList = document.getElementById('savedCharactersList');
    if (!savedCharactersList) return;

    const characters = this.storage.getAllCharacters();
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
  openCharacterModal(characterId) {
    const character = this.storage.getCharacterById(characterId);
    if (!character) {
      showMessage('Personagem não encontrado!', 'is-danger');
      return;
    }

    this.currentCharacterId = characterId;
    
    // Implementar modal de detalhes...
    showMessage(`Abrindo detalhes de ${character.name}`, 'is-info');
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
}

// Inicializar aplicação quando DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  window.forjadorApp = new ForjadorApp();
}); 