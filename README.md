# Forjador de Lendas

Bem-vindo ao **Forjador de Lendas**, um gerador de personagens para o sistema de RPG **Tormenta 20**, ambientado no rico mundo de **Arton**. Este projeto permite criar heróis épicos com raças, classes, atributos e histórias de fundo geradas automaticamente, tudo envolto em uma interface com temática medieval e um mago companion interativo que guia o usuário.

## ✨ Funcionalidades
- **Seleção de Raças e Classes:** Escolha entre as 17 raças e 14 classes oficiais de Tormenta 20.
- **Geração de Atributos:** Role os dados (4d6, descartando o menor) para criar atributos únicos.
- **Histórias Automáticas:** Gere histórias de fundo baseadas nas escolhas do usuário, com referências ao lore de Arton.
- **Mago Companion:** Um assistente virtual que reage às escolhas do jogador com falas temáticas.
- **Interface Medieval:** Design inspirado em fantasia, com névoa, painéis rústicos e ícones personalizados.
- **Salvamento Local:** Armazene seus personagens no `localStorage` do navegador.
- **Modal Dinâmico:** Visualize detalhes dos personagens e edite ou exclua com facilidade.

## 🛠️ Tecnologias Utilizadas
- **HTML5:** Estrutura da página.
- **CSS3:** Estilização com Bulma CSS, Font Awesome e animações personalizadas.
- **JavaScript:** Lógica interativa, incluindo geração de histórias e manipulação do DOM.
- **LocalStorage:** Persistência de dados no navegador.

## 📋 Pré-requisitos
- Um navegador moderno (Chrome, Firefox, Edge, etc.).
- Nenhum servidor é necessário; o projeto roda localmente no cliente.

## 🚀 Como Executar
1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/forjador-de-lendas.git
   ```
2. Abra o arquivo `index.html` em um navegador:
   - No Windows: clique com o botão direito no arquivo e selecione "Abrir com" > seu navegador.
   - Ou arraste o arquivo para uma aba do navegador.
3. Comece a criar seus heróis!

## 📂 Estrutura do Projeto
```
forjador-de-lendas/
│
├── assets/
│   ├── img/              # Imagens do projeto (fundo, mago companion, etc.)
│   └── ...               # Outros assets
├── css/
│   ├── reset.css         # Reset de estilos
│   └── style.css         # Estilos personalizados
├── js/
│   ├── app.js            # Lógica principal do gerador
│   ├── companion.js      # Lógica do mago companion
│   └── storage.js        # Gerenciamento de armazenamento local
├── index.html            # Página principal
└── README.md             # Este arquivo
```

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
