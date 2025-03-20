class MagoCompanion {
    constructor() {
        this.container = document.querySelector(".companion-container");
        this.speechBubble = document.querySelector(".companion-speech-bubble");
        this.companionText = document.getElementById("companionText");
        this.companionAvatar = document.querySelector(".companion-avatar");
        this.lastMessage = "";
        this.isDragging = false;
        this.dragOffset = { y: 0 };
        this.isMobile = window.innerWidth <= 1023;

        // Aguardar o DOM estar completamente carregado
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        console.log("Mago Companion inicializado");
        this.setupEventListeners();

        // Configurar arrasto apenas em dispositivos móveis
        if (this.isMobile) {
            this.setupDraggable();
            this.loadPosition();
        }

        this.greet();
    }

    setupEventListeners() {
        console.log("Configurando event listeners do Mago Companion");

        // Conecta os eventos de input/change com os métodos correspondentes
        const charName = document.getElementById("charName");
        const charRace = document.getElementById("charRace");
        const charClass = document.getElementById("charClass");
        const charAlignment = document.getElementById("charAlignment");
        const rollAttributesBtn = document.getElementById("rollAttributes");

        // Adicionar event listeners diretamente (sem tentar remover os antigos)
        if (charName) {
            charName.addEventListener("input", (e) => this.onNameInput(e));
            console.log("Event listener adicionado para charName");
        }

        if (charRace) {
            charRace.addEventListener("change", (e) => this.onRaceChange(e));
            console.log("Event listener adicionado para charRace");
        }

        if (charClass) {
            charClass.addEventListener("change", (e) => this.onClassChange(e));
            console.log("Event listener adicionado para charClass");
        }

        if (charAlignment) {
            charAlignment.addEventListener("change", (e) => this.onAlignmentChange(e));
            console.log("Event listener adicionado para charAlignment");
        }

        // Adicionar event listener para o botão de rolar atributos
        if (rollAttributesBtn) {
            rollAttributesBtn.addEventListener("click", () => {
                console.log("Botão de rolar atributos clicado");
                this.onRollAttributes();
            });
            console.log("Event listener adicionado para rollAttributes");
        }

        // Eventos para outros botões
        const buttonElements = ["generateLore", "saveCharacter", "clearForm"];

        buttonElements.forEach((elementId) => {
            const el = document.getElementById(elementId);
            if (el) {
                el.addEventListener("click", () => {
                    if (elementId === "generateLore") {
                        this.speak("Deixe-me consultar os pergaminhos antigos...", 3000);
                    } else if (elementId === "saveCharacter") {
                        this.speak("Seu herói foi registrado em meu grimório!", 3000);
                    } else {
                        this.hideSpeechBubble();
                    }
                });
            }
        });

        // Adiciona evento de clique no avatar para mostrar/esconder o balão
        this.companionAvatar.addEventListener("click", (e) => {
            // Só mostra/esconde o balão se não estiver arrastando
            if (!this.isDragging) {
                this.toggleSpeechBubble();
            }
        });

        // Esconde o balão quando clicar fora
        document.addEventListener("click", (e) => {
            if (!this.companionAvatar.contains(e.target) && !this.speechBubble.contains(e.target)) {
                this.hideSpeechBubble();
            }
        });

        // Atualiza o estado mobile quando a janela é redimensionada
        window.addEventListener("resize", () => {
            const wasMobile = this.isMobile;
            this.isMobile = window.innerWidth <= 1023;

            // Se mudou de desktop para mobile ou vice-versa
            if (wasMobile !== this.isMobile) {
                if (this.isMobile) {
                    // Mudou para mobile
                    this.setupDraggable();
                    this.loadPosition();
                    this.companionAvatar.style.cursor = "grab";
                } else {
                    // Mudou para desktop
                    this.removeDraggable();
                    this.resetDesktopPosition();
                    this.companionAvatar.style.cursor = "default";
                }
            }
        });

        // Salvar posição quando a janela for fechada (apenas em mobile)
        window.addEventListener("beforeunload", () => {
            if (this.isMobile) {
                this.savePosition();
            }
        });
    }

    setupDraggable() {
        // Remover listeners existentes para evitar duplicação
        this.removeDraggable();

        // Mouse events (desktop)
        this.companionAvatar.addEventListener("mousedown", this.handleMouseDown);
        document.addEventListener("mousemove", this.handleMouseMove);
        document.addEventListener("mouseup", this.handleMouseUp);

        // Touch events (mobile)
        this.companionAvatar.addEventListener("touchstart", this.handleTouchStart);
        document.addEventListener("touchmove", this.handleTouchMove);
        document.addEventListener("touchend", this.handleTouchEnd);

        // Prevenir comportamento padrão de arrastar imagem
        this.companionAvatar.addEventListener("dragstart", this.handleDragStart);
    }

    removeDraggable() {
        // Remover todos os event listeners de arrasto
        this.companionAvatar.removeEventListener("mousedown", this.handleMouseDown);
        document.removeEventListener("mousemove", this.handleMouseMove);
        document.removeEventListener("mouseup", this.handleMouseUp);

        this.companionAvatar.removeEventListener("touchstart", this.handleTouchStart);
        document.removeEventListener("touchmove", this.handleTouchMove);
        document.removeEventListener("touchend", this.handleTouchEnd);

        this.companionAvatar.removeEventListener("dragstart", this.handleDragStart);
    }

    // Usando arrow functions para manter o contexto 'this'
    handleMouseDown = (e) => this.startDrag(e);
    handleMouseMove = (e) => this.drag(e);
    handleMouseUp = () => this.endDrag();
    handleTouchStart = (e) => this.startDrag(e);
    handleTouchMove = (e) => this.drag(e);
    handleTouchEnd = () => this.endDrag();
    handleDragStart = (e) => e.preventDefault();

    startDrag(e) {
        if (!this.isMobile) return; // Só permite arrasto em mobile

        this.isDragging = true;
        this.companionAvatar.style.cursor = "grabbing";

        // Adicionar classe visual para feedback
        this.companionAvatar.classList.add("dragging");

        // Capturar a posição inicial do mouse/toque
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);

        // Calcular o offset entre o ponto de clique e o topo do elemento
        const rect = this.container.getBoundingClientRect();
        this.dragOffset.y = clientY - rect.top;

        // Prevenir comportamento padrão para evitar problemas em dispositivos móveis
        if (e.type === "touchstart") {
            e.preventDefault();
        }
    }

    drag(e) {
        if (!this.isDragging || !this.isMobile) return;

        // Obter a posição atual do mouse/toque
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);

        if (clientY === undefined) return;

        // Calcular a nova posição considerando o offset (apenas vertical)
        const newTop = clientY - this.dragOffset.y;

        // Limitar a posição para não sair da tela
        const maxY = window.innerHeight - this.container.offsetHeight;
        const boundedTop = Math.max(0, Math.min(newTop, maxY));

        // Aplicar a nova posição (apenas vertical)
        // Usamos valores percentuais para manter a posição relativa à viewport
        const topPercent = (boundedTop / window.innerHeight) * 100;

        // Aplicar a posição com transformação para melhor desempenho
        this.container.style.transform = `translateY(${boundedTop}px)`;
        this.container.style.top = "auto";
        this.container.style.bottom = "auto";

        // Manter fixo no lado direito
        this.container.style.right = "0";
        this.container.style.left = "auto";

        // Prevenir comportamento padrão para evitar rolagem da página
        if (e.type === "touchmove") {
            e.preventDefault();
        }
    }

    endDrag() {
        if (this.isDragging && this.isMobile) {
            this.isDragging = false;
            this.companionAvatar.style.cursor = "grab";

            // Remover classe visual
            this.companionAvatar.classList.remove("dragging");

            // Converter a transformação em posição top para salvar
            const transform = this.container.style.transform;
            const match = transform.match(/translateY$$([^)]+)px$$/);
            if (match && match[1]) {
                const topValue = parseFloat(match[1]);
                const topPercent = (topValue / window.innerHeight) * 100;
                this.container.style.top = `${topPercent}%`;
                this.container.style.transform = "none";
            }

            this.savePosition();
        }
    }

    savePosition() {
        if (!this.isMobile) return;

        const position = {
            top: this.container.style.top,
            bottom: this.container.style.bottom,
        };
        localStorage.setItem("magoCompanionPosition", JSON.stringify(position));
    }

    loadPosition() {
        if (!this.isMobile) return;

        try {
            const savedPosition = localStorage.getItem("magoCompanionPosition");
            if (savedPosition) {
                const position = JSON.parse(savedPosition);
                this.container.style.top = position.top || "auto";
                this.container.style.bottom = position.bottom || "auto";

                // Se não tiver posição definida, usar a posição padrão
                if (position.top === "auto" && position.bottom === "auto") {
                    this.resetMobilePosition();
                }
            } else {
                this.resetMobilePosition();
            }

            // Garantir que esteja fixo no lado direito
            this.container.style.right = "0";
            this.container.style.left = "auto";
            this.container.style.transform = "none";
        } catch (error) {
            console.error("Erro ao carregar posição do companion:", error);
            this.resetMobilePosition();
        }
    }

    resetMobilePosition() {
        // Posição padrão no canto inferior direito para mobile
        this.container.style.top = "auto";
        this.container.style.right = "0";
        this.container.style.bottom = "20px";
        this.container.style.left = "auto";
        this.container.style.transform = "none";
    }

    resetDesktopPosition() {
        // Restaurar posição original para desktop
        this.container.style.top = "-1%";
        this.container.style.right = "-12%";
        this.container.style.bottom = "auto";
        this.container.style.left = "auto";
        this.container.style.transform = "none";
    }

    toggleSpeechBubble() {
        if (this.speechBubble.classList.contains("hidden")) {
            this.showLastMessage();
        } else {
            this.hideSpeechBubble();
        }
    }

    speak(text, duration = null) {
        console.log("Mago diz:", text);
        this.lastMessage = text;
        this.speechBubble.classList.remove("hidden");
        this.speechBubble.classList.add("fade-in");
        this.companionText.textContent = text;

        // Efeito visual no avatar quando fala
        this.companionAvatar.classList.add("pulse");
        setTimeout(() => {
            this.companionAvatar.classList.remove("pulse");
        }, 1000);

        if (duration) {
            setTimeout(() => this.hideSpeechBubble(), duration);
        }
    }

    hideSpeechBubble() {
        this.speechBubble.classList.add("hidden");
        this.speechBubble.classList.remove("fade-in");
    }

    showLastMessage() {
        if (this.lastMessage) {
            this.speak(this.lastMessage);
        } else {
            this.greet();
        }
    }

    greet() {
        const greetings = [
            "Bem-vindo ao Forjador de Lendas! Sou Merlin, seu guia em Arton!",
            "Um novo herói para Arton! Vamos criar uma lenda épica juntos!",
            "Por minhas barbas mágicas! Que tal forjar um destino no Reinado?",
        ];
        this.speak(greetings[Math.floor(Math.random() * greetings.length)]);
    }

    onNameInput(e) {
        const name = e.target.value.trim();
        if (name.length > 2) {
            const responses = [
                `${name}? Um nome que ecoará em Arton! Escolha sua raça!`,
                `Ah, ${name}! Vejo um futuro lendário no Reinado para você!`,
                `${name}... *acaricia a barba* Um herói contra a Tormenta, talvez?`,
            ];
            this.speak(responses[Math.floor(Math.random() * responses.length)]);
        }
    }

    onRaceChange(e) {
        console.log("Raça alterada:", e.target.value);
        const raceResponses = {
            Humano: "Humanos! Tão versáteis quanto os ventos de Arton!",
            Anão: "Um anão de Doherimm? Só não me peça para cavar contigo!",
            Dahllan: "Uma dahllan! Allihanna deve estar orgulhosa de você!",
            Elfo: "Um elfo de Lenórienn? Elegante, mas não se perca em séculos!",
            Goblin: "Um goblin? *checa os bolsos* Cuidado com Tollon em você!",
            Lefou: "Um lefou? *recua* Espero que a Tormenta não te siga!",
            Minotauro: "Um minotauro! Só não quebre minha torre com esses chifres!",
            Qareen: "Um qareen! Cuidado com os desejos que conceder por aí!",
            Golem: "Um golem? *observa* Quem te trouxe à vida, hein?",
            Hynne: "Um hynne! Pequeno, mas cheio de sorte, aposto!",
            Kliren: "Um kliren! Sua inteligência vai resolver muitos enigmas!",
            Medusa: "Uma medusa? *evita o olhar* Não me transforme em pedra!",
            Osteon: "Um osteon? *treme* Espero que não seja meu esqueleto animado!",
            "Sereia/Tritão": "Um sereia ou tritão! Não molhe minha túnica, por favor!",
            Sílfide: "Uma sílfide! Você flutua como os ventos de Wynlla!",
            Suraggel: "Um suraggel! Divino ou infernal, escolha com cuidado!",
            Trong: "Um trong! *se afasta* Não me coma, eu sou só um mago velho!",
        };
        this.speak(raceResponses[e.target.value] || "Uma raça intrigante para Arton!");
    }

    onClassChange(e) {
        console.log("Classe alterada:", e.target.value);
        const classResponses = {
            Arcanista: "Um arcanista! *limpa uma lágrima* Um irmão das artes mágicas!",
            Bárbaro: "Um bárbaro! Só não quebre minhas coisas na sua fúria!",
            Bardo: "Um bardo! Cante minhas glórias... quer dizer, as suas!",
            Bucaneiro: "Um bucaneiro! Espero que não roube meu cajado no mar!",
            Caçador: "Um caçador! Perfeito para rastrear horrores da Tormenta!",
            Cavaleiro: "Um cavaleiro! Sua honra brilha mais que minha magia!",
            Clérigo: "Um clérigo! Que os deuses do Pantheon te abençoem!",
            Druida: "Um druida! Allihanna aprova, mas sem lobos na minha torre!",
            Guerreiro: "Um guerreiro! Pronto para as batalhas de Arton!",
            Inventor: "Um inventor! *se anima* Mostre-me seus gadgets!",
            Ladino: "Um ladino! *esconde o bolso* Cuidado com os Ladrões de Deheon!",
            Lutador: "Um lutador! Seus punhos vão impressionar em Arton!",
            Nobre: "Um nobre! Sua presença é digna de Valkaria!",
            Paladino: "Um paladino! A luz de Khalmyr guia seus passos!",
        };
        this.speak(classResponses[e.target.value] || "Uma classe fascinante para Arton!");
    }

    onAlignmentChange(e) {
        console.log("Alinhamento alterado:", e.target.value);
        const alignment = e.target.value;
        if (alignment.includes("Mau")) {
            this.speak("Hmmm... *suspeita* Não traga a Tormenta para minha torre!");
        } else if (alignment.includes("Bom")) {
            this.speak("Um coração nobre! Arton precisa de você contra o mal!");
        } else {
            this.speak("Neutro? Equilíbrio é sábio, mas não seja indeciso!");
        }
    }

    onRollAttributes() {
        console.log("Rolando atributos...");
        const responses = [
            "*Agita as mãos* Que os dados de Nimb decidam seu destino!",
            "Rolando! Que Tanna-Toh revele sua força interior!",
            "*Sopra os dados* Um toque de Wynna para sua sorte!",
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];

        // Forçar a exibição do balão de fala
        this.speak(randomResponse, 4000);
    }
}

// Criar uma instância global do MagoCompanion
let magoCompanionInstance = null;

// Função para inicializar o Mago Companion
function initMagoCompanion() {
    console.log("Inicializando Mago Companion");
    if (!magoCompanionInstance) {
        magoCompanionInstance = new MagoCompanion();
        window.magoCompanion = magoCompanionInstance;
    }
}

// Garantir que o Mago Companion seja inicializado quando o DOM estiver pronto
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMagoCompanion);
} else {
    initMagoCompanion();
}
