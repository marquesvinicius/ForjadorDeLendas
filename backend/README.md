# RPG Character Maker - Backend

Backend Flask para geração de backstories de personagens RPG usando Google Gemini AI.

## Configuração

### Pré-requisitos
- Python 3.8+
- Pip

### Instalação Local

1. Navegue até o diretório do backend:
```bash
cd backend
```

2. Instale as dependências:
```bash
pip install -r requirements.txt
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o arquivo .env e adicione sua chave da API do Gemini
```

4. Execute o servidor:
```bash
python generate_story.py
```

O servidor estará disponível em `http://localhost:5000`

## Endpoints

### GET /ping
Endpoint para verificar se o servidor está ativo.

**Resposta:**
```json
{
  "status": "alive",
  "message": "Servidor está ativo"
}
```

### POST /generate
Gera uma backstory para um personagem baseada no prompt fornecido.

**Corpo da requisição:**
```json
{
  "prompt": "Seu prompt para geração da backstory"
}
```

**Resposta de sucesso:**
```json
{
  "backstory": "Backstory gerada pelo Gemini AI"
}
```

**Resposta de erro:**
```json
{
  "error": "Mensagem de erro"
}
```

## Deploy

O backend está configurado para deploy no Render.com usando o arquivo `render.yaml`.

### Variáveis de Ambiente para Produção
- `GEMINI_API_KEY`: Sua chave da API do Google Gemini

## Desenvolvimento

### Estrutura do Projeto
```
backend/
├── generate_story.py    # Aplicação Flask principal
├── requirements.txt     # Dependências Python
├── render.yaml         # Configuração de deploy
├── .env.example        # Exemplo de variáveis de ambiente
└── README.md          # Esta documentação
```

### Testando a API

Você pode testar a API usando curl ou qualquer cliente HTTP:

```bash
# Teste de saúde
curl http://localhost:5000/ping

# Geração de backstory
curl -X POST http://localhost:5000/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Crie uma backstory para um mago élfico"}'
``` 