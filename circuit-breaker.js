/**
 * Circuit Breaker - Previne loops infinitos de tentativas de API
 * Pausa tentativas quando há muitas falhas consecutivas
 */

export class CircuitBreaker {
    constructor(options = {}) {
        this.failureThreshold = options.failureThreshold || 5;
        this.resetTimeout = options.resetTimeout || 60000; // 1 minuto
        this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
        this.failureCount = 0;
        this.lastFailureTime = null;
        this.name = options.name || 'CircuitBreaker';
    }

    /**
     * Executa uma função com proteção de circuit breaker
     */
    async execute(operation) {
        if (this.state === 'OPEN') {
            if (this.shouldAttemptReset()) {
                this.state = 'HALF_OPEN';
                console.log(`🔄 ${this.name}: Tentando reabrir circuit...`);
            } else {
                const error = new Error(`Circuit breaker is OPEN for ${this.name}`);
                error.circuitBreakerOpen = true;
                throw error;
            }
        }

        try {
            const result = await operation();
            this.onSuccess();
            return result;
        } catch (error) {
            this.onFailure();
            throw error;
        }
    }

    /**
     * Registra uma operação bem-sucedida
     */
    onSuccess() {
        this.failureCount = 0;
        this.state = 'CLOSED';
        console.log(`✅ ${this.name}: Circuit fechado (sucesso)`);
    }

    /**
     * Registra uma falha
     */
    onFailure() {
        this.failureCount++;
        this.lastFailureTime = Date.now();

        if (this.failureCount >= this.failureThreshold) {
            this.state = 'OPEN';
            console.warn(`🚨 ${this.name}: Circuit ABERTO (${this.failureCount} falhas). Pausando tentativas por ${this.resetTimeout/1000}s`);
        } else {
            console.warn(`⚠️ ${this.name}: Falha ${this.failureCount}/${this.failureThreshold}`);
        }
    }

    /**
     * Verifica se deve tentar reabrir o circuit
     */
    shouldAttemptReset() {
        return Date.now() - this.lastFailureTime > this.resetTimeout;
    }

    /**
     * Força o circuit a fechar (para testes ou reset manual)
     */
    forceClose() {
        this.state = 'CLOSED';
        this.failureCount = 0;
        this.lastFailureTime = null;
        console.log(`🔧 ${this.name}: Circuit forçado a fechar`);
    }

    /**
     * Retorna o status atual
     */
    getStatus() {
        return {
            state: this.state,
            failureCount: this.failureCount,
            lastFailureTime: this.lastFailureTime,
            name: this.name
        };
    }
}

// Instâncias globais para diferentes serviços
export const supabaseCircuitBreaker = new CircuitBreaker({
    name: 'Supabase',
    failureThreshold: 3,
    resetTimeout: 30000 // 30 segundos
});

export const backendCircuitBreaker = new CircuitBreaker({
    name: 'Backend',
    failureThreshold: 2,
    resetTimeout: 60000 // 1 minuto
});

export const authCircuitBreaker = new CircuitBreaker({
    name: 'Auth',
    failureThreshold: 5,
    resetTimeout: 120000 // 2 minutos
}); 