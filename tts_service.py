"""
Multi-language TTS Service using Google TTS (gTTS) and pyttsx3
Supports: Spanish, French, Amharic, Tigrinya, Oromo
- gTTS: Spanish, French, Amharic, Tigrinya
- pyttsx3: Oromo (using Windows SAPI)
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

# Audio output directory
AUDIO_DIR = os.path.join(os.path.dirname(__file__), 'audio_output')
os.makedirs(AUDIO_DIR, exist_ok=True)

# Language configuration
# gTTS languages: Spanish, French, Amharic (confirmed supported)
# Tigrinya uses Amharic TTS since both use Ge'ez script with similar pronunciation
# pyttsx3 for Oromo (uses Windows SAPI TTS - gTTS doesn't support it)
LANGUAGE_CODES = {
    'spanish': 'es',
    'french': 'fr',
    'amharic': 'am',
    'tigrinya': 'am',  # Uses Amharic TTS (same Ge'ez alphabet, similar pronunciation)
    'oromo': 'om',     # Not in gTTS - will use pyttsx3
    'english': 'en'    # Added English support
}

# Languages that use pyttsx3 instead of gTTS (because gTTS doesn't support them)
PYTTSX3_LANGUAGES = ['oromo']

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "ok", "model": "gTTS"})

@app.route('/tts', methods=['POST'])
def text_to_speech():
    """
    Convert text to speech using Google TTS
    Expected JSON: {
        "text": "Hello world",
        "language": "spanish|french|amharic|tigrinya"
    }
    """
    try:
        data = request.json
        text = data.get('text', '')
        language = data.get('language', 'spanish').lower()
        
        if not text:
            return jsonify({"error": "No text provided"}), 400
        
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
        
        return send_file(
            output_path,
            mimetype=mimetype,
            as_attachment=False,
            download_name=filename
        )
    
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
    print("Supported languages:", ", ".join(LANGUAGE_CODES.keys()))
    print("="*50 + "\n")
    app.run(host='0.0.0.0', port=5000, debug=True)
