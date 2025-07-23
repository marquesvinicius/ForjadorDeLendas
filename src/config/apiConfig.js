/**
 * Configurações da API Backend
 * Centraliza URLs e configurações para comunicação com o servidor Flask
 */

// Detectar se estamos em ambiente local (comentado para usar Render)
const isLocalEnvironment = () => {
    // Para forçar uso do Render, sempre retorna false
    // Descomente a linha abaixo para usar servidor local
    // return true; 
    
    const hostname = window.location.hostname;
    const localHostnames = ['localhost', '127.0.0.1', '::1', 'local'];
    const isLocal = localHostnames.includes(hostname) || hostname.startsWith('192.168.') || hostname.startsWith('10.');
    
    console.log('🔍 Detectando ambiente:');
    console.log('   Hostname atual:', hostname);
    console.log('   É ambiente local?', isLocal);
    console.log('   Usando servidor:', isLocal ? 'Local' : 'Render');
    
    // Forçar uso do Render sempre
    return false;
};

export const API_CONFIG = {
    // URL base do backend - usando Render
    BASE_URL: isLocalEnvironment()
        ? 'http://localhost:5000'  // Desenvolvimento local (desabilitado)
        : 'https://forjadordelendas.onrender.com', // Produção no Render

    // Endpoints disponíveis
    ENDPOINTS: {
        PING: '/ping',
        GENERATE_STORY: '/generate'
    },

    // Configurações de requisição
    REQUEST_CONFIG: {
        timeout: 60000, // 60 segundos para Render (pode ser mais lento)
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
        console.log('🔗 Testando conexão com:', `${this.BASE_URL}${this.ENDPOINTS.PING}`);
        try {
            const response = await fetch(`${this.BASE_URL}${this.ENDPOINTS.PING}`, {
                method: 'GET',
                signal: AbortSignal.timeout(10000) // 10 segundos para Render
            });

            if (response.ok) {
                const data = await response.json();
                this.isOnline = data.status === 'alive';
                console.log('✅ Backend respondeu:', data);
                return this.isOnline;
            }

            throw new Error(`HTTP ${response.status}`);

        } catch (error) {
            console.log('❌ Backend não disponível:', error.message);
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
        console.log('🎯 Enviando requisição para:', `${this.BASE_URL}${this.ENDPOINTS.GENERATE_STORY}`);
        try {
            const response = await fetch(`${this.BASE_URL}${this.ENDPOINTS.GENERATE_STORY}`, {
                method: 'POST',
                headers: this.REQUEST_CONFIG.headers,
                body: JSON.stringify({ prompt }),
                signal: AbortSignal.timeout(this.REQUEST_CONFIG.timeout)
            });

            console.log('📡 Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Erro do servidor:', errorText);
                throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
            }

            const data = await response.json();
            console.log('✅ Resposta recebida do Render');

            if (data.error) {
                throw new Error(data.error);
            }

            return data.backstory || 'História não pôde ser gerada.';

        } catch (error) {
            console.error('❌ Erro ao gerar história via API:', error);

            // Fallback para histórias locais se a API falhar
            console.log('🔄 Usando geração local como fallback...');
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
console.log('🚀 Inicializando API_CONFIG...');
console.log('🔗 URL do backend:', API_CONFIG.BASE_URL);

API_CONFIG.testConnection().then(isOnline => {
    console.log(`📊 Backend status: ${isOnline ? 'Online' : 'Offline'}`);
    if (isOnline) {
        console.log('✅ Geração de histórias com IA disponível no Render');
    } else {
        console.log('⚠️ Render offline - usando geração local de histórias');
    }
}).catch(error => {
    console.log('❌ Erro na inicialização do backend:', error.message);
});

// Exportar a configuração para uso global
window.API_CONFIG = API_CONFIG; 