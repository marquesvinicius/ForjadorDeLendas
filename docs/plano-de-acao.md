# 🧭 Plano de Ação — Forjador de Lendas

Organizado por prioridade e complexidade para facilitar a execução incremental no Cursor e GitHub.

---

## ✅ 1. Alta Prioridade / Baixa Complexidade

### 🔹 Limpeza do Repositório
- [ ] Remover diretórios `__pycache__`, arquivos `.DS_Store`, `.log`, e arquivos JS compilados.
- [ ] Deletar arquivos não utilizados da pasta `assets/`.

### 🔹 Documentação
- [ ] Atualizar `README.md` com:
  - Instruções de execução local
  - Dependências do `package.json`
  - Orientações para uso do novo **Seletor de Mundos**
  - Como alterar o tema e aplicar o `themeManager`

### 🔹 Otimização de Imagens
- [ ] Converter imagens de `assets/img/` para formato `.webp` sempre que possível.
- [ ] Atualizar caminhos no HTML/CSS após conversão.

### 🔹 Pequenos Ajustes no Código
- [ ] Criar arquivo `config.js` para armazenar URLs e chaves (ex: `BASE_API_URL`).
- [ ] Melhorar `fetchBackstoryFromLocal()` com mensagens de erro amigáveis e logs mais claros.

---

## ⚙️ 2. Prioridade Média / Complexidade Moderada

### 🔹 Padronização de Estilo
- [ ] Configurar ESLint com regras básicas para JS moderno.
- [ ] Adicionar Prettier para formatação automática.
- [ ] Incluir scripts no `package.json` (lint, format).

### 🔹 Testes Automatizados
- [ ] Instalar Jest.
- [ ] Criar testes unitários para:
  - Rolagem de atributos (`rollAttributes`)
  - Armazenamento com `CharacterStorage`

### 🔹 Modularização e Bundler
- [ ] Refatorar JS para `import/export` usando ES6.
- [ ] Avaliar e integrar Vite ou Webpack como bundler.
- [ ] Separar arquivos por `core/`, `ui/`, `logic/`.

### 🔹 Autenticação e Login
- [ ] Criar página ou modal de login com tema medieval.
- [ ] Armazenar token no `localStorage` ou `cookie`.
- [ ] Redirecionar para a aplicação após login.

### 🔹 Migração para API
- [ ] Refatorar `CharacterStorage` para usar API (`fetch` ou `axios`).
- [ ] Criar funções `getCharacters()`, `saveCharacter()`, `deleteCharacter()`.

### 🔹 Integração do Backend ao Monorepo
- [ ] Mover/copiar o conteúdo do repositório `forjador-backend` para uma subpasta no repositório principal (ex: `/backend`).
- [ ] Ajustar caminhos e `package.json` para funcionar em subdiretório.
- [ ] Atualizar `.env`, se necessário, e documentar no `README.md`.
- [ ] Atualizar URL base do frontend para `/backend` localmente e para o domínio do Render no deploy.

---

## 🚀 3. Longo Prazo / Maior Complexidade

### 🔹 Backend e Persistência
- [ ] Criar backend com Node.js + Express (ou FastAPI).
- [ ] Banco de dados PostgreSQL (ou Supabase).
- [ ] Implementar:
  - Cadastro e login com JWT
  - Rotas REST CRUD para personagens

### 🔹 Progressive Web App (PWA)
- [ ] Adicionar service worker para cache offline.
- [ ] Cachear imagens, fontes e JS base.
- [ ] Incluir `manifest.json` e ícones da aplicação.

### 🔹 Acessibilidade e Experiência
- [ ] Melhorar semântica HTML (`aria-label`, `role`, cabeçalhos).
- [ ] Testar suporte a leitores de tela.
- [ ] Adicionar temas acessíveis (alto contraste, dislexia, etc).

---

📁 **Sugestão**: Salve este arquivo como `docs/plano-de-acao.md` e vincule às issues e PRs do GitHub para controle de progresso.