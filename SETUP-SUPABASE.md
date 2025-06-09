# 🚀 Setup Rápido - Supabase Auth

## ⚡ Configuração em 5 Minutos

### 1. **Criar Projeto no Supabase**
1. Acesse [supabase.com](https://supabase.com)
2. "Start your project" → Login
3. "New Project":
   - **Name**: `forjador-de-lendas`
   - **Region**: `South America (São Paulo)`
   - **Plan**: **Free** ✅
4. Aguarde 1-2 minutos

### 2. **Configurar Credenciais**
1. Vá em **Settings** → **API**
2. Copie:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGci...`

3. **Edite** `src/core/supabase.js`:
```javascript
const SUPABASE_URL = 'COLE-SUA-URL-AQUI'
const SUPABASE_ANON_KEY = 'COLE-SUA-CHAVE-AQUI'
```

### 3. **Criar Tabelas**
Vá em **SQL Editor** e execute:

```sql
-- Tabela de perfis
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

-- Segurança
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem gerenciar próprio perfil" ON profiles
  FOR ALL USING (auth.uid() = id);

-- Trigger para criar perfil automaticamente
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

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 4. **Configurar Site URL**
1. **Authentication** → **Settings**
2. **Site URL**: `http://localhost:3000` (dev) ou seu domínio (prod)
3. **Additional redirect URLs**: adicione suas URLs

## 🧪 **Testar**

### Criar primeiro usuário:
1. Abra `login.html`
2. Use o formulário (será integrado com Supabase)
3. Ou teste no console:

```javascript
import { supabaseAuth } from './src/core/supabase.js'

// Criar usuário teste
await supabaseAuth.signUp('teste@email.com', '123456', {
  username: 'forjador_teste'
})

// Fazer login
await supabaseAuth.signIn('teste@email.com', '123456')
```

## 📊 **Recursos Disponíveis**

### ✅ **Plano Gratuito**
- **50,000 usuários únicos/mês**
- **500MB database**
- **5GB bandwidth**
- **2 projetos**

### 🔐 **Segurança**
- Row Level Security (RLS)
- JWT tokens automáticos
- Hash seguro de senhas
- Rate limiting

### 🚀 **Features**
- ✅ Email/senha
- ✅ OAuth (Google, GitHub)
- ✅ Reset de senha
- ✅ Confirmação por email
- ✅ Multi-factor auth
- ✅ Perfis automáticos

## 🔧 **Troubleshooting**

**Erro "Invalid API Key"**
→ Verifique URLs em `src/core/supabase.js`

**Erro "Email not confirmed"**
→ Cheque caixa de entrada/spam

**Performance lenta**
→ Troque região no Supabase

---

## 🎯 **Próximos Passos**

1. ✅ **Setup básico** (este guia)
2. 🔄 **Integrar com UI atual**
3. 🔄 **Adicionar OAuth providers**
4. 🔄 **Sincronizar personagens**
5. 🔄 **Deploy em produção**

**🏰 Em poucos minutos, o Forjador de Lendas terá autenticação profissional!** 