/**
 * Módulo responsável pelo sistema de fallback para geração de histórias
 */

/**
 * Gera uma história simples para um personagem quando a API falha
 * @param {Object} character - Dados do personagem
 * @returns {string} História gerada
 */
export function generateSimpleLore(character) {
    const currentWorld = localStorage.getItem('selectedWorld') || 'dnd';
    
    // Usar template específico do mundo
    if (currentWorld === 'ordem-paranormal') {
        return generateOrdemParanormalFallback(character);
    }

    // Template padrão (D&D/Tormenta)
    const personalityTraits = getPersonalityTraits();
    const motivationTemplates = getMotivationTemplates();
    const alignmentTemplates = getAlignmentTemplates();

    const raceOptions = personalityTraits[character.race] || personalityTraits['Humano'];
    const classOptions = motivationTemplates[character.class] || motivationTemplates['Guerreiro'];
    const alignmentOptions = alignmentTemplates[character.alignment] || alignmentTemplates['Neutro'];

    const personalityText = raceOptions[Math.floor(Math.random() * raceOptions.length)];
    const motivationText = classOptions[Math.floor(Math.random() * classOptions.length)];
    const alignmentText = alignmentOptions[Math.floor(Math.random() * alignmentOptions.length)];

    // Gerar texto baseado em atributos
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

    // Gerar gancho de aventura
    const adventureHooks = [
        `${character.name} busca enfrentar os horrores da Tormenta em Arton.`,
        `Uma profecia em Triunfo aponta ${character.name} como chave para o Reinado.`,
        `Um artefato em Lamnor chama ${character.name} em sonhos sombrios.`,
        `${character.name} explora Deheon em busca de respostas sobre a Tormenta.`,
        `Após perder tudo para a Tormenta, ${character.name} jurou vingança.`,
        `Rumores de um tesouro em Vectora levam ${character.name} a uma jornada.`
    ];
    const adventureText = adventureHooks[Math.floor(Math.random() * adventureHooks.length)];

    // Gerar frase de efeito final
    const catchphrases = getCatchphrases();
    const classQuotes = catchphrases[character.class] || catchphrases['Guerreiro'];
    const finalQuote = classQuotes[Math.floor(Math.random() * classQuotes.length)];

    return `${personalityText} ${motivationText} ${alignmentText} ${attributeText} Agora, ${character.name} busca seu lugar no mundo, carregando tanto suas virtudes quanto seus medos internos. ${finalQuote}`;
}

/**
 * Gera história para personagem de Ordem Paranormal
 */
function generateOrdemParanormalFallback(character) {
    const originTraits = getOrdemParanormalOriginTraits();
    const classTraits = getOrdemParanormalClassTraits();
    const traumaTemplates = getOrdemParanormalTraumaTemplates();
    const motivationTemplates = getOrdemParanormalMotivationTemplates();
    const catchphrases = getOrdemParanormalCatchphrases();

    const originOptions = originTraits[character.race] || originTraits['Investigador'];
    const classOptions = classTraits[character.class] || classTraits['Especialista'];
    const traumaText = traumaTemplates[Math.floor(Math.random() * traumaTemplates.length)];
    const motivationText = motivationTemplates[Math.floor(Math.random() * motivationTemplates.length)];
    const finalQuote = catchphrases[Math.floor(Math.random() * catchphrases.length)];

    const originText = originOptions[Math.floor(Math.random() * originOptions.length)];
    const classText = classOptions[Math.floor(Math.random() * classOptions.length)];

    return `${originText} ${classText} ${traumaText} ${motivationText} ${finalQuote}`;
}

/**
 * Retorna templates de personalidade por raça
 */
function getPersonalityTraits() {
    return {
        'Humano': [
            `${character.name} sempre foi determinado e adaptável, moldado pelas tradições de Valkaria.`,
            `Crescendo em Nova Malpetrim, ${character.name} desenvolveu uma personalidade resiliente e desconfiada.`,
            `Vindo de Tamu-ra, ${character.name} carrega a simplicidade rural e uma curiosidade insaciável sobre o mundo.`
        ],
        'Anão': [
            `${character.name} carrega o orgulho ancestral dos anões, com uma determinação inabalável e amor pela tradição.`,
            `Crescendo nas profundezas de Lamnor, ${character.name} aprendeu a valorizar trabalho duro e lealdade acima de tudo.`,
            `${character.name} herdou a teimosia típica dos anões, mas também sua incrível habilidade artesanal.`
        ],
        'Elfo': [
            `${character.name} possui a graça e sabedoria milenar dos elfos, mas também sua melancolia pelo passado perdido.`,
            `Nascido nas florestas de Deheon, ${character.name} desenvolveu uma conexão profunda com a natureza e magia.`,
            `${character.name} carrega a perspectiva única dos elfos sobre o tempo, vendo a brevidade da vida humana.`
        ],
        'Halfling': [
            `${character.name} possui a alegria natural dos halflings, encontrando prazer nas coisas simples da vida.`,
            `Crescendo em comunidades pacíficas, ${character.name} desenvolveu uma natureza otimista e hospitaleira.`,
            `${character.name} herdou a coragem discreta dos halflings, enfrentando desafios com determinação silenciosa.`
        ],
        'Draconato': [
            `${character.name} carrega o sangue dos dragões, com uma presença imponente e orgulho inabalável.`,
            `Nascido sob o signo de Tiamat, ${character.name} desenvolveu uma ambição feroz e desejo de poder.`,
            `${character.name} possui a sabedoria ancestral dos draconatos, combinada com uma natureza protetora.`
        ],
        'Gnomo': [
            `${character.name} possui a curiosidade insaciável dos gnomos, sempre buscando novos conhecimentos e invenções.`,
            `Crescendo em comunidades de artesãos, ${character.name} desenvolveu uma mente inventiva e amor pelo detalhe.`,
            `${character.name} herdou o otimismo natural dos gnomos, vendo beleza e possibilidade em tudo.`
        ],
        'Meio-Elfo': [
            `${character.name} vive entre dois mundos, carregando a graça élfica e a ambição humana.`,
            `Nascido de duas culturas, ${character.name} desenvolveu uma adaptabilidade única e diplomacia natural.`,
            `${character.name} busca seu lugar no mundo, não pertencendo completamente a nenhuma das raças parentais.`
        ],
        'Meio-Orc': [
            `${character.name} carrega a força dos orcs, mas também o preconceito que vem com essa herança.`,
            `Crescendo em um mundo que o rejeita, ${character.name} desenvolveu uma resiliência feroz e determinação.`,
            `${character.name} luta para provar que o sangue não define o destino, buscando redenção através de atos nobres.`
        ],
        'Tiefling': [
            `${character.name} carrega as marcas do inferno, com chifres e cauda como lembretes de seu passado sombrio.`,
            `Nascido sob o signo de Asmodeus, ${character.name} desenvolveu uma natureza rebelde e desejo de redenção.`,
            `${character.name} luta contra o preconceito e sua própria herança infernal, buscando um caminho de luz.`
        ],
        'Dahllan': [
            `${character.name} possui a conexão natural com a magia, nascido sob a influência da Tormenta.`,
            `Crescendo em terras selvagens, ${character.name} desenvolveu uma intuição mágica e resistência sobrenatural.`,
            `${character.name} carrega o sangue dos antigos, com poderes que ainda não compreende completamente.`
        ],
        'Goblin': [
            `${character.name} possui a agilidade natural dos goblins, combinada com uma astúcia inesperada.`,
            `Crescendo nas sombras da sociedade, ${character.name} desenvolveu habilidades de sobrevivência únicas.`,
            `${character.name} luta contra os estereótipos de sua raça, provando que goblins podem ser heróis.`
        ],
        'Lefou': [
            `${character.name} carrega as marcas da Tormenta, com uma aparência que assusta mas esconde um coração nobre.`,
            `Nascido nas terras corrompidas, ${character.name} desenvolveu uma resistência única aos efeitos da Tormenta.`,
            `${character.name} luta para encontrar beleza em sua forma distorcida, buscando aceitação em um mundo que o rejeita.`
        ],
        'Minotauro': [
            `${character.name} possui a força bruta dos minotauros, combinada com uma inteligência surpreendente.`,
            `Crescendo em labirintos ancestrais, ${character.name} desenvolveu uma orientação natural e força inigualável.`,
            `${character.name} carrega o orgulho de sua raça, mas também a sabedoria de que a força deve ser usada com sabedoria.`
        ],
        'Qareen': [
            `${character.name} carrega o sangue dos djinns, com uma conexão natural com os elementos.`,
            `Nascido sob o signo dos ventos, ${character.name} desenvolveu uma natureza livre e poderes elementais.`,
            `${character.name} possui a sabedoria dos antigos, combinada com uma curiosidade insaciável sobre o mundo.`
        ],
        'Golem': [
            `${character.name} foi criado por magia, carregando a marca de seu criador mas desenvolvendo consciência própria.`,
            `Nascido da magia e pedra, ${character.name} desenvolveu uma perspectiva única sobre a vida e mortalidade.`,
            `${character.name} busca entender sua natureza artificial, questionando se pode ser considerado verdadeiramente vivo.`
        ],
        'Hynne': [
            `${character.name} possui a agilidade natural dos hynnes, com uma conexão profunda com a natureza.`,
            `Crescendo em florestas ancestrais, ${character.name} desenvolveu uma harmonia natural com o mundo selvagem.`,
            `${character.name} carrega a sabedoria dos antigos, ensinando que a natureza deve ser respeitada e protegida.`
        ],
        'Kliren': [
            `${character.name} carrega o sangue dos antigos, com uma inteligência excepcional e poderes psíquicos.`,
            `Nascido sob o signo das estrelas, ${character.name} desenvolveu uma mente brilhante e curiosidade cósmica.`,
            `${character.name} possui a sabedoria dos klirens, mas também a responsabilidade de usar seus poderes com sabedoria.`
        ],
        'Medusa': [
            `${character.name} carrega a maldição da medusa, com serpentes no lugar do cabelo e um olhar petrificante.`,
            `Nascido sob o signo da serpente, ${character.name} desenvolveu uma natureza solitária e desconfiada.`,
            `${character.name} luta contra a maldição de sua raça, buscando aceitação em um mundo que teme seu poder.`
        ],
        'Osteon': [
            `${character.name} é um não-morto consciente, carregando a sabedoria dos séculos em ossos imortais.`,
            `Nascido da morte e magia, ${character.name} desenvolveu uma perspectiva única sobre a mortalidade.`,
            `${character.name} carrega o peso da imortalidade, testemunhando eras passadas e futuras que ainda virão.`
        ],
        'Sereia/Tritão': [
            `${character.name} carrega o sangue dos mares, com uma conexão natural com as profundezas oceânicas.`,
            `Nascido nas profundezas, ${character.name} desenvolveu uma sabedoria ancestral e poderes aquáticos.`,
            `${character.name} possui a graça dos mares, mas também a responsabilidade de proteger os oceanos.`
        ],
        'Sílfide': [
            `${character.name} carrega a graça dos ventos, com uma conexão natural com o ar e a liberdade.`,
            `Nascido sob o signo dos ventos, ${character.name} desenvolveu uma natureza livre e espírito aventureiro.`,
            `${character.name} possui a leveza dos ventos, mas também a responsabilidade de proteger a liberdade.`
        ],
        'Suraggel': [
            `${character.name} carrega o sangue celestial, com uma conexão natural com a luz e a justiça.`,
            `Nascido sob o signo dos céus, ${character.name} desenvolveu uma natureza nobre e desejo de justiça.`,
            `${character.name} possui a graça celestial, mas também a responsabilidade de proteger os inocentes.`
        ],
        'Trong': [
            `${character.name} carrega a força dos antigos, com uma resistência natural e espírito indomável.`,
            `Nascido nas terras selvagens, ${character.name} desenvolveu uma força bruta e determinação feroz.`,
            `${character.name} possui a resistência dos antigos, mas também a sabedoria de que a força deve ser usada com honra.`
        ]
    };
}

/**
 * Retorna templates de motivação por classe
 */
function getMotivationTemplates() {
    return {
        'Arcanista': [
            `${character.name} é movido por uma sede insaciável de conhecimento, às vezes ignorando consequências morais.`,
            `Obcecado por desvendar mistérios arcanos, ${character.name} teme que seu poder seja insuficiente quando mais precisar.`,
            `${character.name} busca provar que a magia pode resolver qualquer problema, mesmo quando a força bruta seria mais eficaz.`
        ],
        'Bárbaro': [
            `${character.name} é movido por fúria primal, canalizando raiva ancestral em força de combate.`,
            `Procurando vingança por sua tribo perdida, ${character.name} caça os responsáveis pela destruição de seu povo.`,
            `${character.name} busca provar que a força bruta e instinto são tão válidos quanto estratégia e magia.`
        ],
        'Bardo': [
            `${character.name} é movido pelo desejo de coletar histórias e canções de todo o mundo.`,
            `Buscando inspiração para sua próxima obra-prima, ${character.name} viaja em busca de aventuras épicas.`,
            `${character.name} acredita que a música e arte podem mudar o mundo, uma nota de cada vez.`
        ],
        'Bruxo': [
            `${character.name} é movido pelo pacto com seu patrono, pagando um preço terrível por poder.`,
            `Buscando conhecimento proibido, ${character.name} fez um pacto que mudou sua vida para sempre.`,
            `${character.name} luta para manter controle sobre os poderes que seu patrono lhe concedeu.`
        ],
        'Clérigo': [
            `${character.name} é movido pela fé em seu deus, espalhando sua palavra e protegendo os inocentes.`,
            `Buscando redenção por pecados passados, ${character.name} serve seu deus com devoção absoluta.`,
            `${character.name} acredita que a luz divina pode curar qualquer ferida, física ou espiritual.`
        ],
        'Druida': [
            `${character.name} é movido pelo dever de proteger a natureza contra a civilização destrutiva.`,
            `Buscando equilíbrio entre progresso e preservação, ${character.name} medeia conflitos entre civilização e natureza.`,
            `${character.name} acredita que a sabedoria antiga da natureza é a chave para o futuro.`
        ],
        'Feiticeiro': [
            `${character.name} é movido pelo sangue mágico que corre em suas veias, buscando controlar seus poderes.`,
            `Buscando entender sua linhagem mágica, ${character.name} explora os limites de seu poder inato.`,
            `${character.name} teme que sua magia selvagem cause dano aos que ama, mas não consegue resistir ao seu chamado.`
        ],
        'Guerreiro': [
            `${character.name} é movido pelo desejo de se tornar o maior guerreiro que já viveu.`,
            `Buscando honra e glória em batalha, ${character.name} mede seu valor pela força de sua lâmina.`,
            `${character.name} acredita que a disciplina e treinamento são o caminho para a verdadeira maestria.`
        ],
        'Ladino': [
            `${character.name} é movido pelo desafio de roubos impossíveis e segredos bem guardados.`,
            `Buscando redenção de um passado criminoso, ${character.name} usa suas habilidades para o bem.`,
            `${character.name} acredita que às vezes os fins justificam os meios, especialmente quando se trata de justiça.`
        ],
        'Mago': [
            `${character.name} é movido pela busca do conhecimento arcano, estudando incansavelmente novos feitiços.`,
            `Buscando provar que a magia é a forma suprema de poder, ${character.name} dedica sua vida aos estudos.`,
            `${character.name} teme que seu conhecimento seja usado para o mal, mas não consegue resistir à magia.`
        ],
        'Monge': [
            `${character.name} é movido pela busca da perfeição física e espiritual através da disciplina.`,
            `Buscando iluminação através da meditação e treinamento, ${character.name} busca transcender a carne.`,
            `${character.name} acredita que a verdadeira força vem de dentro, não de armas ou armaduras.`
        ],
        'Paladino': [
            `${character.name} é movido por um juramento sagrado, protegendo os inocentes e punindo os ímpios.`,
            `Buscando vingança por um mal cometido contra sua ordem, ${character.name} caça os responsáveis.`,
            `${character.name} acredita que a luz divina pode banir qualquer treva, incluindo a de seu próprio coração.`
        ],
        'Patrulheiro': [
            `${character.name} é movido pelo dever de proteger as fronteiras selvagens do mundo civilizado.`,
            `Buscando vingança contra monstros que destruíram sua casa, ${character.name} caça criaturas perigosas.`,
            `${character.name} acredita que a natureza selvagem é seu aliado, não seu inimigo.`
        ],
        'Bucaneiro': [
            `${character.name} é movido pelo espírito aventureiro e amor pela liberdade dos mares.`,
            `Buscando tesouros perdidos e aventuras épicas, ${character.name} navega pelos sete mares.`,
            `${character.name} acredita que a verdadeira riqueza está na liberdade, não no ouro.`
        ],
        'Caçador': [
            `${character.name} é movido pelo instinto de caçador, rastreando presas e protegendo territórios.`,
            `Buscando vingança contra uma besta que matou sua família, ${character.name} caça monstros perigosos.`,
            `${character.name} acredita que a natureza é sua professora, ensinando lições de sobrevivência e respeito.`
        ],
        'Cavaleiro': [
            `${character.name} é movido pelo código de cavalaria, protegendo os fracos e servindo com honra.`,
            `Buscando provar seu valor como cavaleiro, ${character.name} busca aventuras que testem sua honra.`,
            `${character.name} acredita que a verdadeira nobreza vem de ações, não de sangue.`
        ],
        'Inventor': [
            `${character.name} é movido pela curiosidade científica, criando invenções que podem mudar o mundo.`,
            `Buscando provar que a tecnologia pode rivalizar com a magia, ${character.name} desenvolve máquinas incríveis.`,
            `${character.name} acredita que a inovação é a chave para o progresso da civilização.`
        ],
        'Lutador': [
            `${character.name} é movido pelo desejo de se tornar o maior lutador de todos os tempos.`,
            `Buscando vingança por uma derrota humilhante, ${character.name} treina obsessivamente para se tornar mais forte.`,
            `${character.name} acredita que a verdadeira força vem da determinação, não apenas do corpo.`
        ],
        'Nobre': [
            `${character.name} é movido pelo dever de governar com sabedoria e justiça.`,
            `Buscando restaurar a honra de sua família manchada, ${character.name} busca aventuras que provem seu valor.`,
            `${character.name} acredita que a nobreza verdadeira vem de servir ao povo, não de explorá-lo.`
        ]
    };
}

/**
 * Retorna templates de alinhamento
 */
function getAlignmentTemplates() {
    return {
        'Leal e Bom': [
            `${character.name} possui um código moral rígido e se culpa profundamente quando falha em proteger outros.`,
            `Acredita que a ordem e a justiça são fundamentais, mas às vezes é inflexível demais com si mesmo e outros.`
        ],
        'Neutro e Bom': [
            `${character.name} busca fazer o bem sem se prender a regras rígidas, seguindo seu coração.`,
            `Acredita que a bondade é mais importante que a ordem, mas também que a liberdade tem limites.`
        ],
        'Caótico e Bom': [
            `${character.name} acredita que a liberdade individual é o bem supremo, mesmo quando isso desafia a ordem.`,
            `Luta contra tiranos e opressores, mas às vezes sua rebeldia causa mais problemas que soluções.`
        ],
        'Leal e Neutro': [
            `${character.name} valoriza a ordem e tradição acima de tudo, mesmo quando isso significa ignorar questões morais.`,
            `Acredita que a estabilidade é mais importante que mudanças, mesmo que essas mudanças sejam para o bem.`
        ],
        'Neutro': [
            `${character.name} busca equilíbrio em todas as coisas, evitando extremos de ordem, caos, bem ou mal.`,
            `Acredita que a moderação é a virtude suprema, mas às vezes isso o torna indeciso.`
        ],
        'Caótico e Neutro': [
            `${character.name} valoriza a liberdade pessoal acima de tudo, rejeitando tanto ordem quanto caos organizado.`,
            `Acredita que cada pessoa deve seguir seu próprio caminho, sem interferência de leis ou tradições.`
        ],
        'Leal e Mau': [
            `${character.name} usa a ordem e hierarquia para oprimir outros, acreditando que a força é o direito.`,
            `Acredita que a disciplina e controle são necessários para manter a sociedade, mesmo através do medo.`
        ],
        'Neutro e Mau': [
            `${character.name} busca poder e riqueza sem se importar com as consequências para outros.`,
            `Acredita que o mundo é um lugar cruel onde apenas os fortes sobrevivem, e ele pretende ser um dos fortes.`
        ],
        'Caótico e Mau': [
            `${character.name} é imprevisível e cruel, destruindo por prazer e caos por diversão.`,
            `Acredita que a liberdade significa fazer o que quiser, sem consideração pelos outros.`
        ]
    };
}

/**
 * Retorna frases de efeito por classe
 */
function getCatchphrases() {
    return {
        'Arcanista': [
            `"O conhecimento é poder, e eu serei imparável."`,
            `"Cada segredo desvendado me torna mais forte."`,
            `"A magia não tem limites, apenas mentes limitadas."`
        ],
        'Bárbaro': [
            `"A fúria dos ancestrais flui através de mim!"`,
            `"Minha força é a força de mil guerreiros!"`,
            `"A raiva é minha arma, e eu sou imparável!"`
        ],
        'Bardo': [
            `"Cada história merece ser contada, cada canção merece ser cantada."`,
            `"A música é a linguagem da alma, e eu sou seu mestre."`,
            `"Que minha canção inspire coragem nos corações dos heróis."`
        ],
        'Bruxo': [
            `"O poder tem um preço, e eu estou disposto a pagá-lo."`,
            `"Meu patrono me concedeu poder, mas eu controlo como usá-lo."`,
            `"Às vezes os fins justificam os meios, mesmo os mais sombrios."`
        ],
        'Clérigo': [
            `"A luz divina guia meus passos e protege meus aliados."`,
            `"Meu deus me escolheu para ser seu instrumento de justiça."`,
            `"A fé move montanhas, e eu sou um servo da fé."`
        ],
        'Druida': [
            `"A natureza é minha aliada, e eu sou seu guardião."`,
            `"Os espíritos da terra me sussurram seus segredos."`,
            `"Equilíbrio é a chave - entre civilização e natureza, vida e morte."`
        ],
        'Feiticeiro': [
            `"O sangue mágico que corre em minhas veias é minha herança e minha maldição."`,
            `"A magia é parte de mim, tão natural quanto respirar."`,
            `"Meus poderes são um dom e uma responsabilidade."`
        ],
        'Guerreiro': [
            `"A disciplina e treinamento são o caminho para a verdadeira maestria."`,
            `"Minha lâmina é minha vida, e eu a uso com honra."`,
            `"A força sem controle é inútil, mas a força com disciplina é invencível."`
        ],
        'Ladino': [
            `"As sombras são meu lar, e os segredos são minha moeda."`,
            `"Às vezes a melhor estratégia é não ser visto."`,
            `"Cada fechadura tem uma chave, e eu tenho todas elas."`
        ],
        'Mago': [
            `"O conhecimento arcano é a chave para o poder supremo."`,
            `"Cada feitiço é uma obra de arte, e eu sou o artista."`,
            `"A magia é ciência, e eu sou seu estudioso mais dedicado."`
        ],
        'Monge': [
            `"A verdadeira força vem de dentro, não de armas ou armaduras."`,
            `"A disciplina do corpo leva à disciplina da mente."`,
            `"Equilíbrio em todas as coisas - corpo, mente e espírito."`
        ],
        'Paladino': [
            `"Meu juramento é minha vida, e eu o honro com cada ação."`,
            `"A luz divina banirá as trevas, e eu sou seu instrumento."`,
            `"Justiça e compaixão - essas são minhas armas mais poderosas."`
        ],
        'Patrulheiro': [
            `"A natureza selvagem é minha aliada, e eu sou seu protetor."`,
            `"Cada pegada conta uma história, e eu sei lê-las todas."`,
            `"Entre civilização e natureza, eu sou a ponte."`
        ],
        'Bucaneiro': [
            `"O mar é minha liberdade, e aventureiro é meu nome."`,
            `"Tesouros perdidos e mares inexplorados me chamam."`,
            `"A liberdade é a maior riqueza, e eu a encontrei nos sete mares."`
        ],
        'Caçador': [
            `"A natureza é minha professora, e eu sou seu aluno mais dedicado."`,
            `"Cada presa tem uma lição para ensinar, cada rastro uma história."`,
            `"Entre homem e besta, eu sou o caçador supremo."`
        ],
        'Cavaleiro': [
            `"Honra, dever e lealdade - esses são os pilares da cavalaria."`,
            `"Proteger os fracos e servir com nobreza é meu juramento."`,
            `"A verdadeira nobreza vem de ações, não de sangue."`
        ],
        'Inventor': [
            `"A inovação é a chave para o futuro, e eu sou seu arquiteto."`,
            `"Cada invenção é um passo em direção ao progresso."`,
            `"A tecnologia pode rivalizar com a magia, e eu vou provar isso."`
        ],
        'Lutador': [
            `"O corpo é minha arma, e eu a aperfeiçoei através do treinamento."`,
            `"Cada golpe é uma obra de arte, cada movimento uma dança."`,
            `"A verdadeira força vem da determinação, não apenas do músculo."`
        ],
        'Nobre': [
            `"Governar com sabedoria e justiça é meu dever e privilégio."`,
            `"A nobreza verdadeira vem de servir ao povo, não de explorá-lo."`,
            `"Poder e responsabilidade caminham juntos, e eu aceito ambos."`
        ]
    };
}

/**
 * Retorna templates de origem para Ordem Paranormal
 */
function getOrdemParanormalOriginTraits() {
    return {
        'Acadêmico': [
            `${character.name} descobriu o paranormal através de pesquisas universitárias em São Paulo, quando um livro antigo provocou manifestações estranhas.`,
            `Professor em Brasília, ${character.name} viu sua vida acadêmica desmoronar após presenciar rituais impossíveis durante suas pesquisas.`,
            `${character.name} era um pesquisador respeitado no Rio de Janeiro até encontrar documentos que revelaram a existência do Outro Lado.`
        ],
        'Agente de Saúde': [
            `${character.name} testemunhou casos médicos impossíveis em um hospital de São Paulo, onde pacientes relatavam visões de criaturas sobrenaturais.`,
            `Enfermeiro em Curitiba, ${character.name} descobriu que alguns pacientes estavam sendo afetados por entidades do Outro Lado.`,
            `${character.name} era médico em Belo Horizonte até um surto de "doenças" inexplicáveis revelar a verdade sobre o paranormal.`
        ],
        'Amnésico': [
            `${character.name} acordou em uma rua de São Paulo sem memória de quem era, mas com cicatrizes que sugeriam encontros com o paranormal.`,
            `Encontrado inconsciente em Porto Alegre, ${character.name} não lembra de seu passado, mas possui habilidades que só podem vir do Outro Lado.`,
            `${character.name} perdeu a memória após um acidente em Recife, mas fragmentos de pesadelos revelam uma verdade terrível.`
        ],
        'Artista': [
            `${character.name} começou a pintar visões de pesadelo em São Paulo, descobrindo que suas obras previam eventos paranormais.`,
            `Músico em Salvador, ${character.name} compôs uma melodia que atraía criaturas do Outro Lado, revelando seu talento sobrenatural.`,
            `${character.name} era escritor em Fortaleza até suas histórias começarem a se tornar realidade, revelando seu dom paranormal.`
        ],
        'Atleta': [
            `${character.name} desenvolveu habilidades físicas sobrenaturais após um acidente durante um treino em São Paulo.`,
            `Jogador de futebol em Rio de Janeiro, ${character.name} descobriu que podia ver "algo mais" durante os jogos.`,
            `${character.name} era corredor em Brasília até descobrir que podia correr mais rápido que humanamente possível.`
        ],
        'Chef': [
            `${character.name} descobriu que podia "sentir" ingredientes de forma sobrenatural em seu restaurante em São Paulo.`,
            `Cozinheiro em Porto Alegre, ${character.name} criou pratos que curavam ferimentos e aliviavam traumas paranormais.`,
            `${character.name} era chef em Belo Horizonte até descobrir que sua comida podia afetar a realidade de formas impossíveis.`
        ],
        'Criminoso': [
            `${character.name} descobriu o paranormal durante um roubo em São Paulo, quando encontrou artefatos que não deveriam existir.`,
            `Ex-presidiário em Rio de Janeiro, ${character.name} testemunhou rituais estranhos na prisão que revelaram a verdade.`,
            `${character.name} era ladrão em Curitiba até roubar algo que mudou sua vida para sempre - um objeto do Outro Lado.`
        ],
        'Cultista Arrependido': [
            `${character.name} foi membro de um culto em São Paulo até descobrir a verdade sobre as entidades que adorava.`,
            `Ex-líder de seita em Brasília, ${character.name} se arrependeu após presenciar os horrores reais do Outro Lado.`,
            `${character.name} era sacerdote de uma religião falsa em Salvador até descobrir que servia a entidades malignas.`
        ],
        'Desgarrado': [
            `${character.name} viveu nas ruas de São Paulo, testemunhando eventos paranormais que outros ignoravam.`,
            `Sem-teto em Rio de Janeiro, ${character.name} desenvolveu uma sensibilidade única para detectar o paranormal.`,
            `${character.name} era nômade em Belo Horizonte até encontrar outros como ele - pessoas que viam o que outros não viam.`
        ],
        'Engenheiro': [
            `${character.name} projetou máquinas que funcionavam com princípios impossíveis em sua empresa em São Paulo.`,
            `Engenheiro civil em Brasília, ${character.name} descobriu que podia "sentir" estruturas de forma sobrenatural.`,
            `${character.name} era engenheiro em Porto Alegre até criar dispositivos que interagiam com o Outro Lado.`
        ],
        'Executivo': [
            `${character.name} descobriu que sua empresa em São Paulo estava envolvida em experimentos paranormais secretos.`,
            `CEO em Rio de Janeiro, ${character.name} testemunhou reuniões de diretoria que incluíam entidades do Outro Lado.`,
            `${character.name} era executivo em Curitiba até descobrir que o sucesso de sua empresa vinha de pactos sombrios.`
        ],
        'Investigador': [
            `${character.name} investigava casos de desaparecimentos em São Paulo quando descobriu padrões sobrenaturais.`,
            `Detetive particular em Rio de Janeiro, ${character.name} seguiu pistas que o levaram ao mundo paranormal.`,
            `${character.name} era jornalista investigativo em Brasília até descobrir uma conspiração que envolvia o Outro Lado.`
        ],
        'Lutador': [
            `${character.name} desenvolveu força sobrenatural após um combate em São Paulo contra um oponente "diferente".`,
            `Lutador profissional em Rio de Janeiro, ${character.name} descobriu que podia ver auras e energias durante as lutas.`,
            `${character.name} era boxeador em Belo Horizonte até um golpe revelar que possuía poderes além do humano.`
        ],
        'Magnata': [
            `${character.name} descobriu que sua fortuna em São Paulo vinha de investimentos em empresas envolvidas com o paranormal.`,
            `Empresário em Rio de Janeiro, ${character.name} testemunhou reuniões de negócios que incluíam entidades sobrenaturais.`,
            `${character.name} era magnata em Brasília até descobrir que seu sucesso financeiro tinha origens sombrias.`
        ],
        'Mercenário': [
            `${character.name} foi contratado para missões em São Paulo que revelaram a existência de criaturas sobrenaturais.`,
            `Soldado de fortuna em Rio de Janeiro, ${character.name} lutou em guerras que incluíam elementos paranormais.`,
            `${character.name} era mercenário em Curitiba até aceitar um trabalho que mudou sua compreensão da realidade.`
        ],
        'Militar': [
            `${character.name} testemunhou operações militares secretas em São Paulo que envolviam tecnologia paranormal.`,
            `Soldado em Rio de Janeiro, ${character.name} participou de missões que o expuseram ao Outro Lado.`,
            `${character.name} era militar em Brasília até ser recrutado para uma unidade especial que lidava com o paranormal.`
        ],
        'Operário': [
            `${character.name} trabalhou em uma fábrica em São Paulo onde máquinas funcionavam com princípios impossíveis.`,
            `Operário em Rio de Janeiro, ${character.name} testemunhou acidentes de trabalho que revelaram elementos sobrenaturais.`,
            `${character.name} era trabalhador em Belo Horizonte até descobrir que sua fábrica estava construída sobre um portal.`
        ],
        'Policial': [
            `${character.name} investigava crimes em São Paulo que não seguiam as leis da física ou da lógica.`,
            `Detetive em Rio de Janeiro, ${character.name} seguiu pistas que o levaram a casos paranormais inexplicáveis.`,
            `${character.name} era policial em Brasília até ser transferido para uma unidade que lidava com "casos especiais".`
        ],
        'Religioso': [
            `${character.name} era padre em São Paulo até presenciar milagres que não vinham de seu deus.`,
            `Pastor em Rio de Janeiro, ${character.name} descobriu que algumas de suas visões eram reais e sobrenaturais.`,
            `${character.name} era líder religioso em Salvador até descobrir que sua fé o conectava ao Outro Lado.`
        ],
        'Servidor Público': [
            `${character.name} trabalhou em um órgão público em São Paulo que escondia documentos sobre o paranormal.`,
            `Funcionário em Rio de Janeiro, ${character.name} descobriu que o governo sabia sobre o Outro Lado.`,
            `${character.name} era servidor em Brasília até ser transferido para um departamento que lidava com "assuntos especiais".`
        ],
        'Teórico da Conspiração': [
            `${character.name} sempre acreditou em teorias da conspiração em São Paulo, até descobrir que algumas eram verdadeiras.`,
            `Investigador amador em Rio de Janeiro, ${character.name} descobriu evidências de que o paranormal era real.`,
            `${character.name} era teórico da conspiração em Curitiba até suas teorias se tornarem realidade.`
        ],
        'T.I.': [
            `${character.name} trabalhou em uma empresa de tecnologia em São Paulo que desenvolvia software para detectar o paranormal.`,
            `Programador em Rio de Janeiro, ${character.name} criou algoritmos que identificavam padrões sobrenaturais.`,
            `${character.name} era técnico em Belo Horizonte até descobrir que a internet podia ser usada para acessar o Outro Lado.`
        ],
        'Trabalhador Rural': [
            `${character.name} viveu em uma fazenda em São Paulo onde eventos paranormais eram comuns.`,
            `Agricultor em Rio de Janeiro, ${character.name} testemunhou colheitas que cresciam de forma impossível.`,
            `${character.name} era peão em Brasília até descobrir que a terra onde trabalhava era sagrada.`
        ],
        'Trambiqueiro': [
            `${character.name} vendia produtos falsos em São Paulo até vender algo que realmente funcionava - um artefato paranormal.`,
            `Charlatão em Rio de Janeiro, ${character.name} descobriu que algumas de suas "farsas" eram reais.`,
            `${character.name} era trambiqueiro em Curitiba até encontrar um objeto que realmente tinha poderes sobrenaturais.`
        ],
        'Universitário': [
            `${character.name} estudava em uma universidade em São Paulo onde professores ensinavam sobre o paranormal.`,
            `Estudante em Rio de Janeiro, ${character.name} participou de experimentos que revelaram a existência do Outro Lado.`,
            `${character.name} era universitário em Brasília até descobrir que sua tese era sobre fenômenos paranormais reais.`
        ],
        'Vítima': [
            `${character.name} sobreviveu a um ataque paranormal em São Paulo que mudou sua vida para sempre.`,
            `Sobrevivente em Rio de Janeiro, ${character.name} testemunhou horrores que outros não conseguiam ver.`,
            `${character.name} era vítima em Belo Horizonte até descobrir que seu trauma o conectava ao Outro Lado.`
        ]
    };
}

/**
 * Retorna templates de classe para Ordem Paranormal
 */
function getOrdemParanormalClassTraits() {
    return {
        'Combatente': [
            `${character.name} desenvolveu uma resistência mental impressionante, canalizando traumas em pura determinação física.`,
            `Após presenciar horrores indescritíveis, ${character.name} encontrou na luta direta sua forma de lidar com o medo.`,
            `${character.name} treina obsessivamente, sabendo que sua força pode ser a única coisa entre a humanidade e o caos.`
        ],
        'Especialista': [
            `${character.name} desenvolveu habilidades únicas através de treinamento intensivo e experiência prática.`,
            `Após sobreviver a encontros paranormais, ${character.name} aprendeu a usar suas habilidades de forma estratégica.`,
            `${character.name} se especializou em técnicas específicas, sabendo que a versatilidade é crucial contra o paranormal.`
        ],
        'Ocultista': [
            `${character.name} desenvolveu uma conexão profunda com o Outro Lado, canalizando poderes que outros temem.`,
            `Após estudar rituais antigos, ${character.name} aprendeu a usar a magia paranormal contra as próprias entidades.`,
            `${character.name} mergulhou nos mistérios do Outro Lado, pagando um preço terrível por conhecimento proibido.`
        ]
    };
}

/**
 * Retorna templates de trauma para Ordem Paranormal
 */
function getOrdemParanormalTraumaTemplates() {
    return [
        `Após sobreviver a um encontro com criaturas de Sangue, ${character.name} nunca mais foi o mesmo, carregando cicatrizes físicas e mentais.`,
        `A exposição ao elemento Morte envelheceu prematuramente parte de seu corpo, um lembrete constante da fragilidade da realidade.`,
        `${character.name} ouviu os sussurros do Conhecimento e agora luta diariamente contra vozes que tentam revelar segredos terríveis.`,
        `Uma explosão de Energia paranormal modificou irreversivelmente sua percepção, fazendo-o ver padrões caóticos em tudo.`,
        `${character.name} foi marcado pelo Medo primordial, tendo pesadelos vívidos que sangram na realidade quando desperta.`
    ];
}

/**
 * Retorna templates de motivação para Ordem Paranormal
 */
function getOrdemParanormalMotivationTemplates() {
    return [
        `Agora ${character.name} luta para proteger outros de passarem pelo mesmo trauma que o/a marcou para sempre.`,
        `${character.name} busca respostas sobre sua transformação, temendo e desejando ao mesmo tempo descobrir a verdade completa.`,
        `Movido por vingança, ${character.name} caça as entidades responsáveis por destruir sua vida anterior.`,
        `${character.name} serve à Ordo Realitas por senso de dever, sabendo que é uma das poucas pessoas capazes de enfrentar o horror.`,
        `Obcecado pela possibilidade de reverter sua condição, ${character.name} estuda obsessivamente os mistérios do Outro Lado.`
    ];
}

/**
 * Retorna frases de efeito para Ordem Paranormal
 */
function getOrdemParanormalCatchphrases() {
    return [
        `"A realidade é mais frágil do que imaginamos, mas ainda vale a pena protegê-la."`,
        `"Cada pesadelo me torna mais forte para enfrentar o próximo horror."`,
        `"Vi o Outro Lado... e agora é minha responsabilidade impedir que outros vejam."`,
        `"A sanidade é um preço pequeno a pagar pela proteção da humanidade."`,
        `"Conhecer a verdade é uma maldição, mas ignorá-la seria uma traição."`
    ];
} 