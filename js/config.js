/**
 * 🔧 Configurações Centralizadas — Forjador de Lendas
 * Arquivo para armazenar URLs, chaves e configurações globais
 */

const CONFIG = {
    // URLs da API
    API: {
        BASE_URL: 'http://localhost:3000/api',
        ENDPOINTS: {
            CHARACTERS: '/characters',
            BACKSTORY: '/backstory',
            AUTH: '/auth'
        }
    },

    // Configurações de armazenamento
    STORAGE: {
        CHARACTERS_KEY: 'forjador_characters',
        SETTINGS_KEY: 'forjador_settings',
        THEME_KEY: 'forjador_theme',
        WORLD_KEY: 'forjador_selected_world'
    },

    // Configurações de UI
    UI: {
        ANIMATION_DURATION: 300,
        TOAST_DURATION: 3000,
        MODAL_BACKDROP_BLUR: '5px'
    },

    // Configurações dos mundos
    WORLDS: {
        DEFAULT: 'dnd',
        AVAILABLE: ['dnd', 'tormenta', 'ordem-paranormal']
    },

    // Configurações de desenvolvimento
    DEV: {
        DEBUG_MODE: false,
        LOG_LEVEL: 'info' // 'debug', 'info', 'warn', 'error'
    }
};

// Função para logging controlado
const log = {
    debug: (message, ...args) => {
        if (CONFIG.DEV.DEBUG_MODE || CONFIG.DEV.LOG_LEVEL === 'debug') {
            console.log(`🐛 [DEBUG] ${message}`, ...args);
        }
    },
    info: (message, ...args) => {
        if (['debug', 'info'].includes(CONFIG.DEV.LOG_LEVEL)) {
            console.info(`ℹ️ [INFO] ${message}`, ...args);
        }
    },
    warn: (message, ...args) => {
        if (['debug', 'info', 'warn'].includes(CONFIG.DEV.LOG_LEVEL)) {
            console.warn(`⚠️ [WARN] ${message}`, ...args);
        }
    },
    error: (message, ...args) => {
        console.error(`❌ [ERROR] ${message}`, ...args);
    }
};

// Exportar para uso global e ES modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, log };
}

// Exportação ES6 modules
export { CONFIG, log }; 