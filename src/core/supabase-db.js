/**
 * Sistema de Database Supabase para Forjador de Lendas
 * Gerencia profiles e characters no banco de dados
 */

import { supabase } from './supabase.js';

export class SupabaseDatabase {
    constructor() {
        this.client = supabase;
    }

    // ==================== PROFILES ====================

    /**
     * Criar ou atualizar perfil do usuário
     */
    async upsertProfile(userId, profileData) {
        try {
            const { data, error } = await this.client
                .from('profiles')
                .upsert({
                    id: userId,
                    username: profileData.username,
                    full_name: profileData.full_name || '',
                    avatar_url: profileData.avatar_url || '',
                    favorite_world: profileData.favorite_world || 'tormenta',
                    updated_at: new Date().toISOString()
                }, {
                    onConflict: 'id'
                })
                .select()
                .single();

            if (error) throw error;

            return {
                success: true,
                data,
                message: 'Perfil atualizado com sucesso!'
            };
        } catch (error) {
            console.error('❌ Erro ao atualizar perfil:', error);
            return {
                success: false,
                error: error.message,
                message: 'Erro ao atualizar perfil'
            };
        }
    }

    /**
     * Obter perfil do usuário
     */
    async getProfile(userId) {
        try {
            const { data, error } = await this.client
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error && error.code !== 'PGRST116') throw error;

            return {
                success: true,
                data: data || null,
                message: data ? 'Perfil encontrado' : 'Perfil não encontrado'
            };
        } catch (error) {
            console.error('❌ Erro ao buscar perfil:', error);
            return {
                success: false,
                error: error.message,
                message: 'Erro ao buscar perfil'
            };
        }
    }

    /**
     * Atualizar contador de personagens criados
     */
    async incrementCharacterCount(userId) {
        try {
            // Primeiro buscar o valor atual
            const { data: currentProfile, error: fetchError } = await this.client
                .from('profiles')
                .select('characters_created')
                .eq('id', userId)
                .single();

            if (fetchError) throw fetchError;

            const newCount = (currentProfile?.characters_created || 0) + 1;

            const { data, error } = await this.client
                .from('profiles')
                .update({
                    characters_created: newCount,
                    updated_at: new Date().toISOString()
                })
                .eq('id', userId)
                .select()
                .single();

            if (error) throw error;

            return {
                success: true,
                data,
                message: 'Contador atualizado'
            };
        } catch (error) {
            console.error('❌ Erro ao incrementar contador:', error);
            return {
                success: false,
                error: error.message,
                message: 'Erro ao atualizar contador'
            };
        }
    }

    // ==================== CHARACTERS ====================

    /**
     * Salvar personagem
     */
    async saveCharacter(userId, characterData) {
        try {
            const characterToSave = {
                user_id: userId,
                name: characterData.name,
                race: characterData.race,
                class: characterData.class,
                alignment: characterData.alignment,
                world: characterData.world || 'tormenta',
                attributes: characterData.attributes || {},
                background: characterData.background || '',
                updated_at: new Date().toISOString()
            };

            let result;

            if (characterData.id) {
                // Atualizar personagem existente
                const { data, error } = await this.client
                    .from('characters')
                    .update(characterToSave)
                    .eq('id', characterData.id)
                    .eq('user_id', userId) // Segurança: só atualizar se for do usuário
                    .select()
                    .single();

                if (error) throw error;
                result = data;
            } else {
                // Criar novo personagem
                const { data, error } = await this.client
                    .from('characters')
                    .insert(characterToSave)
                    .select()
                    .single();

                if (error) throw error;
                result = data;

                // Incrementar contador de personagens do usuário
                await this.incrementCharacterCount(userId);
            }

            return {
                success: true,
                data: result,
                message: characterData.id ? 'Personagem atualizado!' : 'Personagem criado!'
            };
        } catch (error) {
            console.error('❌ Erro ao salvar personagem:', error);
            return {
                success: false,
                error: error.message,
                message: 'Erro ao salvar personagem'
            };
        }
    }

    /**
     * Obter todos os personagens do usuário
     */
    async getUserCharacters(userId, world = null) {
        console.log('[SupabaseDB] Buscando personagens para user:', userId, 'world:', world);
        try {
            let query = this.client
                .from('characters')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (world && typeof world === 'string' && world.trim() !== '') {
                query = query.eq('world', world);
            }

            const { data, error } = await query;

            if (error) throw error;

            return {
                success: true,
                data: data || [],
                message: `${data?.length || 0} personagens encontrados`
            };
        } catch (error) {
            console.error('❌ Erro ao buscar personagens:', error);
            return {
                success: false,
                error: error.message,
                message: 'Erro ao buscar personagens'
            };
        }
    }

    /**
     * Obter personagem específico
     */
    async getCharacter(userId, characterId) {
        try {
            const { data, error } = await this.client
                .from('characters')
                .select('*')
                .eq('id', characterId)
                .eq('user_id', userId) // Segurança: só buscar se for do usuário
                .single();

            if (error) throw error;

            return {
                success: true,
                data,
                message: 'Personagem encontrado'
            };
        } catch (error) {
            console.error('❌ Erro ao buscar personagem:', error);
            return {
                success: false,
                error: error.message,
                message: 'Personagem não encontrado'
            };
        }
    }

    /**
     * Deletar personagem
     */
    async deleteCharacter(userId, characterId) {
        try {
            const { error } = await this.client
                .from('characters')
                .delete()
                .eq('id', characterId)
                .eq('user_id', userId); // Segurança: só deletar se for do usuário

            if (error) throw error;

            return {
                success: true,
                message: 'Personagem deletado com sucesso!'
            };
        } catch (error) {
            console.error('❌ Erro ao deletar personagem:', error);
            return {
                success: false,
                error: error.message,
                message: 'Erro ao deletar personagem'
            };
        }
    }

    // ==================== UTILITIES ====================

    /**
     * Verificar se o banco está acessível
     */
    async testConnection() {
        try {
            // Teste mais rápido usando apenas uma query simples
            const { data, error } = await this.client
                .from('profiles')
                .select('id')
                .limit(1)
                .single();

            // Não importa se não há dados, só se a query funciona
            if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
                throw error;
            }

            return {
                success: true,
                message: 'Conexão com banco OK!'
            };
        } catch (error) {
            console.error('❌ Erro de conexão:', error);
            return {
                success: false,
                error: error.message,
                message: 'Erro de conexão com banco'
            };
        }
    }

    /**
     * Migrar dados do localStorage para Supabase
     */
    async migrateLocalCharacters(userId) {
        try {
            // Obter personagens do localStorage
            const localCharacters = JSON.parse(localStorage.getItem('rpg_characters') || '[]');
            
            if (localCharacters.length === 0) {
                return {
                    success: true,
                    migrated: 0,
                    message: 'Nenhum personagem local para migrar'
                };
            }

            let migratedCount = 0;
            const errors = [];

            // Migrar cada personagem
            for (const character of localCharacters) {
                try {
                    const result = await this.saveCharacter(userId, {
                        name: character.name,
                        race: character.race,
                        class: character.class,
                        alignment: character.alignment,
                        world: character.world || 'tormenta',
                        attributes: character.attributes || {},
                        background: character.background || ''
                    });

                    if (result.success) {
                        migratedCount++;
                    } else {
                        errors.push(`${character.name}: ${result.message}`);
                    }
                } catch (error) {
                    errors.push(`${character.name}: ${error.message}`);
                }
            }

            return {
                success: true,
                migrated: migratedCount,
                total: localCharacters.length,
                errors,
                message: `${migratedCount}/${localCharacters.length} personagens migrados`
            };
        } catch (error) {
            console.error('❌ Erro na migração:', error);
            return {
                success: false,
                error: error.message,
                message: 'Erro ao migrar personagens'
            };
        }
    }
}

// Exportar instância única
export const supabaseDB = new SupabaseDatabase(); 