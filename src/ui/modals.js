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
 * Configura event listeners para fechar modais
 * @param {HTMLElement} modal - Modal para configurar
 */
export function setupModalCloseListeners(modal) {
  if (!modal) return;

  // Fechar ao clicar no background
  const background = modal.querySelector('.modal-background');
  if (background) {
    background.addEventListener('click', () => closeModal(modal));
  }

  // Fechar ao clicar no botão delete
  const deleteButtons = modal.querySelectorAll('.delete');
  deleteButtons.forEach(btn => {
    btn.addEventListener('click', () => closeModal(modal));
  });

  // Fechar com ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-active')) {
      closeModal(modal);
    }
  });
} 