class MagoCompanion {
    constructor() {
        this.speechBubble = document.querySelector('.companion-speech-bubble');
        this.companionText = document.getElementById('companionText');
        this.companionAvatar = document.querySelector('.companion-avatar');
        this.setupEventListeners();
        this.setupMobileEvents();
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
        if (window.innerWidth <= 768) {
            this.companionAvatar.addEventListener('click', () => {
                if (this.speechBubble.classList.contains('hidden')) {
                    this.showLastMessage();
                } else {
                    this.hideSpeechBubble();
                }
            });

            // Esconde o balão quando clicar fora
            document.addEventListener('click', (e) => {
                if (!this.companionAvatar.contains(e.target) && 
                    !this.speechBubble.contains(e.target)) {
                    this.hideSpeechBubble();
                }
            });
        }
    }

    speak(text, duration = null) {
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
        const greetings = [
            "Bem-vindo ao Forjador de Lendas! Sou Merlin, seu guia em Arton!",
            "Um novo herói para Arton! Vamos criar uma lenda épica juntos!",
            "Por minhas barbas mágicas! Que tal forjar um destino no Reinado?"
        ];
        this.speak(greetings[Math.floor(Math.random() * greetings.length)]);
    }

    onNameInput(e) {
        const name = e.target.value.trim();
        if (name.length > 2) {
            const responses = [
                `${name}? Um nome que ecoará em Arton! Escolha sua raça!`,
                `Ah, ${name}! Vejo um futuro lendário no Reinado para você!`,
                `${name}... *acaricia a barba* Um herói contra a Tormenta, talvez?`
            ];
            this.speak(responses[Math.floor(Math.random() * responses.length)]);
        }
    }

    onRaceChange(e) {
        const raceResponses = {
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
        this.speak(raceResponses[e.target.value] || "Uma raça intrigante para Arton!");
    }

    onClassChange(e) {
        const classResponses = {
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
        this.speak(classResponses[e.target.value] || "Uma classe fascinante para Arton!");
    }

    onAlignmentChange(e) {
        const alignment = e.target.value;
        if (alignment.includes('Mau')) {
            this.speak("Hmmm... *suspeita* Não traga a Tormenta para minha torre!");
        } else if (alignment.includes('Bom')) {
            this.speak("Um coração nobre! Arton precisa de você contra o mal!");
        } else {
            this.speak("Neutro? Equilíbrio é sábio, mas não seja indeciso!");
        }
    }

    onRollAttributes() {
        const responses = [
            "*Agita as mãos* Que os dados de Nimb decidam seu destino!",
            "Rolando! Que Tanna-Toh revele sua força interior!",
            "*Sopra os dados* Um toque de Wynna para sua sorte!"
        ];
        this.speak(responses[Math.floor(Math.random() * responses.length)]);
    }

    showLastMessage() {
        if (this.lastMessage) {
            this.speak(this.lastMessage);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.magoCompanion = new MagoCompanion();
});