/**
 * Centralized Configuration for Sound Training TTS App
 * Single source of truth for languages, ports, and constants
 */

// Supported languages configuration
const LANGUAGES = [
  "english",
  "spanish",
  "french",
  "italian",
  "german",
  "portuguese",
  "russian",
  "chinese",
  "japanese",
  "korean",
  "arabic",
  "hebrew",
  "greek",
  "turkish",
  "farsi",
  "kurdish",
  "hindi",
  "bengali",
  "telugu",
  "tamil",
  "thai",
  "vietnamese",
  "dutch",
  "swedish",
  "polish",
  "czech",
  "hungarian",
  "amharic",
  "tigrinya",
  "oromo",
  "somali",
  "hadiyaa",
  "wolayitta",
  "afar",
  "gamo",
  "swahili",
  "kinyarwanda",
  "kirundi",
  "luo",
  "luganda",
  "dinka",
  "nuer",
  "bantu"
];

// Language display names (native + English)
const LANGUAGE_NAMES = {
    'english': 'English',
    'spanish': 'Español (Spanish)',
    'french': 'Français (French)',
    'italian': 'Italiano (Italian)',
    'german': 'Deutsch (German)',
    'portuguese': 'Português (Portuguese)',
    'russian': 'Русский (Russian)',
    'chinese': '中文 (Chinese)',
    'japanese': '日本語 (Japanese)',
    'korean': '한국어 (Korean)',
    'arabic': 'العربية (Arabic)',
    'hebrew': 'עברית (Hebrew)',
    'greek': 'Ελληνικά (Greek)',
    'turkish': 'Türkçe (Turkish)',
    'farsi': 'فارسی (Farsi/Persian)',
    'kurdish': 'Kurdî (Kurdish)',
    'hindi': 'हिन्दी (Hindi)',
    'bengali': 'বাংলা (Bengali)',
    'telugu': 'తెలుగు (Telugu)',
    'tamil': 'தமிழ் (Tamil)',
    'thai': 'ไทย (Thai)',
    'vietnamese': 'Tiếng Việt (Vietnamese)',
    'dutch': 'Nederlands (Dutch)',
    'swedish': 'Svenska (Swedish)',
    'polish': 'Polski (Polish)',
    'czech': 'Čeština (Czech)',
    'hungarian': 'Magyar (Hungarian)',
    'amharic': 'አማርኛ (Amharic)',
    'tigrinya': 'ትግርኛ (Tigrinya)',
    'oromo': 'Afaan Oromoo (Oromo)',
    'somali': 'Af-Soomaali (Somali)',
    'hadiyaa': 'Hadiyyisa (Hadiyaa)',
    'hadiyaa_phonetic': 'Hadiyaa (Phonetic)',
    'wolayitta': 'Wolaytta (Wolayitta)',
    'afar': 'Qafar (Afar)',
    'afar_phonetic': 'Afar (Phonetic)',
    'gamo': 'Gamoñña (Gamo)',
    'swahili': 'Kiswahili (Swahili)',
    'kinyarwanda': 'Ikinyarwanda (Kinyarwanda)',
    'kirundi': 'Ikirundi (Kirundi)',
    'kirundi_phonetic': 'Kirundi (Phonetic)',
    'luo': 'Dholuo (Luo)',
    'luo_phonetic': 'Luo (Phonetic)',
    'luganda': 'Luganda',
    'dinka': 'Dinka',
    'nuer': 'Nuer',
    'bantu': 'Bantu'
};

// Server configuration
const SERVER_CONFIG = {
    EXPRESS_PORT: process.env.PORT || process.env.EXPRESS_PORT || 3000,
    TTS_SERVICE_PORT: process.env.TTS_SERVICE_PORT || 5000,
    TTS_SERVICE_URL: process.env.TTS_SERVICE_URL || 'http://localhost:5000'
};

// Input validation limits
const VALIDATION = {
    MAX_TEXT_LENGTH: 5000,  // Maximum characters for TTS input
    MIN_TEXT_LENGTH: 1,
    MAX_AUDIO_AGE_HOURS: 24  // Auto-cleanup audio files older than this
};


// Audio file configuration
const AUDIO_CONFIG = {
    OUTPUT_DIR: 'audio_output',
    FORMATS: {
        GTTS: 'mp3',
        PYTTSX3: 'wav'
    },
    MIMETYPES: {
        mp3: 'audio/mpeg',
        wav: 'audio/wav'
    }
};

// Helper function to validate language
function isValidLanguage(language) {
    return LANGUAGES.includes(language);
}

// Helper function to validate text input
function validateTextInput(text) {
    if (!text || typeof text !== 'string') {
        return { valid: false, error: 'Text is required and must be a string' };
    }

    // FIX: Remove null bytes and control characters (except newlines/tabs) to prevent injection
    const sanitized = text.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');
    const trimmedText = sanitized.trim();

    if (trimmedText.length < VALIDATION.MIN_TEXT_LENGTH) {
        return { valid: false, error: 'Text cannot be empty' };
    }

    if (trimmedText.length > VALIDATION.MAX_TEXT_LENGTH) {
        return { valid: false, error: `Text exceeds maximum length of ${VALIDATION.MAX_TEXT_LENGTH} characters` };
    }

    return { valid: true, text: trimmedText };
}

module.exports = {
    LANGUAGES,
    LANGUAGE_NAMES,
    SERVER_CONFIG,
    VALIDATION,
    AUDIO_CONFIG,
    isValidLanguage,
    validateTextInput
};

