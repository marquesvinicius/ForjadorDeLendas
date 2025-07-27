/**
 * Cria e gerencia o seletor de mundos com animações de transição
 */
document.addEventListener('DOMContentLoaded', function () {
    const worlds = [
        { id: 'tormenta', name: 'Tormenta 20', icon: 'assets/img/tormenta/icon.webp', loadingMessage: 'Viajando para Arton...' },
        { id: 'dnd', name: 'D&D 5e', icon: 'assets/img/dnd/icon.webp', loadingMessage: 'Voando para a Terra dos Dragões...' },
        { id: 'ordem-paranormal', name: 'Ordem Paranormal', icon: 'assets/img/ordem-paranormal/icon.webp', loadingMessage: 'Invocando a Ordem...' }
    ];

    const mainContainer = document.querySelector('.container.is-fluid.main-container');
    if (!mainContainer) return;

    const oldSelector = document.querySelector('.world-selector');
    if (oldSelector) oldSelector.remove();

    // Verificar o mundo atual no localStorage
    const currentWorldId = localStorage.getItem('selectedWorld') || 'dnd';

    // Encontrar o índice do mundo atual
    let currentIndex = worlds.findIndex(world => world.id === currentWorldId);
    if (currentIndex === -1) currentIndex = 1; // Default para D&D (índice 1) se não encontrar

    const worldSelector = document.createElement('div');
    worldSelector.className = 'world-selector';

    const selectorRow = document.createElement('div');
    selectorRow.className = 'world-selector-row';

    const prevButton = document.createElement('button');
    prevButton.id = 'prevWorld';
    prevButton.className = 'arrow-button';
    prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
    selectorRow.appendChild(prevButton);

    const leftWorld = document.createElement('div');
    leftWorld.className = 'side-world';
    leftWorld.innerHTML = `<img src="${worlds[(currentIndex - 1 + worlds.length) % worlds.length].icon}" alt="Mundo Anterior" class="world-icon side">`;
    selectorRow.appendChild(leftWorld);

    const centerWorld = document.createElement('div');
    centerWorld.id = 'worldIconContainer';
    centerWorld.innerHTML = `<img src="${worlds[currentIndex].icon}" alt="${worlds[currentIndex].name}" class="world-icon">`;
    selectorRow.appendChild(centerWorld);

    const rightWorld = document.createElement('div');
    rightWorld.className = 'side-world';
    rightWorld.innerHTML = `<img src="${worlds[(currentIndex + 1) % worlds.length].icon}" alt="Próximo Mundo" class="world-icon side">`;
    selectorRow.appendChild(rightWorld);

    const nextButton = document.createElement('button');
    nextButton.id = 'nextWorld';
    nextButton.className = 'arrow-button';
    nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
    selectorRow.appendChild(nextButton);

    const confirmButton = document.createElement('button');
    confirmButton.type = 'button';
    confirmButton.id = 'confirmWorld';
    confirmButton.className = 'button is-primary world-confirm-button';
    confirmButton.innerHTML = `
      <span class="icon">
        <i class="fas fa-globe-americas"></i>
      </span>
      <span>Trocar Mundo</span>
    `;

    worldSelector.appendChild(selectorRow);
    worldSelector.appendChild(confirmButton);

    // Função para posicionar o seletor de mundos com base na largura da tela
    function positionWorldSelector() {
        const characterPanel = document.querySelector('.character-panel-container');
        const savedCharactersSection = document.querySelector('.saved-characters-section');

        if (window.innerWidth <= 1300 && characterPanel && savedCharactersSection) {
            // Para telas menores que 1300px, inserir entre character-panel e saved-characters-section
            savedCharactersSection.parentNode.insertBefore(worldSelector, savedCharactersSection);

            // Telas entre 1024px e 1300px - posicionamento centralizado
            if (window.innerWidth >= 1024) {
                // O CSS se encarregará do posicionamento centralizado
            }
        } else {
            // Para telas maiores, manter no mainContainer
            mainContainer.appendChild(worldSelector);
        }
    }

    // Posicionar o seletor de mundos inicialmente
    positionWorldSelector();

    // Adicionar listener para redimensionamento da janela
    window.addEventListener('resize', positionWorldSelector);

    // Criação do modal de carregamento
    const loadingModal = document.createElement('div');
    loadingModal.className = 'modal';
    loadingModal.id = 'worldLoadingModal';

    loadingModal.innerHTML = `
      <div class="modal-background"></div>
      <div class="modal-content">
        <div class="box has-text-centered">
          <h3 class="title is-4 medieval-title mb-4" id="loadingMessage"></h3>
          <progress class="progress is-primary" max="100"></progress>
          <p class="mt-2">Preparando o universo...</p>
        </div>
      </div>
    `;
    document.body.appendChild(loadingModal);

    // Criar a notificação de "Já está neste mundo"
    const worldNotification = document.createElement('div');
    worldNotification.className = 'notification is-info world-notification';
    worldNotification.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999; max-width: 300px; display: none; opacity: 0; transition: opacity 0.3s ease;';
    worldNotification.innerHTML = `
      <button class="delete"></button>
      <p><strong>Você já se encontra nessas terras!</strong></p>
    `;
    document.body.appendChild(worldNotification);

    // Adicionar evento para fechar a notificação
    worldNotification.querySelector('.delete').addEventListener('click', function () {
        hideWorldNotification();
    });

    function showWorldNotification(message) {
        if (message) {
            worldNotification.querySelector('p').innerHTML = `<strong>${message}</strong>`;
        }
        worldNotification.style.display = 'block';
        setTimeout(() => {
            worldNotification.style.opacity = '1';
        }, 50);

        // Auto-esconder após 3 segundos
        setTimeout(() => {
            hideWorldNotification();
        }, 3000);
    }

    function hideWorldNotification() {
        worldNotification.style.opacity = '0';
        setTimeout(() => {
            worldNotification.style.display = 'none';
        }, 300);
    }

    const styleEl = document.createElement('style');
    styleEl.textContent = `
        @keyframes moveLeft {
            0% { transform: translateX(0); opacity: 1; }
            50% { opacity: 0.5; }
            100% { transform: translateX(-100%); opacity: 0; }
        }
        @keyframes moveRight {
            0% { transform: translateX(0); opacity: 1; }
            50% { opacity: 0.5; }
            100% { transform: translateX(100%); opacity: 0; }
        }
        @keyframes moveFromLeft {
            0% { transform: translateX(-100%); opacity: 0; }
            50% { opacity: 0.5; }
            100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes moveFromRight {
            0% { transform: translateX(100%); opacity: 0; }
            50% { opacity: 0.5; }
            100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes moveToCenter {
            0% { transform: scale(0.7); opacity: 0.7; }
            100% { transform: scale(1); opacity: 1; }
        }
        @keyframes moveFromCenter {
            0% { transform: scale(1); opacity: 1; }
            100% { transform: scale(0.7); opacity: 0.7; }
        }
        .move-left { animation: moveLeft 0.4s forwards; }
        .move-right { animation: moveRight 0.4s forwards; }
        .move-from-left { animation: moveFromLeft 0.4s forwards; }
        .move-from-right { animation: moveFromRight 0.4s forwards; }
        .move-to-center { animation: moveToCenter 0.4s forwards; }
        .move-from-center { animation: moveFromCenter 0.4s forwards; }
    `;
    document.head.appendChild(styleEl);

    let isAnimating = false;

    function updateDisplayWithAnimation(direction) {
        if (isAnimating) return;
        isAnimating = true;

        const prevIndex = (currentIndex - 1 + worlds.length) % worlds.length;
        const nextIndex = (currentIndex + 1) % worlds.length;

        if (direction === 'next') {
            centerWorld.querySelector('img').classList.add('move-left');
            rightWorld.querySelector('img').classList.add('move-to-center');
            leftWorld.querySelector('img').classList.add('move-right');

            setTimeout(() => {
                leftWorld.querySelector('img').src = worlds[prevIndex].icon;
                centerWorld.querySelector('img').src = worlds[currentIndex].icon;
                centerWorld.querySelector('img').alt = worlds[currentIndex].name;
                rightWorld.querySelector('img').src = worlds[nextIndex].icon;

                centerWorld.querySelector('img').classList.remove('move-left');
                rightWorld.querySelector('img').classList.remove('move-to-center');
                leftWorld.querySelector('img').classList.remove('move-right');

                isAnimating = false;
            }, 400);
        } else {
            centerWorld.querySelector('img').classList.add('move-right');
            leftWorld.querySelector('img').classList.add('move-to-center');
            rightWorld.querySelector('img').classList.add('move-left');

            setTimeout(() => {
                leftWorld.querySelector('img').src = worlds[prevIndex].icon;
                centerWorld.querySelector('img').src = worlds[currentIndex].icon;
                centerWorld.querySelector('img').alt = worlds[currentIndex].name;
                rightWorld.querySelector('img').src = worlds[nextIndex].icon;

                centerWorld.querySelector('img').classList.remove('move-right');
                leftWorld.querySelector('img').classList.remove('move-to-center');
                rightWorld.querySelector('img').classList.remove('move-left');

                isAnimating = false;
            }, 400);
        }
    }

    function goToNextWorld() {
        currentIndex = (currentIndex + 1) % worlds.length;
        updateDisplayWithAnimation('next');
    }

    function goToPrevWorld() {
        currentIndex = (currentIndex - 1 + worlds.length) % worlds.length;
        updateDisplayWithAnimation('prev');
    }

    prevButton.addEventListener('click', goToPrevWorld);
    nextButton.addEventListener('click', goToNextWorld);
    leftWorld.addEventListener('click', goToPrevWorld);
    rightWorld.addEventListener('click', goToNextWorld);

    confirmButton.addEventListener('click', function () {
        const selectedWorld = worlds[currentIndex];

        // Verificar se o usuário já está no mundo selecionado
        const currentWorldId = localStorage.getItem('selectedWorld') || 'dnd';

        if (selectedWorld.id === currentWorldId) {
            showWorldNotification(`Você já se encontra nessas terras!`);
            return;
        }

        // Mostrar modal de carregamento com mensagem personalizada
        const loadingMessage = document.getElementById('loadingMessage');
        loadingMessage.textContent = selectedWorld.loadingMessage;

        // Ativar o modal
        const modal = document.getElementById('worldLoadingModal');
        modal.classList.add('is-active');

        // Aplicar o tema com atraso para permitir animação
        setTimeout(() => {
            // Aplicar o tema do mundo selecionado
            if (window.applyWorldTheme) {
                window.applyWorldTheme(selectedWorld.id);
            } else {
                // Tentar importar o módulo themeManager
                import('./themeManager.js')
                    .then(module => {
                        module.applyWorldTheme(selectedWorld.id);
                    })
                    .catch(err => {
                        console.error('Erro ao carregar o gerenciador de temas:', err);
                        // Fallback: aplicar tema básico manualmente
                
                        // Pelo menos salvar a seleção
                        localStorage.setItem('selectedWorld', selectedWorld.id);
                        document.dispatchEvent(new CustomEvent('worldChanged'));
                    });
            }

            // Salvar a seleção no localStorage
            const oldWorld = localStorage.getItem('selectedWorld') || 'dnd';
            localStorage.setItem('selectedWorld', selectedWorld.id);
            
            // Disparar evento com dados do mundo anterior e novo
            document.dispatchEvent(new CustomEvent('worldChanged', {
                detail: {
                    oldWorld: oldWorld,
                    newWorld: selectedWorld.id
                }
            }));

            // Notificar pelo companion com saudação específica do mundo
            if (window.magoCompanion && window.magoCompanion.greet) {
                // Aguardar um pouco para o tema carregar antes da saudação
                setTimeout(() => {
                    window.magoCompanion.greet();
                }, 1000); // Aumentado para 1 segundo
            }

            // Fechar o modal após carregar o tema
            setTimeout(() => {
                modal.classList.remove('is-active');
            }, 1200);
        }, 2000); // Tempo suficiente para mostrar a animação de carregamento
    });
});
