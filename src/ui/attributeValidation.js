/**
 * Validação em tempo real para campos de atributos
 */

import { getAttributeLimits, isValidAttributeValue } from '../logic/attributes.js';

/**
 * Configura validação em tempo real para um campo de atributo
 * @param {string} fieldId - ID do campo de atributo
 */
export function setupAttributeValidation(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;

    // Função para validar e corrigir o valor
    const validateAndCorrect = (value) => {
        const currentWorld = localStorage.getItem('selectedWorld') || 'dnd';
        const limits = getAttributeLimits(currentWorld);
        
        // Converter para número
        let numValue = parseInt(value);
        
        // Se não for um número válido, usar o valor mínimo
        if (isNaN(numValue)) {
            numValue = limits.min;
        }
        
        // Aplicar limites
        if (numValue < limits.min) {
            numValue = limits.min;
        } else if (numValue > limits.max) {
            numValue = limits.max;
        }
        
        return numValue;
    };

    // Validar quando o usuário terminar de digitar
    field.addEventListener('blur', () => {
        const correctedValue = validateAndCorrect(field.value);
        field.value = correctedValue;
    });

    // Validar durante a digitação (opcional, para feedback imediato)
    field.addEventListener('input', (e) => {
        const value = e.target.value;
        
        // Permitir campo vazio temporariamente
        if (value === '' || value === '-') {
            return;
        }
        
        const currentWorld = localStorage.getItem('selectedWorld') || 'dnd';
        const limits = getAttributeLimits(currentWorld);
        
        // Verificar se o valor está dentro dos limites
        const numValue = parseInt(value);
        if (!isNaN(numValue)) {
            if (numValue < limits.min || numValue > limits.max) {
                field.classList.add('is-danger');
            } else {
                field.classList.remove('is-danger');
            }
        }
    });

    // Prevenir entrada de caracteres inválidos
    field.addEventListener('keypress', (e) => {
        const currentWorld = localStorage.getItem('selectedWorld') || 'dnd';
        const limits = getAttributeLimits(currentWorld);
        
        // Permitir números, sinal negativo (apenas para Ordem Paranormal) e teclas de controle
        const allowedChars = /[0-9]/;
        const controlKeys = ['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
        
        // Para Ordem Paranormal, permitir sinal negativo
        if (currentWorld === 'ordem-paranormal' && e.key === '-') {
            // Permitir apenas se for o primeiro caractere
            if (field.selectionStart === 0) {
                return;
            }
        }
        
        if (!allowedChars.test(e.key) && !controlKeys.includes(e.key)) {
            e.preventDefault();
        }
    });
}

/**
 * Configura validação para todos os campos de atributos
 */
export function setupAllAttributeValidation() {
    const attributeFields = [
        'attrStr', 'attrDex', 'attrCon', 'attrInt', 'attrWis', 'attrCha'
    ];
    
    attributeFields.forEach(fieldId => {
        setupAttributeValidation(fieldId);
    });
}

/**
 * Atualiza a validação quando o mundo muda
 */
export function updateAttributeValidation() {
    const attributeFields = [
        'attrStr', 'attrDex', 'attrCon', 'attrInt', 'attrWis', 'attrCha'
    ];
    
    const currentWorld = localStorage.getItem('selectedWorld') || 'dnd';
    const limits = getAttributeLimits(currentWorld);
    
    attributeFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            // Atualizar limites
            field.min = limits.min;
            field.max = limits.max;
            
            // Validar valor atual
            const currentValue = parseInt(field.value) || 10;
            if (currentValue < limits.min) {
                field.value = limits.min;
            } else if (currentValue > limits.max) {
                field.value = limits.max;
            }
            
            // Remover classes de erro
            field.classList.remove('is-danger');
        }
    });
} 