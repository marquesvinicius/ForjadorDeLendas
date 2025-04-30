document.addEventListener('DOMContentLoaded', function() {
    // Dados dos mundos disponíveis
    const worlds = [
        {
            id: 'tormenta',
            name: 'Tormenta 20',
            // Usando imagem placeholder temporária
            image: './assets/icons/tormenta-icon.png'
        },
        {
            id: 'dnd',
            name: 'D&D 5e',
            image: 'https://via.placeholder.com/160/000080/FFFFFF/?text=D&D'
        },
        {
            id: 'pathfinder',
            name: 'Pathfinder',
            image: 'https://via.placeholder.com/160/400040/FF8800/?text=PF'
        }
    ];

    let currentIndex = 0;
    const carousel = document.querySelector('.carousel');

    // Inicializar o carrossel
    function initCarousel() {
        carousel.innerHTML = '';
        
        worlds.forEach((world, index) => {
            const worldItem = document.createElement('div');
            worldItem.classList.add('world-item');
            
            // Determinar a posição no carrossel (active, prev, next, hidden)
            if (index === currentIndex) {
                worldItem.classList.add('active');
            } else if (index === getPrevIndex()) {
                worldItem.classList.add('prev');
            } else if (index === getNextIndex()) {
                worldItem.classList.add('next');
            } else {
                worldItem.classList.add('hidden');
            }
            
            worldItem.innerHTML = `
                <img src="${world.image}" alt="${world.name}" class="world-icon">
                <div class="world-label">${world.name}</div>
            `;
            
            carousel.appendChild(worldItem);
        });
    }

    // Obter índice do mundo anterior
    function getPrevIndex() {
        return (currentIndex - 1 + worlds.length) % worlds.length;
    }

    // Obter índice do próximo mundo
    function getNextIndex() {
        return (currentIndex + 1) % worlds.length;
    }

    // Navegar para o mundo anterior
    function goToPrev() {
        currentIndex = getPrevIndex();
        initCarousel();
    }

    // Navegar para o próximo mundo
    function goToNext() {
        currentIndex = getNextIndex();
        initCarousel();
    }

    // Botão de confirmação
    function confirmSelection() {
        alert(`Mundo selecionado: ${worlds[currentIndex].name}`);
        // Aqui você implementaria a lógica para realmente trocar o mundo
    }

    // Adicionar eventos aos botões
    document.querySelector('.arrow-btn.prev').addEventListener('click', goToPrev);
    document.querySelector('.arrow-btn.next').addEventListener('click', goToNext);
    document.querySelector('.confirm-button').addEventListener('click', confirmSelection);

    // Inicializar o carrossel
    initCarousel();
});