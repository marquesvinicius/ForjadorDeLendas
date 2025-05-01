/**
 * Cria e gerencia o seletor de mundos com animações de transição
 */
document.addEventListener('DOMContentLoaded', function () {
    const worlds = [
        { id: 'tormenta', name: 'Tormenta 20', icon: 'assets/icons/tormenta-icon.png' },
        { id: 'dnd', name: 'D&D 5e', icon: 'assets/icons/dnd-icon.png' },
        { id: 'ordem-paranormal', name: 'Ordem Paranormal', icon: 'assets/icons/ordem-paranormal-icon.png' }
    ];

    const mainContainer = document.querySelector('.container.is-fluid.main-container');
    if (!mainContainer) return;

    const oldSelector = document.querySelector('.world-selector');
    if (oldSelector) oldSelector.remove();

    let currentIndex = 0;

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
    mainContainer.appendChild(worldSelector);

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
        confirmButton.classList.add('is-loading');

        const selectedWorld = worlds[currentIndex];
        console.log(`Trocando para o mundo: ${selectedWorld.name} (${selectedWorld.id})`);

        setTimeout(() => {
            confirmButton.classList.remove('is-loading');
            if (window.companionSpeak) {
                window.companionSpeak(`Trocando para o mundo: ${selectedWorld.name}!`);
            }
            localStorage.setItem('selectedWorld', selectedWorld.id);
        }, 800);
    });
});
