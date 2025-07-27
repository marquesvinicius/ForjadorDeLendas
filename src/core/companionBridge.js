/**
 * Módulo responsável pela integração com o magoCompanion
 */

/**
 * Retorna a instância do companion de forma segura
 * @returns {Object|null} Instância do companion ou null se não disponível
 */
export function getCompanion() {
    return window.magoCompanion || null;
}

/**
 * Verifica se o companion está disponível
 * @returns {boolean} True se o companion está disponível
 */
export function isCompanionAvailable() {
    return !!getCompanion();
}

/**
 * Notifica o companion sobre eventos do personagem
 */
export const companionEvents = {
    /**
     * Notifica sobre salvamento de personagem
     * @param {string} characterName - Nome do personagem
     */
    onCharacterSave: (characterName) => {
        const companion = getCompanion();
        if (companion) companion.reactToCharacterSave(characterName);
    },

    /**
     * Notifica sobre atualização de personagem
     * @param {string} characterName - Nome do personagem
     */
    onCharacterUpdate: (characterName) => {
        const companion = getCompanion();
        if (companion) companion.reactToCharacterUpdate(characterName);
    },

    /**
     * Notifica sobre exclusão de personagem
     * @param {string} characterName - Nome do personagem
     */
    onCharacterDelete: (characterName) => {
        const companion = getCompanion();
        if (companion) companion.reactToCharacterDelete(characterName);
    },

    /**
     * Notifica sobre edição de personagem
     * @param {string} characterName - Nome do personagem
     */
    onCharacterEdit: (characterName) => {
        const companion = getCompanion();
        if (companion) companion.reactToCharacterEdit(characterName);
    },

    /**
     * Notifica sobre início da geração de história
     */
    onStoryGenerationStart: () => {
        const companion = getCompanion();
        if (companion) companion.reactToStoryGeneration();
    },

    /**
     * Notifica sobre sucesso na geração de história
     */
    onStoryGenerationSuccess: () => {
        const companion = getCompanion();
        if (companion) companion.reactToStorySuccess();
    },

    /**
     * Notifica sobre fallback na geração de história
     */
    onStoryGenerationFallback: () => {
        const companion = getCompanion();
        if (companion) companion.reactToStoryFallback();
    },

    /**
     * Notifica sobre mudança de mundo
     * @param {string} newWorld - Novo mundo selecionado
     * @param {string} oldWorld - Mundo anterior (opcional)
     */
    onWorldChange: (newWorld, oldWorld = null) => {
        const companion = getCompanion();
        if (companion && companion.reactToWorldChange) {
            companion.reactToWorldChange(newWorld, oldWorld);
        }
    },

    /**
     * Notifica sobre feedback de conteúdo da história
     * @param {string} story - História gerada
     * @param {Object} characterData - Dados do personagem
     */
    onStoryContentFeedback: (story, characterData) => {
        const companion = getCompanion();
        if (companion && companion.reactToStoryContent) {
            // Delay para não sobrecarregar o usuário
            setTimeout(() => {
                companion.reactToStoryContent(story, characterData);
            }, 2000);
        }
    }
}; 