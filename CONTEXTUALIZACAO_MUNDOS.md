# Contextualização de Mundos - Forjador de Lendas

## Funcionalidades Implementadas

### Sistema de Mundos Contextuais

O Forjador de Lendas agora suporta múltiplos sistemas de RPG com contexto completo:

#### 🌟 **Mundos Disponíveis:**
1. **Tormenta 20** - Mundo de Arton
2. **D&D 5e** - Reinos Esquecidos (Faerûn) 
3. **Ordem Paranormal** - Brasil contemporâneo com elementos sobrenaturais

### 🎭 **Funcionalidades Contextuais:**

#### **1. Raças e Classes Dinâmicas**
- As opções de raça e classe mudam automaticamente baseadas no mundo selecionado
- **Tormenta 20**: 17 raças (Humano, Anão, Dahllan, Elfo, etc.) e 14 classes
- **D&D 5e**: 9 raças clássicas (Humano, Anão, Elfo, Halfling, etc.) e 12 classes
- **Ordem Paranormal**: Apenas humanos com 3 classes (Combatente, Especialista, Ocultista)

#### **2. Atributos Contextuais**
- **Tormenta 20 & D&D 5e**: Força, Destreza, Constituição, Inteligência, Sabedoria, Carisma
- **Ordem Paranormal**: Força, Agilidade, Intelecto, Presença, Vigor

#### **3. Mago Companion Inteligente**
O mago companion agora fala de forma contextual para cada mundo:

**Exemplos de falas para D&D 5e:**
- Saudação: *"Bem-vindo ao Forjador de Lendas! Sou seu guia pelos Reinos Esquecidos!"*
- Raça Elfo: *"Um elfo! Suas flechas dançam com a graça de Corellon."*
- Classe Mago: *"Um mago! Um irmão da Teia de Mystra!"*
- Rolar dados: *"Que Tymora sorria para você!"*

**Comparação com Tormenta 20:**
- Saudação: *"Bem-vindo ao Forjador de Lendas! Sou Merlin, seu guia em Arton!"*
- Raça Elfo: *"Um elfo de Lenórienn? Elegante, mas não se perca em séculos!"*
- Classe Arcanista: *"Um arcanista! Um irmão das artes mágicas!"*
- Rolar dados: *"Que os dados de Nimb decidam seu destino!"*

#### **4. Geração de História Contextual**
Os prompts para IA agora são específicos para cada mundo:

**D&D 5e:**
- Menciona locais como Waterdeep, Baldur's Gate, Candlekeep
- Referencia divindades como Mystra, Tyr, Selûne, Tempus
- Foca na Teia de Mystra para conjuradores
- Tom de fantasia épica clássica

**Tormenta 20:**
- Menciona locais como Valkaria, Lenórienn, Vectora
- Referencia eventos como a Tormenta
- Foca nos deuses do Panteão de Arton
- Tom de fantasia brasileira

**Ordem Paranormal:**
- Contexto brasileiro contemporâneo
- Menciona a Ordem, Outro Lado, entidades paranormais
- Tom de horror investigativo moderno
- Foca em como o personagem descobriu o paranormal

#### **5. Ícones de Classe Adaptativos**
- Cada mundo tem seus próprios ícones para as classes
- Os cards de personagens mostram ícones apropriados para o mundo do personagem
- Atualização automática ao trocar de mundo

### 🔧 **Arquitetura Técnica:**

#### **Arquivos Principais:**
- `js/worldsConfig.js` - Configurações de todos os mundos
- `js/worldManager.js` - Gerenciamento dinâmico do formulário
- `js/companion.js` - Falas contextuais do mago
- `js/app.js` - Lógica principal atualizada

#### **Estrutura de Configuração:**
```javascript
worldsConfig = {
    'dnd': {
        name: 'D&D 5e',
        races: [...],
        classes: [...],
        attributes: [...],
        classIcons: {...},
        companionSpeech: {
            greetings: [...],
            raceResponses: {...},
            classResponses: {...},
            // etc.
        },
        raceSummaries: {...},
        classSummaries: {...}
    }
}
```

### 🎮 **Como Usar:**

1. **Seleção de Mundo**: Use a roleta de mundos para escolher entre Tormenta 20, D&D 5e ou Ordem Paranormal
2. **Criação Contextual**: O formulário se adapta automaticamente ao mundo selecionado
3. **Interação com o Mago**: O companion reage com falas específicas do mundo
4. **Geração de História**: As histórias são geradas com contexto apropriado
5. **Visualização**: Os personagens salvos mostram informações contextuais

### 🌟 **Benefícios:**

- **Imersão Total**: Cada mundo mantém sua identidade única
- **Precisão Narrativa**: Histórias fiéis ao lore de cada sistema
- **Experiência Fluida**: Transição suave entre mundos
- **Flexibilidade**: Fácil adição de novos mundos no futuro

### 🔮 **Próximos Passos:**

Para implementar **Ordem Paranormal** completamente, será necessário:
1. Adicionar falas específicas do companion
2. Criar summaries das classes de OP
3. Ajustar prompts para o tom de horror investigativo
4. Adicionar elementos visuais temáticos

---

**Desenvolvido por Marques** | *Forjador de Lendas v2.0* 