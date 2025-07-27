/**
 * Configurações contextuais para cada mundo do RPG
 */

export const worldsConfig = {
    'tormenta': {
        name: 'Tormenta 20',
        fieldLabels: {
            race: 'Raça',
            class: 'Classe'
        },
        races: [
            'Humano', 'Anão', 'Dahllan', 'Elfo', 'Goblin', 'Lefou', 'Minotauro', 
            'Qareen', 'Golem', 'Hynne', 'Kliren', 'Medusa', 'Osteon', 
            'Sereia/Tritão', 'Sílfide', 'Suraggel', 'Trong'
        ],
        classes: [
            'Arcanista', 'Bárbaro', 'Bardo', 'Bucaneiro', 'Caçador', 'Cavaleiro',
            'Clérigo', 'Druida', 'Guerreiro', 'Inventor', 'Ladino', 'Lutador',
            'Nobre', 'Paladino'
        ],
        attributes: ['Força', 'Destreza', 'Constituição', 'Inteligência', 'Sabedoria', 'Carisma'],
        classIcons: {
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
        },
        companionSpeech: {
            greetings: [
                "Bem-vindo ao Forjador de Lendas! Sou Merlin, seu guia em Arton!",
                "Um novo herói para Arton! Vamos criar uma lenda épica juntos!",
                "Por minhas barbas mágicas! Que tal forjar um destino no Reinado?"
            ],
            nameResponses: [
                "{name}? Um nome que ecoará em Arton! Escolha sua raça!",
                "Ah, {name}! Vejo um futuro lendário no Reinado para você!",
                "{name}... *acaricia a barba* Um herói contra a Tormenta, talvez?"
            ],
            raceResponses: {
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
            },
            classResponses: {
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
            },
            alignmentResponses: {
                'Leal e Bom': "Um coração nobre! Arton precisa de você contra o mal!",
                'Neutro e Bom': "Bondade equilibrada! Que Marah aprove seus atos.",
                'Caótico e Bom': "Liberdade e bondade? Cuidado com os tiranos de Arton!",
                'Leal e Neutro': "Ordem sem fanatismo. Khalmyr aprova o equilíbrio.",
                'Neutro': "Neutro? Equilíbrio é sábio, mas não seja indeciso!",
                'Caótico e Neutro': "Liberdade acima de tudo! Que Nimb guie sua sorte.",
                'Leal e Mau': "Hmmm... *suspeita* Não traga a Tormenta para minha torre!",
                'Neutro e Mau': "Pragmatismo sombrio... Cuidado com as tentações.",
                'Caótico e Mau': "Caos e trevas? Definitivamente não traga a Tormenta aqui!"
            },
            rollAttributesResponses: [
                "*Agita as mãos* Que os dados de Nimb decidam seu destino!",
                "Rolando! Que Tanna-Toh revele sua força interior!",
                "*Sopra os dados* Um toque de Wynna para sua sorte!"
            ]
        },
        raceSummaries: {
            'Humano': 'Versáteis, ambiciosos e adaptáveis, os humanos representam a maioria em Arton. Capazes de trilhar qualquer caminho, moldam o mundo com sua vontade e perseverança. Seguem Valkaria, a Deusa da Evolução e da Jornada.',
            'Anão': 'Oriundos das montanhas de Doherimm, anões são robustos, honrados e resilientes. Artesãos lendários, mestres das forjas e da mineração, reverenciam Khalmyr, deus da justiça.',
            'Dahllan': 'Criaturas féericas criadas pela Deusa Allihanna para proteger a natureza. Sua aparência mistura traços humanos e vegetais, com seiva em vez de sangue e flores adornando seus corpos.',
            'Elfo': 'Antigos senhores de Lenórienn, os elfos são graciosos, longevos e dotados de afinidade natural com a magia. A destruição de sua cidade pela Tormenta marcou-os para sempre.',
            'Goblin': 'Pequenos sobreviventes de Tollon, goblins são engenhosos, caóticos e extremamente adaptáveis. Embora vistos como trapaceiros, suas sociedades florescem no subterrâneo.',
            'Lefou': 'Marcados pela corrupção da Tormenta, Lefou são seres deformados, mas ainda dotados de alma. Lutar contra sua natureza é um desafio constante.',
            'Minotauro': 'Guerreiros orgulhosos oriundos de Tapista, minotauros veneravam Tauron, o deus da força, agora morto. Em busca de um novo propósito.',
            'Qareen': 'Descendentes dos gênios, os qareen são belos, carismáticos e profundamente ligados à magia elemental. Vivem principalmente em Wynlla.',
            'Golem': 'Seres artificiais criados por magos há séculos, golems desenvolveram consciência própria. Buscam compreender o significado da vida.',
            'Hynne': 'Pequenos seres similares a halflings, vindos de comunidades alegres. Amantes da boa vida, da sorte e da liberdade.',
            'Kliren': 'Descendentes de gnomos vindos de outros planos, kliren são inovadores, excêntricos e altamente inteligentes. Obcecados por tecnologia.',
            'Medusa': 'Seres amaldiçoados por aparências monstruosas e olhos capazes de petrificar. Vivem isoladas por medo ou são caçadas como aberrações.',
            'Osteon': 'Mortos-vivos conscientes originados por alterações no ciclo natural da morte. Mantêm sua inteligência e personalidade após a morte.',
            'Sereia/Tritão': 'Seres anfíbios, habitantes dos oceanos que cercam Arton. Dotados de voz encantadora e adaptabilidade aquática.',
            'Sílfide': 'Espíritos alados ligados ao vento, as sílfides são leves, esvoaçantes e brincalhonas. Vivem entre nuvens e montanhas.',
            'Suraggel': 'Descendentes de extraplanares — anjos, demônios, ou ambos. Vivem divididos entre luz e trevas.',
            'Trong': 'Seres reptilianos de força colossal, oriundos de regiões pantanosas e cavernosas. Valorizam clãs e sobrevivência acima de tudo.'
        },
        classSummaries: {
            'Arcanista': 'Mestre das artes arcanas, os arcanistas canalizam o poder mágico puro através de anos de estudo ou talento inato. Moldam a realidade com feitiços devastadores.',
            'Bárbaro': 'Guerreiros selvagens que lutam impulsionados por uma fúria primal, dominam as regiões mais indomadas de Arton como as estepes de Tapista.',
            'Bardo': 'Artistas inspirados, os bardos tecem magia através da música, poesia e oratória. Viajantes incansáveis, são historiadores e espiões.',
            'Bucaneiro': 'Corsários e aventureiros marítimos, exímios em navegação e combate ágil. Dominam cidades portuárias como Portsmouth.',
            'Caçador': 'Especialistas em sobrevivência e rastreamento, dominam as fronteiras do Reinado, protegendo contra feras e horrores da Tormenta.',
            'Cavaleiro': 'Defensores da honra e da justiça, seguem códigos rígidos de conduta. Figuras de prestígio em reinos como Deheon e Valkaria.',
            'Clérigo': 'Canalizadores da vontade divina, servem deuses do Panteão como Khalmyr, Lena ou Azgher. Capazes de curar aliados e banir mortos-vivos.',
            'Druida': 'Protetores do ciclo natural, reverenciam Allihanna e os espíritos da terra. Guardiões secretos de florestas como Lenórienn.',
            'Guerreiro': 'Combatentes versáteis, treinados em todas as armas e estilos. Formam o núcleo de exércitos e companhias mercenárias.',
            'Inventor': 'Mentes brilhantes que criam engenhocas fantásticas. Unem ciência e magia, destacando-se em centros como Vectora.',
            'Ladino': 'Mestres das sombras, furtividade e trapaças. Especialistas em infiltração, agem nas vielas de Malpetrim e becos de Portsmouth.',
            'Lutador': 'Especialistas no combate corpo a corpo, aprimoram seu corpo como uma arma mortal. Treinados em academias de Tapista.',
            'Nobre': 'Membros da aristocracia, combinam refinamento, estratégia política e habilidade marcial. Exercem influência sobre reinos e guildas.',
            'Paladino': 'Campeões sagrados, juram lealdade a deuses da justiça como Khalmyr. Portadores de bênçãos divinas, são exemplos de virtude.'
        }
    },
    'dnd': {
        name: 'D&D 5e',
        fieldLabels: {
            race: 'Raça',
            class: 'Classe'
        },
        races: [
            'Humano', 'Anão', 'Elfo', 'Halfling', 'Draconato', 'Gnomo', 
            'Meio-Elfo', 'Meio-Orc', 'Tiefling'
        ],
        classes: [
            'Bárbaro', 'Bardo', 'Bruxo', 'Clérigo', 'Druida', 'Feiticeiro',
            'Guerreiro', 'Ladino', 'Mago', 'Monge', 'Paladino', 'Patrulheiro'
        ],
        attributes: ['Força', 'Destreza', 'Constituição', 'Inteligência', 'Sabedoria', 'Carisma'],
        classIcons: {
            'Bárbaro': 'fa-gavel',
            'Bardo': 'fa-guitar',
            'Bruxo': 'fa-magic',
            'Clérigo': 'fa-pray',
            'Druida': 'fa-leaf',
            'Feiticeiro': 'fa-fire',
            'Guerreiro': 'fa-jedi',
            'Ladino': 'fa-mask',
            'Mago': 'fa-hat-wizard',
            'Monge': 'fa-fist-raised',
            'Paladino': 'fa-shield-alt',
            'Patrulheiro': 'fa-bullseye'
        },
        companionSpeech: {
            greetings: [
                "Bem-vindo ao Forjador de Lendas! Sou seu guia pelos Reinos Esquecidos!",
                "Um novo aventureiro para Faerûn! Que sua jornada seja épica.",
                "Pelos deuses! Pronto para desbravar Waterdeep ou as selvas de Chult?"
            ],
            nameResponses: [
                "{name}? Um nome que ecoará por toda Faerûn!",
                "Ah, {name}! Vejo um futuro de glória e perigo te esperando nos Reinos.",
                "{name}... *esfrega as mãos com antecipação* Um herói para enfrentar os dragões, talvez?"
            ],
            raceResponses: {
                'Humano': "Um humano! O mundo é seu para moldar.",
                'Anão': "Um anão! Seu martelo ecoa como trovões de Moradin.",
                'Elfo': "Um elfo! Suas flechas dançam com a graça de Corellon.",
                'Halfling': "Um halfling! Pequeno, mas com um coração de dragão.",
                'Draconato': "Um draconato! Seu sopro é digno de Bahamut.",
                'Gnomo': "Um gnomo! Que engenhoca você trama hoje?",
                'Meio-Elfo': "Um meio-elfo! Um pé em dois mundos, que equilíbrio!",
                'Meio-Orc': "Um meio-orc! Sua força é uma lenda em formação.",
                'Tiefling': "Um tiefling! Seu fogo interno brilha forte."
            },
            classResponses: {
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
            },
            alignmentResponses: {
                'Leal e Bom': "Um coração nobre! Faerûn precisa de sua luz.",
                'Neutro e Bom': "Bondade equilibrada! Que Tyr aprove seus atos.",
                'Caótico e Bom': "Liberdade e bondade? Cuidado com os tiranos!",
                'Leal e Neutro': "Ordem sem fanatismo. Mystra aprova o equilíbrio.",
                'Neutro': "Equilíbrio é sábio, mas escolha um lado eventualmente.",
                'Caótico e Neutro': "Liberdade acima de tudo! Que Cyric não te seduza.",
                'Leal e Mau': "Ordem sombria? Mystra observa seus passos.",
                'Neutro e Mau': "Pragmatismo sombrio... Cuidado com o abismo.",
                'Caótico e Mau': "Caos e trevas? Não traga demônios à minha torre!"
            },
            rollAttributesResponses: [
                "Que os ventos do destino guiem seus dados!",
                "*Murmura um encantamento* Que Tymora sorria para você!",
                "Rolando os ossos do destino! Que Mystra ilumine seus atributos!"
            ]
        },
        raceSummaries: {
            'Humano': 'Versáteis e ambiciosos, os humanos dominam grande parte de Faerûn. Adaptáveis e determinados, podem ser encontrados em todas as profissões e caminhos. Sua diversidade cultural é vasta, desde os nobres de Waterdeep até os bárbaros do Norte Selvagem.',
            'Anão': 'Robustos e honrados, os anões vivem em fortalezas montanhosas como Mithral Hall. Mestres ferreiros e guerreiros corajosos, reverenciam Moradin e valorizam tradições clânicas. Sua resistência é lendária, assim como seu orgulho.',
            'Elfo': 'Graciosos e longevos, os elfos habitam florestas encantadas como Cormanthor. Ligados à magia e à natureza, seguem Corellon Larethian. Sua sabedoria ancestral e habilidades arcanas são respeitadas em todo Faerûn.',
            'Halfling': 'Pequenos e alegres, os halflings valorizam conforto e comunidade. Vivem em vilarejos pacíficos como os de Luiren, sob a proteção de Yondalla. Sua sorte natural e coragem inesperada os tornam aventureiros únicos.',
            'Draconato': 'Descendentes de dragões, os draconatos carregam orgulho e honra em sua linhagem. Vivem em clãs organizados, seguindo Bahamut ou Tiamat. Seu sopro dracônico e força física os tornam guerreiros formidáveis.',
            'Gnomo': 'Curiosos e inventivos, os gnomos habitam colinas e florestas. Devotos de Garl Glittergold, são conhecidos por sua magia ilusória e engenhosidade. Sua natureza brincalhona esconde uma inteligência afiada.',
            'Meio-Elfo': 'Carismáticos e adaptáveis, os meio-elfos vivem entre dois mundos. Herdeiros da graça élfica e da ambição humana, frequentemente se tornam diplomatas, bardos ou líderes. Buscam seu lugar em ambas as sociedades.',
            'Meio-Orc': 'Fortes e resilientes, os meio-orcs enfrentam preconceitos devido à sua herança. Muitos canalizam sua força em causas nobres, provando que o sangue não define o destino. Gruumsh e Ilneval influenciam alguns, mas não todos.',
            'Tiefling': 'Marcados por herança infernal, os tieflings carregam chifres e caudas como lembretes de seu passado. Apesar da discriminação, muitos buscam redenção ou abraçam sua natureza única. Asmodeus é uma influência constante, mas não inevitável.'
        },
        classSummaries: {
            'Bárbaro': 'Guerreiros selvagens que canalizam fúria primal em combate. Vindos de terras brutas como as Terras Selvagens do Norte, confiam mais no instinto que na estratégia. Sua resistência sobrenatural e força bruta são lendárias.',
            'Bardo': 'Artistas versáteis que tecem magia através de música e palavras. Viajantes incansáveis, coletam histórias e segredos por toda Faerûn. Seus encantamentos podem inspirar aliados ou confundir inimigos.',
            'Bruxo': 'Conjuradores que fizeram pactos com entidades poderosas. Seja com arquifadas, grandes antigos ou diabos, pagam um preço por poder místico. Seus feitiços são limitados mas devastadores.',
            'Clérigo': 'Servos divinos que canalizam o poder de deuses como Selûne, Tempus ou Mystra. Capazes de curar ferimentos e banir mortos-vivos, são tanto curandeiros quanto guerreiros sagrados.',
            'Druida': 'Guardiões da natureza que seguem Silvanus e os espíritos selvagens. Podem se transformar em animais e controlar elementos naturais. Protegem florestas como Cormanthor contra a civilização destrutiva.',
            'Feiticeiro': 'Magos inatos cujo poder vem de linhagens místicas. Seja sangue dracônico ou magia selvagem, seus feitiços são instintivos e poderosos. A magia flui através deles como força natural.',
            'Guerreiro': 'Combatentes versáteis treinados em todas as armas e táticas. Formam o núcleo de exércitos e companhias mercenárias. Sua disciplina e versatilidade os tornam adversários formidáveis.',
            'Ladino': 'Especialistas em furtividade e precisão. Das guildas de ladrões de Waterdeep aos espiões de Luskan, usam astúcia e destreza para sobreviver. Mestres do ataque surpresa e da infiltração.',
            'Mago': 'Estudiosos da magia arcana que dominam a Teia de Mystra através de conhecimento. Seus grimórios contêm segredos poderosos aprendidos em academias como Candlekeep. A preparação é sua maior força.',
            'Monge': 'Ascetas que aperfeiçoam corpo e mente através de disciplina. Treinados em mosteiros remotos, canalizam ki para realizar feitos sobrenaturais. Suas artes marciais transcendem o físico.',
            'Paladino': 'Guerreiros sagrados que juram votos solenes a ideais divinos. Seja devoção, vingança ou redenção, seus juramentos lhes concedem poder divino. São faróis de esperança em tempos sombrios.',
            'Patrulheiro': 'Rastreadores e guardiões das fronteiras selvagens. Conhecem cada trilha de Chult às Terras Selvagens do Norte. Seus inimigos favoritos e terrenos conhecidos os tornam caçadores letais.'
        }
    },
    'ordem-paranormal': {
        name: 'Ordem Paranormal',
        fieldLabels: {
            race: 'Origem',
            class: 'Classe'
        },
        races: [
            'Acadêmico', 'Agente de Saúde', 'Amnésico', 'Artista', 'Atleta',
            'Chef', 'Criminoso', 'Cultista Arrependido', 'Desgarrado',
            'Engenheiro', 'Executivo', 'Investigador', 'Lutador', 'Magnata',
            'Mercenário', 'Militar', 'Operário', 'Policial', 'Religioso',
            'Servidor Público', 'Teórico da Conspiração', 'T.I.',
            'Trabalhador Rural', 'Trambiqueiro', 'Universitário', 'Vítima'
        ],
        classes: [
            'Combatente', 'Especialista', 'Ocultista'
        ],
        attributes: ['Força', 'Agilidade', 'Intelecto', 'Presença', 'Vigor'],
        classIcons: {
            'Combatente': 'fa-shield-alt',
            'Especialista': 'fa-search',
            'Ocultista': 'fa-eye'
        },
        companionSpeech: {
            greetings: [
                "Bem-vindo, agente... A Ordo Realitas precisa de você.",
                "Um novo investigador do paranormal? A Membrana está frágil...",
                "Por Veríssimo! Outro corajoso para enfrentar o Outro Lado."
            ],
            nameResponses: [
                "{name}? Um nome que constará nos arquivos da Ordem.",
                "Ah, {name}! C.R.I.S. já registrou sua entrada no sistema.",
                "{name}... *sussurra* Que os elementos não te corrompam."
            ],
            raceResponses: {
                'Acadêmico': "Um Acadêmico! Seu conhecimento pode salvar ou condenar.",
                'Agente de Saúde': "Um profissional da saúde! A Morte teme sua dedicação.",
                'Amnésico': "Um Amnésico? Seu passado pode esconder horrores...",
                'Artista': "Um Artista! Sua criatividade confunde até entidades.",
                'Atleta': "Um Atleta! Sua disciplina física impressiona.",
                'Chef': "Um Chef! Que seus pratos afastem o mal.",
                'Criminoso': "Um ex-criminoso? A Ordem dá segundas chances.",
                'Cultista Arrependido': "Um ex-cultista? *observa com cautela* Prove sua lealdade.",
                'Desgarrado': "Um Desgarrado! Sem passado, mas com futuro na Ordem.",
                'Engenheiro': "Um Engenheiro! Sua lógica desafia o paranormal.",
                'Executivo': "Um Executivo! Sua influência será útil às missões.",
                'Investigador': "Um Investigador nato! C.R.I.S. aprova sua escolha.",
                'Lutador': "Um Lutador! Seus punhos falam mais alto que rituais.",
                'Magnata': "Um Magnata! Seus recursos fortalecerão a Ordem.",
                'Mercenário': "Um Mercenário! Experiência de combate será crucial.",
                'Militar': "Um Militar! Disciplina será crucial contra o caos.",
                'Operário': "Um Operário! Suas mãos constroem esperança.",
                'Policial': "Um Policial! A lei humana vs. as regras do Outro Lado.",
                'Religioso': "Um Religioso! Sua fé será testada pelo horror.",
                'Servidor Público': "Um Servidor! O Estado precisa da Ordem.",
                'Teórico da Conspiração': "Um Teórico! *sussurra* Você já suspeitava da verdade...",
                'T.I.': "Um profissional de T.I.! C.R.I.S. reconhece um igual.",
                'Trabalhador Rural': "Um Trabalhador Rural! A terra guarda segredos.",
                'Trambiqueiro': "Um Trambiqueiro! Suas artimanhas serão úteis.",
                'Universitário': "Um Universitário! Jovem, mas determinado.",
                'Vítima': "Uma Vítima que sobreviveu... Agora é hora da vingança."
            },
            classResponses: {
                'Combatente': "Um Combatente! Sua coragem enfrenta o horror físico!",
                'Especialista': "Um Especialista! Sua mente desvenda os mistérios do Outro Lado.",
                'Ocultista': "Um Ocultista! *sussurra* Cuidado, o conhecimento tem um preço terrível."
            },
            alignmentResponses: {
                'Leal e Bom': "Lealdade e bondade! A Ordem precisa de almas como você.",
                'Neutro e Bom': "Bondade pragmática. Útil contra cultistas fanáticos.",
                'Caótico e Bom': "Coração rebelde, mas bom. Cuidado com a Produção do Anfitrião!",
                'Leal e Neutro': "Disciplinado e focado. Veríssimo aprovaria.",
                'Neutro': "Neutralidade pode ser sábia... ou perigosa indecisão.",
                'Caótico e Neutro': "Imprevisível como o próprio elemento Energia.",
                'Leal e Mau': "Lealdade sombria... A Seita das Máscaras pensaria assim.",
                'Neutro e Mau': "Pragmatismo frio. Útil, mas... preocupante.",
                'Caótico e Mau': "Caos e maldade? *recua* Não se torne um Transtornado!"
            },
            rollAttributesResponses: [
                "*Ativa C.R.I.S.* Calculando suas capacidades de agente...",
                "Que a sorte determine seu potencial contra o Outro Lado!",
                "*Sussurra* Que os elementos não influenciem estes dados..."
            ]
        },
        raceSummaries: {
            'Acadêmico': 'Um pesquisador ou professor universitário cujos estudos tocaram o paranormal, atraindo a atenção da Ordo Realitas. Trazem rigor intelectual às investigações, mas correm o risco de se tornarem obcecados pelo conhecimento proibido.',
            'Agente de Saúde': 'Profissional da saúde (médico, enfermeiro, paramédico) que encontrou o paranormal durante o trabalho. Hábeis sob pressão e dedicados a salvar vidas, mesmo quando enfrentam horrores indescritíveis.',
            'Amnésico': 'Pessoa com pouca ou nenhuma memória, possivelmente devido a trauma paranormal ou ritual. Busca desesperadamente sua identidade perdida, temendo que seu passado esteja conectado ao Outro Lado.',
            'Artista': 'Criativo que encontrou inspiração ou horror no paranormal. Sua sensibilidade permite perceber manifestações sutis, mas também os torna vulneráveis à influência de entidades.',
            'Atleta': 'Esportista cuja disciplina física o preparou para os rigores das missões da Ordem. Confiante e determinado, mas pode subestimar ameaças não-físicas.',
            'Chef': 'Profissional culinário que descobriu o paranormal através de ingredientes estranhos ou eventos em seu local de trabalho. Criativo e adaptável sob pressão.',
            'Criminoso': 'Ex-infrator que se deparou com o paranormal durante atividades ilícitas. A Ordem oferece redenção, mas velhos hábitos podem ressurgir em momentos críticos.',
            'Cultista Arrependido': 'Ex-membro de culto paranormal que escapou ou foi resgatado. Conhece os perigos do Outro Lado intimamente, mas carrega traumas e desconfiança.',
            'Desgarrado': 'Pessoa sem raízes ou identidade clara, frequentemente sem família ou histórico. Livre de amarras, mas também sem apoio emocional.',
            'Engenheiro': 'Profissional técnico cuja mentalidade lógica se choca com realidades paranormais. Busca explicações racionais para o irracional.',
            'Executivo': 'Pessoa de negócios com recursos e conexões. Acostumado ao controle, pode ter dificuldade aceitando forças além de sua influência.',
            'Investigador': 'Detetive, jornalista investigativo ou pesquisador que seguiu pistas até encontrar o paranormal. Naturalmente curioso e persistente.',
            'Lutador': 'Combatente treinado (boxeador, artista marcial) que usa habilidades físicas contra ameaças paranormais. Direto e prático.',
            'Magnata': 'Pessoa extremamente rica e influente que descobriu o paranormal através de seus negócios ou círculo social. Usa recursos financeiros para apoiar a Ordem.',
            'Mercenário': 'Soldado de fortuna ou combatente experiente que oferece suas habilidades em troca de pagamento. Pragmático e letal, mas pode questionar ordens.',
            'Militar': 'Ex-soldado ou militar ativo com disciplina e experiência em combate. Acostumado a seguir ordens e trabalhar em equipe.',
            'Operário': 'Trabalhador manual que encontrou o paranormal em canteiros de obra ou fábricas. Prático e resiliente, mas pode sentir-se deslocado.',
            'Policial': 'Oficial da lei que investigou casos estranhos. Experiência em procedimentos e combate, mas limitado por protocolos convencionais.',
            'Religioso': 'Pessoa de fé que teve sua visão de mundo abalada pelo encontro com o paranormal. Busca conciliar crenças com nova realidade.',
            'Servidor Público': 'Funcionário do governo que descobriu conspirações ou eventos paranormais. Conhece a burocracia e tem acesso a informações.',
            'Teórico da Conspiração': 'Pessoa obcecada por teorias conspiratórias que descobriu que algumas delas são reais. Paranóico mas frequentemente correto sobre ameaças ocultas.',
            'T.I.': 'Profissional de tecnologia da informação que detectou anomalias digitais ligadas ao paranormal. Especialista em sistemas e dados.',
            'Trabalhador Rural': 'Pessoa do campo que encontrou manifestações paranormais em áreas remotas. Conectado à natureza e acostumado ao isolamento.',
            'Trambiqueiro': 'Pessoa que vive de pequenos golpes e trapaças, descobriu o paranormal durante uma farsa que se tornou real. Esperto e adaptável.',
            'Universitário': 'Estudante que se deparou com o paranormal durante pesquisas ou eventos no campus. Jovem, curioso e adaptável.',
            'Vítima': 'Sobrevivente de evento paranormal traumático. Motivado por vingança ou necessidade de proteger outros, mas emocionalmente frágil.'
        },
        classSummaries: {
            'Combatente': 'Agentes especializados em combate físico direto contra entidades paranormais. São a linha de frente da Ordo Realitas, enfrentando criaturas de Sangue e outras ameaças tangíveis. Resilientes e táticos, protegem aliados enquanto eliminam perigos.',
            'Especialista': 'Investigadores habilidosos focados em perícias, tecnologia e táticas. São o cérebro das operações, usando C.R.I.S. para rastrear anomalias, infiltrando-se em cultos e desvendando mistérios do Outro Lado.',
            'Ocultista': 'Estudiosos do paranormal que manipulam rituais e conhecimento proibido. Arriscam sua sanidade para compreender e combater o Outro Lado, sendo essenciais para banir entidades e decifrar segredos arcanos.'
        }
    }
};

/**
 * Obtém a configuração do mundo atual
 */
export function getCurrentWorldConfig() {
    const currentWorld = localStorage.getItem('selectedWorld') || 'dnd';
    return worldsConfig[currentWorld] || worldsConfig['dnd'];
}

/**
 * Obtém a configuração de um mundo específico
 */
export function getWorldConfig(worldId) {
    return worldsConfig[worldId] || worldsConfig['dnd'];
} 