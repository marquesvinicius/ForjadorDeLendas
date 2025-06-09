# 🚀 Configuração de Deploy - Vercel + Supabase

## 📋 Checklist de Deploy

### 1. **Deploy no Vercel**
```bash
# Se ainda não tem o projeto no Vercel
npm install -g vercel
vercel

# Ou conecte seu GitHub ao Vercel (recomendado)
```

**Seu domínio Vercel será algo como:**
`https://forjador-de-lendas.vercel.app`

### 2. **Configurar Supabase para Produção**

#### 2.1 Site URLs
Vá em **Authentication → Settings** e configure:

**Site URL:**
```
https://SEU-PROJETO.vercel.app
```

**Additional redirect URLs:**
```
http://localhost:3000
http://localhost:8000
https://SEU-PROJETO.vercel.app
https://SEU-PROJETO.vercel.app/
```

#### 2.2 CORS Origins (se necessário)
Se tiver problemas de CORS, adicione em **Settings → API**:
```
https://SEU-PROJETO.vercel.app
```

### 3. **Variáveis de Ambiente (Opcional)**

Se quiser usar variáveis de ambiente no Vercel:

#### 3.1 No Vercel Dashboard
```env
VITE_SUPABASE_URL=https://zeiemqbillfiwlecjdtl.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

#### 3.2 Atualizar supabase.js
```javascript
// src/core/supabase.js
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://zeiemqbillfiwlecjdtl.supabase.co'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGci...'
```

### 4. **Teste Completo**

#### 4.1 Desenvolvimento (localhost)
- ✅ Login/registro funcionando
- ✅ Redirecionamentos corretos
- ✅ Backend conectando (se configurado)

#### 4.2 Produção (Vercel)
- ✅ Deploy bem-sucedido
- ✅ Autenticação funcionando
- ✅ HTTPS funcionando
- ✅ OAuth funcionando (se configurado)

## 🔧 Troubleshooting

### Erro: "Invalid redirect URL"
**Solução:** Verificar se o domínio está nas Additional redirect URLs

### Erro: "CORS blocked"
**Solução:** Adicionar domínio nas configurações de CORS do Supabase

### Login funciona local mas não em produção
**Solução:** Verificar se todas as URLs estão configuradas corretamente

## 📱 URLs Finais

### Desenvolvimento
- **Frontend**: `http://localhost:3000`
- **Backend**: `http://localhost:5000` (opcional)
- **Supabase**: Configurado para localhost

### Produção
- **Frontend**: `https://SEU-PROJETO.vercel.app`
- **Backend**: `https://forjador-backend.onrender.com` (opcional)
- **Supabase**: Configurado para domínios de produção

---

**🎯 Resumo:** Configure o Supabase com o domínio do Vercel (frontend), não do Render (backend)! 