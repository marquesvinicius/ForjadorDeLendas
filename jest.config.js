module.exports = {
  // Ambiente de teste
  testEnvironment: 'jsdom',
  
  // Padrões de arquivos de teste
  testMatch: [
    '**/tests/**/*.test.js',
    '**/tests/**/*.spec.js'
  ],
  
  // Diretórios a serem ignorados
  testPathIgnorePatterns: [
    '/node_modules/',
    '/assets/'
  ],
  
  // Configuração de cobertura
  collectCoverageFrom: [
    'js/**/*.js',
    '!js/config.js', // Arquivo de configuração
    '!**/node_modules/**'
  ],
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  
  // Desabilitar transformações para evitar problemas de source map
  transform: {},
  
  // Globals para os testes
  globals: {
    'CharacterStorage': true,
    'ThemeManager': true,
    'worldThemes': true
  }
}; 