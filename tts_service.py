"""
Multi-language TTS Service using Google TTS (gTTS)
Supports: Spanish, French, Amharic, Tigrinya, Arabic, Swahili, Kinyarwanda, English, Italian, Chinese
- gTTS: All supported languages
- Note: Oromo, Somali, Hadiyaa, Wolayitta, Afar, Gamo, Luo not supported on Linux (pyttsx3 Windows-only)
"""

from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from gtts import gTTS
import os
import uuid
import time
from threading import Thread

app = Flask(__name__)
CORS(app)

print("TTS Service initializing...")

# Configuration
PORT = int(os.getenv('TTS_SERVICE_PORT', 5000))
MAX_TEXT_LENGTH = int(os.getenv('MAX_TEXT_LENGTH', 5000))

# Audio output directory
# Use /tmp for production (ephemeral storage on Render)
AUDIO_DIR = os.getenv('AUDIO_DIR', 
    '/tmp/audio_output' if os.getenv('NODE_ENV') == 'production' 
    else os.path.join(os.path.dirname(__file__), 'audio_output')
)
os.makedirs(AUDIO_DIR, exist_ok=True)

# Language configuration
# gTTS languages: All supported (cloud-based, platform-independent)
# Note: Some languages not supported by gTTS - will return error
LANGUAGE_CODES = {
    'spanish': 'es',
    'french': 'fr',
    'amharic': 'am',
    'tigrinya': 'am',  # Uses Amharic TTS (same Ge'ez alphabet, similar pronunciation)
    'arabic': 'ar',
    'swahili': 'sw',
    'kinyarwanda': 'rw',
    'kirundi': 'sw',   # Uses Swahili TTS (both Bantu languages, similar phonology)
    'english': 'en',
    'italian': 'it',
    'chinese': 'zh-CN',
    # Unsupported languages (return error on Linux/Render)
    'oromo': None,     # Not supported by gTTS
    'somali': None,    # Not supported by gTTS
    'hadiyaa': None,   # Not supported by gTTS
    'wolyitta': None,  # Not supported by gTTS
    'afar': None,      # Not supported by gTTS
    'gamo': None,      # Not supported by gTTS
    'luo': None,       # Not supported by gTTS
}

# Languages not supported (will return error message)
UNSUPPORTED_LANGUAGES = [k for k, v in LANGUAGE_CODES.items() if v is None]

def cleanup_old_files():
    """
    Background thread to delete audio files older than 24 hours
    Prevents disk space exhaustion
    """
    while True:
        try:
            now = time.time()
            deleted_count = 0
            for filename in os.listdir(AUDIO_DIR):
                filepath = os.path.join(AUDIO_DIR, filename)
                if os.path.isfile(filepath):
                    # Check file age in hours
                    age_hours = (now - os.path.getmtime(filepath)) / 3600
                    if age_hours > 24:
                        os.remove(filepath)
                        deleted_count += 1

            if deleted_count > 0:
                print(f"🧹 Cleaned up {deleted_count} old audio files")
        except Exception as e:
            print(f"⚠️ Cleanup error: {e}")

        # Run cleanup every hour
        time.sleep(3600)

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
        
        # Check if language is unsupported on Linux
        if language in UNSUPPORTED_LANGUAGES:
            return jsonify({
                "error": f"Language '{language}' is not supported on this platform",
                "details": "This language requires Windows-specific TTS (pyttsx3). Consider using a cloud TTS service for full language support.",
                "supported_languages": [k for k, v in LANGUAGE_CODES.items() if v is not None]
            }), 400
        
        # Generate unique filename
        filename = f"{uuid.uuid4()}.mp3"
        output_path = os.path.join(AUDIO_DIR, filename)
        
        # Language code
        lang_code = LANGUAGE_CODES[language]
        
        print(f"Generating speech: '{text[:50]}...' in {language} ({lang_code})")
        
        # Use gTTS for all supported languages
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
    supported = {k: v for k, v in LANGUAGE_CODES.items() if v is not None}
    unsupported = {k: v for k, v in LANGUAGE_CODES.items() if v is None}
    
    return jsonify({
        "languages": list(supported.keys()),
        "codes": supported,
        "unsupported": list(unsupported.keys()),
        "platform": "Linux/Render (gTTS only)"
    })

if __name__ == '__main__':
    # Start background cleanup thread (optional on Linux - /tmp auto-cleaned)
    if os.getenv('ENABLE_CLEANUP', 'true').lower() == 'true':
        cleanup_thread = Thread(target=cleanup_old_files, daemon=True)
        cleanup_thread.start()
        cleanup_status = "Enabled (24-hour retention)"
    else:
        cleanup_status = "Disabled (using /tmp)"

    print("\n" + "="*50)
    print("TTS Service Ready!")
    print(f"Running on port: {PORT}")
    print(f"Supported languages: {len([v for v in LANGUAGE_CODES.values() if v is not None])}/{len(LANGUAGE_CODES)}")
    print(f"Max text length: {MAX_TEXT_LENGTH} characters")
    print(f"🧹 Audio cleanup: {cleanup_status}")
    print(f"📁 Audio directory: {AUDIO_DIR}")
    if UNSUPPORTED_LANGUAGES:
        print(f"⚠️  Unsupported: {', '.join(UNSUPPORTED_LANGUAGES)}")
    print("="*50 + "\n")
    app.run(host='0.0.0.0', port=PORT, debug=True)
