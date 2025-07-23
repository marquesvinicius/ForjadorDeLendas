/**
 * Gerenciador de mundos - atualiza formulário baseado no mundo selecionado
 */

import { getCurrentWorldConfig, getWorldConfig } from '../config/worldsConfig.js';

/**
 * Atualiza as opções de raça baseadas no mundo atual
 */
export function updateRaceOptions() {
    const config = getCurrentWorldConfig();
    const raceSelect = document.getElementById('charRace');
    
    if (!raceSelect) return;
    
    // Salvar a seleção atual se existir
    const currentSelection = raceSelect.value;
    
    // Limpar opções existentes
    raceSelect.innerHTML = '';
    
    // Adicionar novas opções baseadas no mundo
    config.races.forEach(race => {
        const option = document.createElement('option');
        option.value = race;
        option.textContent = race;
        raceSelect.appendChild(option);
    });
    
    // Restaurar seleção se ainda for válida
    if (config.races.includes(currentSelection)) {
        raceSelect.value = currentSelection;
    } else {
        raceSelect.value = config.races[0]; // Primeira opção como padrão
    }
}

/**
 * Atualiza as opções de classe baseadas no mundo atual
 */
export function updateClassOptions() {
    const config = getCurrentWorldConfig();
    const classSelect = document.getElementById('charClass');
    
    if (!classSelect) return;
    
    // Salvar a seleção atual se existir
    const currentSelection = classSelect.value;
    
    // Limpar opções existentes
    classSelect.innerHTML = '';
    
    // Adicionar novas opções baseadas no mundo
    config.classes.forEach(charClass => {
        const option = document.createElement('option');
        option.value = charClass;
        option.textContent = charClass;
        classSelect.appendChild(option);
    });
    
    // Restaurar seleção se ainda for válida
    if (config.classes.includes(currentSelection)) {
        classSelect.value = currentSelection;
    } else {
        classSelect.value = config.classes[0]; // Primeira opção como padrão
    }
}

/**
 * Atualiza os rótulos dos campos baseados no mundo atual
 */
export function updateFieldLabels() {
    const config = getCurrentWorldConfig();
    
    // Atualizar label do campo de raça/origem
    const raceSelect = document.getElementById('charRace');
    if (raceSelect) {
        const raceFieldContainer = raceSelect.closest('.field');
        const raceLabel = raceFieldContainer?.querySelector('label');
        if (raceLabel && config.fieldLabels?.race) {
            raceLabel.textContent = config.fieldLabels.race;
        }
    }
    
    // Atualizar label do campo de classe
    const classSelect = document.getElementById('charClass');
    if (classSelect) {
        const classFieldContainer = classSelect.closest('.field');
        const classLabel = classFieldContainer?.querySelector('label');
        if (classLabel && config.fieldLabels?.class) {
            classLabel.textContent = config.fieldLabels.class;
        }
    }
}

/**
 * Atualiza os rótulos dos atributos baseados no mundo atual
 */
export function updateAttributeLabels() {
    const config = getCurrentWorldConfig();
    const attributeFields = [
        { id: 'attrStr', element: document.getElementById('attrStr') },
        { id: 'attrDex', element: document.getElementById('attrDex') },
        { id: 'attrCon', element: document.getElementById('attrCon') },
        { id: 'attrInt', element: document.getElementById('attrInt') },
        { id: 'attrWis', element: document.getElementById('attrWis') },
        { id: 'attrCha', element: document.getElementById('attrCha') }
    ];
    
    // Esconder todos os campos primeiro
    attributeFields.forEach(attr => {
        if (attr.element) {
            const fieldContainer = attr.element.closest('.field');
            if (fieldContainer) {
                fieldContainer.style.display = 'none';
            }
        }
    });
    
    // Mostrar e configurar apenas os atributos necessários para o mundo atual
    config.attributes.forEach((attributeName, index) => {
        if (index < attributeFields.length) {
            const attr = attributeFields[index];
            if (attr.element) {
                const fieldContainer = attr.element.closest('.field');
                const label = fieldContainer?.querySelector('label');
                
                if (label && fieldContainer) {
                    label.textContent = attributeName;
                    fieldContainer.style.display = 'block';
                }
            }
        }
    });
}



/**
 * Atualiza todo o formulário para o mundo atual
 */
export function updateFormForCurrentWorld() {
    updateRaceOptions();
    updateClassOptions();
    updateAttributeLabels();
    updateFieldLabels();
    
    // Recarregar lista de personagens para atualizar ícones
    if (window.forjadorAppInstance) {
        window.forjadorAppInstance.loadCharacters();
    }
}

/**
 * Inicializa o gerenciador de mundos
 */
export function initWorldManager() {
    // Atualizar formulário na inicialização
    updateFormForCurrentWorld();
    
    // Escutar mudanças de mundo
    document.addEventListener('worldChanged', () => {
        updateFormForCurrentWorld();
        
        // Recarregar companion para usar novas falas
        if (window.magoCompanion) {
            window.magoCompanion.greet();
        }
    });
}

/**
 * Obtém os ícones de classe para o mundo atual
 */
export function getCurrentClassIcons() {
    const config = getCurrentWorldConfig();
    return config.classIcons || {};
} 