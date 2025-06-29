from flask import Flask, request, jsonify
from flask_cors import CORS
# from langchain_community.vectorstores import FAISS
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from google.generativeai import GenerativeModel, configure
import google.generativeai as genai
import logging
import os

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Configure CORS for deployed frontend
CORS(app, origins=[
    "https://tatamotorsmagazine.netlify.app",
    "https://frabjous-cupcake-7d90f7.netlify.app",
    "http://localhost:5173",  # For local development
    "http://localhost:3000"   # Alternative local port
])

# FAISS_PATH = "faiss_index"

# Configure Google Gemini API
GOOGLE_API_KEY = "AIzaSyCV3iu9BRwKMFZ1Y2FFLVgMXZFHg0Egozs"
configure(api_key=GOOGLE_API_KEY)

def get_response(context, question):
    try:
        # Using the same model configuration as the Chatbot
        model = GenerativeModel("gemini-1.5-flash")
        
        prompt = f"""You are a knowledgeable Tata Motors virtual assistant. Based on the following information from our database, please provide a confident and helpful response.

Context:
{context}

Question: {question}

Please provide a clear, confident response based on the information available in our database. 
Important guidelines:
1. Keep responses concise and under 500 characters
2. Focus on key information first
3. If more details are available, mention "For more details, please ask about specific features"
4. Avoid phrases like "I don't have information" or "I don't know"
5. Format the response for easy reading in a chat bubble"""

        response = model.generate_content(prompt)
        # Ensure response is within character limit
        response_text = response.text
        if len(response_text) > 500:
            # Split into paragraphs and take the first complete paragraph
            paragraphs = response_text.split('\n\n')
            response_text = paragraphs[0]
            if len(response_text) > 500:
                # If still too long, truncate with ellipsis
                response_text = response_text[:497] + "..."
        
        return response_text
    except Exception as e:
        logger.error(f"Error in get_response: {str(e)}")
        raise e

def query_database(query_text):
    try:
        # Enhanced context with more Tata Motors information
        context_text = """Tata Motors is India's largest automobile company, with consolidated revenues of INR 3,27,000 crores (USD 44 billion) in 2022-23. 
        
        Passenger Vehicles include:
        - SUVs: Safari (7-seater premium SUV), Harrier (premium SUV), Nexon (subcompact SUV), Punch (micro SUV)
        - Electric Vehicles: Nexon EV (best-selling electric SUV), Tiago EV (electric hatchback), Tigor EV (electric sedan)
        - Hatchbacks: Tiago, Altroz
        - Sedans: Tigor
        
        Key features: 5-star Global NCAP safety ratings, connected car technology, advanced driver assistance systems, premium interiors, and eco-friendly options."""
        
        return get_response(context_text, query_text)
    except Exception as e:
        logger.error(f"Error in query_database: {str(e)}")
        raise e

@app.route('/api/query', methods=['POST'])
def handle_query():
    try:
        data = request.json
        query_text = data.get('prompt')
        
        if not query_text:
            return jsonify({'error': 'No prompt provided'}), 400
        
        logger.info(f"Received query: {query_text}")
        response = query_database(query_text)
        logger.info(f"Generated response successfully")
        return jsonify({'response': response})
    except Exception as e:
        logger.error(f"Error in handle_query: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint for monitoring"""
    return jsonify({'status': 'healthy', 'message': 'Tata Motors API is running'})

@app.route('/', methods=['GET'])
def root():
    """Root endpoint"""
    return jsonify({
        'message': 'Tata Motors Magazine API',
        'version': '1.0.0',
        'endpoints': {
            'query': '/api/query',
            'health': '/health'
        }
    })

if __name__ == '__main__':
    # Get port from environment variable or default to 5005
    port = int(os.environ.get('PORT', 5005))
    app.run(host='0.0.0.0', port=port, debug=True)
