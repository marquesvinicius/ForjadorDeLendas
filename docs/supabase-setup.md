# 🏰 Guia de Configuração do Supabase - Forjador de Lendas

## 📋 Passo a Passo Completo

### 1. 🚀 Criar Conta no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Clique em "Start your project"
3. Faça login com GitHub, Google ou email
4. Será direcionado para o dashboard

### 2. 🏗️ Criar Novo Projeto

1. No dashboard, clique em "New Project"
2. **Organization**: Selecione ou crie uma organização
3. **Name**: `forjador-de-lendas`
4. **Database Password**: Gere uma senha forte (anote!)
5. **Region**: Escolha `South America (São Paulo)` para melhor latência
6. **Pricing Plan**: Selecione **Free** (perfeito para começar)
7. Clique em "Create new project"

⏱️ *O projeto levará 1-2 minutos para ser criado*

### 3. 🔧 Configurar Autenticação

#### 3.1 Configurações Básicas
1. No painel lateral, vá em **Authentication** → **Settings**
2. Em **Site URL**, configure:
   - **Site URL**: `http://localhost:3000` (para desenvolvimento)
   - **Additional redirect URLs**: 
     - `http://localhost:3000`
     - `https://seu-dominio.com` (quando for para produção)

#### 3.2 Configurar Providers
1. Em **Authentication** → **Providers**
2. **Email**: Já vem habilitado por padrão
3. **Google** (opcional):
   - Toggle "Enable"
   - Adicione Client ID e Secret do Google OAuth
4. **GitHub** (opcional):
   - Toggle "Enable" 
   - Adicione Client ID e Secret do GitHub OAuth

#### 3.3 Configurar Email Templates
1. Em **Authentication** → **Email Templates**
2. Personalize os templates para o tema medieval:

**Confirm signup:**
```html
<h2>🏰 Bem-vindo ao Reino do Forjador de Lendas!</h2>
<p>Clique no link abaixo para confirmar sua jornada épica:</p>
<p><a href="{{ .ConfirmationURL }}">Confirmar Conta</a></p>
<p>Que grandes aventuras te aguardem!</p>
```

**Reset password:**
```html
<h2>🔑 Redefinir Palavra Secreta</h2>
<p>Um pedido foi feito para alterar sua palavra secreta.</p>
<p><a href="{{ .ConfirmationURL }}">Redefinir Senha</a></p>
<p>Se não foi você, ignore este pergaminho.</p>
```

### 4. 🗃️ Criar Tabelas do Banco

#### 4.1 Tabela de Perfis de Usuário
1. Vá em **Table Editor**
2. Clique em "Create a new table"
3. **Name**: `profiles`
4. **Description**: "Perfis dos usuários forjadores"
5. Adicione as colunas:

```sql
-- Execute no SQL Editor
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  favorite_world TEXT DEFAULT 'tormenta',
  characters_created INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Usuários podem ver próprio perfil" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar próprio perfil" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Usuários podem inserir próprio perfil" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

#### 4.2 Tabela de Personagens (opcional - integração com storage local)
```sql
-- Tabela para sincronizar personagens com a nuvem
CREATE TABLE characters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  race TEXT NOT NULL,
  class TEXT NOT NULL,
  alignment TEXT NOT NULL,
  world TEXT NOT NULL,
  attributes JSONB NOT NULL,
  background TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;

-- Políticas
CREATE POLICY "Usuários podem gerenciar próprios personagens" ON characters
  FOR ALL USING (auth.uid() = user_id);
```

#### 4.3 Trigger para criar perfil automaticamente
```sql
-- Função para criar perfil quando usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 5. 🔑 Obter Credenciais

1. Vá em **Settings** → **API**
2. Copie as informações:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 6. ⚙️ Configurar no Projeto

#### 6.1 Atualizar src/core/supabase.js
```javascript
// Substitua estas variáveis com suas credenciais reais
const SUPABASE_URL = 'https://SEU-PROJECT-REF.supabase.co'
const SUPABASE_ANON_KEY = 'SEU-ANON-KEY-AQUI'
```

#### 6.2 Variáveis de Ambiente (Produção)
Crie um arquivo `.env`:
```env
VITE_SUPABASE_URL=https://seu-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key-aqui
```

### 7. 🧪 Testar a Integração

#### 7.1 Teste Básico
```javascript
import { supabaseAuth } from './src/core/supabase.js'

// Testar conexão
console.log('Supabase conectado:', supabaseAuth.client)

// Testar registro
const result = await supabaseAuth.signUp('teste@email.com', '123456', {
  username: 'forjador_teste'
})
console.log('Resultado:', result)
```

### 8. 🚀 Deploy e Configuração de Produção

#### 8.1 Configurar URLs de Produção
1. Em **Authentication** → **Settings**
2. Atualize **Site URL** para seu domínio de produção
3. Adicione URLs de redirect de produção

#### 8.2 Configurar Email SMTP (Opcional)
1. Em **Authentication** → **Settings**
2. Configure **SMTP Settings** para usar seu próprio servidor de email

### 9. 📊 Monitoramento e Logs

#### 9.1 Verificar Logs
1. **Authentication** → **Logs**: Ver tentativas de login
2. **Logs** → **Explorer**: Consultas SQL e erros

#### 9.2 Métricas de Uso
1. **Reports**: Acompanhar MAU (Monthly Active Users)
2. **Usage**: Verificar limites e usage

## 🔒 Recursos de Segurança

### Row Level Security (RLS)
- ✅ Habilitado em todas as tabelas
- ✅ Políticas restritivas por usuário
- ✅ Validação automática de permissões

### Autenticação Multi-fator
```sql
-- Habilitar MFA para usuários específicos
UPDATE auth.users 
SET phone_confirmed_at = NOW() 
WHERE email = 'admin@forjador.com';
```

## 📈 Escalabilidade

### Limites do Plano Gratuito
- ✅ **50,000 MAU**: Até 50 mil usuários únicos por mês
- ✅ **500MB**: Banco de dados PostgreSQL
- ✅ **5GB**: Transferência de dados
- ✅ **2 projetos**: Desenvolvimento + Produção

### Quando Upgradar para Pro ($25/mês)
- 100,000 MAU (depois $0.00325/MAU)
- 8GB banco de dados
- 250GB transferência
- Backups automáticos
- Email support

## 🎯 Próximos Passos

1. ✅ **Configurar projeto no Supabase**
2. ✅ **Criar tabelas necessárias**
3. ✅ **Integrar autenticação no frontend**
4. ✅ **Testar registro e login**
5. ✅ **Deploy em produção**
6. 🔄 **Configurar sincronização de personagens**
7. 🔄 **Implementar features avançadas (OAuth, MFA)**

---

## 🆘 Troubleshooting

### Erro: "Invalid API Key"
- Verifique se as URLs estão corretas
- Confirme que está usando a anon key, não a service key

### Erro: "Email not confirmed"
- Verifique a caixa de entrada (e spam)
- Confirme configuração de SMTP

### Erro: "Row Level Security"
- Verifique se as políticas estão corretas
- Confirme que o usuário tem permissão

### Performance Lenta
- Considere mudar para região mais próxima
- Otimize queries SQL
- Use índices apropriados

---

**🏰 Com esta configuração, o Forjador de Lendas terá um sistema de autenticação robusto, seguro e escalável!** 