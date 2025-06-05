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
import { initWorldManager, getCurrentClassIcons } from './worldManager.js';
import { getCurrentWorldConfig } from './worldsConfig.js';

const savedWorld = localStorage.getItem('selectedWorld') || 'dnd';
applyWorldTheme(savedWorld);

// Dados de estado
let characters = [];
let currentCharacterId = null;

// Função para obter ícones de classe baseados no mundo atual
function getClassIcons() {
    return getCurrentClassIcons();
}

// Referência ao storage
const storage = characterStorage;

// Inicialização
document.addEventListener('DOMContentLoaded', function () {
    initWorldManager(); // Inicializar gerenciador de mundos
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
        const classIcons = getClassIcons();
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
                    <i class="fas ${getClassIcons()[character.class] || 'fa-user'}" style="font-size: 4rem;"></i>
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
    const config = getCurrentWorldConfig();
    const currentWorld = localStorage.getItem('selectedWorld') || 'dnd';
    
    // Usar summaries do mundo atual se disponíveis, senão usar fallback
    const raceSummaries = config.raceSummaries || getTormentaRaceSummaries();
    const classSummaries = config.classSummaries || getTormentaClassSummaries();
    
    const raceSummary = raceSummaries[characterData.race] || raceSummaries['Humano'] || 'Uma raça versátil e adaptável.';
    const classSummary = classSummaries[characterData.class] || classSummaries['Guerreiro'] || 'Um combatente habilidoso e versátil.';

    const backgroundNote = characterData.background && characterData.background.trim() !== ""
        ? `Considere também esta informação adicional fornecida pelo jogador para enriquecer a história: "${characterData.background.trim()}".`
        : '';

    // Gerar prompt baseado no mundo
    if (currentWorld === 'dnd') {
        return generateDnDPrompt(characterData, raceSummary, classSummary, backgroundNote);
    } else if (currentWorld === 'ordem-paranormal') {
        return generateOrdemParanormalPrompt(characterData, raceSummary, classSummary, backgroundNote);
    } else {
        return generateTormentaPrompt(characterData, raceSummary, classSummary, backgroundNote);
    }
}

function generateDnDPrompt(characterData, raceSummary, classSummary, backgroundNote) {
    return `
Crie uma história de origem que defina a ESSÊNCIA e PERSONALIDADE de um personagem de D&D 5e nos Reinos Esquecidos. Esta é uma história de FORMAÇÃO DE IDENTIDADE, não de aventuras.

DADOS DO PERSONAGEM:
- Nome: ${characterData.name}
- Raça: ${characterData.race} (${raceSummary})
- Classe: ${characterData.class} (${classSummary})
- Alinhamento: ${characterData.alignment}
- Atributos: Força ${characterData.attributes.strength}, Destreza ${characterData.attributes.dexterity}, Constituição ${characterData.attributes.constitution}, Inteligência ${characterData.attributes.intelligence}, Sabedoria ${characterData.attributes.wisdom}, Carisma ${characterData.attributes.charisma}
${backgroundNote}

FOQUE EM DEFINIR:
1. PERSONALIDADE: Como ${characterData.name} pensa, age e reage
2. MOTIVAÇÕES: O que o/a move, seus objetivos de vida
3. MEDOS/TRAUMAS: Experiências que o/a moldaram
4. RELACIONAMENTOS: Família, mentores, rivais importantes
5. VALORES: No que acredita, seus princípios morais
6. ORIGEM SOCIAL: De onde vem, como foi criado/a

INSTRUÇÕES:
- Escreva em português, tom introspectivo e psicológico
- Use locais de Faerûn (Waterdeep, Baldur's Gate, etc.) e divindades relevantes
- Conecte os atributos à personalidade (alta INT = curioso, baixa CHA = tímido, etc.)
- Explique COMO e POR QUE escolheu sua classe
- Termine com o que o/a motiva a aventurar-se
- FINALIZE com uma frase de efeito marcante que reflita a motivação central do personagem
- NÃO descreva aventuras específicas, foque na FORMAÇÃO do caráter
`;
}

function generateTormentaPrompt(characterData, raceSummary, classSummary, backgroundNote) {
    return `
Crie uma história de origem que defina a ESSÊNCIA e PERSONALIDADE de um personagem de Tormenta 20 em Arton. Esta é uma história de FORMAÇÃO DE IDENTIDADE, não de aventuras.

DADOS DO PERSONAGEM:
- Nome: ${characterData.name}
- Raça: ${characterData.race} (${raceSummary})
- Classe: ${characterData.class} (${classSummary})
- Alinhamento: ${characterData.alignment}
- Atributos: Força ${characterData.attributes.strength}, Destreza ${characterData.attributes.dexterity}, Constituição ${characterData.attributes.constitution}, Inteligência ${characterData.attributes.intelligence}, Sabedoria ${characterData.attributes.wisdom}, Carisma ${characterData.attributes.charisma}
${backgroundNote}

FOQUE EM DEFINIR:
1. PERSONALIDADE: Como ${characterData.name} pensa, age e reage
2. MOTIVAÇÕES: O que o/a move, seus objetivos de vida
3. MEDOS/TRAUMAS: Experiências que o/a moldaram (talvez relacionadas à Tormenta)
4. RELACIONAMENTOS: Família, mentores, rivais importantes
5. VALORES: No que acredita, sua relação com os deuses do Panteão
6. ORIGEM SOCIAL: De onde vem em Arton, como foi criado/a

INSTRUÇÕES:
- Escreva em português, tom introspectivo e psicológico
- Use locais de Arton (Valkaria, Lenórienn, Vectora, etc.) e deuses do Panteão
- Conecte os atributos à personalidade (alta INT = estudioso, baixa CHA = reservado, etc.)
- Explique COMO e POR QUE escolheu sua classe
- Considere a influência da Tormenta na formação do caráter
- Termine com o que o/a motiva a aventurar-se
- FINALIZE com uma frase de efeito marcante que reflita a motivação central do personagem
- NÃO descreva aventuras específicas, foque na FORMAÇÃO do caráter
`;
}

function generateOrdemParanormalPrompt(characterData, raceSummary, classSummary, backgroundNote) {
    return `
Crie uma história de origem que defina a ESSÊNCIA e PERSONALIDADE de um agente da Ordo Realitas no Brasil contemporâneo. Esta é uma história de FORMAÇÃO DE IDENTIDADE, não de missões.

DADOS DO PERSONAGEM:
- Nome: ${characterData.name}
- Origem: ${characterData.race} (${raceSummary})
- Classe: ${characterData.class} (${classSummary})
- Alinhamento: ${characterData.alignment}
- Atributos: Força ${characterData.attributes.strength}, Agilidade ${characterData.attributes.dexterity}, Intelecto ${characterData.attributes.constitution}, Presença ${characterData.attributes.intelligence}, Vigor ${characterData.attributes.wisdom}
${backgroundNote}

CONTEXTO DO UNIVERSO:
- Ordo Realitas: Organização secreta brasileira que protege a realidade das ameaças do Outro Lado
- Outro Lado: Dimensão paranormal com 5 elementos (Sangue, Morte, Conhecimento, Energia, Medo)
- Membrana: Barreira que separa nossa realidade do Outro Lado, enfraquecida pelo medo humano
- C.R.I.S.: Sistema de IA que detecta anomalias paranormais na internet
- Ameaças: Seita das Máscaras, Produção do Anfitrião, Transtornados, Luzídios, Kian e os Escriptas

FOQUE EM DEFINIR:
1. PERSONALIDADE: Como ${characterData.name} pensa, age e lida com o paranormal
2. TRAUMA INICIAL: O primeiro contato terrível com o Outro Lado que mudou sua vida
3. RECRUTAMENTO: Como e por que a Ordo Realitas o/a encontrou e recrutou
4. VIDA DUPLA: Como equilibra identidade civil com missões secretas
5. CONEXÃO PARANORMAL: Possível ligação com um elemento do Outro Lado
6. MOTIVAÇÃO PSICOLÓGICA: O que o/a impele a continuar enfrentando horrores

INSTRUÇÕES:
- Escreva em português brasileiro coloquial, tom psicológico realista
- Use cidades brasileiras (São Paulo, Rio, Brasília, etc.) e cultura nacional
- Conecte atributos à personalidade (alto Intelecto = analítico, baixa Presença = introvertido)
- Mencione como descobriu o paranormal e seu impacto mental
- Inclua referências sutis a elementos do Outro Lado ou organizações inimigas
- Aborde sanidade mental e como lida com conhecer "a verdade"
- FINALIZE com uma frase de efeito que reflita sua determinação como agente
- NÃO descreva missões específicas, foque na FORMAÇÃO psicológica e trauma

ELEMENTOS PARANORMAIS PARA INSPIRAÇÃO:
- Sangue: Emoções extremas, criaturas bestiais, rituais com automutilação
- Morte: Distorção temporal, lodo preto, envelhecimento, apathia
- Conhecimento: Sussurros malignos, símbolos místicos, obsessão por segredos
- Energia: Caos eletrônico, transformação, imprevisibilidade, tecnologia distorcida
- Medo: Pesadelos, instabilidade emocional, conexão com a Calamidade
`;
}

// Funções auxiliares para fallback
function getTormentaRaceSummaries() {
    return {
        'Humano': 'Versáteis, ambiciosos e adaptáveis, os humanos representam a maioria em Arton. Capazes de trilhar qualquer caminho, moldam o mundo com sua vontade e perseverança.',
        'Anão': 'Oriundos das montanhas de Doherimm, anões são robustos, honrados e resilientes. Artesãos lendários, mestres das forjas e da mineração.',
        // ... outras raças de Tormenta
    };
}

function getTormentaClassSummaries() {
    return {
        'Guerreiro': 'Combatentes versáteis, treinados em todas as armas e estilos, guerreiros formam o núcleo de exércitos, milícias e companhias mercenárias.',
        'Arcanista': 'Mestre das artes arcanas, os arcanistas canalizam o poder mágico puro através de anos de estudo ou talento inato.',
        // ... outras classes de Tormenta
    };
}

// Função para chamar o servidor local Python
async function fetchBackstoryFromLocal(prompt) {
    try {
        const response = await fetch('https://forjador-backend.onrender.com/generate', {
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

// Função de fallback específica para Ordem Paranormal
function generateOrdemParanormalFallback(character) {
    const originTraits = {
        'Acadêmico': [
            `${character.name} descobriu o paranormal através de pesquisas universitárias em São Paulo, quando um livro antigo provocou manifestações estranhas.`,
            `Professor em Brasília, ${character.name} viu sua vida acadêmica desmoronar após presenciar rituais impossíveis durante suas pesquisas.`,
            `${character.name} era um pesquisador respeitado no Rio de Janeiro até encontrar documentos que revelaram a existência do Outro Lado.`
        ],
        'Agente de Saúde': [
            `${character.name} trabalhava em um pronto-socorro de Belo Horizonte quando começou a tratar feridas que desafiavam a medicina.`,
            `Paramédico em Salvador, ${character.name} foi o primeiro a responder chamadas envolvendo criaturas que não deveriam existir.`,
            `${character.name} era enfermeiro em Recife até presenciar um paciente se transformar em algo monstruoso durante seu plantão.`
        ],
        'Amnésico': [
            `${character.name} acordou em um hospital de Curitiba sem memórias, apenas cicatrizes estranhas e pesadelos sobre símbolos místicos.`,
            `Encontrado desmaiado nas ruas de Fortaleza, ${character.name} não consegue lembrar do passado, apenas de sussurros malignos.`,
            `${character.name} perdeu a memória após um evento traumático em Porto Alegre, restando apenas fragmentos de rituais sombrios.`
        ],
        'Investigador': [
            `${character.name} era detetive em São Paulo quando começou a investigar desaparecimentos ligados a cultos paranormais.`,
            `Jornalista investigativo no Rio, ${character.name} seguiu uma pista que o levou direto para os segredos da Ordo Realitas.`,
            `${character.name} trabalhava como investigador particular em Brasília até descobrir conspirações envolvendo o Outro Lado.`
        ],
        'Militar': [
            `${character.name} era soldado em Manaus quando sua unidade foi atacada por criaturas que não constavam nos manuais militares.`,
            `Ex-fuzileiro naval do Rio, ${character.name} sobreviveu a um incidente paranormal que dizimou sua equipe.`,
            `${character.name} servia no Exército em Brasília até testemunhar experimentos secretos envolvendo entidades do Outro Lado.`
        ],
        'Policial': [
            `${character.name} era delegado em São Paulo quando começou a investigar crimes impossíveis envolvendo rituais satânicos.`,
            `Investigador da Polícia Civil no Rio, ${character.name} descobriu que alguns casos nunca poderiam ser resolvidos pela justiça comum.`,
            `${character.name} patrulhava as ruas de Belo Horizonte até presenciar um crime que desafiava todas as leis da física.`
        ],
        'Magnata': [
            `${character.name} era CEO de uma multinacional em São Paulo quando descobriu que seus negócios estavam conectados a cultos paranormais.`,
            `Empresário bilionário do Rio, ${character.name} usou sua fortuna para investigar eventos estranhos após perder um familiar para o Outro Lado.`,
            `${character.name} controlava um império financeiro em Brasília até descobrir que alguns investidores serviam entidades sombrias.`
        ],
        'Mercenário': [
            `${character.name} era soldado de fortuna em zonas de conflito até ser contratado para uma missão que envolvia criaturas do Outro Lado.`,
            `Ex-militar de elite, ${character.name} oferecia seus serviços no Brasil até enfrentar ameaças que balas convencionais não podiam parar.`,
            `${character.name} trabalhava como segurança privado em São Paulo quando foi atacado por entidades paranormais durante um serviço de proteção.`
        ],
        'T.I.': [
            `${character.name} trabalhava como programador em São Paulo quando detectou anomalias digitais impossíveis em seus sistemas.`,
            `Especialista em segurança digital, ${character.name} descobriu que algumas invasões vinham de dimensões paralelas.`,
            `${character.name} era analista de dados no Rio quando o C.R.I.S. começou a se comunicar diretamente com seus computadores.`
        ],
        'Teórico da Conspiração': [
            `${character.name} sempre soube que algo estava errado com o mundo, até descobrir que suas teorias mais paranóicas eram reais.`,
            `Blogger conspiratório de São Paulo, ${character.name} foi contactado pela Ordem após expor verdades perigosas sobre o paranormal.`,
            `${character.name} dedicava sua vida a desmascarar supostas conspirações até perceber que estava sendo observado por entidades do Outro Lado.`
        ]
    };

    const classTraits = {
        'Combatente': [
            `${character.name} desenvolveu uma resistência mental impressionante, canalizando traumas em pura determinação física.`,
            `Após presenciar horrores indescritíveis, ${character.name} encontrou na luta direta sua forma de lidar com o medo.`,
            `${character.name} treina obsessivamente, sabendo que sua força pode ser a única coisa entre a humanidade e o caos.`
        ],
        'Especialista': [
            `${character.name} usa sua inteligência analítica para decifrar padrões nos eventos paranormais, mantendo a sanidade através da lógica.`,
            `Obcecado por entender o Outro Lado, ${character.name} coleta evidências e dados, transformando o medo em conhecimento útil.`,
            `${character.name} desenvolveu métodos científicos para estudar o paranormal, mesmo sabendo dos riscos à sua sanidade.`
        ],
        'Ocultista': [
            `${character.name} sacrificou parte de sua sanidade para compreender rituais proibidos, sempre na linha tênue entre razão e loucura.`,
            `Obcecado por desvendar os segredos do Outro Lado, ${character.name} sussurra encantamentos que ecoam em dimensões sombrias.`,
            `${character.name} carrega o peso do conhecimento proibido, sabendo que cada ritual o aproxima mais da insanidade total.`
        ]
    };

    const traumaTemplates = [
        `Após sobreviver a um encontro com criaturas de Sangue, ${character.name} nunca mais foi o mesmo, carregando cicatrizes físicas e mentais.`,
        `A exposição ao elemento Morte envelheceu prematuramente parte de seu corpo, um lembrete constante da fragilidade da realidade.`,
        `${character.name} ouviu os sussurros do Conhecimento e agora luta diariamente contra vozes que tentam revelar segredos terríveis.`,
        `Uma explosão de Energia paranormal modificou irreversivelmente sua percepção, fazendo-o ver padrões caóticos em tudo.`,
        `${character.name} foi marcado pelo Medo primordial, tendo pesadelos vívidos que sangram na realidade quando desperta.`
    ];

    const motivationTemplates = [
        `Agora ${character.name} luta para proteger outros de passarem pelo mesmo trauma que o/a marcou para sempre.`,
        `${character.name} busca respostas sobre sua transformação, temendo e desejando ao mesmo tempo descobrir a verdade completa.`,
        `Movido por vingança, ${character.name} caça as entidades responsáveis por destruir sua vida anterior.`,
        `${character.name} serve à Ordo Realitas por senso de dever, sabendo que é uma das poucas pessoas capazes de enfrentar o horror.`,
        `Obcecado pela possibilidade de reverter sua condição, ${character.name} estuda obsessivamente os mistérios do Outro Lado.`
    ];

    const catchphrases = [
        `"A realidade é mais frágil do que imaginamos, mas ainda vale a pena protegê-la."`,
        `"Cada pesadelo me torna mais forte para enfrentar o próximo horror."`,
        `"Vi o Outro Lado... e agora é minha responsabilidade impedir que outros vejam."`,
        `"A sanidade é um preço pequeno a pagar pela proteção da humanidade."`,
        `"Conhecer a verdade é uma maldição, mas ignorá-la seria uma traição."`
    ];

    const originOptions = originTraits[character.race] || originTraits['Investigador'];
    const classOptions = classTraits[character.class] || classTraits['Especialista'];
    const traumaText = traumaTemplates[Math.floor(Math.random() * traumaTemplates.length)];
    const motivationText = motivationTemplates[Math.floor(Math.random() * motivationTemplates.length)];
    const finalQuote = catchphrases[Math.floor(Math.random() * catchphrases.length)];

    const originText = originOptions[Math.floor(Math.random() * originOptions.length)];
    const classText = classOptions[Math.floor(Math.random() * classOptions.length)];

    return `${originText} ${classText} ${traumaText} ${motivationText} ${finalQuote}`;
}

// Função de fallback focada em essência do personagem
function generateSimpleLore(character) {
    // Verificar se estamos em Ordem Paranormal e usar templates específicos
    const currentWorld = localStorage.getItem('selectedWorld') || 'dnd';
    if (currentWorld === 'ordem-paranormal') {
        return generateOrdemParanormalFallback(character);
    }
    
    const personalityTraits = {
        'Humano': [
            `${character.name} sempre foi determinado e adaptável, moldado pelas tradições de Valkaria.`,
            `Crescendo em Nova Malpetrim, ${character.name} desenvolveu uma personalidade resiliente e desconfiada.`,
            `Vindo de Tamu-ra, ${character.name} carrega a simplicidade rural e uma curiosidade insaciável sobre o mundo.`
        ],
        'Anão': [
            `${character.name} possui a teimosia e honra típicas de Doherimm, valoriza tradições acima de tudo.`,
            `Forjado em Khalifor, ${character.name} é orgulhoso, leal e tem dificuldade em confiar em estranhos.`,
            `${character.name} carrega o peso das expectativas familiares e busca provar seu valor além das montanhas.`
        ],
        'Dahllan': [
            `${character.name} possui uma conexão profunda com a natureza, sendo empática mas ingênua sobre o mundo civilizado.`,
            `Criada entre espíritos de Lenórienn, ${character.name} é pacífica por natureza mas feroz quando ameaçada.`,
            `${character.name} luta para equilibrar sua natureza selvagem com a necessidade de conviver em sociedade.`
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

    const motivationTemplates = {
        'Arcanista': [
            `${character.name} é movido por uma sede insaciável de conhecimento, às vezes ignorando consequências morais.`,
            `Obcecado por desvendar mistérios arcanos, ${character.name} teme que seu poder seja insuficiente quando mais precisar.`,
            `${character.name} busca provar que a magia pode resolver qualquer problema, mesmo quando a força bruta seria mais eficaz.`
        ],
        'Bárbaro': [
            `${character.name} luta contra uma raiva interior constante, canalizando-a para proteger os que ama.`,
            `Desconfiado da civilização, ${character.name} prefere soluções diretas e tem dificuldade com sutilezas sociais.`,
            `${character.name} carrega o peso de ter perdido o controle no passado e teme machucar inocentes novamente.`
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
            `${character.name} possui um código moral rígido e se culpa profundamente quando falha em proteger outros.`,
            `Acredita que a ordem e a justiça são fundamentais, mas às vezes é inflexível demais com si mesmo e outros.`
        ],
        'Neutro e Bom': [
            `${character.name} é compassivo por natureza, mas luta para encontrar equilíbrio entre ajudar e se preservar.`,
            `Prefere julgar cada situação individualmente, o que às vezes o deixa indeciso em momentos críticos.`
        ],
        'Caótico e Bom': [
            `${character.name} segue seu coração acima de tudo, mas sua impulsividade às vezes causa problemas não intencionais.`,
            `Detesta autoridade injusta e pode ser teimoso quando acredita estar certo, mesmo contra evidências.`
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

    const raceOptions = personalityTraits[character.race] || personalityTraits['Humano'];
    const classOptions = motivationTemplates[character.class] || motivationTemplates['Guerreiro'];
    const alignmentOptions = alignmentTemplates[character.alignment] || alignmentTemplates['Neutro'];

    const personalityText = raceOptions[Math.floor(Math.random() * raceOptions.length)];
    const motivationText = classOptions[Math.floor(Math.random() * classOptions.length)];
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

    // Frases de efeito baseadas na classe
    const catchphrases = {
        'Arcanista': [
            `"O conhecimento é poder, e eu serei imparável."`,
            `"Cada segredo desvendado me torna mais forte."`,
            `"A magia não tem limites, apenas mentes limitadas."`
        ],
        'Bárbaro': [
            `"Minha fúria protege aqueles que não podem se proteger."`,
            `"A civilização pode me julgar, mas minha força fala por si."`,
            `"Quando a diplomacia falha, meus punhos respondem."`
        ],
        'Guerreiro': [
            `"Minha lâmina é minha palavra, minha honra é meu escudo."`,
            `"Cada cicatriz conta uma história de vitória."`,
            `"Não recuo, não me rendo, não falho."`
        ],
        'Clérigo': [
            `"Minha fé é minha força, minha compaixão é minha arma."`,
            `"Os deuses me guiam, mas minhas escolhas definem meu destino."`,
            `"Onde há trevas, eu levo a luz."`
        ],
        'Ladino': [
            `"As sombras são meu lar, mas meu coração ainda brilha."`,
            `"Confie em mim... ou pelo menos em minhas habilidades."`,
            `"Sobrevivência não é covardia, é inteligência."`
        ]
    };

    const classQuotes = catchphrases[character.class] || catchphrases['Guerreiro'];
    const finalQuote = classQuotes[Math.floor(Math.random() * classQuotes.length)];

    return `${personalityText} ${motivationText} ${alignmentText} ${attributeText} Agora, ${character.name} busca seu lugar no mundo, carregando tanto suas virtudes quanto seus medos internos. ${finalQuote}`;
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