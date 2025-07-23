/**
 * Módulo responsável pela geração de histórias de personagem
 */

import { showMessage } from '../ui/notifications.js';
import { companionEvents } from '../core/companionBridge.js';

import { generatePrompt } from './promptTemplates.js';
import { generateSimpleLore } from './fallbackLore.js';
import { getCurrentWorldConfig } from '../config/worldsConfig.js';

/**
 * Gera história para um personagem
 * @param {Object} characterData - Dados do personagem
 * @param {HTMLElement} backgroundTextArea - Elemento textarea para a história
 * @param {Object} storage - Instância do storage
 * @param {string} currentCharacterId - ID do personagem atual (opcional)
 */
export async function generateCharacterLore(characterData, backgroundTextArea, storage, currentCharacterId = null) {
    if (!characterData.name) {
        showMessage('Por favor, dê um nome ao seu personagem antes de gerar sua história.', 'is-danger');
        return;
    }

    openLoadingModal();
    companionEvents.onStoryGenerationStart();

    const prompt = generatePrompt(characterData);
    console.log('Prompt enviado:', prompt);
    
    try {
        const startTime = Date.now();
        console.log('🔮 Iniciando geração de backstory via API...');

        const backstory = await window.API_CONFIG.generateStory(prompt);
        const duration = Date.now() - startTime;
        
        console.log(`✅ Backstory gerada em ${duration}ms`);
        
        updateBackgroundWithLore(backstory, backgroundTextArea, storage, currentCharacterId, characterData);
        companionEvents.onStoryGenerationSuccess();
        
    } catch (error) {
        console.error('❌ Erro ao gerar história via API:', error.message);
        
        // Usar fallback
        console.log('Usando sistema de fallback...');
        const fallbackLore = generateSimpleLore(characterData);
        updateBackgroundWithLore(fallbackLore, backgroundTextArea, storage, currentCharacterId, characterData);
        
        companionEvents.onStoryGenerationFallback();
        showMessage('O servidor local falhou, mas geramos uma história alternativa!', 'is-warning');
    }

    closeLoadingModal();
    showMessage('História gerada com sucesso!', 'is-success');
    
    // Destaque visual
    backgroundTextArea.classList.add('highlight');
    setTimeout(() => backgroundTextArea.classList.remove('highlight'), 1000);
}

/**
 * Atualiza o textarea e salva a história
 * @param {string} lore - História gerada
 * @param {HTMLElement} backgroundTextArea - Elemento textarea
 * @param {Object} storage - Instância do storage
 * @param {string} currentCharacterId - ID do personagem atual
 * @param {Object} characterData - Dados do personagem
 */
function updateBackgroundWithLore(lore, backgroundTextArea, storage, currentCharacterId, characterData) {
    backgroundTextArea.value = lore;

    if (currentCharacterId) {
        const character = storage.getCharacterById(currentCharacterId);
        if (character) {
            character.background = lore;
            storage.saveCharacter(character);
        }
    }
}

/**
 * Abre o modal de loading
 */
function openLoadingModal() {
    const loadingModal = document.getElementById('loadingModal');
    if (!loadingModal) {
        console.error('Modal de carregamento não encontrado');
        return;
    }

    loadingModal.style.display = 'flex';
    loadingModal.classList.add('is-active');

    const modalContent = loadingModal.querySelector('.modal-content');
    if (modalContent) {
        modalContent.style.opacity = '1';
        modalContent.style.transform = 'translateY(0)';
    }
}

/**
 * Fecha o modal de loading
 */
function closeLoadingModal() {
    const loadingModal = document.getElementById('loadingModal');
    if (!loadingModal) return;

    setTimeout(() => {
        loadingModal.classList.remove('is-active');
        setTimeout(() => {
            loadingModal.style.display = 'none';
        }, 300);
    }, 2000);
} 