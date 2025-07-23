import { worldThemes } from '../../js/themes.js';

export function applyWorldTheme(worldId) {
  console.log('🎨 ThemeManager: Aplicando tema para mundo:', worldId);
  
  const theme = worldThemes[worldId];
  if (!theme) {
    console.error('❌ ThemeManager: Tema não encontrado para mundo:', worldId);
    return;
  }

  console.log('🎨 ThemeManager: Tema encontrado:', theme);

  // Se o mundo for D&D, redefina as variáveis CSS para os valores padrão
  if (worldId === 'dnd') {
    console.log('🎨 ThemeManager: Aplicando tema D&D (padrão)');
    document.documentElement.style.setProperty('--primary-color', '#8B5A2B');
    document.documentElement.style.setProperty('--secondary-color', '#4A2511');
    document.documentElement.style.setProperty('--accent-color', '#D4AF37');
    document.documentElement.style.setProperty('--bg-color', '#2C1B0F');
    document.documentElement.style.setProperty('--text-color', '#E8DBBE');
    document.documentElement.style.setProperty('--panel-bg', 'rgba(35, 25, 15, 0.85)');
    document.documentElement.style.setProperty('--panel-border', '#8B5A2B');
  } else {
    console.log('🎨 ThemeManager: Aplicando tema personalizado para:', worldId);
    // Para outros mundos, aplique as propriedades CSS personalizadas, se definidas
    if (theme.primaryColor) {
      document.documentElement.style.setProperty('--primary-color', theme.primaryColor);
    }
    if (theme.accentColor) {
      document.documentElement.style.setProperty('--accent-color', theme.accentColor);
    }
    if (theme.textColor) {
      document.documentElement.style.setProperty('--text-color', theme.textColor);
    }
    if (theme.panelBg) {
      document.documentElement.style.setProperty('--panel-bg', theme.panelBg);
    }
    if (theme.panelBorder) {
      document.documentElement.style.setProperty('--panel-border', theme.panelBorder);
    }
  }

  // Aplicar imagem de fundo
  if (theme.bgImage) {
    console.log('🖼️ ThemeManager: Aplicando background:', theme.bgImage);
    
    // ⭐ MÚLTIPLAS TENTATIVAS DE APLICAÇÃO
    const backgroundUrl = `url('${theme.bgImage}')`;
    
    // Método 1: style.backgroundImage
    document.body.style.backgroundImage = backgroundUrl;
    
    // Método 2: setProperty (mais força)
    document.body.style.setProperty('background-image', backgroundUrl, 'important');
    
    // Método 3: Via CSS custom property
    document.documentElement.style.setProperty('--bg-image', backgroundUrl);
    
    // Verificar se foi aplicado
    setTimeout(() => {
      const computedStyle = window.getComputedStyle(document.body);
      const appliedBg = computedStyle.backgroundImage;
      console.log('🔍 ThemeManager: Background aplicado?', appliedBg !== 'none' ? '✅' : '❌');
      console.log('🔍 ThemeManager: Background atual:', appliedBg);
      
      if (appliedBg === 'none') {
        console.warn('⚠️ ThemeManager: Background não aplicado, tentando força bruta...');
        // Força bruta: criar elemento style
        const style = document.createElement('style');
        style.innerHTML = `body { background-image: ${backgroundUrl} !important; }`;
        document.head.appendChild(style);
      }
    }, 50);
  } else {
    console.warn('⚠️ ThemeManager: Nenhum background definido para:', worldId);
  }
  
  // Atualizar imagem do companion
  const companion = document.querySelector('.companion-avatar');
  if (companion && theme.companionImage) {
    console.log('🧙 ThemeManager: Atualizando companion:', theme.companionImage);
    companion.src = theme.companionImage;
  }
  
  // Manter o título principal como "Forjador de Lendas" para todos os mundos
  const mainTitle = document.querySelector('.title.is-1.medieval-title');
  if (mainTitle) {
    mainTitle.textContent = 'Forjador de Lendas';
  }
  
  // Atualizar apenas os subtítulos específicos de cada mundo
  const subtitle = document.querySelector('.subtitle.medieval-title');
  if (subtitle && theme.subtitle) {
    console.log('📝 ThemeManager: Atualizando subtítulo:', theme.subtitle);
    subtitle.textContent = theme.subtitle;
  } else if (subtitle && worldId === 'tormenta') {
    subtitle.textContent = 'Crie heróis épicos para Arton';
  } else if (subtitle && worldId === 'dnd') {
    subtitle.textContent = 'Aventuras nas Terras dos Dragões';
  } else if (subtitle && worldId === 'ordem-paranormal') {
    subtitle.textContent = 'Investigue o Desconhecido';
  }
  
  console.log('✅ ThemeManager: Tema aplicado com sucesso para:', worldId);
  
  // Atualizar elementos específicos de cada mundo (se necessário)
  // Por exemplo, se precisarmos mostrar/ocultar campos específicos de cada sistema
}

/**
 * Inicializa o tema automaticamente
 */
export function initializeTheme() {
    const currentWorld = localStorage.getItem('selectedWorld') || 'dnd';
    console.log('🎨 Aplicando tema automaticamente:', currentWorld);
    applyWorldTheme(currentWorld);
}

/**
 * Configura os listeners de tema
 */
export function setupThemeListeners() {
    // Aplicar tema o mais cedo possível
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeTheme);
    } else {
        // Se DOM já carregou, aplicar imediatamente
        initializeTheme();
    }
    
    // Backup: aplicar tema após Auth Guard também
    document.addEventListener('supabaseSignIn', () => {
        setTimeout(() => {
            const currentWorld = localStorage.getItem('selectedWorld') || 'dnd';
            console.log('🎨 Re-aplicando tema após login:', currentWorld);
            applyWorldTheme(currentWorld);
        }, 100);
    });
}

// Tornar a função disponível globalmente para compatibilidade com scripts não-module
window.applyWorldTheme = applyWorldTheme; 
