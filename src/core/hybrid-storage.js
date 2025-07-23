/**
 * Sistema de Storage Exclusivo do Supabase - Forjador de Lendas
 * 100% baseado em Supabase, sem fallback para localStorage
 * localStorage usado apenas para configurações de UI (tema, mundo selecionado)
 */

import { supabaseAuth } from './supabase.js';
import { supabaseDB } from './supabase-db.js';

export class SupabaseOnlyStorage {
    constructor() {
        this.supabaseStorage = supabaseDB;
        this.authService = supabaseAuth;
        this.isOnline = false;
        this.listenersAdded = false;
        this.init();
    }

    /**
     * Inicializar sistema exclusivo do Supabase
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
        
        console.log(`🔄 Storage Mode: ${this.isOnline ? 'Supabase Only' : 'Offline'}`);

        // Configurar eventos de autenticação (apenas uma vez)
        if (!this.listenersAdded) {
            document.addEventListener('supabaseSignIn', (event) => {
                console.log('📥 SupabaseOnlyStorage: Evento SignIn recebido para:', event.detail?.user?.email);
                this.onUserLogin(event.detail.user);
            });

            document.addEventListener('supabaseSignOut', () => {
                console.log('📤 SupabaseOnlyStorage: Evento SignOut recebido');
                this.onUserLogout();
            });

            this.listenersAdded = true;
            console.log('✅ Event listeners do SupabaseOnlyStorage registrados');
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
     * Quando usuário faz logout - limpar apenas dados temporários
     */
    onUserLogout() {
        console.log('🧹 Limpando dados temporários...');
        // Manter apenas configurações de UI no localStorage (tema, mundo)
        // Personagens são sempre do Supabase - não precisa limpar
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
        if (!this.isOnline || !user) {
            throw new Error('Usuário não autenticado ou sem conexão. Faça login para salvar personagens.');
        }

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
            } else {
                throw new Error(result.error || 'Erro ao salvar personagem');
            }
        } catch (error) {
            console.error('❌ Erro ao salvar na nuvem:', error);
            throw error;
        }
    }

    /**
     * Obter todos os personagens (apenas Supabase)
     */
    async getAllCharacters(world = null) {
        const user = this.authService.getCurrentUser();
        if (!this.isOnline || !user) {
            throw new Error('Usuário não autenticado ou sem conexão. Faça login para ver seus personagens.');
        }

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
            } else {
                throw new Error(result.error || 'Erro ao buscar personagens');
            }
        } catch (error) {
            console.error('❌ Erro ao buscar da nuvem:', error);
            throw error;
        }
    }

    /**
     * Obter personagem por ID (apenas Supabase)
     */
    async getCharacterById(id) {
        const user = this.authService.getCurrentUser();
        if (!this.isOnline || !user) {
            throw new Error('Usuário não autenticado ou sem conexão. Faça login para acessar personagens.');
        }

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
            } else {
                throw new Error(result.error || 'Personagem não encontrado');
            }
        } catch (error) {
            console.error('❌ Erro ao buscar da nuvem:', error);
            throw error;
        }
    }

    /**
     * Deletar personagem (apenas Supabase)
     */
    async deleteCharacter(id) {
        const user = this.authService.getCurrentUser();
        if (!this.isOnline || !user) {
            throw new Error('Usuário não autenticado ou sem conexão. Faça login para deletar personagens.');
        }

        try {
            const result = await this.supabaseStorage.deleteCharacter(user.id, id);
            if (result.success) {
                return true;
            } else {
                throw new Error(result.error || 'Erro ao deletar personagem');
            }
        } catch (error) {
            console.error('❌ Erro ao deletar da nuvem:', error);
            throw error;
        }
    }

    /**
     * Verificar status de conexão
     */
    getSyncStatus() {
        const user = this.authService.getCurrentUser();
        
        return {
            isOnline: this.isOnline,
            isAuthenticated: !!user,
            mode: this.isOnline && user ? 'supabase' : 'offline',
            storage: 'supabase-only'
        };
    }

    /**
     * Forçar teste de conexão
     */
    async testConnection() {
        try {
            const result = await this.supabaseStorage.testConnection();
            this.isOnline = result.success;
            return result;
        } catch (error) {
            this.isOnline = false;
            throw error;
        }
    }
}

// Exportar instância única - agora é SupabaseOnlyStorage
export const supabaseOnlyStorage = new SupabaseOnlyStorage();

// Manter compatibilidade com nome antigo
export const hybridStorage = supabaseOnlyStorage; 