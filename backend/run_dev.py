#!/usr/bin/env python3
"""
Script para executar o backend em modo de desenvolvimento
Carrega automaticamente as variáveis de ambiente do arquivo .env
"""

import os
import sys
from pathlib import Path

# Adiciona o diretório do backend ao path
backend_dir = Path(__file__).parent
sys.path.append(str(backend_dir))

# Carrega variáveis do .env se existir
env_file = backend_dir / '.env'
if env_file.exists():
    from dotenv import load_dotenv
    load_dotenv(env_file)
    print(f"[OK] Variaveis de ambiente carregadas de {env_file}")
else:
    print("⚠️ Arquivo .env nao encontrado. Crie um baseado no .env.example")
    
# Verifica se a API key está definida
if not os.getenv('GEMINI_API_KEY'):
    print("[ERROR] GEMINI_API_KEY nao esta definida!")
    print("   Configure-a no arquivo .env ou como variavel de ambiente")
    sys.exit(1)

# Importa e executa a aplicação
if __name__ == '__main__':
    from generate_story import app
    
    print("Iniciando servidor de desenvolvimento...")
    print("Backend disponivel em: http://localhost:5000")
    print("Endpoints:")
    print("   GET  /ping     - Verificar status")
    print("   POST /generate - Gerar historia")
    print("\n[INFO] Pressione Ctrl+C para parar o servidor")
    
    # Executa em modo debug para desenvolvimento
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True,
        use_reloader=True
    ) 