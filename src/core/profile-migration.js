/**
 * Sistema para migrar perfis existentes para Supabase Auth
 * Conecta perfis que já existem na tabela profiles com contas Auth
 */

import { supabaseAuth } from './supabase.js';
import { supabaseDB } from './supabase-db.js';

export class ProfileMigration {
    
    /**
     * Perfis existentes que precisam ser conectados
     */
    static getExistingProfiles() {
        return [
            {
                id: '25a18a33-8466-4df2-975c-272d2cd06e7c',
                username: 'admin',
                full_name: 'Administrador',
                email: 'admin@test.com',
                password: '123456'
            },
            {
                id: '73d5b936-29ae-424f-ba98-757d608575e1', 
                username: 'forjador_teste',
                full_name: 'Forjador Teste',
                email: 'forjador_teste@test.com',
                password: '123456'
            }
        ];
    }

    /**
     * Criar conta Supabase Auth para perfil existente
     */
    static async createAuthForProfile(profile) {
        try {
            console.log(`🔗 Criando conta Auth para: ${profile.username}`);
            
            // 1. Criar conta no Supabase Auth
            const authResult = await supabaseAuth.signUp(profile.email, profile.password, {
                username: profile.username,
                full_name: profile.full_name
            });
            
            if (authResult.success && authResult.user) {
                // 2. Atualizar o ID do perfil na tabela profiles para coincidir com o Auth
                const updateResult = await this.updateProfileId(profile.id, authResult.user.id);
                
                if (updateResult.success) {
                    console.log(`✅ Perfil ${profile.username} conectado com sucesso!`);
                    return {
                        success: true,
                        oldId: profile.id,
                        newId: authResult.user.id,
                        email: profile.email,
                        password: profile.password
                    };
                } else {
                    console.error(`❌ Erro ao atualizar ID do perfil: ${updateResult.error}`);
                    return updateResult;
                }
            } else {
                console.error(`❌ Erro ao criar conta Auth: ${authResult.error}`);
                return authResult;
            }
        } catch (error) {
            console.error('❌ Erro na migração de perfil:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Atualizar ID do perfil na tabela (com backup)
     */
    static async updateProfileId(oldId, newId) {
        try {
            const { data, error } = await supabaseDB.client
                .from('profiles')
                .update({ 
                    id: newId,
                    updated_at: new Date().toISOString()
                })
                .eq('id', oldId)
                .select();

            if (error) throw error;

            return {
                success: true,
                data
            };
        } catch (error) {
            console.error('❌ Erro ao atualizar ID do perfil:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Migrar todos os perfis existentes
     */
    static async migrateAllProfiles() {
        const profiles = this.getExistingProfiles();
        const results = [];
        
        console.log('🚀 Iniciando migração de perfis existentes...');
        
        for (const profile of profiles) {
            console.log(`\n📋 Migrando: ${profile.username}`);
            
            const result = await this.createAuthForProfile(profile);
            results.push({
                username: profile.username,
                email: profile.email,
                password: profile.password,
                oldId: profile.id,
                ...result
            });
            
            // Aguardar entre migrações
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
        console.log('\n📊 Resultado da migração:');
        console.table(results);
        
        return results;
    }

    /**
     * Verificar se perfil já foi migrado
     */
    static async checkMigrationStatus() {
        const profiles = this.getExistingProfiles();
        const status = [];
        
        for (const profile of profiles) {
            try {
                // Tentar fazer login
                const loginResult = await supabaseAuth.signIn(profile.email, profile.password);
                
                status.push({
                    username: profile.username,
                    email: profile.email,
                    migrated: loginResult.success,
                    status: loginResult.success ? '✅ Migrado' : '❌ Não migrado'
                });
            } catch (error) {
                status.push({
                    username: profile.username,
                    email: profile.email,
                    migrated: false,
                    status: '❌ Erro na verificação'
                });
            }
        }
        
        console.table(status);
        return status;
    }

    /**
     * Setup completo: migrar perfis + criar contas extras
     */
    static async fullSetup() {
        console.log('🚀 SETUP COMPLETO - Migrando perfis e criando contas');
        
        // 1. Verificar status atual
        console.log('\n1️⃣ Status atual:');
        await this.checkMigrationStatus();
        
        // 2. Migrar perfis existentes
        console.log('\n2️⃣ Migrando perfis existentes:');
        const migrationResults = await this.migrateAllProfiles();
        
        // 3. Resultado final
        console.log('\n✅ SETUP CONCLUÍDO!');
        console.log('\n📧 Contas disponíveis para login:');
        
        const accounts = this.getExistingProfiles().map(p => ({
            Username: p.username,
            Email: p.email,
            Password: p.password
        }));
        
        console.table(accounts);
        
        return {
            migration: migrationResults,
            accounts
        };
    }
}

// Disponibilizar no window para uso no console
if (typeof window !== 'undefined') {
    window.ProfileMigration = ProfileMigration;
} 