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
 * Valida se um valor de atributo está na faixa válida
 * @param {number} value - Valor a ser validado
 * @returns {boolean} True se válido
 */
export function isValidAttributeValue(value) {
  return Number.isInteger(value) && value >= 3 && value <= 18;
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