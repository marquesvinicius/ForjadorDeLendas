/**
 * Helper para facilitar autenticação de teste
 * Permite usar emails fake para desenvolvimento
 */

import { supabaseAuth } from './supabase.js';

export class AuthHelper {
    
    /**
     * Criar conta de teste facilmente
     */
    static async createTestAccount(username, password = '123456') {
        const email = `${username}@test.com`;
        
        try {
            console.log(`🧪 Criando conta de teste: ${email}`);
            
            const result = await supabaseAuth.signUp(email, password, {
                username: username,
                full_name: username.charAt(0).toUpperCase() + username.slice(1)
            });
            
            if (result.success) {
                console.log(`✅ Conta criada: ${email} / ${password}`);
                return {
                    success: true,
                    email,
                    password,
                    message: `Conta criada: ${email} / ${password}`
                };
            } else {
                return result;
            }
        } catch (error) {
            console.error('❌ Erro ao criar conta de teste:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Login rápido com username (converte para email)
     */
    static async quickLogin(username, password = '123456') {
        const email = `${username}@test.com`;
        
        try {
            console.log(`🚀 Login rápido: ${username}`);
            
            const result = await supabaseAuth.signIn(email, password);
            return result;
        } catch (error) {
            console.error('❌ Erro no login rápido:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Contas pré-definidas para facilitar testes
     */
    static getTestAccounts() {
        return [
            { username: 'admin', email: 'admin@test.com', password: '123456' },
            { username: 'forjador', email: 'forjador@test.com', password: '123456' },
            { username: 'mestre', email: 'mestre@test.com', password: '123456' },
            { username: 'jogador', email: 'jogador@test.com', password: '123456' }
        ];
    }

    /**
     * Criar todas as contas de teste de uma vez
     */
    static async setupTestAccounts() {
        const accounts = this.getTestAccounts();
        const results = [];
        
        for (const account of accounts) {
            const result = await this.createTestAccount(account.username, account.password);
            results.push({
                username: account.username,
                email: account.email,
                password: account.password,
                success: result.success,
                message: result.message
            });
            
            // Aguardar um pouco entre criações
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        return results;
    }
}

// Adicionar ao window para uso no console
if (typeof window !== 'undefined') {
    window.AuthHelper = AuthHelper;
} 