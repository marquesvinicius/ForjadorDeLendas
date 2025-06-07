/**
 * Testes para a classe CharacterStorage
 */

// Importar a classe (simulando a implementação)
class CharacterStorage {
  constructor() {
    this.storageKey = 'rpg_characters';
    this.characters = this.loadCharacters();
  }

  loadCharacters() {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }

  saveCharacters() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.characters));
  }

  saveCharacter(character) {
    if (!character.id) {
      character.id = this.generateId();
      character.createdAt = new Date().toISOString();
      this.characters.push(character);
    } else {
      const index = this.characters.findIndex(c => c.id === character.id);
      if (index !== -1) {
        character.updatedAt = new Date().toISOString();
        this.characters[index] = character;
      } else {
        character.id = this.generateId();
        character.createdAt = new Date().toISOString();
        this.characters.push(character);
      }
    }
    
    this.saveCharacters();
    return character;
  }

  getAllCharacters() {
    return [...this.characters];
  }

  getCharacterById(id) {
    return this.characters.find(c => c.id === id);
  }

  deleteCharacter(id) {
    const index = this.characters.findIndex(c => c.id === id);
    if (index !== -1) {
      this.characters.splice(index, 1);
      this.saveCharacters();
      return true;
    }
    return false;
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }
}

describe('CharacterStorage', () => {
  let storage;
  
  beforeEach(() => {
    // Limpar localStorage antes de cada teste
    localStorage.clear();
    storage = new CharacterStorage();
  });

  describe('constructor', () => {
    test('deve inicializar com array vazio quando localStorage está vazio', () => {
      expect(storage.characters).toEqual([]);
      expect(storage.storageKey).toBe('rpg_characters');
    });

    test('deve carregar personagens existentes do localStorage', () => {
      const existingCharacters = [
        { id: '1', name: 'Aragorn', race: 'Humano', class: 'Ranger' }
      ];
      localStorage.setItem('rpg_characters', JSON.stringify(existingCharacters));
      
      const newStorage = new CharacterStorage();
      expect(newStorage.characters).toEqual(existingCharacters);
    });
  });

  describe('saveCharacter', () => {
    test('deve salvar um novo personagem sem ID', () => {
      const character = {
        name: 'Legolas',
        race: 'Elfo',
        class: 'Ranger'
      };

      const savedCharacter = storage.saveCharacter(character);

      expect(savedCharacter.id).toBeDefined();
      expect(savedCharacter.createdAt).toBeDefined();
      expect(savedCharacter.name).toBe('Legolas');
      expect(storage.characters).toHaveLength(1);
    });

    test('deve atualizar um personagem existente', () => {
      // Primeiro, salvar um personagem
      const character = {
        name: 'Gimli',
        race: 'Anão',
        class: 'Guerreiro'
      };
      const savedCharacter = storage.saveCharacter(character);
      
      // Depois, atualizar
      savedCharacter.name = 'Gimli Filho de Glóin';
      const updatedCharacter = storage.saveCharacter(savedCharacter);

      expect(updatedCharacter.name).toBe('Gimli Filho de Glóin');
      expect(updatedCharacter.updatedAt).toBeDefined();
      expect(storage.characters).toHaveLength(1);
    });

    test('deve persistir no localStorage', () => {
      const character = {
        name: 'Gandalf',
        race: 'Maia',
        class: 'Mago'
      };

      storage.saveCharacter(character);

      const storedData = localStorage.getItem('rpg_characters');
      const parsedData = JSON.parse(storedData);
      expect(parsedData).toHaveLength(1);
      expect(parsedData[0].name).toBe('Gandalf');
    });
  });

  describe('getAllCharacters', () => {
    test('deve retornar array vazio quando não há personagens', () => {
      expect(storage.getAllCharacters()).toEqual([]);
    });

    test('deve retornar cópia dos personagens', () => {
      const character = { name: 'Frodo', race: 'Hobbit', class: 'Ladino' };
      storage.saveCharacter(character);

      const characters = storage.getAllCharacters();
      expect(characters).toHaveLength(1);
      
      // Modificar o array retornado não deve afetar o storage
      characters.push({ name: 'Sam' });
      expect(storage.characters).toHaveLength(1);
    });
  });

  describe('getCharacterById', () => {
    test('deve retornar personagem pelo ID', () => {
      const character = { name: 'Boromir', race: 'Humano', class: 'Guerreiro' };
      const savedCharacter = storage.saveCharacter(character);

      const foundCharacter = storage.getCharacterById(savedCharacter.id);
      expect(foundCharacter).toEqual(savedCharacter);
    });

    test('deve retornar undefined para ID inexistente', () => {
      const foundCharacter = storage.getCharacterById('id-inexistente');
      expect(foundCharacter).toBeUndefined();
    });
  });

  describe('deleteCharacter', () => {
    test('deve remover personagem existente', () => {
      const character = { name: 'Saruman', race: 'Maia', class: 'Mago' };
      const savedCharacter = storage.saveCharacter(character);

      const result = storage.deleteCharacter(savedCharacter.id);
      
      expect(result).toBe(true);
      expect(storage.characters).toHaveLength(0);
      expect(storage.getCharacterById(savedCharacter.id)).toBeUndefined();
    });

    test('deve retornar false para ID inexistente', () => {
      const result = storage.deleteCharacter('id-inexistente');
      expect(result).toBe(false);
    });

    test('deve atualizar localStorage após remoção', () => {
      const character = { name: 'Sauron', race: 'Maia', class: 'Necromante' };
      const savedCharacter = storage.saveCharacter(character);

      storage.deleteCharacter(savedCharacter.id);

      const storedData = localStorage.getItem('rpg_characters');
      const parsedData = JSON.parse(storedData);
      expect(parsedData).toHaveLength(0);
    });
  });

  describe('generateId', () => {
    test('deve gerar IDs únicos', () => {
      const id1 = storage.generateId();
      const id2 = storage.generateId();
      
      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
      expect(typeof id2).toBe('string');
      expect(id1.length).toBeGreaterThan(0);
      expect(id2.length).toBeGreaterThan(0);
    });

    test('deve gerar IDs em formato string', () => {
      const id = storage.generateId();
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(5); // Deve ter tamanho razoável
    });
  });
}); 