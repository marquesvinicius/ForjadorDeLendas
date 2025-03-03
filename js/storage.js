/**
 * Sistema de armazenamento local para personagens
 */
class CharacterStorage {
    constructor() {
        this.storageKey = 'rpg_characters';
        this.characters = this.loadCharacters();
    }

    // Carrega personagens do localStorage
    loadCharacters() {
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : [];
    }

    // Salva personagens no localStorage
    saveCharacters() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.characters));
    }

    // Adiciona ou atualiza um personagem
    saveCharacter(character) {
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
        return [...this.characters];
    }

    // Obtém um personagem pelo ID
    getCharacterById(id) {
        return this.characters.find(c => c.id === id);
    }

    // Remove um personagem
    deleteCharacter(id) {
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

// Exporta a instância
const characterStorage = new CharacterStorage(); 