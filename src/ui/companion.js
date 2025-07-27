import { getCurrentWorldConfig } from '../config/worldsConfig.js';

class MagoCompanion {
    constructor() {
        this.companionContainer = document.querySelector('.companion-container');
        this.speechBubble = document.querySelector('.companion-speech-bubble');
        this.companionText = document.getElementById('companionText');
        this.companionAvatar = document.querySelector('.companion-avatar');
        this.lastMessage = null;
        this.speechTimeout = null;
        this.isSpeaking = false;
        this.triggeredEasterEggs = new Set(); // Para evitar repetição de Easter Eggs
        this.setupEventListeners();
        this.setupMobileEvents();
        this.setupScrollListener();
        
        // Garantir que o mago comece visível
        if (this.companionContainer) {
            this.companionContainer.style.opacity = '1';
        }
        
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
            
            // Verificar Easter Eggs de nomes específicos
            const easterEggResponse = this.checkNameEasterEggs(name, currentWorld);
            if (easterEggResponse) {
                this.speak(easterEggResponse, 30000); // 30 segundos para Easter Eggs
                return;
            }
            
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

    /**
     * Verifica Easter Eggs de nomes específicos
     */
    checkNameEasterEggs(name, world) {
        const normalizedName = name.toLowerCase().trim();
        
        // Easter Eggs especiais
        if (normalizedName === 'merlin') {
            if (!this.triggeredEasterEggs.has('merlin')) {
                this.triggeredEasterEggs.add('merlin');
                this.addMagicalEyeGlow('merlin');
                return "*olhos brilham magicamente* Eu conheço alguém com esse nome... *sussurra arcano*";
            }
            return null;
        }
        
        if (normalizedName === 'marques') {
            if (!this.triggeredEasterEggs.has('marques')) {
                this.triggeredEasterEggs.add('marques');
                this.addMagicalEyeGlow('marques');
                return "*olhos brilham intensamente* Foi ele quem me prendeu aqui pela eternidade... *sussurro sombrio* O deus criador deste universo...";
            }
            return null;
        }
        
        // Verificar variações do nome Crequi
        const crequiVariations = ['crequi', 'créqui', 'crequi lahk', 'créqui láhk', 'crequi lah', 'créqui lah'];
        if (crequiVariations.includes(normalizedName)) {
            const easterEggKey = `crequi-${world}`;
            if (!this.triggeredEasterEggs.has(easterEggKey)) {
                this.triggeredEasterEggs.add(easterEggKey);
                this.addMagicalEyeGlow('crequi');
                return this.getCrequiResponse(world);
            }
            return null;
        }
        
        // Nomes dos Renegados - Easter Eggs multiverso
        const renegados = {
            'vorlan': {
                'tormenta': [
                    "Ah, sim… o ladino com olhos como rubis e segredos tão profundos quanto túmulos.",
                    "Se for flanquear com um Nefarion, traga alguém pra tankar. Sério. Vai por mim."
                ],
                'ordem-paranormal': [
                    "Esse nome me dá calafrios… alguém com ele já esfaqueou um ritualista nas costas. E sumiu na névoa.",
                    "Vorlan? Não sei se é um agente do Ordo Realitas… ou uma anomalia que escapou da contenção."
                ],
                'dnd': [
                    "Já ouvi esse nome nos becos de Baldur's Gate… falavam de um esqueleto com duas adagas e uma dívida com a Morte.",
                    "Se for esse Vorlan que enfrentou um beholder sozinho… bom, ele não venceu, mas que estilo!"
                ]
            },
            'igris': {
                'tormenta': [
                    "Olhos díspares, lâminas limpas e passado sujo. Os melhores guerreiros sempre vêm das arenas.",
                    "Ele fala pouco, mas quando fala… é com a espada."
                ],
                'ordem-paranormal': [
                    "Esse Igris aí… dizem que escapou de uma prisão do Sigma usando só uma katana e silêncio absoluto.",
                    "Olhos diferentes, alma marcada. Talvez seja um host. Ou algo pior."
                ],
                'dnd': [
                    "Katana em mãos, cicatrizes nas costas… se esse for o Igris que enfrentou Tiamat, entendo o clima sombrio.",
                    "Elfo? Gladiador? Combinação letal. Principalmente se o bardo estiver por perto narrando."
                ]
            },
            'malthas': {
                'tormenta': [
                    "Aqueles que têm antenas... escutam o que nenhum mortal deveria. Malthas aprendeu isso da pior forma.",
                    "Cuidado. Se ele começar a extrair éter, prepare-se pra correr. Ou rezar."
                ],
                'ordem-paranormal': [
                    "Lefou com antenas? Ah, claro. Código 17-Roxo. Não era pra ele estar aqui. Mas ninguém impediu.",
                    "Você já sonhou com insetos? Se sim... talvez conheça Malthas."
                ],
                'dnd': [
                    "Feiticeiro deformado pela magia? Clássico. Mas esse aqui... ele brilha no escuro. Isso não é bom sinal.",
                    "Se ele começar a murmurar em Abissal, esconda os grimórios."
                ]
            },
            'azariel': {
                'tormenta': [
                    "A cura de trevas às vezes vem da luz errada… Marek que o diga.",
                    "Alado, sábio, e com fé demais para este mundo. Mas útil. Muito útil."
                ],
                'ordem-paranormal': [
                    "Um anjo? Aqui? Tem certeza que não é um avatar? Ou talvez… um eco de um Elo Perdido?",
                    "Tanah-Toh não existe neste mundo. Mas ele age como se existisse. Isso me assusta um pouco."
                ],
                'dnd': [
                    "Clérigos alados são raros. Os que curam mortos-vivos então… quase impossíveis.",
                    "Se você errar a cura de novo, Azariel, prometo que um guerreiro vai te usar de escudo."
                ]
            },
            'rashid': {
                'tormenta': [
                    "Ah, o Qareen cantor! Encanta corações e distrai assassinos. Às vezes ao mesmo tempo.",
                    "Se o alaúde quebrar, o grupo desaba. Literalmente."
                ],
                'ordem-paranormal': [
                    "Bardo em Paranormal? Tá achando que é musical? Ainda bem que ele canta em Énoquico… ou quase isso.",
                    "A música dele acalma até o Sigma. Ou pelo menos, os faz dançar."
                ],
                'dnd': [
                    "Já ouvi Rashid tocar na corte de Neverwinter. Fez um dragão chorar. Depois foi preso. Longa história.",
                    "Se ele começar a cantar, prepare-se. Ou será um buff... ou um escândalo diplomático."
                ]
            },
            'marek': {
                'tormenta': [
                    "Ossos de um cavaleiro... e um nome que pesa mais que a armadura. Marek carrega o que muitos não suportariam lembrar.",
                    "Se for esse o Marek verdadeiro, que Khalmyr tenha misericórdia de quem cruzar o caminho dele.",
                    "Já ouvi ecos de seus passos no Salão dos Corvos... e o som que vinham não era de arrependimento."
                ],
                'ordem-paranormal': [
                    "Há algo nesse nome... como se ele fosse um Cavaleiro do Vazio, amaldiçoado a guardar um segredo eterno.",
                    "Marek? Eu vi esse nome num manuscrito rasgado da Ordo Realitas, marcado com sangue seco e a palavra: 'Cinza'.",
                    "Um esqueleto guiado por justiça? Em Paranormal, isso só pode significar uma coisa: entidade grau S."
                ],
                'dnd': [
                    "Um cavaleiro morto-vivo, que luta por honra? Clássico. Mas este… este já enfrentou algo pior que a morte.",
                    "Se for o Marek que conheço, cuidado com os juramentos. Ele os cumpre. Mesmo depois da vida.",
                    "Dizem que quando Marek ajoelha, até os deuses escutam. E às vezes... eles respondem."
                ]
            },
            'samuca': {
                'tormenta': [
                    "Ah, o mestre da sessão! Aquele que controla o destino de todos os renegados...",
                    "Samuca? O narrador supremo que tece as histórias de Arton com maestria divina."
                ],
                'ordem-paranormal': [
                    "O mestre da sessão em Paranormal? Aquele que desvenda os mistérios do Outro Lado...",
                    "Samuca? O condutor das narrativas que fazem a realidade tremer."
                ],
                'dnd': [
                    "O mestre da sessão nos Reinos Esquecidos? Aquele que molda o destino de Faerûn...",
                    "Samuca? O arquiteto das aventuras que fazem os deuses sorrirem."
                ]
            }
        };
        
        const renegado = renegados[normalizedName];
        if (renegado && renegado[world]) {
            const easterEggKey = `${normalizedName}-${world}`;
            if (!this.triggeredEasterEggs.has(easterEggKey)) {
                this.triggeredEasterEggs.add(easterEggKey);
                const responses = renegado[world];
                const response = responses[Math.floor(Math.random() * responses.length)];
                
                // Adicionar efeito visual de brilho nos olhos específico para cada personagem
                this.addMagicalEyeGlow(normalizedName);
                
                return `*olhos brilham magicamente* ${response}`;
            }
        }
        
        return null;
    }

    /**
     * Retorna resposta específica para Crequi baseada no mundo
     */
    getCrequiResponse(world) {
        const responses = {
            'tormenta': [
                "Espelhos, cambalhotas e ossos quebrados... só pode ser ele.",
                "Diga a ele pra não morrer de novo. O clérigo ainda tem pesadelos com aquilo."
            ],
            'ordem-paranormal': [
                "Espelhos são portais… e o último Crequi que vi dançava na frente deles como se fosse um espelho também.",
                "Se começar a falar sozinho perto do espelho… pode não ser loucura. Pode ser Crequi."
            ],
            'dnd': [
                "Pirata esquelético com um monóculo e um arco longo? Ah, sim. Esse já saqueou até planos astrais.",
                "Cuidado com os reflexos. Alguns dizem que o espírito de Crequi ainda vaga entre os espelhos de Sigil."
            ]
        };
        
        const worldResponses = responses[world] || responses['tormenta'];
        const response = worldResponses[Math.floor(Math.random() * worldResponses.length)];
        return `*olhos brilham magicamente* ${response}`;
    }

    /**
     * Adiciona efeito visual de brilho mágico nos olhos
     * @param {string} characterName - Nome do personagem para cor específica
     */
    addMagicalEyeGlow(characterName = null) {
        const companion = document.querySelector('.companion-container');
        if (companion) {
            // Remover classes de glow anteriores
            companion.classList.remove('magical-glow', 'glow-merlin', 'glow-marques', 'glow-vorlan', 'glow-marek', 'glow-crequi', 'glow-malthas', 'glow-rashid', 'glow-azariel', 'glow-igris', 'glow-samuca');
            
            // Aplicar classe específica baseada no personagem
            if (characterName) {
                companion.classList.add(`glow-${characterName}`);
            } else {
                companion.classList.add('magical-glow');
            }
            
            setTimeout(() => {
                companion.classList.remove('magical-glow', 'glow-merlin', 'glow-marques', 'glow-vorlan', 'glow-marek', 'glow-crequi', 'glow-malthas', 'glow-rashid', 'glow-azariel', 'glow-igris', 'glow-samuca');
            }, 4000); // Aumentado para 4 segundos
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
        
        // Verificar combinações inesperadas após a mudança de raça
        this.checkUnexpectedCombinations();
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
        
        // Verificar combinações inesperadas após a mudança de classe
        this.checkUnexpectedCombinations();
    }

    /**
     * Verifica e reage a combinações inesperadas de raça e classe
     */
    checkUnexpectedCombinations() {
        const currentRace = document.getElementById('charRace')?.value;
        const currentClass = document.getElementById('charClass')?.value;
        const currentAlignment = document.getElementById('charAlignment')?.value;
        const currentWorld = localStorage.getItem('selectedWorld') || 'dnd';
        
        if (!currentRace || !currentClass) return;
        
        // Combinações inesperadas por mundo
        const unexpectedCombinations = {
            'dnd': {
                'Halfling-Guerreiro': [
                    "Um halfling guerreiro? *pisca* Que coragem! Pequeno mas destemido!",
                    "Halfling guerreiro? *rindo* Vai precisar de uma escada para montar no cavalo!",
                    "Um guerreiro halfling? *impressionado* Que determinação em um pacote pequeno!"
                ],
                'Draconato-Nobre': [
                    "Um draconato nobre? *ajusta os óculos* Que elegância reptiliana!",
                    "Draconato nobre? *curioso* Como você segura o chá com essas garras?",
                    "Um nobre draconato? *admirado* Que presença real... e escamosa!"
                ],
                'Gnomo-Bárbaro': [
                    "Um gnomo bárbaro? *surpreso* Que fúria em miniatura!",
                    "Gnomo bárbaro? *rindo* Vai quebrar tudo com seu machado... de brinquedo!",
                    "Um bárbaro gnomo? *impressionado* Pequeno mas feroz como um urso!"
                ],
                'Tiefling-Paladino': [
                    "Um tiefling paladino? *curioso* Que ironia divina!",
                    "Tiefling paladino? *impressionado* Redimindo sua linhagem com luz!",
                    "Um paladino tiefling? *admirado* Que determinação em enfrentar preconceitos!"
                ],
                'Meio-Orc-Bardo': [
                    "Um meio-orc bardo? *surpreso* Que melodia... robusta!",
                    "Meio-orc bardo? *rindo* Sua harpa deve ser do tamanho de uma lira!",
                    "Um bardo meio-orc? *curioso* Que voz poderosa para canções suaves!"
                ],
                'Anão-Monge': [
                    "Um anão monge? *pisca* Que disciplina... baixa!",
                    "Anão monge? *rindo* Como você faz as posições de meditação?",
                    "Um monge anão? *impressionado* Que sabedoria em um corpo compacto!"
                ],
                'Elfo-Bárbaro': [
                    "Um elfo bárbaro? *surpreso* Que fúria... elegante!",
                    "Elfo bárbaro? *curioso* Como você mantém a graça na batalha?",
                    "Um bárbaro elfo? *admirado* Que combinação de força e beleza!"
                ],
                'Halfling-Bárbaro': [
                    "Um halfling bárbaro? *rindo* Que fúria... minúscula!",
                    "Halfling bárbaro? *surpreso* Vai quebrar tudo com seu machado de brinquedo!",
                    "Um bárbaro halfling? *impressionado* Pequeno mas feroz como um urso!"
                ],
                'Halfling-Ladino': [
                    "Um halfling ladino? *pisca* Que ladrão... discreto!",
                    "Halfling ladino? *curioso* Como você se esconde sendo tão pequeno?",
                    "Um ladino halfling? *impressionado* Que habilidade em um pacote pequeno!"
                ],
                'Halfling-Druida': [
                    "Um halfling druida? *surpreso* Que natureza... compacta!",
                    "Halfling druida? *curioso* Como você se transforma em animais pequenos?",
                    "Um druida halfling? *impressionado* Que conexão com a natureza em miniatura!"
                ],
                'Tiefling-Clérigo': [
                    "Um tiefling clérigo? *confuso* Que ironia divina!",
                    "Tiefling clérigo? *curioso* Que deus aceita sua linhagem?",
                    "Um clérigo tiefling? *impressionado* Que determinação em servir a luz!"
                ],
                'Meio-Orc-Monge': [
                    "Um meio-orc monge? *surpreso* Que disciplina... robusta!",
                    "Meio-orc monge? *curioso* Como você medita com tanta força?",
                    "Um monge meio-orc? *impressionado* Que sabedoria em um corpo poderoso!"
                ]
            },
            'tormenta': {
                'Minotauro-Arcanista': [
                    "Um minotauro arcanista? *pisca* Que inteligência... bovina!",
                    "Minotauro arcanista? *surpreso* Como você vira as páginas dos grimórios?",
                    "Um arcanista minotauro? *impressionado* Que magia poderosa em um corpo forte!"
                ],
                'Hynne-Guerreiro': [
                    "Um hynne guerreiro? *rindo* Que guerreiro... minúsculo!",
                    "Hynne guerreiro? *curioso* Sua espada deve ser do tamanho de um palito!",
                    "Um guerreiro hynne? *admirado* Pequeno mas corajoso como um leão!"
                ],
                'Osteon-Bucaneiro': [
                    "Um osteon bucaneiro? *surpreso* Que pirata... esquelético!",
                    "Osteon bucaneiro? *rindo* Como você segura o rum sem lábios?",
                    "Um bucaneiro osteon? *curioso* Que navio fantasma você comanda?"
                ],
                'Lefou-Nobre': [
                    "Um lefou nobre? *pisca* Que nobreza... corrompida!",
                    "Lefou nobre? *curioso* Como você mantém a elegância com essas deformações?",
                    "Um nobre lefou? *impressionado* Que determinação em manter a dignidade!"
                ],
                'Golem-Bardo': [
                    "Um golem bardo? *surpreso* Que música... mecânica!",
                    "Golem bardo? *rindo* Sua harpa deve ser de cordas de aço!",
                    "Um bardo golem? *curioso* Que melodia robótica você canta?"
                ],
                'Sílfide-Guerreiro': [
                    "Uma sílfide guerreira? *pisca* Que guerreira... etérea!",
                    "Sílfide guerreira? *rindo* Sua espada deve ser do tamanho de uma agulha!",
                    "Uma guerreira sílfide? *admirado* Que coragem em um corpo tão frágil!"
                ],
                'Qareen-Arcanista': [
                    "Um qareen arcanista? *surpreso* Que magia... desejosa!",
                    "Qareen arcanista? *curioso* Como você controla a magia e os desejos?",
                    "Um arcanista qareen? *impressionado* Que poder místico e carnal!"
                ],
                'Medusa-Bardo': [
                    "Uma medusa bardo? *pisca* Que música... petrificante!",
                    "Medusa bardo? *rindo* Como você canta sem virar as pessoas em pedra?",
                    "Uma bardo medusa? *curioso* Que melodia mortal você entoa?"
                ],
                'Trong-Nobre': [
                    "Um trong nobre? *surpreso* Que nobreza... canibal!",
                    "Trong nobre? *rindo* Como você mantém a elegância sem comer os convidados?",
                    "Um nobre trong? *impressionado* Que refinamento em um corpo feroz!"
                ],
                'Trong-Clérigo': [
                    "Um trong clérigo? *surpreso* Que padre... canibal!",
                    "Trong clérigo? *rindo* Como você abençoa sem comer os fiéis?",
                    "Um clérigo trong? *curioso* Que deus aceita um seguidor faminto?"
                ],
                'Trong-Arcanista': [
                    "Um trong arcanista? *pisca* Que mago... faminto!",
                    "Trong arcanista? *rindo* Como você lê grimórios sem comer as páginas?",
                    "Um arcanista trong? *curioso* Que magia você pratica sem devorar os ingredientes?"
                ],
                'Trong-Bardo': [
                    "Um trong bardo? *surpreso* Que músico... canibal!",
                    "Trong bardo? *rindo* Como você canta sem comer o público?",
                    "Um bardo trong? *curioso* Que melodia você entoa sem devorar os instrumentos?"
                ],
                'Trong-Druida': [
                    "Um trong druida? *pisca* Que druida... faminto!",
                    "Trong druida? *rindo* Como você se transforma sem comer os animais?",
                    "Um druida trong? *curioso* Que natureza você respeita sem devorar a flora?"
                ],
                'Sereia/Tritão-Bárbaro': [
                    "Uma sereia bárbara? *surpreso* Que fúria... aquática!",
                    "Sereia bárbara? *rindo* Como você luta na terra sem secar?",
                    "Uma bárbara sereia? *curioso* Que fúria você tem debaixo d'água?"
                ],
                'Sereia/Tritão-Guerreiro': [
                    "Uma sereia guerreira? *pisca* Que guerreira... molhada!",
                    "Sereia guerreira? *curioso* Como você usa armadura sem enferrujar?",
                    "Uma guerreira sereia? *impressionado* Que combate você trava no mar?"
                ],
                'Sílfide-Bárbaro': [
                    "Uma sílfide bárbara? *surpreso* Que fúria... etérea!",
                    "Sílfide bárbara? *rindo* Como você fica furiosa sendo tão delicada?",
                    "Uma bárbara sílfide? *curioso* Que fúria você tem sendo tão pequena?"
                ],
                'Sílfide-Guerreiro': [
                    "Uma sílfide guerreira? *pisca* Que guerreira... etérea!",
                    "Sílfide guerreira? *rindo* Sua espada deve ser do tamanho de uma agulha!",
                    "Uma guerreira sílfide? *admirado* Que coragem em um corpo tão frágil!"
                ],
                'Minotauro-Druida': [
                    "Um minotauro druida? *surpreso* Que natureza... bovina!",
                    "Minotauro druida? *curioso* Como você se transforma em animais menores?",
                    "Um druida minotauro? *impressionado* Que conexão com a natureza em um corpo forte!"
                ],
                'Minotauro-Bardo': [
                    "Um minotauro bardo? *pisca* Que músico... robusto!",
                    "Minotauro bardo? *curioso* Como você toca instrumentos com essas mãos?",
                    "Um bardo minotauro? *impressionado* Que melodia você entoa com essa voz?"
                ],
                'Golem-Clérigo': [
                    "Um golem clérigo? *surpreso* Que padre... mecânico!",
                    "Golem clérigo? *curioso* Como você reza sendo feito de pedra?",
                    "Um clérigo golem? *impressionado* Que deus aceita um seguidor inanimado?"
                ],
                'Golem-Druida': [
                    "Um golem druida? *pisca* Que natureza... artificial!",
                    "Golem druida? *curioso* Como você se conecta com a natureza sendo artificial?",
                    "Um druida golem? *impressionado* Que equilíbrio entre artificial e natural!"
                ]
            },
            'ordem-paranormal': {
                'Agente de Saúde-Combatente': [
                    "Um agente de saúde combatente? *pisca* Que médico... agressivo!",
                    "Agente de saúde combatente? *curioso* Como você cura e machuca ao mesmo tempo?",
                    "Um combatente agente de saúde? *impressionado* Que combinação de cura e destruição!"
                ],
                'Chef-Ocultista': [
                    "Um chef ocultista? *surpreso* Que culinária... sobrenatural!",
                    "Chef ocultista? *curioso* Como você mistura temperos e rituais?",
                    "Um ocultista chef? *impressionado* Que pratos místicos você prepara?"
                ],
                'Acadêmico-Combatente': [
                    "Um acadêmico combatente? *pisca* Que estudioso... violento!",
                    "Acadêmico combatente? *curioso* Como você combina livros e punhos?",
                    "Um combatente acadêmico? *impressionado* Que conhecimento aplicado na prática!"
                ],
                'Artista-Combatente': [
                    "Um artista combatente? *surpreso* Que arte... sangrenta!",
                    "Artista combatente? *curioso* Como você pinta com sangue e lágrimas?",
                    "Um combatente artista? *impressionado* Que performance violenta você apresenta?"
                ],
                'Cultista Arrependido-Ocultista': [
                    "Um cultista arrependido ocultista? *pisca* Que ocultismo... redimido!",
                    "Cultista arrependido ocultista? *curioso* Como você usa magia sem cair na tentação?",
                    "Um ocultista cultista arrependido? *impressionado* Que determinação em se redimir!"
                ],
                'Amnésico-Combatente': [
                    "Um amnésico combatente? *surpreso* Que lutador... esquecido!",
                    "Amnésico combatente? *curioso* Como você luta sem lembrar das técnicas?",
                    "Um combatente amnésico? *impressionado* Que instinto de sobrevivência!"
                ],
                'Mercenário-Especialista': [
                    "Um mercenário especialista? *pisca* Que mercenário... inteligente!",
                    "Mercenário especialista? *curioso* Como você combina violência e investigação?",
                    "Um especialista mercenário? *impressionado* Que combinação de força e astúcia!"
                ],
                'Lutador-Ocultista': [
                    "Um lutador ocultista? *surpreso* Que ocultismo... violento!",
                    "Lutador ocultista? *curioso* Como você combina punhos e rituais?",
                    "Um ocultista lutador? *impressionado* Que combinação de força física e mística!"
                ],
                'Magnata-Combatente': [
                    "Um magnata combatente? *surpreso* Que rico... violento!",
                    "Magnata combatente? *curioso* Como você combina dinheiro e punhos?",
                    "Um combatente magnata? *impressionado* Que aristocracia... agressiva!"
                ],
                'Trambiqueiro-Especialista': [
                    "Um trambiqueiro especialista? *pisca* Que investigador... trapaceiro!",
                    "Trambiqueiro especialista? *curioso* Como você investiga sem ser honesto?",
                    "Um especialista trambiqueiro? *impressionado* Que combinação de astúcia e investigação!"
                ],
                'Vítima-Ocultista': [
                    "Uma vítima ocultista? *surpreso* Que sobrevivente... místico!",
                    "Vítima ocultista? *curioso* Como você usa magia após o trauma?",
                    "Uma ocultista vítima? *impressionado* Que determinação em enfrentar o horror!"
                ],
                'Amnésico-Especialista': [
                    "Um amnésico especialista? *surpreso* Que investigador... esquecido!",
                    "Amnésico especialista? *curioso* Como você investiga sem lembrar de nada?",
                    "Um especialista amnésico? *impressionado* Que instinto investigativo!"
                ],
                'Teórico da Conspiração-Combatente': [
                    "Um teórico da conspiração combatente? *pisca* Que lutador... paranóico!",
                    "Teórico da conspiração combatente? *curioso* Como você luta e teoriza ao mesmo tempo?",
                    "Um combatente teórico da conspiração? *impressionado* Que combinação de força e paranoia!"
                ],
                'Trambiqueiro-Combatente': [
                    "Um trambiqueiro combatente? *surpreso* Que lutador... trapaceiro!",
                    "Trambiqueiro combatente? *curioso* Como você combina violência e artimanhas?",
                    "Um combatente trambiqueiro? *impressionado* Que combinação de força e astúcia!"
                ],
                'Religioso-Ocultista': [
                    "Um religioso ocultista? *pisca* Que fé... mística!",
                    "Religioso ocultista? *curioso* Como você concilia religião e magia?",
                    "Um ocultista religioso? *impressionado* Que combinação de fé e conhecimento!"
                ],
                'Policial-Ocultista': [
                    "Um policial ocultista? *surpreso* Que investigador... místico!",
                    "Policial ocultista? *curioso* Como você combina protocolos e rituais?",
                    "Um ocultista policial? *impressionado* Que combinação de lei e magia!"
                ],
                'Universitário-Combatente': [
                    "Um universitário combatente? *pisca* Que estudioso... violento!",
                    "Universitário combatente? *curioso* Como você combina livros e punhos?",
                    "Um combatente universitário? *impressionado* Que conhecimento aplicado na prática!"
                ],
                'T.I.-Ocultista': [
                    "Um profissional de T.I. ocultista? *surpreso* Que programador... místico!",
                    "T.I. ocultista? *curioso* Como você combina código e rituais?",
                    "Um ocultista T.I.? *impressionado* Que combinação de tecnologia e magia!"
                ],
                'Ocultista': {
                    'Caótico e Mau': [
                        "Um ocultista caótico mau? *confuso* Que magia... perversa!",
                        "Ocultista caótico mau? *surpreso* Que conhecimento maligno!",
                        "Um ocultista caótico mau? *curioso* Que rituais sombrios você pratica?"
                    ]
                },
                'Combatente': {
                    'Caótico e Mau': [
                        "Um combatente caótico mau? *confuso* Que guerreiro... perverso!",
                        "Combatente caótico mau? *surpreso* Que violência sem controle!",
                        "Um combatente caótico mau? *curioso* Que batalha você trava?"
                    ]
                },
                'Especialista': {
                    'Caótico e Mau': [
                        "Um especialista caótico mau? *confuso* Que investigador... perverso!",
                        "Especialista caótico mau? *surpreso* Que conhecimento maligno!",
                        "Um especialista caótico mau? *curioso* Que mistérios você desvenda?"
                    ]
                }
            }
        };
        
        // Verificar combinações inesperadas
        const combinationKey = `${currentRace}-${currentClass}`;
        const worldCombinations = unexpectedCombinations[currentWorld];
        
        if (worldCombinations && worldCombinations[combinationKey]) {
            const responses = worldCombinations[combinationKey];
            const response = responses[Math.floor(Math.random() * responses.length)];
            
            // Delay para não sobrecarregar após a reação da classe
            setTimeout(() => {
                this.speak(response, 5000);
            }, 2000);
        }
        
        // Verificar alinhamentos inesperados
        this.checkUnexpectedAlignment(currentClass, currentAlignment, currentWorld);
    }
    
    /**
     * Verifica alinhamentos inesperados para certas classes
     */
    checkUnexpectedAlignment(className, alignment, world) {
        const unexpectedAlignments = {
            'dnd': {
                'Paladino': {
                    'Caótico e Mau': [
                        "Um paladino caótico mau? *confuso* Como isso funciona?",
                        "Paladino caótico mau? *surpreso* Que contradição divina!",
                        "Um paladino caótico mau? *curioso* Que ordem você segue?"
                    ],
                    'Leal e Mau': [
                        "Um paladino mau leal? *pisca* Que justiça... sombria!",
                        "Paladino mau leal? *curioso* Que deus você serve?",
                        "Um paladino mau leal? *impressionado* Que disciplina nas trevas!"
                    ]
                },
                'Clérigo': {
                    'Caótico e Mau': [
                        "Um clérigo caótico mau? *confuso* Que deus aceita isso?",
                        "Clérigo caótico mau? *surpreso* Que divindade você venera?",
                        "Um clérigo caótico mau? *curioso* Que templo você frequenta?"
                    ],
                    'Leal e Mau': [
                        "Um clérigo mau leal? *pisca* Que fé... sombria!",
                        "Clérigo mau leal? *curioso* Que deus maligno você serve?",
                        "Um clérigo mau leal? *impressionado* Que disciplina nas trevas!"
                    ]
                },
                'Druida': {
                    'Leal e Mau': [
                        "Um druida mau leal? *confuso* Que natureza... perversa!",
                        "Druida mau leal? *surpreso* Que equilíbrio sombrio!",
                        "Um druida mau leal? *curioso* Que força natural maligna!"
                    ],
                    'Caótico e Mau': [
                        "Um druida caótico mau? *surpreso* Que natureza... corrompida!",
                        "Druida caótico mau? *curioso* Que equilíbrio você quebra?",
                        "Um druida caótico mau? *confuso* Que força natural perversa!"
                    ]
                },
                'Bardo': {
                    'Leal e Mau': [
                        "Um bardo mau leal? *pisca* Que música... sombria!",
                        "Bardo mau leal? *curioso* Que canções malignas você canta?",
                        "Um bardo mau leal? *impressionado* Que arte nas trevas!"
                    ],
                    'Caótico e Mau': [
                        "Um bardo caótico mau? *surpreso* Que música... perversa!",
                        "Bardo caótico mau? *curioso* Que canções malignas você entoa?",
                        "Um bardo caótico mau? *confuso* Que arte nas trevas você pratica?"
                    ]
                },
                'Paladino': {
                    'Caótico e Mau': [
                        "Um paladino caótico mau? *confuso* Como isso funciona em Arton?",
                        "Paladino caótico mau? *surpreso* Que contradição divina!",
                        "Um paladino caótico mau? *curioso* Que ordem você segue?"
                    ],
                    'Leal e Mau': [
                        "Um paladino mau leal? *pisca* Que justiça... sombria!",
                        "Paladino mau leal? *curioso* Que deus do Pantheon você serve?",
                        "Um paladino mau leal? *impressionado* Que disciplina nas trevas!"
                    ]
                },
                'Nobre': {
                    'Caótico e Mau': [
                        "Um nobre caótico mau? *confuso* Que aristocracia... perversa!",
                        "Nobre caótico mau? *surpreso* Que família você representa?",
                        "Um nobre caótico mau? *curioso* Que linhagem sombria!"
                    ]
                }
            },
            'tormenta': {
                'Paladino': {
                    'Caótico e Mau': [
                        "Um paladino caótico mau? *confuso* Como isso funciona em Arton?",
                        "Paladino caótico mau? *surpreso* Que contradição divina!",
                        "Um paladino caótico mau? *curioso* Que ordem você segue?"
                    ],
                    'Leal e Mau': [
                        "Um paladino mau leal? *pisca* Que justiça... sombria!",
                        "Paladino mau leal? *curioso* Que deus do Pantheon você serve?",
                        "Um paladino mau leal? *impressionado* Que disciplina nas trevas!"
                    ]
                },
                'Clérigo': {
                    'Caótico e Mau': [
                        "Um clérigo caótico mau? *confuso* Que deus aceita isso?",
                        "Clérigo caótico mau? *surpreso* Que divindade você venera?",
                        "Um clérigo caótico mau? *curioso* Que templo você frequenta?"
                    ]
                },
                'Druida': {
                    'Leal e Mau': [
                        "Um druida mau leal? *confuso* Que natureza... perversa!",
                        "Druida mau leal? *surpreso* Que equilíbrio sombrio!",
                        "Um druida mau leal? *curioso* Que força natural maligna!"
                    ]
                },
                'Bardo': {
                    'Leal e Mau': [
                        "Um bardo mau leal? *pisca* Que música... sombria!",
                        "Bardo mau leal? *curioso* Que canções malignas você canta?",
                        "Um bardo mau leal? *impressionado* Que arte nas trevas!"
                    ]
                },
                'Nobre': {
                    'Caótico e Mau': [
                        "Um nobre caótico mau? *confuso* Que aristocracia... perversa!",
                        "Nobre caótico mau? *surpreso* Que família você representa?",
                        "Um nobre caótico mau? *curioso* Que linhagem sombria!"
                    ]
                }
            },
            'ordem-paranormal': {
                'Ocultista': {
                    'Caótico e Mau': [
                        "Um ocultista caótico mau? *confuso* Que magia... perversa!",
                        "Ocultista caótico mau? *surpreso* Que conhecimento maligno!",
                        "Um ocultista caótico mau? *curioso* Que rituais sombrios você pratica?"
                    ]
                },
                'Combatente': {
                    'Caótico e Mau': [
                        "Um combatente caótico mau? *confuso* Que guerreiro... perverso!",
                        "Combatente caótico mau? *surpreso* Que violência sem controle!",
                        "Um combatente caótico mau? *curioso* Que batalha você trava?"
                    ]
                },
                'Especialista': {
                    'Caótico e Mau': [
                        "Um especialista caótico mau? *confuso* Que investigador... perverso!",
                        "Especialista caótico mau? *surpreso* Que conhecimento maligno!",
                        "Um especialista caótico mau? *curioso* Que mistérios você desvenda?"
                    ]
                }
            }
        };
        
        const worldAlignments = unexpectedAlignments[world];
        if (worldAlignments && worldAlignments[className] && worldAlignments[className][alignment]) {
            const responses = worldAlignments[className][alignment];
            const response = responses[Math.floor(Math.random() * responses.length)];
            
            // Delay para não sobrecarregar
            setTimeout(() => {
                this.speak(response, 4000);
            }, 3000);
        }
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
        
        // Verificar alinhamentos inesperados após a mudança de alinhamento
        const currentClass = document.getElementById('charClass')?.value;
        if (currentClass) {
            this.checkUnexpectedAlignment(currentClass, alignment, currentWorld);
        }
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
        this.speak(response, 6000); // Aumentado para 6 segundos

        // Comentário adicional sobre as mudanças visuais (OPCIONAL - reduzir frequência)
        // Apenas 30% das vezes para não sobrecarregar
        if (Math.random() < 0.3) {
            setTimeout(() => {
                this.commentOnVisualChanges(newWorld);
            }, 8000); // Aumentado para 8 segundos
        }
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

export { MagoCompanion };