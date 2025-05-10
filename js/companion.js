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
        const currentWorld = localStorage.getItem('selectedWorld') || 'dnd';
        let greetings;
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
        this.speak(greetings[Math.floor(Math.random() * greetings.length)]);
    }

    onNameInput(e) {
        const name = e.target.value.trim();
        if (name.length > 2) {
            const currentWorld = localStorage.getItem('selectedWorld') || 'dnd';
            let responses;
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
            this.speak(responses[Math.floor(Math.random() * responses.length)]);
        }
    }

    onRaceChange(e) {
        const selectedRace = e.target.value;
        const currentWorld = localStorage.getItem('selectedWorld') || 'dnd';
        let raceResponses;

        if (currentWorld === 'dnd') {
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
                // Adicionar outras raças de D&D e suas falas conforme necessário
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
        this.speak(raceResponses[selectedRace] || (currentWorld === 'dnd' ? "Uma raça intrigante para os Reinos!" : "Uma raça intrigante para Arton!"));
    }

    onClassChange(e) {
        const selectedClass = e.target.value;
        const currentWorld = localStorage.getItem('selectedWorld') || 'dnd';
        let classResponses;

        if (currentWorld === 'dnd') {
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
                // Adicionar outras classes de D&D e suas falas
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
        this.speak(classResponses[selectedClass] || (currentWorld === 'dnd' ? "Uma classe formidável para os Reinos!" : "Uma classe fascinante para Arton!"));
    }

    onAlignmentChange(e) {
        const alignment = e.target.value;
        const currentWorld = localStorage.getItem('selectedWorld') || 'dnd';
        let response;

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
        this.speak(response);
    }

    onRollAttributes() {
        const currentWorld = localStorage.getItem('selectedWorld') || 'dnd';
        let responses;
        if (currentWorld === 'dnd') {
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
}

document.addEventListener('DOMContentLoaded', () => {
    window.magoCompanion = new MagoCompanion();
});