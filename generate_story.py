from transformers import pipeline
from flask import Flask, request, jsonify
from flask_cors import CORS
import logging

app = Flask(__name__)
CORS(app)  # Habilita CORS para todas as rotas

# Configura logging pra ver erros e resultados no terminal
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

try:
    # Carrega o modelo uma vez no início
    logger.info("Carregando o modelo distilgpt2...")
    generator = pipeline('text-generation', model='distilgpt2')
    logger.info("Modelo carregado com sucesso!")
except Exception as e:
    logger.error(f"Erro ao carregar o modelo: {str(e)}")
    generator = None

@app.route('/generate', methods=['POST'])
def generate():
    if generator is None:
        logger.error("Modelo não carregado!")
        return jsonify({'error': 'Modelo de linguagem não disponível'}), 500

    try:
        data = request.get_json()
        prompt = data.get('prompt', '')
        logger.info(f"Recebido prompt: {prompt}")

        # Gera a história com mais criatividade e tokens
        result = generator(prompt, max_new_tokens=300, temperature=0.8, top_p=0.95, truncation=True)
        full_text = result[0]['generated_text']
        logger.info(f"Texto gerado completo: {full_text}")

        # Remove o prompt e garante que o texto restante seja válido
        backstory = full_text.replace(prompt, '').strip()
        logger.info(f"História extraída: {backstory}")

        # Verifica se o backstory é válido (não vazio e tem pelo menos 50 palavras)
        if not backstory or len(backstory.split()) < 50:
            backstory = "Orlak, um goblin astuto, rastreia as florestas de Arton com seu arco em punho."
            logger.warning("História gerada inválida ou curta, usando fallback interno.")

        return jsonify({'backstory': backstory})
    except Exception as e:
        logger.error(f"Erro ao gerar história: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000)