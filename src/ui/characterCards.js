/**
 * Módulo responsável pela renderização e interação com cards de personagem
 */

import { openCharacterModal } from './characterModal.js';
import { showMessage } from './notifications.js';
import { getCurrentClassIcons } from '../logic/worldManager.js';

/**
 * Renderiza a lista de personagens
 * @param {Array} characters - Lista de personagens
 * @param {HTMLElement} container - Container onde os cards serão renderizados
 */
export function renderCharactersList(characters, container) {
    if (!container) return;

    const currentWorld = localStorage.getItem('selectedWorld') || 'dnd';
    const filteredCharacters = characters.filter(char => char.world === currentWorld);

    if (filteredCharacters.length === 0) {
        container.innerHTML = '<p class="empty-list-message">Nenhum herói criado para este mundo ainda. Comece a forjar sua lenda!</p>';
        return;
    }

    container.innerHTML = '';
    filteredCharacters.forEach(character => {
        const characterCard = createCharacterCard(character);
        container.appendChild(characterCard);
    });
}

/**
 * Cria um card de personagem
 * @param {Object} character - Dados do personagem
 * @returns {HTMLElement} Card do personagem
 */
function createCharacterCard(character) {
    const characterCard = document.createElement('div');
    characterCard.className = 'character-card';
    characterCard.dataset.id = character.id;
    
    const classIcons = getCurrentClassIcons();
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
            <p class="is-size-7">${formatDate(character.createdAt)}</p>
        </div>
    `;
    
    characterCard.addEventListener('click', () => {
        // Buscar o modal e storage da instância principal
        const modal = document.getElementById('characterModal');
        const storage = window.forjadorAppInstance?.storage;
        
        if (!modal) {
            console.error('Modal de personagem não encontrado!');
            showMessage('Erro: Modal não encontrado!', 'is-danger');
            return;
        }
        
        if (!storage) {
            console.error('Storage não encontrado!');
            showMessage('Erro: Sistema de armazenamento não disponível!', 'is-danger');
            return;
        }
        
        openCharacterModal(character.id, storage, modal);
    });
    
    return characterCard;
}

/**
 * Formata uma data para exibição
 * @param {string} dateString - Data em formato string
 * @returns {string} Data formatada
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

/**
 * Destaca um card recém-criado
 * @param {string} characterId - ID do personagem
 * @param {HTMLElement} container - Container dos cards
 */
export function highlightNewCard(characterId, container) {
    setTimeout(() => {
        const newCard = container.querySelector(`.character-card[data-id="${characterId}"]`);
        if (newCard) {
            newCard.classList.add('new-character-highlight');
            newCard.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
            setTimeout(() => {
                newCard.classList.remove('new-character-highlight');
            }, 2500);
        }
    }, 100);
} 