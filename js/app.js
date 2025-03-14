// Elementos DOM
const characterForm = document.getElementById('characterForm');
const rollAttributesBtn = document.getElementById('rollAttributes');
const generateLoreBtn = document.getElementById('generateLore');
const saveCharacterBtn = document.getElementById('saveCharacter');
const clearFormBtn = document.getElementById('clearForm');
const savedCharactersList = document.getElementById('savedCharactersList');
const characterModal = document.getElementById('characterModal');
const loadingModal = document.getElementById('loadingModal');
const closeModalBtn = document.getElementById('closeModal');
const deleteCharacterBtn = document.getElementById('deleteCharacter');
const editCharacterBtn = document.getElementById('editCharacter');
const characterDetails = document.getElementById('characterDetails');
const loreText = document.getElementById('loreText');

// Dados de estado
let characters = [];
let currentCharacterId = null;

// Classe para ícones de cada classe de personagem
const classIcons = {
    'Arcanista': 'fa-hat-wizard',
    'Bárbaro': 'fa-gavel',
    'Bardo': 'fa-guitar',
    'Bucaneiro': 'fa-sailboat',
    'Caçador': 'fa-shoe-prints',
    'Cavaleiro': 'fa-horse-head',
    'Clérigo': 'fa-pray',
    'Druida': 'fa-leaf',
    'Guerreiro': 'fa-jedi',
    'Inventor': 'fa-tools',
    'Ladino': 'fa-mask',
    'Lutador': 'fa-fist-raised',
    'Nobre': 'fa-crown',
    'Paladino': 'fa-shield-alt'
};

// Referência ao storage
const storage = characterStorage;

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    loadCharacters();
    const characters = characterStorage.getAllCharacters();
    setupEventListeners();
    if (typeof magoCompanion !== 'undefined') {
        magoCompanion.init();
    } else {
        console.error('magoCompanion não está definido. Verifique companion.js');
    }
    renderCharactersList(characters);
});

// Configuração de listeners de eventos
function setupEventListeners() {
    saveCharacterBtn.addEventListener('click', saveCharacter);
    clearFormBtn.addEventListener('click', clearForm);
    rollAttributesBtn.addEventListener('click', rollAttributes);
    generateLoreBtn.addEventListener('click', generateCharacterLore);
    document.querySelectorAll('.modal .delete, #closeModal').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => closeModal(characterModal));
    });
    deleteCharacterBtn.addEventListener('click', deleteCurrentCharacter);
    editCharacterBtn.addEventListener('click', editCurrentCharacter);
}

// Carregar personagens do localStorage
function loadCharacters() {
    const savedCharacters = localStorage.getItem('rpgCharacters');
    if (savedCharacters) {
        characters = JSON.parse(savedCharacters);
        renderCharactersList();
    }
}

// Salvar personagem no localStorage
function saveCharacters() {
    localStorage.setItem('rpgCharacters', JSON.stringify(characters));
}

// Manipuladores de eventos
function saveCharacter(e) {
    e.preventDefault();
    const name = document.getElementById('charName').value.trim();
    if (!name) {
        showMessage('Por favor, dê um nome ao seu personagem.', 'is-danger');
        return;
    }

    const character = {
        id: currentCharacterId || null,
        name: name,
        race: document.getElementById('charRace').value,
        class: document.getElementById('charClass').value,
        alignment: document.getElementById('charAlignment').value,
        attributes: {
            strength: parseInt(document.getElementById('attrStr').value),
            dexterity: parseInt(document.getElementById('attrDex').value),
            constitution: parseInt(document.getElementById('attrCon').value),
            intelligence: parseInt(document.getElementById('attrInt').value),
            wisdom: parseInt(document.getElementById('attrWis').value),
            charisma: parseInt(document.getElementById('attrCha').value)
        },
        background: document.getElementById('charBackground').value
    };

    const savedCharacter = storage.saveCharacter(character);
    renderCharactersList();
    
    // Resetar o formulário e o botão de salvar
    clearForm();
    saveCharacterBtn.innerHTML = '<i class="fas fa-save"></i>&nbsp; Salvar Personagem';
    saveCharacterBtn.classList.remove('is-warning');
    saveCharacterBtn.style.color = '';
    
    // Feedback baseado em se foi uma criação ou atualização
    const isUpdate = currentCharacterId !== null;
    currentCharacterId = null;
    
    if (isUpdate) {
        showMessage(`Personagem ${savedCharacter.name} atualizado com sucesso!`, 'is-success');
        magoCompanion.speak(`${savedCharacter.name} foi atualizado em seu grimório!`, 4000);
    } else {
        showMessage(`Personagem ${savedCharacter.name} salvo com sucesso!`, 'is-success');
        magoCompanion.speak(`${savedCharacter.name} foi adicionado ao seu grimório de heróis!`, 4000);
    }
    
    document.querySelector('.saved-characters-section').scrollIntoView({ behavior: 'smooth' });
}

function rollAttributes() {
    function rollStat() {
        const rolls = Array.from({length: 4}, () => Math.floor(Math.random() * 6) + 1);
        rolls.sort((a, b) => a - b);
        return rolls.slice(1).reduce((sum, roll) => sum + roll, 0);
    }
    document.getElementById('attrStr').value = rollStat();
    document.getElementById('attrDex').value = rollStat();
    document.getElementById('attrCon').value = rollStat();
    document.getElementById('attrInt').value = rollStat();
    document.getElementById('attrWis').value = rollStat();
    document.getElementById('attrCha').value = rollStat();
}

function renderCharactersList() {
    const characters = storage.getAllCharacters();
    if (characters.length === 0) {
        savedCharactersList.innerHTML = '<p class="empty-list-message">Nenhum herói criado ainda. Comece a forjar sua lenda!</p>';
        return;
    }
    
    savedCharactersList.innerHTML = '';
    characters.forEach(character => {
        const characterCard = document.createElement('div');
        characterCard.className = 'character-card';
        characterCard.dataset.id = character.id;
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
        characterCard.addEventListener('click', () => openCharacterModal(character.id));
        savedCharactersList.appendChild(characterCard);
    });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

function openCharacterModal(characterId) {
    const character = storage.getCharacterById(characterId);
    if (!character) {
        console.error('Personagem não encontrado:', characterId);
        return;
    }
    
    currentCharacterId = characterId;
    characterDetails.innerHTML = `
        <div class="columns is-multiline">
            <div class="column is-8">
                <h3 class="title is-3 medieval-title">${character.name}</h3>
                <p class="subtitle is-5">${character.race} ${character.class} (${character.alignment})</p>
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
                    <i class="fas ${classIcons[character.class] || 'fa-user'}" style="font-size: 4rem;"></i>
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
    document.getElementById('loreContent').style.display = 'none';
    
    // Configurar os botões do modal
    const editBtn = document.getElementById('editCharacter');
    const deleteBtn = document.getElementById('deleteCharacter');
    const closeBtn = document.getElementById('closeModal');
    
    // Remover event listeners antigos para evitar duplicação
    editBtn.replaceWith(editBtn.cloneNode(true));
    deleteBtn.replaceWith(deleteBtn.cloneNode(true));
    closeBtn.replaceWith(closeBtn.cloneNode(true));
    
    // Adicionar novos event listeners
    document.getElementById('editCharacter').addEventListener('click', editCurrentCharacter);
    document.getElementById('deleteCharacter').addEventListener('click', deleteCurrentCharacter);
    document.getElementById('closeModal').addEventListener('click', () => closeModal(characterModal));
    
    openModal(characterModal);
}

function editCurrentCharacter() {
    if (!currentCharacterId) return;
    
    const character = storage.getCharacterById(currentCharacterId);
    if (!character) {
        showMessage('Personagem não encontrado.', 'is-danger');
        return;
    }
    
    // Preencher o formulário com os dados do personagem
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
    
    // Atualizar o botão de salvar para indicar que é uma edição
    saveCharacterBtn.innerHTML = '<i class="fas fa-save"></i>&nbsp; Atualizar Personagem';
    saveCharacterBtn.classList.add('is-warning');
    
    // Garantir que o texto permaneça branco
    saveCharacterBtn.style.color = 'white';
    
    // Fechar o modal e rolar para o formulário
    closeModal(characterModal);
    characterForm.scrollIntoView({ behavior: 'smooth' });
    
    // Feedback visual
    showMessage('Editando personagem: ' + character.name, 'is-info');
    if (typeof magoCompanion !== 'undefined') {
        magoCompanion.speak(`Editando ${character.name}. Faça suas alterações!`, 3000);
    }
}

function deleteCurrentCharacter() {
    if (!currentCharacterId) return;
    
    // Confirmar exclusão
    if (confirm('Tem certeza que deseja excluir este personagem? Esta ação não pode ser desfeita.')) {
        const character = storage.getCharacterById(currentCharacterId);
        if (!character) {
            showMessage('Personagem não encontrado.', 'is-danger');
            return;
        }
        
        // Excluir o personagem
        const success = storage.deleteCharacter(currentCharacterId);
        
        if (success) {
            // Atualizar a lista de personagens
            renderCharactersList();
            
            // Fechar o modal
            closeModal(characterModal);
            
            // Feedback visual
            showMessage(`Personagem ${character.name} excluído com sucesso!`, 'is-warning');
            if (typeof magoCompanion !== 'undefined') {
                magoCompanion.speak(`${character.name} foi removido do seu grimório de heróis!`, 3000);
            }
            
            // Resetar o ID atual
            currentCharacterId = null;
        } else {
            showMessage('Erro ao excluir personagem.', 'is-danger');
        }
    }
}

// Função para abrir o modal de carregamento, centralizado na viewport
function openLoadingModal() {
    if (!loadingModal) {
        console.error('Modal de carregamento não encontrado');
        return;
    }
    
    loadingModal.classList.add('is-active');
    
    const modalContent = loadingModal.querySelector('.modal-content');
    if (modalContent) {
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        const modalHeight = modalContent.offsetHeight;
        const modalWidth = modalContent.offsetWidth;

        const topPosition = (viewportHeight - modalHeight) / 2 + window.scrollY;
        const leftPosition = (viewportWidth - modalWidth) / 2 + window.scrollX;

        modalContent.style.top = `${topPosition}px`;
        modalContent.style.left = `${leftPosition}px`;
        modalContent.style.transform = 'none';
        modalContent.style.opacity = '0';
        
        setTimeout(() => {
            modalContent.style.opacity = '1';
        }, 50);
    }
}

// Função para gerar o prompt com contexto de raças e classes
function generatePrompt(characterData) {
    const raceSummaries = {
        'Humano': 'Versátil e adaptável, sem bônus ou penalidades especiais. Representam a maioria em Arton, com grande presença em cidades como Valkaria.',
        'Anão': 'Robustos e resilientes, com bônus em Constituição e penalidade em Carisma. Habitam montanhas como Doherimm, são exímios mineiros e ferreiros.',
        'Dahllan': 'Semelhantes a meio-elfos, ligados à natureza, com bônus em Sabedoria e Destreza, penalidade em Inteligência. Têm habilidades relacionadas a plantas e animais, como lançar magias de controle de plantas.',
        'Elfo': 'Graciosos e longevos, com bônus em Destreza e Inteligência, penalidade em Constituição. Vivem em florestas como Lenórienn, são arqueros e magos habilidosos.',
        'Goblin': 'Pequenos e astutos, com bônus em Destreza, penalidades em Força ou Carisma. Especializados em furtividade e armadilhas, comuns em áreas como Tollon.',
        'Lefou': 'Meio-demônios afetados pela Tormenta, com bônus em dois atributos (exceto Carisma) e penalidade em Carisma. Têm visão no escuro e habilidades monstruosas, ligados à escuridão.',
        'Minotauro': 'Fortes e ferozes, com bônus em Força e Constituição, penalidades em Inteligência ou Carisma. Excelentes em combate, intimidam facilmente, habitam áreas selvagens.',
        'Qareen': 'Meio-gênios com habilidades mágicas, bônus em Carisma e Inteligência, penalidade em Sabedoria. Podem conceder desejos, com resistência a elementos, comuns em áreas mágicas.',
        'Golem': 'Seres artificiais, com alta resistência e força, sem necessidade de sono ou comida. Podem ter imunidades a certos efeitos, como medo.',
        'Hynne': 'Pequenas criaturas mágicas, com bônus em Destreza e Carisma, penalidade em Força. Têm habilidades de sorte, como rolar novamente testes de resistência, e são ágeis.',
        'Kliren': 'Semelhantes a gnomos, com bônus em Inteligência, penalidade em Força. Têm habilidades lógicas, como usar Inteligência em testes variados, e são engenhosos.',
        'Medusa': 'Inspiradas na mitologia, com possíveis habilidades de petrificação, bônus em Carisma ou Destreza. Têm aparência exótica, comuns em áreas isoladas.',
        'Osteon': 'Esqueletos animados, possivelmente não mortos, com imunidades a efeitos como sono, bônus em Constituição. Têm resistência física elevada.',
        'Sereia/Tritão': 'Seres aquáticos, com bônus em Destreza e Constituição, habilidades de natação e sobrevivência na água, ligados a oceanos e rios.',
        'Sílfide': 'Relacionadas ao ar e vento, com bônus em Destreza e Inteligência, habilidades mágicas ligadas ao elemento, leves e ágeis.',
        'Suraggel': 'Descendentes de anjos ou demônios, com bônus em Sabedoria ou Carisma, habilidades baseadas em sua herança divina ou infernal, ligados a planos espirituais.',
        'Trong': 'Provavelmente trolls ou criaturas similares, com bônus em Força e Constituição, habilidades de regeneração, resistentes e ferozes em combate.'
    };

    const classSummaries = {
        'Arcanista': 'Especialista em magias arcanas, lança feitiços ofensivos e utilitários, como estudante da Academia Arcana de Yuden, central em combate mágico.',
        'Bárbaro': 'Guerreiro focado em força e fúria, ganha bônus em dano e resistência ao entrar em raiva, ideal para combates brutais, comum em áreas selvagens.',
        'Bardo': 'Carismático, usa música e performance para inspirar aliados e manipular inimigos, lança magias leves, central em interações sociais, como em tavernas de Norm.',
        'Bucaneiro': 'Espadachim e navegador, com habilidades de acrobacia e pirataria, proficiente em espadas e navegação, comum em mares e portos como Portsmonth.',
        'Caçador': 'Rastreador e arqueiro, com habilidades de sobrevivência e manejo de animais, protege fronteiras, como nas florestas de Sckharshantallas, versátil em combate à distância.',
        'Cavaleiro': 'Cavaleiro montado, focado em combate com armadura pesada e lança, segue código de cavalaria, central em batalhas organizadas, como em Vectora.',
        'Clérigo': 'Sacerdote devoto, cura aliados e combate com magias divinas, ligado a deuses como Khalmyr, essencial em apoio e combate contra o mal.',
        'Druida': 'Conectado à natureza, lança magias baseadas em elementos, pode se transformar, protege florestas, como em Lenórienn, central em equilíbrio natural.',
        'Guerreiro': 'Combatente geral, proficiente em armas e armaduras, equilibrado sem especializações, comum em batalhas diversas, como em Norm.',
        'Inventor': 'Tecnólogo, cria gadgets e máquinas, usa dispositivos em combate e exploração, inovador, central em estratégias criativas, como em Deheon.',
        'Ladino': 'Ladrão furtivo, especialista em furtividade, armadilhas e ataques sorrateiros, comum em ruas de Malpetrim, central em missões clandestinas.',
        'Lutador': 'Combatente corpo a corpo, focado em artes marciais, proficiente em lutas desarmadas, ágil em combate próximo, como em arenas.',
        'Nobre': 'Classe de status social, com liderança e influência, pode ter treinamento em combate, central em política e diplomacia, como em Valkaria.',
        'Paladino': 'Guerreiro sagrado, segue código de honra, lança magias divinas, combate o mal, como em Yuden, central em missões de justiça.'
    };

    const raceSummary = raceSummaries[characterData.race] || raceSummaries['Humano'];
    const classSummary = classSummaries[characterData.class] || classSummaries['Guerreiro'];

    return `
        Gere uma história curta (100-200 palavras) para um personagem de RPG no mundo de Arton, do sistema Tormenta 20. Aqui estão os detalhes do personagem:
        - Nome: ${characterData.name}
        - Raça: ${characterData.race} (${raceSummary})
        - Classe: ${characterData.class} (${classSummary})
        - Alinhamento: ${characterData.alignment}
        - Atributos: Força ${characterData.attributes.strength}, Destreza ${characterData.attributes.dexterity}, Constituição ${characterData.attributes.constitution}, Inteligência ${characterData.attributes.intelligence}, Sabedoria ${characterData.attributes.wisdom}, Carisma ${characterData.attributes.charisma}
        A história deve ser escrita em português, em um estilo de fantasia épica, refletindo o lore de Arton e as características da raça e classe do personagem.
    `;
}

// Função para chamar o servidor local Python
async function fetchBackstoryFromLocal(prompt) {
    try {
        const response = await fetch('http://127.0.0.1:5000/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt: prompt })
        });

        if (!response.ok) {
            throw new Error('Erro na requisição ao servidor local: ' + response.statusText);
        }

        const data = await response.json();
        console.log('Resposta do servidor local:', data);

        if (data.error) {
            throw new Error(data.error);
        }

        return data.backstory || null;
    } catch (error) {
        console.error('Erro ao gerar história localmente:', error);
        return null;
    }
}

// Função antiga como fallback
function generateSimpleLore(character) {
    const raceTemplates = {
        'Humano': [
            `Nascido na cidade de Valkaria, ${character.name} cresceu sob a proteção da Deusa da Humanidade.`,
            `Originário de Nova Malpetrim, ${character.name} enfrentou os perigos da Tormenta desde jovem.`,
            `Vindo de Tamu-ra, ${character.name} deixou sua vila para buscar um destino maior em Arton.`
        ],
        'Anão': [
            `${character.name} foi forjado nas minas de Doherimm, o reino anão sob as montanhas.`,
            `Nascido em Khalifor, ${character.name} carrega o orgulho de sua linhagem de ferreiros.`,
            `Criado entre martelos e bigornas, ${character.name} saiu de uma fortaleza anã para explorar Arton.`
        ],
        'Dahllan': [
            `${character.name} nasceu em um bosque sagrado de Lenórienn, conectada às forças da natureza.`,
            `Criada entre flores e espíritos selvagens, ${character.name} protege os segredos de Allihanna.`,
            `Vinda de florestas intocadas, ${character.name} dança com as plantas em sua jornada por Arton.`
        ],
        'Elfo': [
            `${character.name} nasceu nas florestas de Lenórienn, lar ancestral dos elfos de Arton.`,
            `Vindo da corte de Allania, ${character.name} carrega as tradições mágicas de seu povo.`,
            `${character.name} cresceu entre as árvores de Gilfien, mestre dos arcos e feitiços.`
        ],
        'Goblin': [
            `Nascido em uma toca em Tollon, ${character.name} sobreviveu com astúcia e malícia.`,
            `${character.name} cresceu entre os goblins de Zakharov, roubando para provar seu valor.`,
            `Vindo das ruínas de Arton, ${character.name} é um goblin esperto fugindo da Tormenta.`
        ],
        'Lefou': [
            `${character.name} emergiu de uma área rubra em Lamnor, marcado pela Tormenta.`,
            `Criado entre sombras e pesadelos, ${character.name} carrega o fardo de sua origem demoníaca.`,
            `Vindo das terras corruptas, ${character.name} busca redenção ou poder em Arton.`
        ],
        'Minotauro': [
            `${character.name} nasceu nas estepes de Galrasia, criado entre guerreiros selvagens.`,
            `Com chifres imponentes, ${character.name} deixou sua tribo em busca de glória em Lamnor.`,
            `${character.name} cresceu em cavernas de Trebuck, temido por sua força bruta.`
        ],
        'Qareen': [
            `${character.name} nasceu em um oásis de Wynlla, herdeiro de desejos mágicos.`,
            `Vindo de um portal em Vectora, ${character.name} encanta com seu sangue de gênio.`,
            `${character.name} cresceu em mercados de Yuden, negociando feitiços e promessas.`
        ],
        'Golem': [
            `${character.name} foi ativado em um laboratório esquecido de Deheon, feito de pedra e magia.`,
            `Sem memórias de criação, ${character.name} vaga por Arton em busca de propósito.`,
            `Construído em Norm, ${character.name} é uma relíquia viva de eras passadas.`
        ],
        'Hynne': [
            `${character.name} nasceu em Tapista, entre halflings e suas festas alegres.`,
            `Criado em Fortuna, ${character.name} usa sua sorte para escapar de perigos.`,
            `Vindo de Pequeno Povo, ${character.name} é pequeno mas cheio de bravura.`
        ],
        'Kliren': [
            `${character.name} nasceu em Triunfo, obcecado por enigmas e invenções.`,
            `Criado em Vectora, ${character.name} resolve problemas com sua mente afiada.`,
            `Vindo de um vilarejo em Deheon, ${character.name} é um mestre da lógica.`
        ],
        'Medusa': [
            `${character.name} surgiu em cavernas de Sckharshantallas, com serpentes como companhia.`,
            `Vinda de ruínas em Lamnor, ${character.name} encanta e petrifica com seu olhar.`,
            `${character.name} cresceu isolada em Trebuck, temida por sua aparência exótica.`
        ],
        'Osteon': [
            `${character.name} foi animado em um ritual sombrio em Galrasia, ossos sem carne.`,
            `Vindo de cemitérios de Malpetrim, ${character.name} busca entender sua existência.`,
            `Criado por necromancia em Vectora, ${character.name} é um eco da morte em Arton.`
        ],
        'Sereia/Tritão': [
            `${character.name} emergiu das águas de Portsmonth, guardião dos segredos do mar.`,
            `Nascido em recifes de Tamu-ra, ${character.name} canta com as ondas.`,
            `Vindo do oceano de Arton, ${character.name} explora a terra com curiosidade.`
        ],
        'Sílfide': [
            `${character.name} nasceu nas nuvens de Wynlla, leve como o vento.`,
            `Criada entre brisas de Lenórienn, ${character.name} dança com os elementos.`,
            `Vinda de picos de Yuden, ${character.name} voa livremente por Arton.`
        ],
        'Suraggel': [
            `${character.name} descende de celestiais em Thyatis, tocado por luz divina.`,
            `Nascido em sombras de Lamnor, ${character.name} carrega um legado infernal.`,
            `Vindo de um plano espiritual, ${character.name} busca equilíbrio em Arton.`
        ],
        'Trong': [
            `${character.name} nasceu em pântanos de Sckharshantallas, regenerando-se a cada ferida.`,
            `Criado em cavernas de Galrasia, ${character.name} é uma força da natureza.`,
            `Vindo de florestas selvagens, ${character.name} ruge contra os inimigos de Arton.`
        ]
    };

    const classTemplates = {
        'Arcanista': [
            `Estudante da Academia Arcana de Yuden, ${character.name} domina os segredos da magia.`,
            `Após um tomo proibido em Vectora, ${character.name} busca poder arcano perdido.`,
            `${character.name} explora Arton, lançando feitiços contra a Tormenta.`
        ],
        'Bárbaro': [
            `Criado nas estepes de Lamnor, ${character.name} entra em fúria contra seus inimigos.`,
            `Vindo de Galrasia, ${character.name} luta com a força de um titã selvagem.`,
            `${character.name} protege sua tribo em Trebuck com gritos de guerra.`
        ],
        'Bardo': [
            `${character.name} canta lendas em tavernas de Norm, encantando multidões.`,
            `Formado em Triunfo, ${character.name} inspira aliados com suas canções.`,
            `Viajante de Deheon, ${character.name} coleta histórias de Arton.`
        ],
        'Bucaneiro': [
            `${character.name} navegou os mares de Portsmonth, espada na mão.`,
            `Criado entre piratas de Tamu-ra, ${character.name} dança com lâminas.`,
            `${character.name} busca tesouros em Vectora, mestre da agilidade.`
        ],
        'Caçador': [
            `${character.name} rastreia presas em Sckharshantallas, arco em punho.`,
            `Treinado em Bielefeld, ${character.name} protege as fronteiras de Arton.`,
            `${character.name} caça criaturas da Tormenta com instintos afiados.`
        ],
        'Cavaleiro': [
            `${character.name} cavalga em Vectora, seguindo um código de honra.`,
            `Nascido em Norm, ${character.name} luta com lança e armadura pesada.`,
            `${character.name} defende o Reinado com sua montaria leal.`
        ],
        'Clérigo': [
            `${character.name} serve o Pantheon em Valkaria, canalizando poder divino.`,
            `Criado em Thyatis, ${character.name} cura aliados com fé inabalável.`,
            `${character.name} combate o mal em Trebuck com bênçãos sagradas.`
        ],
        'Druida': [
            `${character.name} foi iniciado em Lenórienn, guardião da natureza.`,
            `Vindo de Tamu-ra, ${character.name} fala com os espíritos da floresta.`,
            `${character.name} transforma-se para proteger Arton do desequilíbrio.`
        ],
        'Guerreiro': [
            `Treinado em Norm, ${character.name} é um mestre das armas de Arton.`,
            `Veterano da Tormenta, ${character.name} busca glória em combate.`,
            `${character.name} protege os fracos com espada e escudo em Deheon.`
        ],
        'Inventor': [
            `${character.name} criou máquinas em Vectora, gênio da tecnologia.`,
            `Nascido em Triunfo, ${character.name} usa gadgets contra a Tormenta.`,
            `${character.name} explora Arton com invenções revolucionárias.`
        ],
        'Ladino': [
            `${character.name} cresceu em Malpetrim, mestre do furtos e sombras.`,
            `Membro dos Ladrões de Deheon, ${character.name} vive na clandestinidade.`,
            `${character.name} engana inimigos em Portsmonth com astúcia.`
        ],
        'Lutador': [
            `${character.name} lutou em arenas de Yuden, punhos como armas.`,
            `Criado em Norm, ${character.name} domina artes marciais.`,
            `${character.name} enfrenta desafios em Arton com força bruta.`
        ],
        'Nobre': [
            `${character.name} nasceu em Valkaria, líder por direito de sangue.`,
            `Criado em Vectora, ${character.name} comanda com carisma e espada.`,
            `${character.name} negocia paz em Deheon, herdeiro de um legado.`
        ],
        'Paladino': [
            `${character.name} jurou em Yuden combater a Tormenta com justiça.`,
            `Escolhido por Khalmyr, ${character.name} brilha como farol em Arton.`,
            `${character.name} carrega uma armadura sagrada em Norm.`
        ]
    };

    const alignmentTemplates = {
        'Leal e Bom': [
            `Guiado por honra, ${character.name} protege os inocentes de Arton.`,
            `Com justiça no coração, ${character.name} enfrenta o mal sem hesitar.`
        ],
        'Neutro e Bom': [
            `${character.name} ajuda quem precisa, sem se prender a regras rígidas.`,
            `Seguindo seu coração, ${character.name} faz o bem em Arton.`
        ],
        'Caótico e Bom': [
            `${character.name} age por bondade, desafiando leis injustas.`,
            `Livre e generoso, ${character.name} busca o bem à sua maneira.`
        ],
        'Leal e Neutro': [
            `A ordem é essencial para ${character.name}, mesmo em escolhas difíceis.`,
            `${character.name} mantém a estrutura do Reinado com devoção.`
        ],
        'Neutro': [
            `${character.name} busca equilíbrio, julgando cada caso em Arton.`,
            `${character.name} vive conforme a situação exige, sem extremos.`
        ],
        'Caótico e Neutro': [
            `${character.name} valoriza sua liberdade acima de tudo em Arton.`,
            `${character.name} segue seus instintos, rejeitando restrições.`
        ],
        'Leal e Mau': [
            `${character.name} segue um código egoísta, servindo seus interesses.`,
            `Calculista, ${character.name} usa a ordem para seu ganho em Arton.`
        ],
        'Neutro e Mau': [
            `${character.name} busca seus objetivos sem se importar com outros.`,
            `Pragmático, ${character.name} prioriza o poder em Arton.`
        ],
        'Caótico e Mau': [
            `${character.name} espalha caos e destruição por onde passa.`,
            `${character.name} rejeita autoridade, vivendo para seus desejos sombrios.`
        ]
    };

    const raceOptions = raceTemplates[character.race] || raceTemplates['Humano'];
    const classOptions = classTemplates[character.class] || classTemplates['Guerreiro'];
    const alignmentOptions = alignmentTemplates[character.alignment] || alignmentTemplates['Neutro'];

    const raceText = raceOptions[Math.floor(Math.random() * raceOptions.length)];
    const classText = classOptions[Math.floor(Math.random() * classOptions.length)];
    const alignmentText = alignmentOptions[Math.floor(Math.random() * alignmentOptions.length)];

    let attributeTexts = [];
    if (character.attributes.strength >= 14) {
        attributeTexts.push(`A força de ${character.name} impressiona até os guerreiros de Lamnor.`);
    } else if (character.attributes.strength <= 8) {
        attributeTexts.push(`${character.name} compensa sua fraqueza com outras habilidades.`);
    }
    if (character.attributes.intelligence >= 14) {
        attributeTexts.push(`A mente de ${character.name} rivaliza com os sábios de Vectora.`);
    } else if (character.attributes.intelligence <= 8) {
        attributeTexts.push(`${character.name} prefere ações práticas a pensamentos complexos.`);
    }
    if (character.attributes.charisma >= 14) {
        attributeTexts.push(`O carisma de ${character.name} atrai seguidores em todo o Reinado.`);
    } else if (character.attributes.charisma <= 8) {
        attributeTexts.push(`${character.name} evita multidões, preferindo a solidão.`);
    }
    const attributeText = attributeTexts.length > 0 ? attributeTexts[Math.floor(Math.random() * attributeTexts.length)] : '';

    const adventureHooks = [
        `${character.name} busca enfrentar os horrores da Tormenta em Arton.`,
        `Uma profecia em Triunfo aponta ${character.name} como chave para o Reinado.`,
        `Um artefato em Lamnor chama ${character.name} em sonhos sombrios.`,
        `${character.name} explora Deheon em busca de respostas sobre a Tormenta.`,
        `Após perder tudo para a Tormenta, ${character.name} jurou vingança.`,
        `Rumores de um tesouro em Vectora levam ${character.name} a uma jornada.`
    ];
    const adventureText = adventureHooks[Math.floor(Math.random() * adventureHooks.length)];

    return `${raceText} ${classText} ${alignmentText} ${attributeText} ${adventureText}`;
}

// Função atualizada para gerar a história com o servidor local e corrigir o textArea
async function generateCharacterLore() {
    let characterData;
    if (currentCharacterId) {
        characterData = storage.getCharacterById(currentCharacterId);
    } else {
        characterData = {
            name: document.getElementById('charName').value,
            race: document.getElementById('charRace').value,
            class: document.getElementById('charClass').value,
            alignment: document.getElementById('charAlignment').value,
            attributes: {
                strength: parseInt(document.getElementById('attrStr').value),
                dexterity: parseInt(document.getElementById('attrDex').value),
                constitution: parseInt(document.getElementById('attrCon').value),
                intelligence: parseInt(document.getElementById('attrInt').value),
                wisdom: parseInt(document.getElementById('attrWis').value),
                charisma: parseInt(document.getElementById('attrCha').value)
            },
            background: document.getElementById('charBackground').value
        };
    }
    
    if (!characterData.name) {
        showMessage('Por favor, dê um nome ao seu personagem antes de gerar sua história.', 'is-danger');
        return;
    }
    
    openLoadingModal();
    if (typeof magoCompanion !== 'undefined') {
        magoCompanion.speak("Deixe-me consultar os pergaminhos antigos...", 3000);
    }
    
    const prompt = generatePrompt(characterData);
    console.log('Prompt enviado:', prompt);
    const backstoryFromLocal = await fetchBackstoryFromLocal(prompt);
    
    let finalBackstory;
    if (backstoryFromLocal) {
        finalBackstory = backstoryFromLocal;
        if (typeof magoCompanion !== 'undefined') {
            magoCompanion.speak("Uma história digna das tavernas de Arton!", 3000);
        }
    } else {
        console.log('Servidor local falhou, usando fallback...');
        finalBackstory = generateSimpleLore(characterData);
        if (typeof magoCompanion !== 'undefined') {
            magoCompanion.speak("Minha magia falhou, mas os velhos contos ainda servem!", 3000);
        }
        showMessage('O servidor local falhou, mas geramos uma história alternativa!', 'is-warning');
    }
    
    const backgroundTextArea = document.getElementById('charBackground');
    backgroundTextArea.value = finalBackstory;
    
    if (currentCharacterId) {
        const character = storage.getCharacterById(currentCharacterId);
        if (character) {
            character.background = finalBackstory;
            storage.saveCharacter(character);
        }
    }
    
    closeModal(loadingModal);
    showMessage('História gerada com sucesso!', 'is-success');
    backgroundTextArea.classList.add('highlight');
    setTimeout(() => backgroundTextArea.classList.remove('highlight'), 1000);
}

function openModal(modal) {
    if (!modal) {
        console.error('Modal não encontrado');
        return;
    }
    modal.classList.add('is-active');
    const modalCard = modal.querySelector('.modal-card');
    if (modalCard) {
        modalCard.style.opacity = '0';
        setTimeout(() => modalCard.style.opacity = '1', 50);
    }
}

function closeModal(modal) {
    modal.classList.remove('is-active');
}

function showMessage(message, type = 'is-info') {
    const messageEl = document.createElement('div');
    messageEl.className = `notification ${type} is-light`;
    messageEl.style.position = 'fixed';
    messageEl.style.top = '1rem';
    messageEl.style.right = '1rem';
    messageEl.style.zIndex = '9999';
    messageEl.style.maxWidth = '300px';
    messageEl.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.2)';
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'delete';
    closeBtn.addEventListener('click', () => document.body.removeChild(messageEl));
    
    messageEl.appendChild(closeBtn);
    messageEl.appendChild(document.createTextNode(message));
    document.body.appendChild(messageEl);
    setTimeout(() => {
        if (document.body.contains(messageEl)) document.body.removeChild(messageEl);
    }, 5000);
}

function clearForm() {
    characterForm.reset();
    currentCharacterId = null;
    saveCharacterBtn.innerHTML = '<i class="fas fa-save"></i>&nbsp; Salvar Personagem';
    saveCharacterBtn.classList.remove('is-warning');
    saveCharacterBtn.style.color = '';
}