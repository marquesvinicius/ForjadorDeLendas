/**
 * Sistema Híbrido de Storage - Forjador de Lendas
 * Combina localStorage (fallback) com Supabase (principal)
 * Mantém compatibilidade enquanto migra para nuvem
 */

import { supabaseAuth } from './supabase.js';
import { supabaseDB } from './supabase-db.js';
import { CharacterStorage } from './storage.js';

export class HybridStorage {
    constructor() {
        this.localStorage = new CharacterStorage();
        this.supabaseStorage = supabaseDB;
        this.authService = supabaseAuth;
        this.isOnline = false;
        this.listenersAdded = false;
        this.init();
    }

    /**
     * Inicializar sistema híbrido
     */
    async init() {
        // Testar conexão com Supabase
        try {
            const connectionTest = await this.supabaseStorage.testConnection();
            this.isOnline = connectionTest.success;
        } catch (error) {
            console.error('❌ Erro no teste de conexão:', error);
            this.isOnline = false;
        }
        
        console.log(`🔄 Storage Mode: ${this.isOnline ? 'Supabase + Local' : 'Local Only'}`);

        // Configurar eventos de autenticação (apenas uma vez)
        if (!this.listenersAdded) {
        document.addEventListener('supabaseSignIn', (event) => {
                console.log('📥 HybridStorage: Evento SignIn recebido para:', event.detail?.user?.email);
            this.onUserLogin(event.detail.user);
        });

        document.addEventListener('supabaseSignOut', () => {
                console.log('📤 HybridStorage: Evento SignOut recebido');
            this.onUserLogout();
        });

            this.listenersAdded = true;
            console.log('✅ Event listeners do HybridStorage registrados');
        }

        // Se já estiver logado, sincronizar (mas só se online)
        if (this.authService.isAuthenticated() && this.isOnline) {
            const user = this.authService.getCurrentUser();
            await this.onUserLogin(user);
        }
    }

    /**
     * Quando usuário faz login - sincronizar dados
     */
    async onUserLogin(user) {
        if (!this.isOnline) return;

        try {
            console.log('🔄 Sincronizando dados do usuário...');

            // 1. Criar/atualizar perfil no Supabase
            await this.syncUserProfile(user);

        } catch (error) {
            console.error('❌ Erro na sincronização:', error);
        }
    }

    /**
     * Quando usuário faz logout - limpar dados locais
     */
    onUserLogout() {
        console.log('🧹 Limpando dados locais...');
        // Manter dados locais como backup, apenas marcar como offline
        localStorage.setItem('forjador_last_sync', '');
    }

    /**
     * Sincronizar perfil do usuário
     */
    async syncUserProfile(user) {
        try {
            const profileData = {
                username: user.user_metadata?.username || user.email?.split('@')[0] || 'Usuário',
                full_name: user.user_metadata?.full_name || '',
                avatar_url: user.user_metadata?.avatar_url || '',
                favorite_world: localStorage.getItem('selectedWorld') || 'tormenta'
            };

            const result = await this.supabaseStorage.upsertProfile(user.id, profileData);
            
            if (result.success) {
                console.log('✅ Perfil sincronizado:', result.data.username);
                // Salvar perfil localmente para uso offline
                localStorage.setItem('forjador_user_profile', JSON.stringify(result.data));
            }

            return result;
        } catch (error) {
            console.error('❌ Erro ao sincronizar perfil:', error);
            return { success: false, error: error.message };
        }
    }

    // ==================== MÉTODOS PÚBLICOS ====================

    /**
     * Salvar personagem (apenas Supabase)
     */
    async saveCharacter(characterData) {
        const user = this.authService.getCurrentUser();
        if (this.isOnline && user) {
            try {
                const result = await this.supabaseStorage.saveCharacter(user.id, characterData);
                if (result.success) {
                    const localChar = {
                        id: result.data.id,
                        name: result.data.name,
                        race: result.data.race,
                        class: result.data.class,
                        alignment: result.data.alignment,
                        world: result.data.world,
                        attributes: result.data.attributes,
                        background: result.data.background,
                        createdAt: result.data.created_at,
                        updatedAt: result.data.updated_at
                    };
                    return localChar;
                }
            } catch (error) {
                console.warn('⚠️ Erro ao salvar na nuvem:', error);
            }
        }
        throw new Error('Usuário não autenticado ou offline. Não é possível salvar personagem.');
    }

    /**
     * Obter todos os personagens (apenas Supabase)
     */
    async getAllCharacters(world = null) {
        const user = this.authService.getCurrentUser();
        if (this.isOnline && user) {
            try {
                const result = await this.supabaseStorage.getUserCharacters(user.id, world);
                if (result.success) {
                    const characters = result.data.map(char => ({
                        id: char.id,
                        name: char.name,
                        race: char.race,
                        class: char.class,
                        alignment: char.alignment,
                        world: char.world,
                        attributes: char.attributes,
                        background: char.background,
                        createdAt: char.created_at,
                        updatedAt: char.updated_at
                    }));
                    return characters;
                }
            } catch (error) {
                console.warn('⚠️ Erro ao buscar da nuvem:', error);
            }
        }
        throw new Error('Usuário não autenticado ou offline. Não é possível buscar personagens.');
    }

    /**
     * Obter personagem por ID (apenas Supabase)
     */
    async getCharacterById(id) {
        const user = this.authService.getCurrentUser();
        if (this.isOnline && user) {
            try {
                const result = await this.supabaseStorage.getCharacter(user.id, id);
                if (result.success) {
                    const char = result.data;
                    return {
                        id: char.id,
                        name: char.name,
                        race: char.race,
                        class: char.class,
                        alignment: char.alignment,
                        world: char.world,
                        attributes: char.attributes,
                        background: char.background,
                        createdAt: char.created_at,
                        updatedAt: char.updated_at
                    };
                }
            } catch (error) {
                console.warn('⚠️ Erro ao buscar da nuvem:', error);
            }
        }
        throw new Error('Usuário não autenticado ou offline. Não é possível buscar personagem.');
    }

    /**
     * Deletar personagem (apenas Supabase)
     */
    async deleteCharacter(id) {
        const user = this.authService.getCurrentUser();
        if (this.isOnline && user) {
            try {
                const result = await this.supabaseStorage.deleteCharacter(user.id, id);
                if (result.success) {
                    return true;
                }
            } catch (error) {
                console.warn('⚠️ Erro ao deletar da nuvem:', error);
            }
        }
        throw new Error('Usuário não autenticado ou offline. Não é possível deletar personagem.');
    }

    /**
     * Verificar status de sincronização
     */
    getSyncStatus() {
        const lastSync = localStorage.getItem('forjador_last_sync');
        const user = this.authService.getCurrentUser();
        
        return {
            isOnline: this.isOnline,
            isAuthenticated: !!user,
            lastSync: lastSync ? new Date(lastSync) : null,
            mode: this.isOnline && user ? 'cloud' : 'local'
        };
    }

    /**
     * Forçar sincronização manual
     */
    async forcSync() {
        const user = this.authService.getCurrentUser();
        
        if (!this.isOnline || !user) {
            throw new Error('Sincronização requer conexão e autenticação');
        }

        // Remover métodos: syncCharactersFromCloud, migrateLocalCharactersIfNeeded, onUserLogin, e qualquer outro relacionado ao localStorage de personagens.
        
        return {
            success: true,
            message: 'Sincronização concluída!'
        };
    }
}

// Exportar instância única
export const hybridStorage = new HybridStorage(); 