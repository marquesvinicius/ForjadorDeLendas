# 🔗 Integração Backend + Frontend

Documentação sobre a integração do backend Flask com o frontend do Forjador de Lendas.

## 📋 Resumo da Integração

A integração conecta o frontend JavaScript com o backend Flask para geração avançada de histórias usando Google Gemini AI.

### ✅ O que foi implementado:

1. **Backend Flask** (`/backend`)
   - API REST para geração de histórias
   - Integração com Google Gemini AI
   - Configuração para deploy no Render.com
   - Scripts de desenvolvimento e configuração

2. **API Configuration** (`js/apiConfig.js`)
   - Configuração centralizada de URLs
   - Detecção automática de ambiente (desenvolvimento/produção)
   - Sistema de fallback para histórias locais
   - Tratamento robusto de erros

3. **Frontend Integration**
   - Atualização da função `fetchBackstoryFromLocal()` no `app.js`
   - Carregamento automático da configuração da API
   - Fallback gracioso quando backend não está disponível

4. **Scripts de Automação**
   - `scripts/setup_backend.bat` (Windows)
   - `scripts/setup_backend.sh` (Linux/Mac)
   - `backend/run_dev.py` (Desenvolvimento)

## 🗂️ Estrutura de Arquivos

```
project/
├── backend/                 # 🆕 Backend Flask
│   ├── generate_story.py    # Aplicação principal
│   ├── requirements.txt     # Dependências Python
│   ├── render.yaml         # Deploy config
│   ├── run_dev.py          # Script de desenvolvimento
│   ├── .env.example        # Template de ambiente
│   ├── .gitignore          # Git ignore específico
│   └── README.md           # Documentação do backend
│
├── js/
│   ├── apiConfig.js        # 🆕 Configuração da API
│   └── app.js              # ✏️ Atualizado para usar nova API
│
├── scripts/                # 🆕 Scripts de automação
│   ├── setup_backend.bat   # Setup Windows
│   └── setup_backend.sh    # Setup Linux/Mac
│
└── package.json            # ✏️ Adicionados scripts do backend
```

## 🚀 Como Usar

### Opção 1: Frontend apenas (Modo básico)
```bash
# Executa apenas o frontend com histórias locais
npm run serve
# ou
python -m http.server 3000
```

### Opção 2: Backend + Frontend (Modo completo)
```bash
# 1. Configure o backend (primeira vez)
npm run backend:install
cd backend && cp .env.example .env
# Edite .env e adicione sua GEMINI_API_KEY

# 2. Execute backend e frontend juntos
npm run fullstack
```

### Opção 3: Setup automatizado
```bash
# Windows
scripts/setup_backend.bat

# Linux/Mac  
./scripts/setup_backend.sh
```

## 🔧 Configuração da API

### Detecção de Ambiente

A configuração da API (`js/apiConfig.js`) detecta automaticamente o ambiente:

```javascript
BASE_URL: window.location.hostname === 'localhost' 
    ? 'http://localhost:5000'        // Desenvolvimento
    : 'https://forjador-backend.onrender.com'  // Produção
```

### Sistema de Fallback

Se o backend não estiver disponível, o sistema:
1. Tenta conectar à API
2. Se falha, usa templates locais de história
3. Exibe notificação informativa ao usuário
4. Mantém toda funcionalidade do frontend

### Teste de Conectividade

```javascript
// Teste manual da API
await API_CONFIG.testConnection();
console.log('Backend online:', API_CONFIG.isOnline);

// Geração de história
const historia = await API_CONFIG.generateStory("Prompt personalizado");
```

## 📡 Endpoints da API

### GET /ping
Verifica se o backend está online.

**Resposta:**
```json
{
  "status": "alive",
  "message": "Servidor está ativo"
}
```

### POST /generate
Gera história usando Google Gemini AI.

**Request:**
```json
{
  "prompt": "Crie uma backstory para um mago élfico..."
}
```

**Response:**
```json
{
  "backstory": "História gerada pelo Gemini AI..."
}
```

## 🔒 Variáveis de Ambiente

### Backend (.env)
```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

### Como obter Gemini API Key:
1. Acesse: https://makersuite.google.com/app/apikey
2. Crie uma nova chave da API
3. Copie e cole no arquivo `.env`

## 🚀 Deploy

### Frontend
- Permanece sendo um site estático
- Pode ser hospedado em GitHub Pages, Netlify, Vercel, etc.

### Backend
- Configurado para deploy automático no Render.com
- Arquivo `render.yaml` define a configuração
- Variáveis de ambiente definidas no painel do Render

### Produção
Quando ambos estão no ar:
- Frontend detecta automaticamente o backend
- URLs são configuradas para produção
- Fallback local ainda funciona como backup

## 🧪 Testes

### Teste do Backend Local
```bash
# Terminal 1: Iniciar backend
cd backend
python run_dev.py

# Terminal 2: Testar endpoints
curl http://localhost:5000/ping
curl -X POST http://localhost:5000/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Teste de história"}'
```

### Teste da Integração
1. Execute `npm run fullstack`
2. Abra `http://localhost:3000`
3. Crie um personagem e gere história
4. Verifique logs no console do navegador

## 🔍 Troubleshooting

### Backend não conecta
1. Verifique se está rodando: `npm run backend:ping`
2. Confirme a GEMINI_API_KEY no .env
3. Verifique logs: terminal do backend

### Histórias não são geradas
1. Console do navegador mostra erros?
2. Backend está retornando erros? (logs)
3. API Key válida e com créditos?

### Fallback sempre ativo
1. URLs corretas no `apiConfig.js`?
2. CORS configurado no backend?
3. Firewall bloqueando conexão?

## 📊 Monitoramento

### Logs úteis:
```javascript
// No console do navegador
console.log('Backend status:', API_CONFIG.isOnline);
console.log('API Base URL:', API_CONFIG.BASE_URL);

// Testa conectividade
API_CONFIG.testConnection().then(console.log);
```

### Scripts de monitoramento:
```bash
# Status do backend
npm run backend:ping

# Logs do desenvolvimento
npm run backend:dev  # Veja logs em tempo real
```

## 🎯 Próximos Passos

### Melhorias possíveis:
1. **Cache de histórias** - Evitar regenerar histórias idênticas
2. **Rate limiting** - Controle de requisições por usuário  
3. **Métricas** - Analytics de uso da API
4. **Autenticação** - Chaves de API para usuários
5. **Websockets** - Histórias em tempo real
6. **Batch processing** - Múltiplas histórias simultâneas

### Estrutura para expansão:
```
backend/
├── api/              # Múltiplos endpoints
├── services/         # Lógica de negócio  
├── models/           # Modelos de dados
├── tests/            # Testes automatizados
└── utils/            # Utilitários
```

## 🤝 Contribuindo

Para contribuir com melhorias na integração:

1. **Backend**: Edite arquivos em `/backend`
2. **API Config**: Modifique `js/apiConfig.js`
3. **Frontend**: Atualize `js/app.js`
4. **Docs**: Mantenha esta documentação atualizada

## 📚 Referências

- [Flask Documentation](https://flask.palletsprojects.com/)
- [Google Gemini AI](https://ai.google.dev/)
- [Render.com Deploy](https://render.com/docs)
- [CORS em Flask](https://flask-cors.readthedocs.io/) 