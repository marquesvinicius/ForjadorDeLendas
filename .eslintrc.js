module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'prettier'
  ],
  plugins: [
    'prettier'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    // Prettier como regra do ESLint
    'prettier/prettier': 'error',
    
    // Regras básicas de qualidade
    'no-console': 'warn',
    'no-unused-vars': 'warn',
    'prefer-const': 'error',
    'no-var': 'error',
    
    // Regras de estilo consistente
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'indent': ['error', 2],
    'comma-dangle': ['error', 'never'],
    
    // Regras de boas práticas
    'eqeqeq': 'error',
    'no-duplicate-imports': 'error',
    'no-useless-return': 'error',
    'prefer-arrow-callback': 'error',
    
    // Regras específicas para DOM/Browser
    'no-undef': 'error'
  },
  globals: {
    // Variáveis globais do projeto
    'CharacterStorage': 'readonly',
    'ThemeManager': 'readonly',
    'worldThemes': 'readonly'
  }
}; 