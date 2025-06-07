const js = require('@eslint/js');

module.exports = [
  js.configs.recommended,
  {
    files: ['js/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'script',
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        localStorage: 'readonly',
        fetch: 'readonly',
        setTimeout: 'readonly',
        CustomEvent: 'readonly',
        
        // Node.js globals para arquivos de config
        module: 'readonly',
        exports: 'readonly',
        
        // Projeto específico  
        ThemeManager: 'readonly',
        worldThemes: 'readonly',
        applyWorldTheme: 'readonly'
      }
    },
    rules: {
      // Qualidade básica
      'no-console': 'warn',
      'no-unused-vars': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
      
      // Boas práticas
      'eqeqeq': 'error',
      'no-useless-return': 'error'
    }
  },
  {
    // Ignorar arquivos que usam ES modules por enquanto
    ignores: [
      'js/app.js',
      'js/companion.js', 
      'js/themeManager.js',
      'js/themes.js',
      'js/worldManager.js',
      'js/worldsConfig.js'
    ]
  }
]; 