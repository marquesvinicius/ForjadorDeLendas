/**
 * Funções para manipulação de modais e elementos de UI
 */

/**
 * Abre um modal
 * @param {HTMLElement} modal - Elemento do modal
 */
export function openModal(modal) {
  if (modal) {
    modal.classList.add('is-active');
    document.body.classList.add('modal-open');

    // ⭐ BLOQUEAR INTERAÇÕES FORA DO MODAL
    blockBackgroundInteractions();

    // ⭐ FOCUS NO MODAL PARA ACESSIBILIDADE
    const modalContent = modal.querySelector('.modal-card, .modal-content');
    if (modalContent) {
      modalContent.focus();
    }
  }
}

/**
 * Fecha um modal
 * @param {HTMLElement} modal - Elemento do modal
 */
export function closeModal(modal) {
  if (modal) {
    modal.classList.remove('is-active');
    document.body.classList.remove('modal-open');

    // ⭐ RESTAURAR INTERAÇÕES APÓS FECHAR MODAL
    unblockBackgroundInteractions();
  }
}

/**
 * Exibe uma mensagem de notificação
 * @param {string} message - Mensagem a ser exibida
 * @param {string} type - Tipo da mensagem (is-info, is-success, is-warning, is-danger)
 * @param {number} duration - Duração em ms (padrão: 3000)
 */
export function showMessage(message, type = 'is-info', duration = 3000) {
  // Remove mensagens existentes
  const existingMessages = document.querySelectorAll('.notification.floating-message');
  existingMessages.forEach(msg => msg.remove());

  // Cria nova mensagem
  const notification = document.createElement('div');
  notification.className = `notification ${type} floating-message`;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    max-width: 400px;
    opacity: 0;
    transform: translateX(100%);
    transition: all 0.3s ease;
  `;

  notification.innerHTML = `
    <button class="delete"></button>
    <p>${message}</p>
  `;

  document.body.appendChild(notification);

  // Animar entrada
  setTimeout(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateX(0)';
  }, 50);

  // Configurar botão de fechar
  const deleteBtn = notification.querySelector('.delete');
  deleteBtn.addEventListener('click', () => {
    hideMessage(notification);
  });

  // Auto-remover após duração especificada
  setTimeout(() => {
    hideMessage(notification);
  }, duration);
}

/**
 * Esconde uma mensagem de notificação
 * @param {HTMLElement} notification - Elemento da notificação
 */
export function hideMessage(notification) {
  if (notification) {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100%)';

    setTimeout(() => {
      notification.remove();
    }, 300);
  }
}

/**
 * Cria um modal de loading
 * @param {string} title - Título do modal
 * @param {string} message - Mensagem do modal
 * @returns {HTMLElement} Elemento do modal criado
 */
export function createLoadingModal(title = 'Carregando...', message = 'Aguarde...') {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="box has-text-centered">
        <h3 class="title is-4 medieval-title mb-4">${title}</h3>
        <p class="mb-4">${message}</p>
        <progress class="progress is-primary" max="100"></progress>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  return modal;
}

/**
 * Remove um modal de loading
 * @param {HTMLElement} modal - Modal a ser removido
 */
export function removeLoadingModal(modal) {
  if (modal) {
    closeModal(modal);
    setTimeout(() => {
      modal.remove();
    }, 300);
  }
}

/**
 * Cria um modal genérico
 * @param {string} id - ID do modal
 * @param {string} content - Conteúdo HTML do modal
 * @param {string} className - Classe adicional para o modal
 * @returns {HTMLElement} Elemento do modal criado
 */
export function createModal(id, content, className = '') {
  // Remover modal existente se houver
  const existingModal = document.getElementById(id);
  if (existingModal) {
    existingModal.remove();
  }

  const modal = document.createElement('div');
  modal.id = id;
  modal.className = `modal ${className}`;
  modal.innerHTML = `
    <div class="modal-background"></div>
    <div class="modal-content">
      ${content}
    </div>
    <button class="modal-close is-large" aria-label="close"></button>
  `;

  document.body.appendChild(modal);
  setupModalCloseListeners(modal);
  return modal;
}

/**
 * Mostra um modal pelo ID
 * @param {string} modalId - ID do modal
 */
export function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    openModal(modal);
  }
}

/**
 * Esconde um modal pelo ID
 * @param {string} modalId - ID do modal
 */
export function hideModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    closeModal(modal);
  }
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

/**
 * Configura event listeners para fechar modais
 * @param {HTMLElement} modal - Modal para configurar
 */
export function setupModalCloseListeners(modal) {
  if (!modal) return;

  if (modal.hasAttribute('data-persistent') || modal.id === 'worldLoadingModal') {
    console.log('🚫 Modals: Ignorando modal persistente:', modal.id);
    return;
  }


  // Fechar ao clicar no background
  const background = modal.querySelector('.modal-background');
  if (background) {
    background.addEventListener('click', (e) => {
      // ⭐ PREVENIR PROPAGAÇÃO DO CLIQUE
      e.stopPropagation();
      closeModal(modal);
    });
  }

  // Fechar ao clicar no botão delete
  const deleteButtons = modal.querySelectorAll('.delete');
  deleteButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeModal(modal);
    });
  });

  // Fechar ao clicar no botão modal-close
  const closeButton = modal.querySelector('.modal-close');
  if (closeButton) {
    closeButton.addEventListener('click', (e) => {
      e.stopPropagation();
      closeModal(modal);
    });
  }

  // Fechar com ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-active')) {
      closeModal(modal);
    }
  });

  // ⭐ PREVENIR CLICKS FORA DO MODAL
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal(modal);
    }
  });
} 