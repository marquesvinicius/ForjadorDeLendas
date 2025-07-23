/**
 * Módulo responsável pelo modal de detalhes do personagem
 */

import { openModal, closeModal } from './modals.js';
import { showMessage } from './notifications.js';
import { getCurrentClassIcons } from '../logic/worldManager.js';
import { getCompanion } from '../core/companionBridge.js';

let currentCharacterId = null;

const worldDisplayNames = {
    'dnd': 'D&D 5e',
    'tormenta': 'Tormenta 20',
    'ordem-paranormal': 'Ordem Paranormal'
};

/**
 * Abre o modal com detalhes do personagem
 * @param {string} characterId - ID do personagem
 * @param {Object} storage - Instância do storage
 * @param {HTMLElement} modal - Elemento do modal
 */
export async function openCharacterModal(characterId, storage, modal) {
    try {
        const character = await storage.getCharacterById(characterId);
        if (!character) {
            console.error('Personagem não encontrado:', characterId);
            showMessage('Personagem não encontrado!', 'is-danger');
            return;
        }

        currentCharacterId = characterId;

        const characterWorldId = character.world || 'dnd';
        const characterWorldName = worldDisplayNames[characterWorldId] || characterWorldId;

        const characterDetails = modal.querySelector('#characterDetails');
        characterDetails.innerHTML = `
            <div class="columns is-multiline">
                <div class="column is-8">
                    <h3 class="title is-3 medieval-title">${character.name}</h3>
                    <p class="subtitle is-5">${character.race} ${character.class} (${character.alignment})</p>
                    <p class="subtitle is-6 world-info"><i class="fas fa-globe-americas"></i> Mundo: ${characterWorldName}</p>
                    <div class="content mt-4">
                        <h4 class="title is-5 medieval-title">Atributos</h4>
                        <div class="columns is-multiline">
                            <div class="column is-6">
                                <p><strong>Força:</strong> ${character.attributes.strength}</p>
                                <p><strong>Destreza:</strong> ${character.attributes.dexterity}</p>
                                <p><strong>Constituição:</strong> ${character.attributes.constitution}</p>
                            </div>
                            <div class="column is-6">
                                <p><strong>Inteligência:</strong> ${character.attributes.intelligence}</p>
                                <p><strong>Sabedoria:</strong> ${character.attributes.wisdom}</p>
                                <p><strong>Carisma:</strong> ${character.attributes.charisma}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="column is-4 has-text-centered">
                    <div class="character-avatar" style="width: 120px; height: 120px; margin: 0 auto;">
                        <i class="fas ${getCurrentClassIcons()[character.class] || 'fa-user'}" style="font-size: 4rem;"></i>
                    </div>
                    <p class="is-size-7 mt-3">Criado em ${formatDate(character.createdAt)}</p>
                </div>
                ${character.background ? `
                    <div class="column is-12">
                        <div class="content mt-4">
                            <h4 class="title is-5 medieval-title">História de Fundo</h4>
                            <p>${character.background}</p>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;

        setupModalButtons(modal, storage);
        openModal(modal);
        
    } catch (error) {
        console.error('Erro ao carregar personagem:', error);
        showMessage(error.message || 'Erro ao carregar personagem!', 'is-danger');
    }
}

/**
 * Configura os botões do modal
 * @param {HTMLElement} modal - Elemento do modal
 * @param {Object} storage - Instância do storage
 */
function setupModalButtons(modal, storage) {
    const editBtn = modal.querySelector('#editCharacter');
    const deleteBtn = modal.querySelector('#deleteCharacter');
    const closeBtn = modal.querySelector('#closeModal');

    // Remove event listeners antigos
    editBtn.replaceWith(editBtn.cloneNode(true));
    deleteBtn.replaceWith(deleteBtn.cloneNode(true));
    closeBtn.replaceWith(closeBtn.cloneNode(true));

    // Adiciona novos event listeners
    modal.querySelector('#editCharacter').addEventListener('click', () => editCharacter(storage, modal));
    modal.querySelector('#deleteCharacter').addEventListener('click', () => deleteCharacter(storage, modal));
    modal.querySelector('#closeModal').addEventListener('click', () => closeModal(modal));
}

/**
 * Edita um personagem
 * @param {Object} storage - Instância do storage
 * @param {HTMLElement} modal - Elemento do modal
 */
async function editCharacter(storage, modal) {
    if (!currentCharacterId) return;

    try {
        const character = await storage.getCharacterById(currentCharacterId);
        if (!character) {
            showMessage('Personagem não encontrado.', 'is-danger');
            return;
        }

        // Preenche o formulário
        document.getElementById('charName').value = character.name;
        document.getElementById('charRace').value = character.race;
        document.getElementById('charClass').value = character.class;
        document.getElementById('charAlignment').value = character.alignment;
        document.getElementById('attrStr').value = character.attributes.strength;
        document.getElementById('attrDex').value = character.attributes.dexterity;
        document.getElementById('attrCon').value = character.attributes.constitution;
        document.getElementById('attrInt').value = character.attributes.intelligence;
        document.getElementById('attrWis').value = character.attributes.wisdom;
        document.getElementById('attrCha').value = character.attributes.charisma;
        document.getElementById('charBackground').value = character.background || '';

        // Atualiza o botão de salvar
        const saveBtn = document.getElementById('saveCharacter');
        saveBtn.innerHTML = '<i class="fas fa-save"></i>&nbsp; Atualizar Personagem';
        saveBtn.classList.add('is-warning');
        saveBtn.style.color = 'white';

        closeModal(modal);
        showMessage('Editando personagem: ' + character.name, 'is-info');
        
        const companion = getCompanion();
        if (companion) companion.reactToCharacterEdit(character.name);
        
    } catch (error) {
        console.error('Erro ao buscar personagem para edição:', error);
        showMessage(error.message || 'Erro ao carregar dados do personagem!', 'is-danger');
    }
}

/**
 * Deleta um personagem
 * @param {Object} storage - Instância do storage
 * @param {HTMLElement} modal - Elemento do modal
 */
async function deleteCharacter(storage, modal) {
    if (!currentCharacterId) return;

    if (confirm('Tem certeza que deseja excluir este personagem? Esta ação não pode ser desfeita.')) {
        try {
            const character = await storage.getCharacterById(currentCharacterId);
            if (!character) {
                showMessage('Personagem não encontrado.', 'is-danger');
                return;
            }

            const success = await storage.deleteCharacter(currentCharacterId);

            if (success) {
                closeModal(modal);
                showMessage(`Personagem ${character.name} excluído com sucesso!`, 'is-warning');
                
                const companion = getCompanion();
                if (companion) companion.reactToCharacterDelete(character.name);

                currentCharacterId = null;
                
                // Dispara evento para atualizar a lista
                document.dispatchEvent(new CustomEvent('characterDeleted'));
            } else {
                showMessage('Erro ao excluir personagem.', 'is-danger');
            }
            
        } catch (error) {
            console.error('Erro ao deletar personagem:', error);
            showMessage(error.message || 'Erro ao excluir personagem!', 'is-danger');
        }
    }
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
 * Retorna o ID do personagem atual
 * @returns {string|null} ID do personagem atual
 */
export function getCurrentCharacterId() {
    return currentCharacterId;
}

/**
 * Define o ID do personagem atual
 * @param {string|null} id - ID do personagem
 */
export function setCurrentCharacterId(id) {
    currentCharacterId = id;
} 