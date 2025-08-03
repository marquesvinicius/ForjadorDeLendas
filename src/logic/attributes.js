/**
 * Funções para manipulação de atributos de personagens
 */

/**
 * Rola um atributo usando o método 4d6 drop lowest
 * @returns {number} Valor do atributo entre 3 e 18
 */
export function rollStat() {
  const rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1);
  rolls.sort((a, b) => a - b);
  return rolls.slice(1).reduce((sum, roll) => sum + roll, 0);
}

/**
 * Rola todos os atributos de um personagem
 * @returns {Object} Objeto com todos os atributos
 */
export function rollAllAttributes() {
  return {
    strength: rollStat(),
    dexterity: rollStat(),
    constitution: rollStat(),
    intelligence: rollStat(),
    wisdom: rollStat(),
    charisma: rollStat()
  };
}

/**
 * Obtém os limites de atributos para um mundo específico
 * @param {string} world - ID do mundo ('dnd', 'tormenta', 'ordem-paranormal')
 * @returns {Object} Objeto com min e max para o mundo
 */
export function getAttributeLimits(world) {
  const limits = {
    'dnd': { min: 3, max: 18 },
    'tormenta': { min: 3, max: 18 },
    'ordem-paranormal': { min: -2, max: 4 }
  };
  
  return limits[world] || limits['dnd'];
}

/**
 * Valida se um valor de atributo está na faixa válida para o mundo atual
 * @param {number} value - Valor a ser validado
 * @param {string} world - ID do mundo (opcional, usa localStorage se não fornecido)
 * @returns {boolean} True se válido
 */
export function isValidAttributeValue(value, world = null) {
  const currentWorld = world || localStorage.getItem('selectedWorld') || 'dnd';
  const limits = getAttributeLimits(currentWorld);
  
  return Number.isInteger(value) && value >= limits.min && value <= limits.max;
}

/**
 * Converte um valor de rolagem para atributo baseado no mundo
 * @param {number} rollValue - Valor da rolagem (ex: 13, 8, 15, 18, 10, 9)
 * @param {string} world - ID do mundo
 * @returns {number} Valor do atributo convertido
 */
export function convertRollToAttribute(rollValue, world = null) {
  const currentWorld = world || localStorage.getItem('selectedWorld') || 'dnd';
  
  if (currentWorld === 'ordem-paranormal') {
    // Tabela de conversão para Ordem Paranormal
    if (rollValue <= 7) return -2;
    if (rollValue <= 9) return -1;
    if (rollValue <= 11) return 0;
    if (rollValue <= 13) return 1;
    if (rollValue <= 15) return 2;
    if (rollValue <= 17) return 3;
    if (rollValue === 18) return 4;
    return 0; // fallback
  }
  
  // Para D&D e Tormenta, retorna o valor da rolagem diretamente
  return rollValue;
}

/**
 * Rola atributos para Ordem Paranormal usando o sistema específico
 * @returns {Object} Objeto com atributos convertidos
 */
export function rollOrdemParanormalAttributes() {
  const rolls = [];
  
  // Rola 6 vezes usando 4d6 drop lowest
  for (let i = 0; i < 6; i++) {
    const roll = rollStat();
    rolls.push(roll);
  }
  
  // Converte os valores de rolagem para atributos
  const convertedAttributes = rolls.map(roll => convertRollToAttribute(roll, 'ordem-paranormal'));
  
  // Verifica se a soma é pelo menos 6, se não, rola novamente o menor valor
  let sum = convertedAttributes.reduce((a, b) => a + b, 0);
  while (sum < 6) {
    const minIndex = convertedAttributes.indexOf(Math.min(...convertedAttributes));
    const newRoll = rollStat();
    const newAttribute = convertRollToAttribute(newRoll, 'ordem-paranormal');
    convertedAttributes[minIndex] = newAttribute;
    sum = convertedAttributes.reduce((a, b) => a + b, 0);
  }
  
  return {
    strength: convertedAttributes[0],
    dexterity: convertedAttributes[1], 
    constitution: convertedAttributes[2],
    intelligence: convertedAttributes[3],
    wisdom: convertedAttributes[4],
    charisma: convertedAttributes[5]
  };
}

/**
 * Rola todos os atributos baseado no mundo atual
 * @returns {Object} Objeto com todos os atributos
 */
export function rollAllAttributesForCurrentWorld() {
  const currentWorld = localStorage.getItem('selectedWorld') || 'dnd';
  
  if (currentWorld === 'ordem-paranormal') {
    return rollOrdemParanormalAttributes();
  }
  
  return rollAllAttributes();
}

/**
 * Calcula o modificador de um atributo
 * @param {number} attributeValue - Valor do atributo
 * @returns {number} Modificador do atributo
 */
export function getAttributeModifier(attributeValue) {
  return Math.floor((attributeValue - 10) / 2);
}

/**
 * Formata o modificador para exibição
 * @param {number} modifier - Modificador do atributo
 * @returns {string} Modificador formatado (ex: "+2", "-1", "+0")
 */
export function formatModifier(modifier) {
  if (modifier >= 0) {
    return `+${modifier}`;
  }
  return modifier.toString();
}

/**
 * Atualiza os campos de atributos no DOM
 * @param {Object} attributes - Objeto com os atributos
 */
export function updateAttributeFields(attributes) {
  const fieldMap = {
    strength: 'attrStr',
    dexterity: 'attrDex', 
    constitution: 'attrCon',
    intelligence: 'attrInt',
    wisdom: 'attrWis',
    charisma: 'attrCha'
  };

  Object.entries(fieldMap).forEach(([attr, fieldId]) => {
    const element = document.getElementById(fieldId);
    if (element && attributes[attr] !== undefined) {
      element.value = attributes[attr];
    }
  });
}

/**
 * Lê os valores dos atributos dos campos do DOM
 * @returns {Object} Objeto com os atributos lidos
 */
export function readAttributeFields() {
  return {
    strength: parseInt(document.getElementById('attrStr')?.value) || 10,
    dexterity: parseInt(document.getElementById('attrDex')?.value) || 10,
    constitution: parseInt(document.getElementById('attrCon')?.value) || 10,
    intelligence: parseInt(document.getElementById('attrInt')?.value) || 10,
    wisdom: parseInt(document.getElementById('attrWis')?.value) || 10,
    charisma: parseInt(document.getElementById('attrCha')?.value) || 10
  };
} 