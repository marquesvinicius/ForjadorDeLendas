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
const backgroundTextArea = document.getElementById('charBackground');
import { applyWorldTheme } from './themeManager.js';

const savedWorld = localStorage.getItem('selectedWorld') || 'dnd';
applyWorldTheme(savedWorld);

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
document.addEventListener('DOMContentLoaded', function () {
    setupEventListeners();
    renderCharactersList();
    if (typeof magoCompanion !== 'undefined') {
        magoCompanion.init();
    } else {
        console.error('magoCompanion não está definido. Verifique companion.js');
    }
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
    document.addEventListener('worldChanged', renderCharactersList);
}

// Carregar personagens do localStorage
function loadCharacters() {
    const savedCharacters = localStorage.getItem('rpg_characters');
    if (savedCharacters) {
        characters = JSON.parse(savedCharacters);
        renderCharactersList();
    }
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
        world: savedWorld,
        attributes: {
            strength: parseInt(document.getElementById('attrStr').value),
            dexterity: parseInt(document.getElementById('attrDex').value),
            constitution: parseInt(document.getElementById('attrCon').value),
            intelligence: parseInt(document.getElementById('attrInt').value),
            wisdom: parseInt(document.getElementById('attrWis').value),
            charisma: parseInt(document.getElementById('attrCha').value)
        },
        background: backgroundTextArea.value
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

        // Tenta destacar e rolar suavemente para o novo card
        setTimeout(() => { // Pequeno delay para garantir que o DOM foi atualizado por renderCharactersList
            const newCard = savedCharactersList.querySelector(`.character-card[data-id="${savedCharacter.id}"]`);
            if (newCard) {
                newCard.classList.add('new-character-highlight');
                newCard.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
                setTimeout(() => {
                    newCard.classList.remove('new-character-highlight');
                }, 2500); // Remove o destaque após 2.5 segundos
            }
        }, 100);
    }

    // document.querySelector('.saved-characters-section').scrollIntoView({ behavior: 'smooth' }); // Comentado anteriormente
}

function rollAttributes() {
    function rollStat() {
        const rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1);
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
    console.log('Personagens carregados:', characters); // Debug

    const currentSelectedWorld = localStorage.getItem('selectedWorld') || 'dnd';
    const filteredCharacters = characters.filter(character => {
        if (!character.world && currentSelectedWorld === 'dnd') {
            return true;
        }
        return character.world === currentSelectedWorld;
    });

    if (filteredCharacters.length === 0) {
        savedCharactersList.innerHTML = '<p class="empty-list-message">Nenhum herói criado para este mundo ainda. Comece a forjar sua lenda!</p>';
        return;
    }


    savedCharactersList.innerHTML = '';
    filteredCharacters.forEach(character => {
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

    const worldDisplayNames = {
        'dnd': 'D&D 5e',
        'tormenta': 'Tormenta 20',
        'ordem-paranormal': 'Ordem Paranormal'
    };

    const characterWorldId = character.world || 'dnd'; // Assume 'dnd' se não houver mundo definido
    const characterWorldName = worldDisplayNames[characterWorldId] || characterWorldId; // Usa o ID se não houver nome amigável

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
    // characterForm.scrollIntoView({ behavior: 'smooth' }); // Comentado para prevenir scroll indesejado

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

// Função para abrir o modal de carregamento
function openLoadingModal() {
    if (!loadingModal) {
        console.error('Modal de carregamento não encontrado');
        return;
    }

    // Força o modal a aparecer
    loadingModal.style.display = 'flex';
    loadingModal.classList.add('is-active');

    // Garante que o conteúdo do modal seja visível
    const modalContent = loadingModal.querySelector('.modal-content');
    if (modalContent) {
        modalContent.style.opacity = '1';
        modalContent.style.transform = 'translateY(0)';
    }
}

// Função para fechar o modal de carregamento
function closeLoadingModal() {
    if (!loadingModal) return;

    // Adiciona um delay mínimo de 2 segundos antes de fechar
    setTimeout(() => {
        // Remove a classe ativa
        loadingModal.classList.remove('is-active');

        // Esconde o modal após a transição
        setTimeout(() => {
            loadingModal.style.display = 'none';
        }, 300);
    }, 2000); // 2 segundos de delay mínimo
}

// Função para gerar o prompt com contexto de raças e classes
function generatePrompt(characterData) {
    const raceSummaries = {
        'Humano': 'Versáteis, ambiciosos e adaptáveis, os humanos representam a maioria em Arton. Capazes de trilhar qualquer caminho, moldam o mundo com sua vontade e perseverança. Seguem Valkaria, a Deusa da Evolução e da Jornada. Presentes em todas as cidades, dominam centros como Valkaria, Deheon e Portsmouth. Sua diversidade é sua maior força.',
        'Anão': 'Oriundos das montanhas de Doherimm, anões são robustos, honrados e resilientes. Artesãos lendários, mestres das forjas e da mineração, reverenciam Khalmyr, deus da justiça. Vivem em sociedades rigidamente hierárquicas, prezando pela tradição, pela palavra dada e pela vingança contra inimigos antigos.',
        'Dahllan': 'Criaturas féericas criadas pela Deusa Allihanna para proteger a natureza. Sua aparência mistura traços humanos e vegetais, com seiva em vez de sangue e flores adornando seus corpos. Dahllan têm forte ligação com as florestas de Arton, como as matas de Lenórienn, e carregam o peso da missão de equilibrar o mundo natural contra a devastação.',
        'Elfo': 'Antigos senhores de Lenórienn, os elfos são graciosos, longevos e dotados de afinidade natural com a magia. A destruição de sua cidade pela Tormenta marcou-os para sempre, gerando facções: uns buscam reconstrução, outros, vingança. São orgulhosos, refinados e fortemente ligados às artes arcanas e ao culto de Glórienn.',
        'Goblin': 'Pequenos sobreviventes de Tollon, goblins são engenhosos, caóticos e extremamente adaptáveis. Embora vistos como trapaceiros e canalhas pela maioria das raças civilizadas, suas sociedades florescem no subterrâneo e nas ruínas, onde criam engenhocas improvisadas e técnicas peculiares de sobrevivência.',
        'Lefou': 'Marcados pela corrupção da Tormenta, Lefou são seres deformados, mas ainda dotados de alma. Lutar contra sua natureza é um desafio constante: alguns buscam redenção; outros aceitam sua monstruosidade. Sua mera presença desperta medo e preconceito em Arton, mesmo entre aventureiros.',
        'Minotauro': 'Guerreiros orgulhosos oriundos de Tapista, minotauros veneravam Tauron, o deus da força, agora morto. Em busca de um novo propósito, muitos abandonaram o militarismo cego e hoje lutam para provar seu valor, com força bruta e disciplina férrea. Sua cultura valoriza honra e conquista.',
        'Qareen': 'Descendentes dos gênios, os qareen são belos, carismáticos e profundamente ligados à magia elemental. Têm uma aura sobrenatural e são considerados afortunados ou amaldiçoados. Vivem principalmente em Wynlla, a nação da magia, e são conhecidos por sua facilidade em manipular energias místicas.',
        'Golem': 'Seres artificiais criados por magos há séculos, golems desenvolveram consciência própria. Sem fome, sede ou necessidade de descanso, buscam compreender o significado da vida. Alguns servem seus criadores, outros viajam em busca de identidade própria. Carregam resistência sobrenatural e emoções adormecidas.',
        'Hynne': 'Pequenos seres similares a halflings, vindos de comunidades alegres e viajantes como Tapista. Hynne são amantes da boa vida, da sorte e da liberdade. Preferem evitar confrontos, usando sua agilidade e astúcia para escapar de perigos, mas podem surpreender com coragem inesperada.',
        'Kliren': 'Descendentes de gnomos vindos de outros planos, kliren são inovadores, excêntricos e altamente inteligentes. Obcecados por tecnologia, experimentam incessantemente com alquimia, invenções e magia científica. Muitos vivem em Vectora, a cidade voadora, buscando desafios intelectuais.',
        'Medusa': 'Seres amaldiçoados por aparências monstruosas e olhos capazes de petrificar. Medusas vivem isoladas por medo ou são caçadas como aberrações. Algumas buscam integrar-se à sociedade de Arton, ocultando sua natureza; outras abraçam sua solidão ou formam enclaves secretos.',
        'Osteon': 'Mortos-vivos conscientes originados por alterações no ciclo natural da morte. Mantêm sua inteligência e personalidade após a morte, mas enfrentam o preconceito dos vivos. Muitos osteon são movidos por deveres inacabados ou propósitos maiores, rejeitando o destino de simples cadáveres ambulantes.',
        'Sereia/Tritão': 'Seres anfíbios, habitantes dos oceanos que cercam Arton, como o Grande Oceano. Dotados de voz encantadora e adaptabilidade aquática, sereias e tritões exploram tanto os recifes secretos quanto as cidades costeiras, equilibrando curiosidade e desconfiança dos terrestres.',
        'Sílfide': 'Espíritos alados ligados ao vento, as sílfides são leves, esvoaçantes e brincalhonas. Vivem entre nuvens e montanhas, muitas vezes servindo Marah, deusa da bondade e da liberdade. Possuem habilidades mágicas relacionadas ao ar e à fuga.',
        'Suraggel': 'Descendentes de extraplanares — anjos, demônios, ou ambos. Suraggel vivem divididos entre luz e trevas, carregando características de seus ancestrais. São admirados e temidos em igual medida, tanto entre nobres quanto entre camponeses supersticiosos.',
        'Trong': 'Seres reptilianos de força colossal, oriundos de regiões pantanosas e cavernosas. Apesar da aparência bruta e da fala limitada, possuem inteligência pragmática e uma ferocidade incomparável em batalha. Valorizam clãs e sobrevivência acima de tudo.'
    };

    const classSummaries = {
        'Arcanista': 'Mestre das artes arcanas, os arcanistas canalizam o poder mágico puro através de anos de estudo ou talento inato. Podem ser magos eruditos da Academia Arcana em Wynlla ou feiticeiros cuja magia pulsa no sangue. Moldam a realidade com feitiços devastadores, ilusões complexas e proteções místicas.',
        'Bárbaro': 'Guerreiros selvagens que lutam impulsionados por uma fúria primal, os bárbaros dominam as regiões mais indomadas de Arton, como as estepes de Tapista ou os ermos de Lamnor. Preferem a força bruta e o instinto ao invés da estratégia refinada, canalizando raiva em resistência sobrenatural.',
        'Bardo': 'Artistas inspirados, os bardos tecem magia através da música, poesia e oratória. Viajantes incansáveis, eles são historiadores, espiões e líderes carismáticos. Utilizando canções arcanas, podem curar ferimentos, lançar encantamentos e motivar aliados em combates épicos ou intrigas cortesãs.',
        'Bucaneiro': 'Corsários e aventureiros marítimos, os bucaneiros são exímios em navegação, combate ágil e vida pirata. Dominam cidades portuárias como Portsmouth e navegam os mares de Arton em busca de glória, ouro e liberdade. Mestres do acrobático e do improviso em batalha.',
        'Caçador': 'Especialistas em sobrevivência e rastreamento, caçadores dominam as fronteiras do Reinado, protegendo civilizações contra feras e horrores da Tormenta. Arqueiros letais e mestres dos terrenos difíceis, sua ligação com a natureza é tanto pragmática quanto reverente.',
        'Cavaleiro': 'Defensores da honra e da justiça, cavaleiros seguem códigos rígidos de conduta e lealdade. Lutam montados em corcéis treinados, vestindo armaduras reluzentes. São figuras de prestígio em reinos como Deheon e Valkaria, sendo tanto campeões de guerras quanto ícones de esperança.',
        'Clérigo': 'Canalizadores da vontade divina, clérigos servem deuses do Panteão como Khalmyr, Lena ou Azgher. Capazes de curar aliados, banir mortos-vivos e invocar milagres, são tanto pregadores fervorosos quanto guerreiros sagrados. Seu poder varia conforme a fé e a divindade servida.',
        'Druida': 'Protetores do ciclo natural, druidas reverenciam Allihanna e os espíritos da terra, transformando-se em animais ou controlando as forças da natureza. Guardiões secretos de florestas como Lenórienn ou protetores de regiões intocadas, eles lutam para manter o equilíbrio vital de Arton.',
        'Guerreiro': 'Combatentes versáteis, treinados em todas as armas e estilos, guerreiros formam o núcleo de exércitos, milícias e companhias mercenárias. De soldados de Yuden a gladiadores em arenas de Valkaria, são mestres em aproveitar a vantagem física no campo de batalha.',
        'Inventor': 'Mentes brilhantes em um mundo mágico, inventores criam engenhocas e dispositivos fantásticos. Unem ciência e magia, combinando alquimia, mecânica e engenhosidade em armas, armaduras e armadilhas inovadoras. Muitos se destacam em centros como Vectora, onde tecnologia e magia se entrelaçam.',
        'Ladino': 'Mestres das sombras, furtividade e trapaças, ladinos são especialistas em infiltração, espionagem e combate sorrateiro. Agem nas vielas de Malpetrim, nos becos de Portsmouth ou infiltram-se nas cortes do Reinado, usando astúcia, destreza e inteligência para sobreviver e prosperar.',
        'Lutador': 'Especialistas no combate corpo a corpo, lutadores aprimoram seu corpo como uma arma mortal. Treinados em academias de combate como as de Tapista ou autodidatas endurecidos pelas ruas, são capazes de subjugar oponentes com técnica pura, sem depender de armas ou armaduras pesadas.',
        'Nobre': 'Membros da aristocracia, nobres combinam refinamento, estratégia política e habilidade marcial. Treinados desde jovens em etiqueta, diplomacia e guerra, exercem influência sobre reinos e guildas. Alguns empunham espadas com tanta destreza quanto lidam com intrigas de salão.',
        'Paladino': 'Campeões sagrados, paladinos juram lealdade inquebrantável a deuses da justiça, como Khalmyr, ou da guerra justa, como Valkaria. Portadores de bênçãos divinas, curam aliados, banem criaturas malignas e erguem suas espadas pela ordem e pela honra, servindo como exemplo de virtude em tempos sombrios.'
    };

    const raceSummary = raceSummaries[characterData.race] || raceSummaries['Humano'];
    const classSummary = classSummaries[characterData.class] || classSummaries['Guerreiro'];

    const backgroundNote = characterData.background && characterData.background.trim() !== ""
        ? `Considere também esta informação adicional fornecida pelo jogador para enriquecer a história: "${characterData.background.trim()}".`
        : '';

    return `
Gere uma história curta (100-200 palavras) para um personagem de RPG no mundo de Arton, do sistema Tormenta 20. Aqui estão os detalhes do personagem:
- Nome: ${characterData.name}
- Raça: ${characterData.race} (${raceSummary})
- Classe: ${characterData.class} (${classSummary})
- Alinhamento: ${characterData.alignment}
- Atributos: Força ${characterData.attributes.strength}, Destreza ${characterData.attributes.dexterity}, Constituição ${characterData.attributes.constitution}, Inteligência ${characterData.attributes.intelligence}, Sabedoria ${characterData.attributes.wisdom}, Carisma ${characterData.attributes.charisma}
${backgroundNote}

Instruções adicionais:
- A história deve ser escrita em português com linguagem acessível e envolvente, em um estilo de fantasia épica, refletindo fielmente o lore de Arton e as características da raça e classe do personagem.
- Tente integrar elementos relevantes do cenário de Arton, como locais (Valkaria, Lenórienn, Vectora), eventos (Tormenta), e a influência dos deuses, se apropriado.
- A história deve ser coesa, fluida e envolvente, com um tom compatível com um mundo fantástico heróico.
`;
}

// Função para chamar o servidor local Python - melhorada com logs e tratamento de erros
async function fetchBackstoryFromLocal(prompt) {
    const startTime = Date.now();
    
    try {
        // Log do início da requisição
        if (typeof log !== 'undefined') {
            log.info('Iniciando geração de backstory via servidor...', { promptLength: prompt.length });
        } else {
            console.log('🔮 Iniciando geração de backstory via servidor...');
        }

        const response = await fetch('https://forjador-backend.onrender.com/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt: prompt })
        });

        // Verificação detalhada da resposta
        if (!response.ok) {
            const errorMessage = `Servidor retornou status ${response.status}: ${response.statusText}`;
            
            if (typeof log !== 'undefined') {
                log.error('Falha na requisição ao servidor', { 
                    status: response.status, 
                    statusText: response.statusText,
                    url: response.url 
                });
            }
            
            // Mensagem amigável baseada no status
            let friendlyMessage = '';
            switch (response.status) {
                case 429:
                    friendlyMessage = 'Muitas requisições simultâneas. Tente novamente em alguns segundos.';
                    break;
                case 500:
                    friendlyMessage = 'Erro interno do servidor. O serviço pode estar temporariamente indisponível.';
                    break;
                case 503:
                    friendlyMessage = 'Serviço temporariamente indisponível. Tentando novamente...';
                    break;
                default:
                    friendlyMessage = `Erro de conexão com o servidor (${response.status})`;
            }
            
            throw new Error(friendlyMessage);
        }

        const data = await response.json();
        const duration = Date.now() - startTime;
        
        // Log de sucesso com métricas
        if (typeof log !== 'undefined') {
            log.info('Backstory gerada com sucesso', { 
                duration: `${duration}ms`,
                backstoryLength: data.backstory?.length || 0
            });
        } else {
            console.log(`✅ Backstory gerada em ${duration}ms`);
        }

        if (data.error) {
            const errorMsg = `Erro do servidor: ${data.error}`;
            if (typeof log !== 'undefined') {
                log.error('Servidor retornou erro', { error: data.error });
            }
            throw new Error(errorMsg);
        }

        if (!data.backstory) {
            const warningMsg = 'Servidor não retornou backstory válida';
            if (typeof log !== 'undefined') {
                log.warn(warningMsg, data);
            }
            console.warn('⚠️ ' + warningMsg);
        }

        return data.backstory || null;
        
    } catch (error) {
        const duration = Date.now() - startTime;
        
        // Log detalhado do erro
        if (typeof log !== 'undefined') {
            log.error('Erro ao gerar história localmente', { 
                error: error.message,
                duration: `${duration}ms`,
                promptPreview: prompt.substring(0, 100) + '...'
            });
        } else {
            console.error('❌ Erro ao gerar história localmente:', error.message);
        }

        // Retorna null para fallback, mas preserva informação do erro
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
            background: backgroundTextArea.value
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

    backgroundTextArea.value = finalBackstory;

    if (currentCharacterId) {
        const character = storage.getCharacterById(currentCharacterId);
        if (character) {
            character.background = finalBackstory;
            storage.saveCharacter(character);
        }
    }

    closeLoadingModal();
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
    // Verifica se já existe um container de notificações, senão cria
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
    setTimeout(() => {
        if (toastContainer.contains(messageEl)) toastContainer.removeChild(messageEl);
        if (toastContainer.children.length === 0 && document.body.contains(toastContainer)) {
            document.body.removeChild(toastContainer);
        }
    }, 5000);
}

function clearForm() {
    characterForm.reset();
    currentCharacterId = null;
    saveCharacterBtn.innerHTML = '<i class="fas fa-save"></i>&nbsp; Salvar Personagem';
    saveCharacterBtn.classList.remove('is-warning');
    saveCharacterBtn.style.color = '';
    backgroundTextArea.value = '';
}