/**
 * Módulo responsável pelo sistema de notificações toast
 */

/**
 * Mostra uma mensagem toast
 * @param {string} message - Mensagem a ser exibida
 * @param {string} type - Tipo da mensagem (is-info, is-success, is-warning, is-danger)
 */
export function showMessage(message, type = 'is-info') {
    // Verifica se já existe um container de notificações
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.style.position = 'fixed';
        toastContainer.style.top = '1rem';
        toastContainer.style.right = '1rem';
        toastContainer.style.zIndex = '9999';
        toastContainer.style.display = 'flex';
        toastContainer.style.flexDirection = 'column';
        toastContainer.style.gap = '0.5rem';
        toastContainer.style.alignItems = 'flex-end';
        document.body.appendChild(toastContainer);
    }

    const messageEl = document.createElement('div');
    messageEl.className = `notification ${type} is-light`;
    messageEl.style.maxWidth = '300px';
    messageEl.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.2)';
    messageEl.style.margin = '0';
    messageEl.style.position = 'relative';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'delete';
    closeBtn.addEventListener('click', () => {
        toastContainer.removeChild(messageEl);
        // Remove o container se não houver mais notificações
        if (toastContainer.children.length === 0) {
            document.body.removeChild(toastContainer);
        }
    });

    messageEl.appendChild(closeBtn);
    messageEl.appendChild(document.createTextNode(message));
    toastContainer.appendChild(messageEl);

    // Auto-remove após 5 segundos
    setTimeout(() => {
        if (toastContainer.contains(messageEl)) {
            toastContainer.removeChild(messageEl);
            if (toastContainer.children.length === 0 && document.body.contains(toastContainer)) {
                document.body.removeChild(toastContainer);
            }
        }
    }, 5000);
} 