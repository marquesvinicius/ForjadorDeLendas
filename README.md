# 🧙‍♂️ Forjador de Lendas

Bem-vindo ao **Forjador de Lendas**, um gerador de personagens para múltiplos sistemas de RPG, incluindo **Tormenta 20**, **D&D 5e** e **Ordem Paranormal**. Este projeto permite criar heróis épicos com raças, classes, atributos e histórias de fundo geradas automaticamente, tudo envolto em uma interface com temática medieval e um mago companion interativo que guia o usuário.

## ✨ Funcionalidades
- **🌍 Seletor de Mundos:** Alternar entre diferentes sistemas de RPG (Tormenta 20, D&D 5e, Ordem Paranormal).
- **🎭 Seleção de Raças e Classes:** Escolha entre raças e classes específicas de cada sistema.
- **🎲 Geração de Atributos:** Role os dados (4d6, descartando o menor) para criar atributos únicos.
- **📚 Histórias Automáticas:** Gere histórias de fundo baseadas nas escolhas do usuário, com referências ao lore específico de cada mundo.
- **🧙‍♂️ Mago Companion:** Um assistente virtual que reage às escolhas do jogador com falas temáticas.
- **🎨 Sistema de Temas:** Múltiplos temas visuais com `themeManager` integrado.
- **🗂️ Salvamento Local:** Armazene seus personagens no `localStorage` do navegador.
- **📱 Interface Responsiva:** Design otimizado para desktop e mobile.
- **🔍 Modal Dinâmico:** Visualize detalhes dos personagens e edite ou exclua com facilidade.

## 🛠️ Tecnologias Utilizadas
- **HTML5:** Estrutura da página.
- **CSS3:** Estilização com Bulma CSS, Font Awesome e animações personalizadas.
- **JavaScript:** Lógica interativa, incluindo geração de histórias e manipulação do DOM.
- **LocalStorage:** Persistência de dados no navegador.

## 📋 Pré-requisitos
- Um navegador moderno (Chrome, Firefox, Edge, etc.).
- Nenhum servidor é necessário; o projeto roda localmente no cliente.

## 🚀 Como Executar Localmente

### Opção 1: Execução Simples (Recomendado)
1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/forjador-de-lendas.git
   cd forjador-de-lendas
   ```

2. Abra o arquivo `index.html` em um navegador:
   - **Windows:** Clique com o botão direito no arquivo e selecione "Abrir com" > seu navegador
   - **macOS/Linux:** `open index.html` ou arraste o arquivo para uma aba do navegador
   - **Qualquer SO:** Arraste o arquivo `index.html` para uma aba do navegador

### Opção 2: Servidor Local (Para desenvolvimento)
```bash
# Com Python 3
python -m http.server 8000

# Com Node.js (se tiver instalado)
npx serve .

# Com PHP
php -S localhost:8000
```

Depois acesse: `http://localhost:8000`

## 📦 Dependências

### Dependências do Frontend (`package.json`)
O projeto utiliza as seguintes dependências para desenvolvimento e otimização:

```json
{
  "devDependencies": {
    "@babel/core": "^7.22.0",
    "@babel/preset-env": "^7.22.0",
    "eslint": "^8.42.0",
    "prettier": "^2.8.8"
  }
}
```

**Para instalar as dependências de desenvolvimento:**
```bash
npm install
```

### CDNs Utilizadas (já incluídas no HTML)
- **Bulma CSS:** Framework CSS para interface responsiva
- **Font Awesome:** Ícones
- **Google Fonts:** Fontes personalizadas (Cinzel, etc.)

## 🌍 Como Usar o Seletor de Mundos

### Mudando de Sistema de RPG
1. **Clique no seletor** no topo da página (exibe o mundo atual)
2. **Escolha um mundo:**
   - **🐉 Tormenta 20:** Sistema brasileiro com o mundo de Arton
   - **⚔️ D&D 5e:** Sistema clássico de Dungeons & Dragons
   - **👁️ Ordem Paranormal:** Sistema brasileiro de investigação sobrenatural

### Cada mundo possui:
- **Raças únicas:** Adaptadas ao lore específico
- **Classes específicas:** Balanceadas para o sistema
- **Histórias contextualizadas:** Referências ao mundo escolhido
- **Temas visuais:** Paleta de cores e atmosfera específicas

### Persistência
- Sua escolha de mundo é **salva automaticamente**
- Personagens são **organizados por mundo**
- Ao retornar, o último mundo usado será carregado

## 🎨 Sistema de Temas e ThemeManager

### Alterando Temas
O projeto possui um sistema de temas dinâmico gerenciado pelo `themeManager.js`:

```javascript
// Temas disponíveis
const temas = ['medieval', 'dark', 'light', 'mystical'];

// Para mudar tema programaticamente
ThemeManager.setTheme('dark');

// Para obter tema atual
const temaAtual = ThemeManager.getCurrentTheme();
```

### Temas Disponíveis
- **🏰 Medieval (Padrão):** Tons terrosos, atmosfera de fantasia medieval
- **🌙 Dark:** Tema escuro para sessões noturnas
- **☀️ Light:** Tema claro e limpo
- **✨ Mystical:** Cores místicas com tons de roxo e azul

### Personalização
1. **CSS Customizado:** Edite `css/variables.css` para criar novos temas
2. **ThemeManager:** Adicione novos temas em `js/themeManager.js`
3. **Persistência:** Temas são salvos automaticamente no `localStorage`

### Exemplo de Novo Tema
```css
/* css/variables.css */
[data-theme="meu-tema"] {
    --primary-color: #your-color;
    --background-color: #your-bg;
    --text-color: #your-text;
}
```

## 📂 Estrutura do Projeto
```
forjador-de-lendas/
│
├── assets/
│   └── img/              # Imagens organizadas por mundo (dnd/, tormenta/, ordem-paranormal/)
│       ├── dnd/          # Assets específicos do D&D
│       ├── tormenta/     # Assets específicos do Tormenta 20
│       ├── ordem-paranormal/ # Assets específicos da Ordem Paranormal
│       └── logo-forjador-de-lendas.png
│
├── css/                  # Estilos modularizados
│   ├── reset.css         # Reset de estilos
│   ├── variables.css     # Variáveis CSS para temas
│   ├── base.css          # Estilos base
│   ├── buttons.css       # Estilos dos botões
│   ├── forms.css         # Estilos dos formulários
│   ├── modals.css        # Estilos dos modais
│   ├── responsive.css    # Media queries
│   ├── world-selector.css # Estilos do seletor de mundos
│   ├── character-*.css   # Estilos específicos dos componentes
│   └── ...
│
├── js/                   # Scripts modularizados
│   ├── config.js         # ⭐ Configurações centralizadas
│   ├── app.js            # Lógica principal do gerador
│   ├── companion.js      # Lógica do mago companion
│   ├── storage.js        # Gerenciamento de localStorage
│   ├── worldManager.js   # Gerenciamento de mundos
│   ├── worldSelector.js  # Interface do seletor
│   ├── worldsConfig.js   # Configurações dos mundos
│   ├── themeManager.js   # ⭐ Gerenciamento de temas
│   └── themes.js         # Definições dos temas
│
├── docs/                 # Documentação
│   └── plano-de-acao.md  # Este plano que estamos seguindo
│
├── index.html            # Página principal
├── package.json          # Dependências do projeto
├── .gitignore           # Arquivos ignorados pelo Git
└── README.md            # Este arquivo
```

**⭐ = Arquivos criados/melhorados nesta implementação**

## 🎲 Exemplos de Uso
- Escolha "Elfo" como raça e "Arcanista" como classe, clique em "Rolar Atributos" e depois em "Gerar História". Veja o mago reagir e uma história surgir, como: *"Nascido nas florestas de Lenórienn, [nome] domina os segredos da magia na Academia Arcana de Yuden."*
- Salve seu personagem e visualize-o na seção "Seus Heróis".

## 🌟 Contribuições
Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests com melhorias, como:
- Adicionar mais raças ou classes customizadas.
- Integrar uma API de IA para histórias mais complexas.
- Melhorar a responsividade para dispositivos móveis.

1. Fork o repositório.
2. Crie uma branch para sua feature (`git checkout -b feature/nova-ideia`).
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`).
4. Push para o branch (`git push origin feature/nova-ideia`).
5. Abra um Pull Request.

## 📜 Licença
Este projeto é licenciado sob a [MIT License](LICENSE). Sinta-se livre para usar, modificar e distribuir!

## 🧙‍♂️ Créditos
- **Desenvolvido por:** Marques
- **Inspiração:** Universo de Tormenta 20, criado pela Jambô Editora.
- **Apoio:** Comunidade de RPG brasileira.

## 📩 Contato
Dúvidas ou sugestões? Entre em contato comigo em [marquesviniciusmelomartins@gmail.com](mailto:marquesviniciusmelomartins@gmail.com) ou abra uma issue no GitHub!

---

**Forje sua lenda e que os deuses de Arton guiem seus passos!**
