"""
Multi-language TTS Service using Google TTS (gTTS) and pyttsx3
Supports: Spanish, French, Amharic, Tigrinya, Oromo, Somali, Arabic, Hadiyaa, Wolayitta, Afar, Gamo
- gTTS: Spanish, French, Amharic, Tigrinya, Arabic (5 languages)
- pyttsx3: Oromo, Somali, Hadiyaa, Wolayitta, Afar, Gamo (6 languages - using Windows SAPI)
"""

from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from gtts import gTTS
import pyttsx3
import os
import uuid

app = Flask(__name__)
CORS(app)

print("TTS Service initializing...")

# Configuration
PORT = int(os.getenv('TTS_SERVICE_PORT', 5000))
MAX_TEXT_LENGTH = int(os.getenv('MAX_TEXT_LENGTH', 5000))

# Audio output directory
AUDIO_DIR = os.path.join(os.path.dirname(__file__), 'audio_output')
os.makedirs(AUDIO_DIR, exist_ok=True)

# Language configuration
# gTTS languages: Spanish, French, Amharic, Arabic, Swahili, Kinyarwanda (confirmed supported)
# Tigrinya uses Amharic TTS since both use Ge'ez script with similar pronunciation
# Kirundi uses Swahili TTS (both are Bantu languages with similar phonology)
# pyttsx3 for Oromo, Somali, Hadiyaa, Wolayitta, Afar, Gamo, Luo (uses Windows SAPI TTS - gTTS doesn't support them)
LANGUAGE_CODES = {
    'spanish': 'es',
    'french': 'fr',
    'amharic': 'am',
    'tigrinya': 'am',  # Uses Amharic TTS (same Ge'ez alphabet, similar pronunciation)
    'oromo': 'om',     # Not in gTTS - will use pyttsx3
    'somali': 'so',    # Not in gTTS - will use pyttsx3
    'arabic': 'ar',    # Supported by gTTS
    'hadiyaa': 'ha',   # Not in gTTS - will use pyttsx3
    'wolyitta': 'wo',  # Not in gTTS - will use pyttsx3
    'afar': 'aa',      # Not in gTTS - will use pyttsx3
    'gamo': 'gm',      # Not in gTTS - will use pyttsx3
    'swahili': 'sw',   # Supported by gTTS
    'kinyarwanda': 'rw',  # Supported by gTTS
    'kirundi': 'sw',   # Uses Swahili TTS (both Bantu languages, similar phonology)
    'luo': 'luo',      # Not in gTTS - will use pyttsx3
    'english': 'en'    # Added English support
}

# Languages that use pyttsx3 instead of gTTS (because gTTS doesn't support them)
PYTTSX3_LANGUAGES = ['oromo', 'somali', 'hadiyaa', 'wolyitta', 'afar', 'gamo', 'luo']

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "ok", "model": "gTTS"})

@app.route('/tts', methods=['POST'])
def text_to_speech():
    """
    Convert text to speech using Google TTS or pyttsx3
    Expected JSON: {
        "text": "Hello world",
        "language": "spanish|french|amharic|tigrinya|..."
    }
    """
    try:
        data = request.json
        text = data.get('text', '')
        language = data.get('language', 'spanish').lower()

        # Validate text
        if not text or not isinstance(text, str):
            return jsonify({"error": "Text is required and must be a string"}), 400

        text = text.strip()

        if len(text) == 0:
            return jsonify({"error": "Text cannot be empty"}), 400

        if len(text) > MAX_TEXT_LENGTH:
            return jsonify({"error": f"Text exceeds maximum length of {MAX_TEXT_LENGTH} characters"}), 400

        # Validate language
        if language not in LANGUAGE_CODES:
            return jsonify({"error": f"Unsupported language: {language}"}), 400
        
        # Generate unique filename - use .wav for pyttsx3, .mp3 for gTTS
        if language in PYTTSX3_LANGUAGES:
            filename = f"{uuid.uuid4()}.wav"
        else:
            filename = f"{uuid.uuid4()}.mp3"
        output_path = os.path.join(AUDIO_DIR, filename)
        
        # Language code
        lang_code = LANGUAGE_CODES[language]
        
        print(f"Generating speech: '{text}' in {language} ({lang_code})")
        
        # Use appropriate TTS engine
        if language in PYTTSX3_LANGUAGES:
            # Use pyttsx3 for Oromo
            try:
                engine = pyttsx3.init()
                engine.save_to_file(text, output_path)
                engine.runAndWait()
                print(f"Speech generated successfully with pyttsx3: {filename}")
                mimetype = 'audio/wav'
            except Exception as e:
                print(f"pyttsx3 error: {str(e)}")
                raise
        else:
            # Use gTTS for other languages
            try:
                tts = gTTS(text=text, lang=lang_code, slow=False)
                tts.save(output_path)
                print(f"Speech generated successfully with gTTS: {filename}")
                mimetype = 'audio/mpeg'
            except Exception as e:
                print(f"gTTS error: {str(e)}")
                raise
        
        # Send file with correct mimetype in headers
        response = send_file(
            output_path,
            mimetype=mimetype,
            as_attachment=False,
            download_name=filename
        )
        # Ensure Content-Type header is set correctly
        response.headers['Content-Type'] = mimetype
        return response
    
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/tts/clone', methods=['POST'])
def text_to_speech_clone():
    """
    For compatibility - gTTS doesn't support voice cloning
    Falls back to regular TTS
    """
    return text_to_speech()

@app.route('/languages', methods=['GET'])
def get_languages():
    """Get supported languages"""
    return jsonify({
        "languages": list(LANGUAGE_CODES.keys()),
        "codes": LANGUAGE_CODES
    })

if __name__ == '__main__':
    print("\n" + "="*50)
    print("TTS Service Ready!")
    print(f"Running on port: {PORT}")
    print("Supported languages:", ", ".join(LANGUAGE_CODES.keys()))
    print(f"Max text length: {MAX_TEXT_LENGTH} characters")
    print("="*50 + "\n")
    app.run(host='0.0.0.0', port=PORT, debug=True)
