/**
 * Sistema de armazenamento local para personagens
 * ⚠️ DEPRECADO: Este sistema foi substituído pelo SupabaseOnlyStorage
 * Mantido apenas para compatibilidade durante migração
 */

export class CharacterStorage {
  constructor() {
    console.warn('⚠️ CharacterStorage está DEPRECADO! Use SupabaseOnlyStorage em vez disso.');
    this.storageKey = 'rpg_characters';
    this.characters = this.loadCharacters();
  }

  // Carrega personagens do localStorage
  loadCharacters() {
    console.warn('⚠️ Usando localStorage para personagens - DEPRECADO!');
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }

  // Salva personagens no localStorage
  saveCharacters() {
    console.warn('⚠️ Salvando personagens no localStorage - DEPRECADO!');
    localStorage.setItem(this.storageKey, JSON.stringify(this.characters));
  }

  // Adiciona ou atualiza um personagem
  saveCharacter(character) {
    console.warn('⚠️ DEPRECADO: Use SupabaseOnlyStorage.saveCharacter() em vez disso!');
    // Se não tiver ID, cria um novo
    if (!character.id) {
      character.id = this.generateId();
      character.createdAt = new Date().toISOString();
      this.characters.push(character);
    } else {
      // Atualiza um existente
      const index = this.characters.findIndex(c => c.id === character.id);
      if (index !== -1) {
        character.updatedAt = new Date().toISOString();
        this.characters[index] = character;
      } else {
        // ID não encontrado, cria novo
        character.id = this.generateId();
        character.createdAt = new Date().toISOString();
        this.characters.push(character);
      }
    }
    
    this.saveCharacters();
    return character;
  }

  // Obtém todos os personagens
  getAllCharacters() {
    console.warn('⚠️ DEPRECADO: Use SupabaseOnlyStorage.getAllCharacters() em vez disso!');
    return [...this.characters];
  }

  // Obtém um personagem pelo ID
  getCharacterById(id) {
    console.warn('⚠️ DEPRECADO: Use SupabaseOnlyStorage.getCharacterById() em vez disso!');
    return this.characters.find(c => c.id === id);
  }

  // Remove um personagem
  deleteCharacter(id) {
    console.warn('⚠️ DEPRECADO: Use SupabaseOnlyStorage.deleteCharacter() em vez disso!');
    const index = this.characters.findIndex(c => c.id === id);
    if (index !== -1) {
      this.characters.splice(index, 1);
      this.saveCharacters();
      return true;
    }
    return false;
  }

  // Gera um ID único
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }
}

// Exporta uma instância singleton com aviso de depreciação
console.warn('⚠️ characterStorage está DEPRECADO! Use supabaseOnlyStorage em vez disso.');
export const characterStorage = new CharacterStorage(); 