import os
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS

# Carregar variáveis de ambiente do arquivo .env
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)

# Configurar CORS mais explicitamente
CORS(app, origins=["*"], methods=["GET", "POST", "OPTIONS"], allow_headers=["Content-Type"])

# Sua chave Gemini (agora usada para configurar a biblioteca)
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')

if not GEMINI_API_KEY:
    print("[ERROR] GEMINI_API_KEY nao encontrada! Verifique o arquivo .env")
else:
    print("[OK] GEMINI_API_KEY carregada com sucesso")

genai.configure(api_key=GEMINI_API_KEY)

# Carrega o modelo Gemini 1.5 Flash
model = genai.GenerativeModel('gemini-1.5-flash')

@app.route('/ping', methods=['GET'])
def ping():
    """Endpoint simples para manter o servidor ativo - usado pelo cron-job"""
    print("[DEBUG] Ping recebido")
    return jsonify({'status': 'alive', 'message': 'Servidor está ativo'}), 200

@app.route('/generate', methods=['POST', 'OPTIONS'])
def generate():
    print(f"[DEBUG] Requisição recebida: {request.method}")
    print(f"[DEBUG] Headers: {dict(request.headers)}")
    
    # Tratar requisições OPTIONS (preflight CORS)
    if request.method == 'OPTIONS':
        print("[DEBUG] Respondendo ao preflight CORS")
        return '', 200
    
    if not GEMINI_API_KEY:
        print("[ERROR] GEMINI_API_KEY não configurada")
        return jsonify({'error': 'GEMINI_API_KEY não configurada'}), 500
    
    try:
        data = request.get_json()
        print(f"[DEBUG] Dados recebidos: {data}")
        
        if not data:
            print("[ERROR] Nenhum JSON recebido")
            return jsonify({'error': 'JSON inválido ou vazio'}), 400
            
        prompt = data.get('prompt', '')
        print(f"[DEBUG] Prompt extraído (tamanho: {len(prompt)} chars)")

        if not prompt:
            print("[ERROR] Prompt vazio")
            return jsonify({'error': 'Prompt é obrigatório'}), 400

        print("[DEBUG] Chamando API Gemini...")
        response = model.generate_content(prompt)
        
        print("[DEBUG] Resposta recebida da API Gemini")
        generated_text = response.text
        print(f"[DEBUG] Texto gerado (tamanho: {len(generated_text)} chars)")
        
        result = {'backstory': generated_text}
        print("[DEBUG] Enviando resposta de sucesso")
        return jsonify(result)

    except Exception as e:
        print(f"[ERROR] Erro ao chamar Gemini API: {e}")
        print(f"[ERROR] Tipo do erro: {type(e).__name__}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5000))
    print(f"[INFO] Iniciando servidor na porta {port}")
    app.run(host='0.0.0.0', port=port) 