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
    
    // 🎭 TIMEOUT PARA DETECTAR HIBERNAÇÃO
    let hibernationTimeout;
    let isHibernating = false;
    
    try {
        // Configurar timeout para hibernação (8 segundos)
        hibernationTimeout = setTimeout(() => {
            isHibernating = true;
            showHibernationNotification();
        }, 8000);

        const backstory = await window.API_CONFIG.generateStory(prompt);
        
        // Limpar timeout se a resposta chegou a tempo
        if (hibernationTimeout) {
            clearTimeout(hibernationTimeout);
        }
        
        // Remover notificação de hibernação se estava ativa
        if (isHibernating) {
            removeHibernationNotification();
        }
        
        updateBackgroundWithLore(backstory, backgroundTextArea, storage, currentCharacterId, characterData);
        companionEvents.onStoryGenerationSuccess();
        
        // 🎭 NOVA INTERAÇÃO: Feedback sobre o conteúdo da história
        companionEvents.onStoryContentFeedback(backstory, characterData);
        
    } catch (error) {
        console.error('❌ Erro ao gerar história via API:', error.message);
        
        // Limpar timeout se houve erro
        if (hibernationTimeout) {
            clearTimeout(hibernationTimeout);
        }
        
        // Remover notificação de hibernação se estava ativa
        if (isHibernating) {
            removeHibernationNotification();
        }
        
        // Usar fallback
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
    document.body.classList.add('modal-open');
    
    // ⭐ BLOQUEAR INTERAÇÕES FORA DO MODAL
    blockBackgroundInteractions();

    const modalContent = loadingModal.querySelector('.modal-content');
    if (modalContent) {
        modalContent.style.opacity = '1';
        modalContent.style.transform = 'translateY(0)';
    }

    // 🎭 INICIAR ANIMAÇÕES DO MODAL
    startLoadingAnimations();
}

/**
 * Fecha o modal de loading
 */
function closeLoadingModal() {
    const loadingModal = document.getElementById('loadingModal');
    if (!loadingModal) return;

    // 🎭 PARAR ANIMAÇÕES
    stopProgressAnimation();
    removeHibernationNotification();

    setTimeout(() => {
        loadingModal.classList.remove('is-active');
        document.body.classList.remove('modal-open');
        
        // ⭐ RESTAURAR INTERAÇÕES APÓS FECHAR MODAL
        unblockBackgroundInteractions();
        
        setTimeout(() => {
            loadingModal.style.display = 'none';
        }, 300);
    }, 2000);
}

/**
 * Bloqueia interações com o conteúdo de fundo
 */
function blockBackgroundInteractions() {
    // Adicionar classe para bloquear interações
    document.body.classList.add('modal-background-blocked');
    
    // Bloquear scroll do body
    document.body.style.overflow = 'hidden';
    
    // Bloquear interações com elementos fora do modal
}

/**
 * 🎭 Inicia as animações do modal de loading
 */
function startLoadingAnimations() {
    const messages = [
        document.getElementById('loadingMessage1'),
        document.getElementById('loadingMessage2'),
        document.getElementById('loadingMessage3'),
        document.getElementById('loadingMessage4')
    ];

    let currentMessage = 0;
    
    // Função para alternar mensagens
    function cycleMessages() {
        messages.forEach((msg, index) => {
            if (msg) {
                msg.classList.remove('active');
            }
        });
        
        if (messages[currentMessage]) {
            messages[currentMessage].classList.add('active');
        }
        
        currentMessage = (currentMessage + 1) % messages.length;
    }

    // Iniciar ciclo de mensagens
    cycleMessages();
    setInterval(cycleMessages, 3000);

    // Simular progresso
    simulateProgress();
}

/**
 * 🎭 Simula o progresso da barra
 */
function simulateProgress() {
    const progressBar = document.getElementById('loreProgress');
    const progressText = document.getElementById('progressText');
    
    if (!progressBar || !progressText) return;

    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 90) progress = 90; // Não chegar a 100% até a resposta
        
        progressBar.value = progress;
        progressText.textContent = `${Math.round(progress)}%`;
    }, 500);

    // Guardar o intervalo para parar quando necessário
    window.loreProgressInterval = interval;
}

/**
 * 🎭 Para as animações de progresso
 */
function stopProgressAnimation() {
    if (window.loreProgressInterval) {
        clearInterval(window.loreProgressInterval);
        window.loreProgressInterval = null;
    }
}

/**
 * 🎭 Mostra notificação de hibernação
 */
function showHibernationNotification() {
    const loadingModal = document.getElementById('loadingModal');
    if (!loadingModal) return;

    const notification = document.createElement('div');
    notification.className = 'hibernation-notification';
    notification.innerHTML = `
        <i class="fas fa-magic"></i>
        <strong>Aguarde um pouco...</strong><br>
        A magia está despertando dos reinos distantes!
    `;

    const modalContent = loadingModal.querySelector('.modal-content');
    if (modalContent) {
        modalContent.appendChild(notification);
    }
}

/**
 * 🎭 Remove notificação de hibernação
 */
function removeHibernationNotification() {
    const notification = document.querySelector('.hibernation-notification');
    if (notification) {
        notification.remove();
    }
}

/**
 * Restaura interações com o conteúdo de fundo
 */
function unblockBackgroundInteractions() {
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