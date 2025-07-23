/**
 * Módulo responsável pelos templates de prompt para geração de história
 */

import { getCurrentWorldConfig } from '../config/worldsConfig.js';

/**
 * Gera o prompt para a IA baseado nos dados do personagem
 * @param {Object} characterData - Dados do personagem
 * @returns {string} Prompt formatado
 */
export function generatePrompt(characterData) {
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
    switch (currentWorld) {
        case 'dnd':
            return generateDnDPrompt(characterData, raceSummary, classSummary, backgroundNote);
        case 'ordem-paranormal':
            return generateOrdemParanormalPrompt(characterData, raceSummary, classSummary, backgroundNote);
        default:
            return generateTormentaPrompt(characterData, raceSummary, classSummary, backgroundNote);
    }
}

/**
 * Gera prompt para D&D 5e
 */
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

/**
 * Gera prompt para Tormenta 20
 */
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

/**
 * Gera prompt para Ordem Paranormal
 */
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

/**
 * Retorna summaries de raças de Tormenta (fallback)
 */
function getTormentaRaceSummaries() {
    return {
        'Humano': 'Versáteis, ambiciosos e adaptáveis, os humanos representam a maioria em Arton. Capazes de trilhar qualquer caminho, moldam o mundo com sua vontade e perseverança.',
        'Anão': 'Oriundos das montanhas de Doherimm, anões são robustos, honrados e resilientes. Artesãos lendários, mestres das forjas e da mineração.',
        // ... outras raças de Tormenta
    };
}

/**
 * Retorna summaries de classes de Tormenta (fallback)
 */
function getTormentaClassSummaries() {
    return {
        'Guerreiro': 'Combatentes versáteis, treinados em todas as armas e estilos, guerreiros formam o núcleo de exércitos, milícias e companhias mercenárias.',
        'Arcanista': 'Mestre das artes arcanas, os arcanistas canalizam o poder mágico puro através de anos de estudo ou talento inato.',
        // ... outras classes de Tormenta
    };
} 