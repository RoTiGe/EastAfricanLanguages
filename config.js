/**
 * Centralized Configuration for Sound Training TTS App
 * Single source of truth for languages, ports, and constants
 */

// Supported languages configuration
const LANGUAGES = [
    'english',
    'spanish', 
    'french',
    'amharic',
    'tigrinya',
    'oromo',
    'somali',
    'arabic',
    'hadiyaa',
    'wolyitta',
    'afar',
    'gamo',
    'swahili',
    'kinyarwanda',
    'kirundi',
    'luo'
];

// Language display names (native + English)
const LANGUAGE_NAMES = {
    'english': 'English',
    'spanish': 'Español (Spanish)',
    'french': 'Français (French)',
    'amharic': 'አማርኛ (Amharic)',
    'tigrinya': 'ትግርኛ (Tigrinya)',
    'oromo': 'Afaan Oromoo (Oromo)',
    'somali': 'Af-Soomaali (Somali)',
    'arabic': 'العربية (Arabic)',
    'hadiyaa': 'Hadiyyisa (Hadiyaa)',
    'wolyitta': 'Wolaytta (Wolayitta)',
    'afar': 'Qafar (Afar)',
    'gamo': 'Gamoñña (Gamo)',
    'swahili': 'Kiswahili (Swahili)',
    'kinyarwanda': 'Ikinyarwanda (Kinyarwanda)',
    'kirundi': 'Ikirundi (Kirundi)',
    'luo': 'Dholuo (Luo)'
};

// Server configuration
const SERVER_CONFIG = {
    EXPRESS_PORT: process.env.EXPRESS_PORT || 3000,
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
    
    const trimmedText = text.trim();
    
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

