import os
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Sua chave Gemini (agora usada para configurar a biblioteca)
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
genai.configure(api_key=GEMINI_API_KEY)

# Carrega o modelo Gemini 1.5 Flash
model = genai.GenerativeModel('gemini-1.5-flash')

@app.route('/ping', methods=['GET'])
def ping():
    """Endpoint simples para manter o servidor ativo - usado pelo cron-job"""
    return jsonify({'status': 'alive', 'message': 'Servidor está ativo'}), 200

@app.route('/generate', methods=['POST'])
def generate():
    data = request.get_json()
    prompt = data.get('prompt', '')

    try:
        response = model.generate_content(prompt)
        generated_text = response.text
        return jsonify({'backstory': generated_text})

    except Exception as e:
        print(f"Erro ao chamar Gemini API: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port) 