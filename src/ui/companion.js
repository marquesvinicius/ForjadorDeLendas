import { getCurrentWorldConfig } from '../config/worldsConfig.js';

class MagoCompanion {
    constructor() {
        this.companionContainer = document.querySelector('.companion-container');
        this.speechBubble = document.querySelector('.companion-speech-bubble');
        this.companionText = document.getElementById('companionText');
        this.companionAvatar = document.querySelector('.companion-avatar');
        this.lastMessage = '';
        
        // Garantir que o mago comece visível
        if (this.companionContainer) {
            this.companionContainer.style.opacity = '1';
        }
        
        this.setupEventListeners();
        this.setupMobileEvents();
        this.setupScrollListener();
        this.greet();
    }

    setupEventListeners() {
        // Conecta os eventos de input/change com os métodos correspondentes
        const charName = document.getElementById('charName');
        const charRace = document.getElementById('charRace');
        const charClass = document.getElementById('charClass');
        const charAlignment = document.getElementById('charAlignment');
        
        if (charName) charName.addEventListener('input', (e) => this.onNameInput(e));
        if (charRace) charRace.addEventListener('change', (e) => this.onRaceChange(e));
        if (charClass) charClass.addEventListener('change', (e) => this.onClassChange(e));
        if (charAlignment) charAlignment.addEventListener('change', (e) => this.onAlignmentChange(e));

        // Eventos que farão o balão desaparecer apenas após uma nova interação
        const buttonElements = [
            'rollAttributes',
            'generateLore',
            'saveCharacter',
            'clearForm'
        ];

        buttonElements.forEach(elementId => {
            const el = document.getElementById(elementId);
            if (el) {
                el.addEventListener('click', () => {
                    if (elementId === 'rollAttributes') {
                        this.onRollAttributes();
                    } else {
                        this.hideSpeechBubble();
                    }
                });
            }
        });
    }

    setupMobileEvents() {
        this.companionAvatar.addEventListener('click', () => {
            if (window.innerWidth < 1023) {
                if (this.speechBubble.classList.contains('hidden')) {
                    this.showLastMessage();
                } else {
                    this.hideSpeechBubble();
                }
            }
        });

        document.addEventListener('click', (e) => {
            if (window.innerWidth < 1023) {
                if (!this.companionAvatar.contains(e.target) &&
                    !this.speechBubble.contains(e.target) &&
                    !this.speechBubble.classList.contains('hidden')) {
                    this.hideSpeechBubble();
                }
            }
        });
    }

    setupScrollListener() {
        let isNearBottom = false;
        const threshold = 100;

        const checkFooterPosition = () => {
            if (window.innerWidth >= 1023) return;

            const scrollPosition = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const distanceFromBottom = documentHeight - (scrollPosition + windowHeight);

            if (distanceFromBottom <= threshold) {
                if (!isNearBottom) {
                    this.companionContainer.classList.add('companion-fade-out');
                    isNearBottom = true;
                }
            } else {
                if (isNearBottom) {
                    this.companionContainer.classList.remove('companion-fade-out');
                    isNearBottom = false;
                }
            }
        };

        // Verifica no scroll
        window.addEventListener('scroll', checkFooterPosition, { passive: true });

        // Verifica no carregamento
        checkFooterPosition();

        // Verifica também no redimensionamento
        window.addEventListener('resize', checkFooterPosition);
    }

    speak(text, duration = null) {
        this.companionContainer.classList.remove('companion-fade-out');
        this.lastMessage = text;
        this.speechBubble.classList.remove('hidden');
        this.speechBubble.classList.add('fade-in');
        this.companionText.textContent = text;

        if (window.innerWidth <= 768) {
            // Em mobile, pisca o avatar quando fala
            this.companionAvatar.style.boxShadow = '0 0 15px var(--accent-color)';
            setTimeout(() => {
                this.companionAvatar.style.boxShadow = '';
            }, 1000);
        }

        if (duration) {
            setTimeout(() => this.hideSpeechBubble(), duration);
        }
    }

    hideSpeechBubble() {
        this.speechBubble.classList.add('hidden');
        this.speechBubble.classList.remove('fade-in');
    }

    greet() {
        const currentWorld = localStorage.getItem('selectedWorld') || 'tormenta';
        
        let greetings;
        
        // Tentar obter configuração do mundo atual
        try {
            const config = getCurrentWorldConfig();
            if (config && config.companionSpeech && config.companionSpeech.greetings) {
                greetings = config.companionSpeech.greetings;
            }
        } catch (error) {
            console.warn('Erro ao obter configuração do mundo, usando fallback:', error);
        }
        
        // Fallback para mensagens padrão se não conseguir obter do config
        if (!greetings) {
            if (currentWorld === 'dnd') {
                greetings = [
                    "Bem-vindo ao Forjador de Lendas! Sou seu guia pelos Reinos Esquecidos!",
                    "Um novo aventureiro para Faerûn! Que sua jornada seja épica.",
                    "Pelos deuses! Pronto para desbravar Waterdeep ou as selvas de Chult?"
                ];
            } else { // Tormenta como padrão
                greetings = [
                    "Bem-vindo ao Forjador de Lendas! Sou Merlin, seu guia em Arton!",
                    "Um novo herói para Arton! Vamos criar uma lenda épica juntos!",
                    "Por minhas barbas mágicas! Que tal forjar um destino no Reinado?"
                ];
            }
        }
        
        this.speak(greetings[Math.floor(Math.random() * greetings.length)]);
    }

    onNameInput(e) {
        const name = e.target.value.trim();
        if (name.length > 2) {
            const currentWorld = localStorage.getItem('selectedWorld') || 'tormenta';
            
            let responses;
            
            // Tentar obter configuração do mundo atual
            try {
                const config = getCurrentWorldConfig();
                if (config && config.companionSpeech && config.companionSpeech.nameResponses) {
                    responses = config.companionSpeech.nameResponses.map(response => 
                        response.replace('{name}', name)
                    );
                }
            } catch (error) {
                console.warn('Erro ao obter configuração do mundo para nameInput, usando fallback:', error);
            }
            
            // Fallback para mensagens padrão
            if (!responses) {
                if (currentWorld === 'dnd') {
                    responses = [
                        `${name}? Um nome que ecoará por toda Faerûn!`,
                        `Ah, ${name}! Vejo um futuro de glória e perigo te esperando nos Reinos.`,
                        `${name}... *esfrega as mãos com antecipação* Um herói para enfrentar os dragões, talvez?`
                    ];
                } else { // Tormenta
                    responses = [
                        `${name}? Um nome que ecoará em Arton! Escolha sua raça!`,
                        `Ah, ${name}! Vejo um futuro lendário no Reinado para você!`,
                        `${name}... *acaricia a barba* Um herói contra a Tormenta, talvez?`
                    ];
                }
            }
            
            this.speak(responses[Math.floor(Math.random() * responses.length)]);
        }
    }

    onRaceChange(e) {
        const selectedRace = e.target.value;
        const config = getCurrentWorldConfig();
        const currentWorld = localStorage.getItem('selectedWorld') || 'dnd';
        
        let raceResponses;
        if (config.companionSpeech && config.companionSpeech.raceResponses) {
            raceResponses = config.companionSpeech.raceResponses;
        } else if (currentWorld === 'dnd') {
            raceResponses = {
                'Anão': "Um anão! Seu martelo ecoa como trovões de Moradin.",
                'Elfo': "Um elfo! Suas flechas dançam com a graça de Corellon.",
                'Halfling': "Um halfling! Pequeno, mas com um coração de dragão.",
                'Humano': "Um humano! O mundo é seu para moldar.",
                'Draconato': "Um draconato! Seu sopro é digno de Bahamut.",
                'Gnomo': "Um gnomo! Que engenhoca você trama hoje?",
                'Meio-Elfo': "Um meio-elfo! Um pé em dois mundos, que equilíbrio!",
                'Meio-Orc': "Um meio-orc! Sua força é uma lenda em formação.",
                'Tiefling': "Um tiefling! Seu fogo interno brilha forte."
            };
        } else { // Tormenta
            raceResponses = {
                'Humano': "Humanos! Tão versáteis quanto os ventos de Arton!",
                'Anão': "Um anão de Doherimm? Só não me peça para cavar contigo!",
                'Dahllan': "Uma dahllan! Allihanna deve estar orgulhosa de você!",
                'Elfo': "Um elfo de Lenórienn? Elegante, mas não se perca em séculos!",
                'Goblin': "Um goblin? *checa os bolsos* Cuidado com Tollon em você!",
                'Lefou': "Um lefou? *recua* Espero que a Tormenta não te siga!",
                'Minotauro': "Um minotauro! Só não quebre minha torre com esses chifres!",
                'Qareen': "Um qareen! Cuidado com os desejos que conceder por aí!",
                'Golem': "Um golem? *observa* Quem te trouxe à vida, hein?",
                'Hynne': "Um hynne! Pequeno, mas cheio de sorte, aposto!",
                'Kliren': "Um kliren! Sua inteligência vai resolver muitos enigmas!",
                'Medusa': "Uma medusa? *evita o olhar* Não me transforme em pedra!",
                'Osteon': "Um osteon? *treme* Espero que não seja meu esqueleto animado!",
                'Sereia/Tritão': "Um sereia ou tritão! Não molhe minha túnica, por favor!",
                'Sílfide': "Uma sílfide! Você flutua como os ventos de Wynlla!",
                'Suraggel': "Um suraggel! Divino ou infernal, escolha com cuidado!",
                'Trong': "Um trong! *se afasta* Não me coma, eu sou só um mago velho!"
            };
        }
        
        const defaultMessage = currentWorld === 'dnd' ? "Uma raça intrigante para os Reinos!" : "Uma raça intrigante para Arton!";
        this.speak(raceResponses[selectedRace] || defaultMessage);
    }

    onClassChange(e) {
        const selectedClass = e.target.value;
        const config = getCurrentWorldConfig();
        const currentWorld = localStorage.getItem('selectedWorld') || 'dnd';
        
        let classResponses;
        if (config.companionSpeech && config.companionSpeech.classResponses) {
            classResponses = config.companionSpeech.classResponses;
        } else if (currentWorld === 'dnd') {
            classResponses = {
                'Bárbaro': "Um bárbaro! Sua fúria abala montanhas!",
                'Bardo': "Um bardo! Sua canção encantará deuses!",
                'Bruxo': "Um bruxo! Que segredos seu patrono guarda?",
                'Clérigo': "Um clérigo! A luz divina guia seus passos.",
                'Druida': "Um druida! A terra sussurra seus segredos.",
                'Feiticeiro': "Um feiticeiro! Seu sangue pulsa com magia!",
                'Guerreiro': "Um guerreiro! Sua lâmina forjará lendas.",
                'Ladino': "Um ladino! As sombras são seu lar.",
                'Mago': "Um mago! Um irmão da Teia de Mystra!",
                'Monge': "Um monge! Sua disciplina é inspiradora.",
                'Paladino': "Um paladino! Sua luz enfrenta as trevas.",
                'Patrulheiro': "Um patrulheiro! A selva é sua aliada."
            };
        } else { // Tormenta
            classResponses = {
                'Arcanista': "Um arcanista! *limpa uma lágrima* Um irmão das artes mágicas!",
                'Bárbaro': "Um bárbaro! Só não quebre minhas coisas na sua fúria!",
                'Bardo': "Um bardo! Cante minhas glórias... quer dizer, as suas!",
                'Bucaneiro': "Um bucaneiro! Espero que não roube meu cajado no mar!",
                'Caçador': "Um caçador! Perfeito para rastrear horrores da Tormenta!",
                'Cavaleiro': "Um cavaleiro! Sua honra brilha mais que minha magia!",
                'Clérigo': "Um clérigo! Que os deuses do Pantheon te abençoem!",
                'Druida': "Um druida! Allihanna aprova, mas sem lobos na minha torre!",
                'Guerreiro': "Um guerreiro! Pronto para as batalhas de Arton!",
                'Inventor': "Um inventor! *se anima* Mostre-me seus gadgets!",
                'Ladino': "Um ladino! *esconde o bolso* Cuidado com os Ladrões de Deheon!",
                'Lutador': "Um lutador! Seus punhos vão impressionar em Arton!",
                'Nobre': "Um nobre! Sua presença é digna de Valkaria!",
                'Paladino': "Um paladino! A luz de Khalmyr guia seus passos!"
            };
        }
        
        const defaultMessage = currentWorld === 'dnd' ? "Uma classe formidável para os Reinos!" : "Uma classe fascinante para Arton!";
        this.speak(classResponses[selectedClass] || defaultMessage);
    }

    onAlignmentChange(e) {
        const alignment = e.target.value;
        const config = getCurrentWorldConfig();
        const currentWorld = localStorage.getItem('selectedWorld') || 'dnd';
        
        let response;
        if (config.companionSpeech && config.companionSpeech.alignmentResponses) {
            response = config.companionSpeech.alignmentResponses[alignment];
        }
        
        if (!response) {
            if (currentWorld === 'dnd') {
                if (alignment.includes('Bom') && alignment.includes('Leal')) {
                    response = "Um coração nobre! Faerûn precisa de sua luz.";
                } else if (alignment.includes('Bom') && alignment.includes('Caótico')) {
                    response = "Liberdade e bondade? Cuidado com os tiranos!";
                } else if (alignment.includes('Mau') && alignment.includes('Leal')) {
                    response = "Ordem sombria? Mystra observa seus passos.";
                } else if (alignment.includes('Mau') && alignment.includes('Caótico')) {
                    response = "Caos e trevas? Não traga demônios à minha torre!";
                } else { // Neutros
                    response = "Equilíbrio é sábio, mas escolha um lado eventualmente.";
                }
            } else { // Tormenta
                if (alignment.includes('Mau')) {
                    response = "Hmmm... *suspeita* Não traga a Tormenta para minha torre!";
                } else if (alignment.includes('Bom')) {
                    response = "Um coração nobre! Arton precisa de você contra o mal!";
                } else {
                    response = "Neutro? Equilíbrio é sábio, mas não seja indeciso!";
                }
            }
        }
        
        this.speak(response);
    }

    onRollAttributes() {
        const config = getCurrentWorldConfig();
        const currentWorld = localStorage.getItem('selectedWorld') || 'dnd';
        
        let responses;
        if (config.companionSpeech && config.companionSpeech.rollAttributesResponses) {
            responses = config.companionSpeech.rollAttributesResponses;
        } else if (currentWorld === 'dnd') {
            responses = [
                "Que os ventos do destino guiem seus dados!",
                "*Murmura um encantamento* Que Tymora sorria para você!",
                "Rolando os ossos do destino! Que Mystra ilumine seus atributos!"
            ];
        } else { // Tormenta
            responses = [
                "*Agita as mãos* Que os dados de Nimb decidam seu destino!",
                "Rolando! Que Tanna-Toh revele sua força interior!",
                "*Sopra os dados* Um toque de Wynna para sua sorte!"
            ];
        }
        this.speak(responses[Math.floor(Math.random() * responses.length)]);
    }

    // Adicionar métodos para falas específicas de D&D para outras ações, se necessário.
    // Exemplo:
    speakOnSaveCharacter() {
        const currentWorld = localStorage.getItem('selectedWorld') || 'dnd';
        let message;
        if (currentWorld === 'dnd') {
            message = "Sua lenda agora brilha nos anais de Faerûn!";
        } else {
            message = "Seu herói está pronto para desbravar Arton!"; // Ou uma fala mais específica de Tormenta
        }
        // Esta função precisaria ser chamada de app.js, ou o MagoCompanion precisaria
        // ouvir um evento de 'characterSaved'. Por simplicidade, manterei as falas
        // de salvar/gerar história em app.js por enquanto, mas podemos refatorar depois.
        this.speak(message);
    }

    showLastMessage() {
        if (this.lastMessage) {
            this.companionContainer.classList.remove('companion-fade-out');
            this.speak(this.lastMessage);
        }
    }

    // Métodos temáticos para reações específicas
    reactToCharacterSave(characterName) {
        const config = getCurrentWorldConfig();
        const currentWorld = localStorage.getItem('selectedWorld') || 'dnd';
        
        let responses;
        if (config.companionSpeech && config.companionSpeech.characterSaveResponses) {
            responses = config.companionSpeech.characterSaveResponses;
        } else if (currentWorld === 'dnd') {
            responses = [
                `${characterName} foi adicionado aos anais de Faerûn!`,
                `Que ${characterName} encontre glória nos Reinos Esquecidos!`,
                `Pelos deuses! ${characterName} está pronto para grandes aventuras!`
            ];
        } else if (currentWorld === 'ordem-paranormal') {
            responses = [
                `${characterName} foi registrado nos arquivos da Ordo Realitas!`,
                `Que ${characterName} enfrente os horrores do Outro Lado com coragem!`,
                `Por Veríssimo! ${characterName} está pronto para proteger a realidade!`
            ];
        } else { // Tormenta
            responses = [
                `${characterName} foi adicionado ao seu grimório de heróis!`,
                `Que ${characterName} encontre glória em Arton!`,
                `Por minhas barbas mágicas! ${characterName} está pronto para grandes aventuras!`
            ];
        }
        
        const response = responses[Math.floor(Math.random() * responses.length)];
        this.speak(response, 4000);
    }

    reactToCharacterUpdate(characterName) {
        const config = getCurrentWorldConfig();
        const currentWorld = localStorage.getItem('selectedWorld') || 'dnd';
        
        let responses;
        if (config.companionSpeech && config.companionSpeech.characterUpdateResponses) {
            responses = config.companionSpeech.characterUpdateResponses;
        } else if (currentWorld === 'dnd') {
            responses = [
                `${characterName} foi atualizado nos anais de Faerûn!`,
                `As mudanças de ${characterName} foram registradas pelos escribas!`,
                `Pelos deuses! ${characterName} evolui constantemente!`
            ];
        } else if (currentWorld === 'ordem-paranormal') {
            responses = [
                `${characterName} foi atualizado nos arquivos da Ordo Realitas!`,
                `Os dados de ${characterName} foram sincronizados com C.R.I.S.!`,
                `Por Veríssimo! ${characterName} se adapta às ameaças!`
            ];
        } else { // Tormenta
            responses = [
                `${characterName} foi atualizado em seu grimório!`,
                `As mudanças de ${characterName} foram anotadas!`,
                `Por minhas barbas mágicas! ${characterName} evolui constantemente!`
            ];
        }
        
        const response = responses[Math.floor(Math.random() * responses.length)];
        this.speak(response, 4000);
    }

    reactToCharacterEdit(characterName) {
        const config = getCurrentWorldConfig();
        const currentWorld = localStorage.getItem('selectedWorld') || 'dnd';
        
        let responses;
        if (config.companionSpeech && config.companionSpeech.characterEditResponses) {
            responses = config.companionSpeech.characterEditResponses;
        } else if (currentWorld === 'dnd') {
            responses = [
                `Editando ${characterName}. Que Oghma guie suas mudanças!`,
                `Modificando ${characterName}. Faça suas alterações com sabedoria!`,
                `${characterName} em revisão. Pelos deuses, faça-o brilhar!`
            ];
        } else if (currentWorld === 'ordem-paranormal') {
            responses = [
                `Editando ${characterName}. Adapte-se às novas ameaças!`,
                `Modificando o perfil de ${characterName}. A Ordo evolui!`,
                `${characterName} em atualização. Por Veríssimo, melhore-o!`
            ];
        } else { // Tormenta
            responses = [
                `Editando ${characterName}. Faça suas alterações!`,
                `Modificando ${characterName}. Que Tanna-Toh guie sua mão!`,
                `${characterName} em revisão. Por minhas barbas, aprimore-o!`
            ];
        }
        
        const response = responses[Math.floor(Math.random() * responses.length)];
        this.speak(response, 3000);
    }

    reactToCharacterDelete(characterName) {
        const config = getCurrentWorldConfig();
        const currentWorld = localStorage.getItem('selectedWorld') || 'dnd';
        
        let responses;
        if (config.companionSpeech && config.companionSpeech.characterDeleteResponses) {
            responses = config.companionSpeech.characterDeleteResponses;
        } else if (currentWorld === 'dnd') {
            responses = [
                `${characterName} foi removido dos anais de Faerûn!`,
                `Que ${characterName} descanse em paz nos arquivos divinos!`,
                `Pelos deuses... ${characterName} partiu para outras aventuras!`
            ];
        } else if (currentWorld === 'ordem-paranormal') {
            responses = [
                `${characterName} foi removido dos arquivos da Ordo Realitas!`,
                `O arquivo de ${characterName} foi apagado de C.R.I.S.!`,
                `Por Veríssimo... ${characterName} encerrou sua missão!`
            ];
        } else { // Tormenta
            responses = [
                `${characterName} foi removido do seu grimório de heróis!`,
                `Que ${characterName} encontre paz nos planos superiores!`,
                `Por minhas barbas... ${characterName} partiu para outras aventuras!`
            ];
        }
        
        const response = responses[Math.floor(Math.random() * responses.length)];
        this.speak(response, 3000);
    }

    reactToStoryGeneration() {
        const config = getCurrentWorldConfig();
        const currentWorld = localStorage.getItem('selectedWorld') || 'dnd';
        
        let responses;
        if (config.companionSpeech && config.companionSpeech.storyGenerationResponses) {
            responses = config.companionSpeech.storyGenerationResponses;
        } else if (currentWorld === 'dnd') {
            responses = [
                "Deixe-me consultar as crônicas de Faerûn...",
                "Invocando as memórias dos Reinos Esquecidos...",
                "Pelos deuses! Os pergaminhos antigos revelam segredos..."
            ];
        } else if (currentWorld === 'ordem-paranormal') {
            responses = [
                "Acessando os arquivos da Ordo Realitas...",
                "Consultando os relatórios de agentes anteriores...",
                "Por Veríssimo! Os registros paranormais contam histórias..."
            ];
        } else { // Tormenta
            responses = [
                "Deixe-me consultar os pergaminhos antigos...",
                "Invocando as memórias de Arton...",
                "Por minhas barbas mágicas! Os anais revelam segredos..."
            ];
        }
        
        const response = responses[Math.floor(Math.random() * responses.length)];
        this.speak(response, 3000);
    }

    reactToStorySuccess() {
        const config = getCurrentWorldConfig();
        const currentWorld = localStorage.getItem('selectedWorld') || 'dnd';
        
        let responses;
        if (config.companionSpeech && config.companionSpeech.storySuccessResponses) {
            responses = config.companionSpeech.storySuccessResponses;
        } else if (currentWorld === 'dnd') {
            responses = [
                "Uma história digna das tavernas de Waterdeep!",
                "Pelos deuses! Uma lenda nasce em Faerûn!",
                "Que crônica magnífica! Oghma aprovaria!"
            ];
        } else if (currentWorld === 'ordem-paranormal') {
            responses = [
                "Uma história digna dos arquivos da Ordo!",
                "Por Veríssimo! Uma nova lenda paranormal!",
                "Que relatório extraordinário! C.R.I.S. aprovaria!"
            ];
        } else { // Tormenta
            responses = [
                "Uma história digna das tavernas de Arton!",
                "Por minhas barbas mágicas! Uma lenda nasce!",
                "Que crônica magnífica! Tanna-Toh aprovaria!"
            ];
        }
        
        const response = responses[Math.floor(Math.random() * responses.length)];
        this.speak(response, 3000);
    }

    reactToStoryFallback() {
        const config = getCurrentWorldConfig();
        const currentWorld = localStorage.getItem('selectedWorld') || 'dnd';
        
        let responses;
        if (config.companionSpeech && config.companionSpeech.storyFallbackResponses) {
            responses = config.companionSpeech.storyFallbackResponses;
        } else if (currentWorld === 'dnd') {
            responses = [
                "Minha magia falhou, mas os velhos contos de Faerûn ainda servem!",
                "Os deuses testam minha paciência, mas criei algo especial!",
                "Mesmo sem magia divina, posso contar boas histórias!"
            ];
        } else if (currentWorld === 'ordem-paranormal') {
            responses = [
                "A conexão com C.R.I.S. falhou, mas os arquivos locais funcionam!",
                "O Outro Lado interferiu, mas criei algo baseado em experiência!",
                "Por Veríssimo! Mesmo sem tecnologia, posso improvisar!"
            ];
        } else { // Tormenta
            responses = [
                "Minha magia falhou, mas os velhos contos ainda servem!",
                "A Tormenta interferiu, mas criei algo especial!",
                "Por minhas barbas! Mesmo sem magia, tenho histórias!"
            ];
        }
        
        const response = responses[Math.floor(Math.random() * responses.length)];
        this.speak(response, 3000);
    }

    // 🎭 NOVAS INTERAÇÕES COM SISTEMA DE TEMAS
    
    /**
     * Reage à mudança de mundo
     * @param {string} newWorld - Novo mundo selecionado
     * @param {string} oldWorld - Mundo anterior (opcional)
     */
    reactToWorldChange(newWorld, oldWorld = null) {
        const worldChangeResponses = {
            'dnd': {
                fromTormenta: [
                    "Ah! Dos reinos de Arton para os Reinos Esquecidos! Que jornada épica!",
                    "De Tormenta para Faerûn? *ajusta as vestes* Bem-vindo aos Reinos Esquecidos!",
                    "Pelos deuses! De Arton para Waterdeep? Que mudança de ares!"
                ],
                fromOrdem: [
                    "Do paranormal para o fantástico! Os Reinos Esquecidos te aguardam!",
                    "De investigador para aventureiro? Faerûn precisa de sua coragem!",
                    "Por Mystra! Dos horrores do Outro Lado para as maravilhas de Faerûn!"
                ],
                default: [
                    "Bem-vindo aos Reinos Esquecidos! Que os deuses te guiem!",
                    "Pelos deuses! Os Reinos Esquecidos te aguardam, aventureiro!",
                    "Que Tymora sorria para você em Faerûn!"
                ]
            },
            'tormenta': {
                fromDnd: [
                    "De Faerûn para Arton? Que viagem dimensional!",
                    "Pelos deuses! Dos Reinos Esquecidos para o Reinado? Que aventura!",
                    "De Waterdeep para Valkaria? Que mudança de cenário!"
                ],
                fromOrdem: [
                    "Do paranormal para o fantástico! Arton te aguarda, herói!",
                    "De investigador para aventureiro? O Reinado precisa de você!",
                    "Por Khalmyr! Dos horrores para as maravilhas de Arton!"
                ],
                default: [
                    "Bem-vindo a Arton! Que Tanna-Toh te abençoe!",
                    "Por minhas barbas mágicas! O Reinado te aguarda!",
                    "Que os deuses do Pantheon te guiem em Arton!"
                ]
            },
            'ordem-paranormal': {
                fromDnd: [
                    "De Faerûn para a realidade? Que mudança... sobrenatural!",
                    "Pelos deuses! Dos Reinos Esquecidos para o paranormal?",
                    "De Waterdeep para São Paulo? Que viagem... dimensional!"
                ],
                fromTormenta: [
                    "De Arton para a realidade? Que transição... estranha!",
                    "Por Khalmyr! Do Reinado para o paranormal?",
                    "De Valkaria para São Paulo? Que mudança de... realidade!"
                ],
                default: [
                    "Bem-vindo à Ordo Realitas! Que Veríssimo te proteja!",
                    "Por Veríssimo! A Membrana está frágil, agente!",
                    "Que os elementos não te corrompam nesta nova missão!"
                ]
            }
        };

        let responses;
        if (oldWorld && worldChangeResponses[newWorld] && worldChangeResponses[newWorld][`from${oldWorld.charAt(0).toUpperCase() + oldWorld.slice(1)}`]) {
            responses = worldChangeResponses[newWorld][`from${oldWorld.charAt(0).toUpperCase() + oldWorld.slice(1)}`];
        } else if (worldChangeResponses[newWorld]) {
            responses = worldChangeResponses[newWorld].default;
        } else {
            responses = ["Que mudança interessante de cenário!"];
        }

        const response = responses[Math.floor(Math.random() * responses.length)];
        this.speak(response, 5000); // Aumentado para 5 segundos

        // Comentário adicional sobre as mudanças visuais
        setTimeout(() => {
            this.commentOnVisualChanges(newWorld);
        }, 3500); // Aumentado para 3.5 segundos
    }

    /**
     * Comenta sobre as mudanças visuais do tema
     * @param {string} world - Mundo atual
     */
    commentOnVisualChanges(world) {
        const visualComments = {
            'dnd': [
                "Observe como os pergaminhos agora brilham com a luz de Mystra!",
                "As cores mudaram para refletir a magia dos Reinos Esquecidos!",
                "Veja como a interface agora ecoa a grandiosidade de Faerûn!"
            ],
            'tormenta': [
                "As cores agora refletem a diversidade de Arton!",
                "Observe como a interface brilha com a luz de Tanna-Toh!",
                "Veja como os elementos mudaram para honrar o Pantheon!"
            ],
            'ordem-paranormal': [
                "A interface agora tem um toque... sobrenatural!",
                "Observe como as cores refletem a fragilidade da Membrana!",
                "Veja como tudo mudou para o estilo da Ordo Realitas!"
            ]
        };

        if (visualComments[world]) {
            const comment = visualComments[world][Math.floor(Math.random() * visualComments[world].length)];
            this.speak(comment, 4000); // Aumentado para 4 segundos
        }
    }

    /**
     * Adapta o discurso conforme o mundo selecionado
     * @param {string} world - Mundo atual
     */
    adaptSpeechToWorld(world) {
        const speechAdaptations = {
            'dnd': {
                greeting: "Pelos deuses!",
                approval: "Mystra aprova!",
                concern: "Os deuses observam...",
                excitement: "Que aventura épica!"
            },
            'tormenta': {
                greeting: "Por minhas barbas mágicas!",
                approval: "Tanna-Toh aprova!",
                concern: "A Tormenta observa...",
                excitement: "Que lenda em Arton!"
            },
            'ordem-paranormal': {
                greeting: "Por Veríssimo!",
                approval: "A Ordo aprova!",
                concern: "O Outro Lado observa...",
                excitement: "Que missão paranormal!"
            }
        };

        this.currentSpeechStyle = speechAdaptations[world] || speechAdaptations['tormenta'];
    }

    // 📚 FEEDBACK SOBRE HISTÓRIAS GERADAS
    
    /**
     * Analisa e comenta sobre o conteúdo específico da história
     * @param {string} story - História gerada
     * @param {Object} characterData - Dados do personagem
     */
    reactToStoryContent(story, characterData) {
        const currentWorld = localStorage.getItem('selectedWorld') || 'tormenta';
        
        // Análise de elementos específicos na história
        const storyElements = this.analyzeStoryElements(story, characterData);
        
        // Comentários baseados nos elementos encontrados
        this.commentOnStoryElements(storyElements, currentWorld);
        
        // Sugestões de desenvolvimento
        setTimeout(() => {
            this.suggestCharacterDevelopment(characterData, currentWorld);
        }, 3000);
    }

    /**
     * Analisa elementos específicos na história
     * @param {string} story - História gerada
     * @param {Object} characterData - Dados do personagem
     * @returns {Object} Elementos encontrados
     */
    analyzeStoryElements(story, characterData) {
        const elements = {
            hasFamily: story.toLowerCase().includes('família') || story.toLowerCase().includes('pais') || story.toLowerCase().includes('mãe') || story.toLowerCase().includes('pai'),
            hasTragedy: story.toLowerCase().includes('morte') || story.toLowerCase().includes('perda') || story.toLowerCase().includes('tragédia'),
            hasAdventure: story.toLowerCase().includes('aventura') || story.toLowerCase().includes('viagem') || story.toLowerCase().includes('jornada'),
            hasMagic: story.toLowerCase().includes('magia') || story.toLowerCase().includes('mágico') || story.toLowerCase().includes('encantamento'),
            hasConflict: story.toLowerCase().includes('guerra') || story.toLowerCase().includes('batalha') || story.toLowerCase().includes('conflito'),
            hasMystery: story.toLowerCase().includes('mistério') || story.toLowerCase().includes('segredo') || story.toLowerCase().includes('enigma'),
            hasRomance: story.toLowerCase().includes('amor') || story.toLowerCase().includes('romance') || story.toLowerCase().includes('paixão'),
            hasTraining: story.toLowerCase().includes('treinamento') || story.toLowerCase().includes('estudo') || story.toLowerCase().includes('aprendizado'),
            hasVillage: story.toLowerCase().includes('vila') || story.toLowerCase().includes('aldeia') || story.toLowerCase().includes('cidade pequena'),
            hasCity: story.toLowerCase().includes('cidade') || story.toLowerCase().includes('metrópole') || story.toLowerCase().includes('capital'),
            hasForest: story.toLowerCase().includes('floresta') || story.toLowerCase().includes('selva') || story.toLowerCase().includes('bosque'),
            hasMountain: story.toLowerCase().includes('montanha') || story.toLowerCase().includes('montanhas') || story.toLowerCase().includes('pico'),
            hasSea: story.toLowerCase().includes('mar') || story.toLowerCase().includes('oceano') || story.toLowerCase().includes('porto'),
            hasDungeon: story.toLowerCase().includes('masmorra') || story.toLowerCase().includes('dungeon') || story.toLowerCase().includes('ruínas'),
            hasTemple: story.toLowerCase().includes('templo') || story.toLowerCase().includes('igreja') || story.toLowerCase().includes('santuário'),
            hasAcademy: story.toLowerCase().includes('academia') || story.toLowerCase().includes('escola') || story.toLowerCase().includes('universidade'),
            hasGuild: story.toLowerCase().includes('guilda') || story.toLowerCase().includes('guild') || story.toLowerCase().includes('corporação'),
            hasNobility: story.toLowerCase().includes('nobre') || story.toLowerCase().includes('aristocracia') || story.toLowerCase().includes('realeza'),
            hasPoverty: story.toLowerCase().includes('pobre') || story.toLowerCase().includes('miséria') || story.toLowerCase().includes('fome'),
            hasWealth: story.toLowerCase().includes('rico') || story.toLowerCase().includes('riqueza') || story.toLowerCase().includes('fortuna')
        };

        return elements;
    }

    /**
     * Comenta sobre elementos específicos encontrados na história
     * @param {Object} elements - Elementos encontrados
     * @param {string} world - Mundo atual
     */
    commentOnStoryElements(elements, world) {
        const comments = [];
        
        // Comentários baseados em elementos específicos
        if (elements.hasFamily) {
            comments.push("Vejo que a família tem um papel importante nesta história...");
        }
        
        if (elements.hasTragedy) {
            comments.push("Uma tragédia no passado... isso explica muito sobre sua motivação.");
        }
        
        if (elements.hasAdventure) {
            comments.push("Uma vida de aventuras! Que espírito aventureiro!");
        }
        
        if (elements.hasMagic) {
            if (world === 'dnd') {
                comments.push("A magia de Mystra flui em suas veias!");
            } else if (world === 'tormenta') {
                comments.push("A magia de Tanna-Toh te escolheu!");
            } else {
                comments.push("Há algo... sobrenatural em seu passado.");
            }
        }
        
        if (elements.hasConflict) {
            comments.push("Um passado marcado por conflitos... isso forjou seu caráter.");
        }
        
        if (elements.hasMystery) {
            comments.push("Há mistérios em seu passado que ainda precisam ser revelados...");
        }
        
        if (elements.hasRomance) {
            comments.push("O amor também tem seu lugar em sua história...");
        }
        
        if (elements.hasTraining) {
            comments.push("Dedicação ao treinamento! Isso mostra disciplina.");
        }
        
        // Comentários sobre locais
        if (elements.hasVillage) {
            comments.push("Uma origem humilde... isso te deu perspectiva.");
        }
        
        if (elements.hasCity) {
            comments.push("Criado na cidade grande... isso te deu experiência urbana.");
        }
        
        if (elements.hasForest) {
            comments.push("A natureza sempre foi sua aliada...");
        }
        
        if (elements.hasMountain) {
            comments.push("As montanhas te ensinaram resistência...");
        }
        
        if (elements.hasSea) {
            comments.push("O mar sempre te chamou... há algo de liberdade nisso.");
        }
        
        if (elements.hasDungeon) {
            comments.push("Masmorras e ruínas... que experiência perigosa!");
        }
        
        if (elements.hasTemple) {
            comments.push("A fé sempre foi importante em sua vida...");
        }
        
        if (elements.hasAcademy) {
            comments.push("Educação formal! Isso explica sua sabedoria.");
        }
        
        if (elements.hasGuild) {
            comments.push("Uma guilda! Isso te deu conexões importantes.");
        }
        
        if (elements.hasNobility) {
            comments.push("Sangue nobre! Isso explica sua presença.");
        }
        
        if (elements.hasPoverty) {
            comments.push("A pobreza te ensinou a valorizar cada oportunidade...");
        }
        
        if (elements.hasWealth) {
            comments.push("A riqueza te deu oportunidades únicas...");
        }

        // Escolher um comentário aleatório se houver algum
        if (comments.length > 0) {
            const comment = comments[Math.floor(Math.random() * comments.length)];
            this.speak(comment, 4000);
        }
    }

    /**
     * Sugere desenvolvimento do personagem
     * @param {Object} characterData - Dados do personagem
     * @param {string} world - Mundo atual
     */
    suggestCharacterDevelopment(characterData, world) {
        const suggestions = [];
        
        // Sugestões baseadas na classe
        if (characterData.class) {
            if (characterData.class.includes('Mago') || characterData.class.includes('Arcanista')) {
                suggestions.push("Considere estudar magias de proteção para complementar seu arsenal.");
            } else if (characterData.class.includes('Guerreiro') || characterData.class.includes('Cavaleiro')) {
                suggestions.push("Treinar técnicas de combate defensivo pode salvar sua vida.");
            } else if (characterData.class.includes('Ladino') || characterData.class.includes('Bucaneiro')) {
                suggestions.push("Habilidades sociais podem ser tão úteis quanto suas técnicas furtivas.");
            } else if (characterData.class.includes('Clérigo') || characterData.class.includes('Paladino')) {
                suggestions.push("A fé é sua força, mas não negligencie o combate físico.");
            }
        }
        
        // Sugestões baseadas na raça
        if (characterData.race) {
            if (characterData.race.includes('Humano')) {
                suggestions.push("Como humano, sua versatilidade é sua maior vantagem.");
            } else if (characterData.race.includes('Elfo')) {
                suggestions.push("A longevidade élfica te dá tempo para aperfeiçoar suas habilidades.");
            } else if (characterData.race.includes('Anão')) {
                suggestions.push("A resistência anã te serve bem, mas não negligencie a diplomacia.");
            }
        }
        
        // Sugestões baseadas no alinhamento
        if (characterData.alignment) {
            if (characterData.alignment.includes('Bom')) {
                suggestions.push("Sua bondade é admirável, mas não seja ingênuo.");
            } else if (characterData.alignment.includes('Mau')) {
                suggestions.push("O poder tem seu preço... escolha sabiamente seus aliados.");
            } else if (characterData.alignment.includes('Neutro')) {
                suggestions.push("O equilíbrio é sábio, mas às vezes é preciso escolher um lado.");
            }
        }
        
        // Sugestões específicas por mundo
        if (world === 'dnd') {
            suggestions.push("Os Reinos Esquecidos são vastos. Considere especializar-se em uma região.");
        } else if (world === 'tormenta') {
            suggestions.push("Arton é diverso. Aprenda sobre as diferentes culturas do Reinado.");
        } else if (world === 'ordem-paranormal') {
            suggestions.push("O paranormal é imprevisível. Mantenha-se sempre preparado.");
        }
        
        // Escolher uma sugestão aleatória
        if (suggestions.length > 0) {
            const suggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
            this.speak(suggestion, 5000);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Aguardar um pequeno delay para garantir que outros scripts foram carregados
    setTimeout(() => {
        window.magoCompanion = new MagoCompanion();
    }, 100);
});

export { MagoCompanion };