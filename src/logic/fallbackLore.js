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
        // ... outras raças
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
        // ... outras classes
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
        // ... outros alinhamentos
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
        // ... outras classes
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
        // ... outras origens
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
        // ... outras classes
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