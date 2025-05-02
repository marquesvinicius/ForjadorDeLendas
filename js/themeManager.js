import { worldThemes } from './themes.js';

export function applyWorldTheme(worldId) {
  const theme = worldThemes[worldId];
  if (!theme) return;

  /*document.documentElement.style.setProperty('--primary-color', theme.primaryColor);
  document.documentElement.style.setProperty('--accent-color', theme.accentColor);*/
  document.body.style.backgroundImage = `url('${theme.bgImage}')`;

  const companion = document.querySelector('.companion-avatar');
  if (companion) companion.src = theme.companionImage;
} 
