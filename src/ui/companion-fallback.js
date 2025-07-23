/**
 * Sistema de fallback para o Companion
 */

/**
 * Cria uma versão simplificada do companion caso o original não esteja disponível
 */
export function initializeCompanionFallback() {
    // Aguardar um pouco para outros scripts carregarem
    setTimeout(() => {
        if (!window.magoCompanion) {
    
            // Se o companion não estiver disponível, criar uma versão simples
            window.magoCompanion = {
                speak: function(text) {
                    const speechBubble = document.querySelector('.companion-speech-bubble');
                    const companionText = document.getElementById('companionText');
                    if (speechBubble && companionText) {
                        speechBubble.classList.remove('hidden');
                        companionText.textContent = text;
                    }
                },
                greet: function() {
                    const currentWorld = localStorage.getItem('selectedWorld') || 'tormenta';
                    const greetings = currentWorld === 'dnd' 
                        ? ["Bem-vindo ao Forjador de Lendas! Sou seu guia pelos Reinos Esquecidos!"]
                        : ["Bem-vindo ao Forjador de Lendas! Sou Merlin, seu guia em Arton!"];
                    this.speak(greetings[0]);
                }
            };
            window.magoCompanion.greet();
        }
    }, 500);
} 