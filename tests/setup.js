// Setup global para testes
global.localStorage = {
  store: {},
  getItem: function(key) {
    return this.store[key] || null;
  },
  setItem: function(key, value) {
    this.store[key] = value.toString();
  },
  removeItem: function(key) {
    delete this.store[key];
  },
  clear: function() {
    this.store = {};
  }
};

// Mock do console para testes
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  info: jest.fn()
};

// Mock de funções do DOM que podem não estar disponíveis
global.fetch = jest.fn();
global.CustomEvent = jest.fn();

// Limpar mocks antes de cada teste
beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
}); 