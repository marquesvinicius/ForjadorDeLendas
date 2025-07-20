/**
 * Configurações da API Backend
 * Centraliza URLs e configurações para comunicação com o servidor Flask
 */

const API_CONFIG = {
    // URL base do backend - muda conforme o ambiente
    BASE_URL: window.location.hostname === 'localhost' 
        ? 'http://localhost:5000'  // Desenvolvimento local
        : 'https://forjador-backend.onrender.com', // Produção no Render
    
    // Endpoints disponíveis
    ENDPOINTS: {
        PING: '/ping',
        GENERATE_STORY: '/generate'
    },
    
    // Configurações de requisição
    REQUEST_CONFIG: {
        timeout: 30000, // 30 segundos
        headers: {
            'Content-Type': 'application/json'
        }
    },
    
    // Status da conexão
    isOnline: false,
    
    /**
     * Testa a conectividade com o backend
     * @returns {Promise<boolean>} True se o backend estiver online
     */
    async testConnection() {
        try {
            const response = await fetch(`${this.BASE_URL}${this.ENDPOINTS.PING}`, {
                method: 'GET',
                signal: AbortSignal.timeout(5000) // 5 segundos para teste
            });
            
            if (response.ok) {
                const data = await response.json();
                this.isOnline = data.status === 'alive';
                return this.isOnline;
            }
            
            throw new Error(`HTTP ${response.status}`);
            
        } catch (error) {
            console.log('Backend não disponível:', error.message);
            this.isOnline = false;
            return false;
        }
    },
    
    /**
     * Gera uma história usando o backend
     * @param {string} prompt - Prompt para geração da história
     * @returns {Promise<string>} História gerada ou fallback
     */
    async generateStory(prompt) {
        try {
            const response = await fetch(`${this.BASE_URL}${this.ENDPOINTS.GENERATE_STORY}`, {
                method: 'POST',
                headers: this.REQUEST_CONFIG.headers,
                body: JSON.stringify({ prompt }),
                signal: AbortSignal.timeout(this.REQUEST_CONFIG.timeout)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error);
            }
            
            return data.backstory || 'História não pôde ser gerada.';
            
        } catch (error) {
            console.error('Erro ao gerar história via API:', error);
            
            // Fallback para histórias locais se a API falhar
            console.log('Usando geração local como fallback...');
            return this.generateLocalFallback(prompt);
        }
    },
    
    /**
     * Fallback para geração local quando a API não está disponível
     * @param {string} prompt - Prompt original
     * @returns {string} História gerada localmente
     */
    generateLocalFallback(prompt) {
        const templates = [
            "Nascido em terras distantes, este herói carrega consigo mistérios de tempos antigos. Sua jornada o trouxe até aqui em busca de grandes aventuras.",
            "Forjado pelas adversidades da vida, este personagem desenvolveu habilidades únicas que o distinguem entre os demais. Seu destino está ligado a grandes feitos.",
            "Vindo de uma linhagem nobre, este aventureiro busca provar seu valor no mundo. Suas ações ecoarão através dos tempos como lendas.",
            "Marcado pelo destino desde jovem, este herói carrega um propósito maior. Cada passo de sua jornada o aproxima de seu verdadeiro destino."
        ];
        
        const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
        return `${randomTemplate}\n\n[História gerada localmente - Backend indisponível]`;
    }
};

// Exporta a configuração para uso global
window.API_CONFIG = API_CONFIG;

// Testa a conexão na inicialização
API_CONFIG.testConnection().then(isOnline => {
    console.log(`Backend status: ${isOnline ? 'Online' : 'Offline'}`);
    if (isOnline) {
        console.log('✅ Geração de histórias com IA disponível');
    } else {
        console.log('⚠️ Usando geração local de histórias');
    }
}).catch(error => {
    console.log('❌ Erro na inicialização do backend:', error.message);
});

// Exportação ES6 modules
export { API_CONFIG }; 