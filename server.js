/**
 * Express Server for African Translator
 * Integrates with Python TTS service
 */

const express = require('express');
const axios = require('axios');
const path = require('path');
const cors = require('cors');
const fs = require('fs').promises;
const fsSync = require('fs');
const config = require('./config');
const rateLimit = require('express-rate-limit');
const multer = require('multer');

const app = express();
const PORT = config.SERVER_CONFIG.EXPRESS_PORT;
const TTS_SERVICE_URL = config.SERVER_CONFIG.TTS_SERVICE_URL;

// ============================================================================
// UNIFIED TRANSLATIONS CACHE
// ============================================================================

let unifiedTranslations = null;

/**
 * Load unified translations file into memory
 */
async function loadUnifiedTranslations() {
    try {
        const filePath = path.join(__dirname, 'translations', 'all_languages.json');
        const content = await fs.readFile(filePath, 'utf8');
        unifiedTranslations = JSON.parse(content);
        console.log('✅ Loaded unified translations from all_languages.json');

        // Log statistics
        const languages = Object.keys(unifiedTranslations).filter(key => key !== 'categories');
        const categories = unifiedTranslations.categories ? Object.keys(unifiedTranslations.categories) : [];
        console.log(`   📊 Languages: ${languages.length}`);
        console.log(`   📊 Categories: ${categories.length}`);

        return true;
    } catch (error) {
        console.error('❌ Failed to load unified translations:', error.message);
        return false;
    }
}

/**
 * Get language data from unified translations
 */
function getLanguageData(language) {
    if (!unifiedTranslations) {
        throw new Error('Unified translations not loaded');
    }

    if (!unifiedTranslations[language]) {
        throw new Error(`Language '${language}' not found in unified translations`);
    }

    // Return language-specific data merged with shared categories
    return {
        language: unifiedTranslations[language].language,
        nativeLanguageField: unifiedTranslations[language].nativeLanguageField,
        ui: unifiedTranslations[language].ui || {},
        categoryNames: unifiedTranslations[language].categoryNames || {},
        categories: unifiedTranslations.categories || {}
    };
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Use /tmp in production (ephemeral on Render), local uploads in dev
        const uploadDir = process.env.UPLOAD_DIR || (
            process.env.NODE_ENV === 'production' 
                ? '/tmp/uploads' 
                : path.join(__dirname, 'uploads')
        );
        // Create uploads directory if it doesn't exist
        if (!fsSync.existsSync(uploadDir)) {
            fsSync.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Create unique filename with timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        // Accept only specific file types
        const allowedTypes = [
            'application/json',
            'text/plain',
            'text/csv',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JSON, TXT, CSV, Excel, and Word files are allowed.'));
        }
    }
});

// Middleware
// FIX: Configure CORS properly - restrict in production
const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? (process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : 'http://localhost:3000')
        : '*',
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security headers
app.use((req, res, next) => {
    // Disable caching for development
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');

    // Content Security Policy - More permissive for development
    // In production, tighten these directives
    const isDevelopment = process.env.NODE_ENV !== 'production';

    const cspDirectives = [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net",
        "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
        "font-src 'self' data: https://cdn.jsdelivr.net",
        "img-src 'self' data: https: blob:",
        "media-src 'self' blob: data:",
        isDevelopment
            ? "connect-src 'self' http://localhost:* ws://localhost:* wss://localhost:* http://127.0.0.1:* ws://127.0.0.1:* https://cdn.jsdelivr.net devtools://*"
            : "connect-src 'self' https://cdn.jsdelivr.net",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'"
    ].join('; ');

    res.set('Content-Security-Policy', cspDirectives);

    // Additional security headers
    res.set('X-Content-Type-Options', 'nosniff');
    res.set('X-Frame-Options', 'DENY');
    res.set('X-XSS-Protection', '1; mode=block');
    res.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    next();
});

app.use(express.static('public'));
// Translation files are NOT publicly accessible - served only via API

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// SEO Routes - Sitemap and Robots
app.get('/sitemap.xml', (req, res) => {
    res.type('application/xml');
    res.sendFile(path.join(__dirname, 'public', 'sitemap.xml'));
});

app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.sendFile(path.join(__dirname, 'public', 'robots.txt'));
});

// Rate limiting for TTS endpoint to prevent abuse
const ttsLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // 10 requests per minute per IP
    message: { error: 'Too many TTS requests, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Routes

// API endpoint to get categories for a language
app.get('/api/categories/:language', async (req, res) => {
    // FIX: Sanitize language parameter to prevent path traversal
    const language = path.basename(req.params.language);

    if (!config.isValidLanguage(language)) {
        return res.status(404).json({ error: 'Language not supported' });
    }

    try {
        const translationData = getLanguageData(language);

        // Return category names and UI labels, not the phrases
        res.json({
            language: translationData.language,
            nativeLanguageField: translationData.nativeLanguageField,
            categoryNames: translationData.categoryNames,
            ui: translationData.ui,
            categories: Object.keys(translationData.categories)
        });
    } catch (error) {
        if (error.code === 'ENOENT') {
            return res.status(404).json({ error: 'Translation file not found' });
        }
        if (error instanceof SyntaxError) {
            console.error(`Malformed JSON in ${language}:`, error);
            return res.status(500).json({ error: 'Translation file is corrupted' });
        }
        console.error(`Error loading categories for ${language}:`, error);
        res.status(500).json({ error: 'Failed to load categories' });
    }
});

// API endpoint to get phrases for a specific category
app.get('/api/phrases/:language/:category', async (req, res) => {
    // FIX: Sanitize parameters to prevent path traversal and prototype pollution
    const language = path.basename(req.params.language);
    const category = req.params.category;

    if (!config.isValidLanguage(language)) {
        return res.status(404).json({ error: 'Language not supported' });
    }

    // FIX: Validate category format to prevent prototype pollution
    if (typeof category !== 'string' || !/^[a-z_]+$/.test(category)) {
        return res.status(400).json({ error: 'Invalid category format' });
    }

    try {
        const translationData = getLanguageData(language);

        if (!translationData.categories.hasOwnProperty(category)) {
            return res.status(404).json({ error: 'Category not found' });
        }

        // Return phrases for the requested category only
        res.json({
            language: translationData.language,
            nativeLanguageField: translationData.nativeLanguageField,
            category: category,
            categoryName: translationData.categoryNames ? translationData.categoryNames[category] : category,
            phrases: translationData.categories[category]
        });
    } catch (error) {
        if (error.code === 'ENOENT') {
            return res.status(404).json({ error: 'Translation file not found' });
        }
        if (error instanceof SyntaxError) {
            console.error(`Malformed JSON in ${language}:`, error);
            return res.status(500).json({ error: 'Translation file is corrupted' });
        }
        console.error(`Error loading phrases for ${language}/${category}:`, error);
        res.status(500).json({ error: 'Failed to load phrases' });
    }
});

// API endpoint to get contextual phrases
app.get('/api/contextual/phrases', async (req, res) => {
    try {
        const fileContent = await fs.readFile(
            path.join(__dirname, 'translations_network', 'priority_contextual_phrases.json'),
            'utf8'
        );
        const phrasesData = JSON.parse(fileContent);
        res.json(phrasesData);
    } catch (error) {
        console.error('Error loading contextual phrases:', error);
        res.status(500).json({ error: 'Failed to load contextual phrases' });
    }
});

// ============================================================================
// CONTEXTUAL CONVERSATIONS API ENDPOINTS
// ============================================================================

// Get list of all available conversations
app.get('/api/conversations', async (req, res) => {
    try {
        const indexPath = path.join(__dirname, 'contextual_conversations', 'index.json');
        const fileContent = await fs.readFile(indexPath, 'utf8');
        const indexData = JSON.parse(fileContent);
        res.json(indexData);
    } catch (error) {
        console.error('Error loading conversations index:', error);
        res.status(500).json({ error: 'Failed to load conversations index' });
    }
});

// Get specific conversation by context and language
app.get('/api/conversations/:context/:language', async (req, res) => {
    const context = path.basename(req.params.context);
    const language = path.basename(req.params.language);

    // Validate inputs
    if (!/^[a-z_]+$/.test(context) || !/^[a-z_]+$/.test(language)) {
        return res.status(400).json({ error: 'Invalid context or language format' });
    }

    try {
        const conversationPath = path.join(
            __dirname,
            'contextual_conversations',
            `${context}_${language}.json`
        );
        const fileContent = await fs.readFile(conversationPath, 'utf8');
        const conversationData = JSON.parse(fileContent);
        res.json(conversationData);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return res.status(404).json({ error: 'Conversation not found' });
        }
        console.error('Error loading conversation:', error);
        res.status(500).json({ error: 'Failed to load conversation' });
    }
});

// Get all conversations for a specific context (all languages)
app.get('/api/conversations/context/:context', async (req, res) => {
    const context = path.basename(req.params.context);

    if (!/^[a-z_]+$/.test(context)) {
        return res.status(400).json({ error: 'Invalid context format' });
    }

    try {
        const indexPath = path.join(__dirname, 'contextual_conversations', 'index.json');
        const fileContent = await fs.readFile(indexPath, 'utf8');
        const indexData = JSON.parse(fileContent);

        const filtered = indexData.conversations.filter(c => c.context === context);
        res.json({ conversations: filtered });
    } catch (error) {
        console.error('Error loading conversations by context:', error);
        res.status(500).json({ error: 'Failed to load conversations' });
    }
});

// Get all conversations for a specific language (all contexts)
app.get('/api/conversations/language/:language', async (req, res) => {
    const language = path.basename(req.params.language);

    if (!config.isValidLanguage(language)) {
        return res.status(404).json({ error: 'Language not supported' });
    }

    try {
        const indexPath = path.join(__dirname, 'contextual_conversations', 'index.json');
        const fileContent = await fs.readFile(indexPath, 'utf8');
        const indexData = JSON.parse(fileContent);

        const filtered = indexData.conversations.filter(c => c.language === language);
        res.json({ conversations: filtered });
    } catch (error) {
        console.error('Error loading conversations by language:', error);
        res.status(500).json({ error: 'Failed to load conversations' });
    }
});

// ============================================================================
// EXISTING API ENDPOINTS
// ============================================================================

// API endpoint to translate a phrase from source to target language
app.get('/api/translate/:sourceLanguage/:targetLanguage/:category/:english', async (req, res) => {
    const sourceLanguage = path.basename(req.params.sourceLanguage);
    const targetLanguage = path.basename(req.params.targetLanguage);
    const category = req.params.category;
    const englishPhrase = decodeURIComponent(req.params.english);

    if (!config.isValidLanguage(sourceLanguage) || !config.isValidLanguage(targetLanguage)) {
        return res.status(404).json({ error: 'Language not supported' });
    }

    try {
        const sourceData = getLanguageData(sourceLanguage);
        const targetData = getLanguageData(targetLanguage);

        // Find the phrase in category by English text
        let phrase = null;

        if (sourceData.categories[category]) {
            phrase = sourceData.categories[category].find(p => p.english === englishPhrase);
        }

        if (!phrase) {
            return res.status(404).json({ error: 'Phrase not found' });
        }

        // Construct phonetic field names (e.g., "amharic_phonetic", "oromo_phonetic")
        const sourcePhoneticField = `${sourceLanguage}_phonetic`;
        const targetPhoneticField = `${targetLanguage}_phonetic`;

        res.json({
            source: {
                language: sourceLanguage,
                languageField: sourceData.nativeLanguageField,
                text: phrase[sourceLanguage] || phrase[sourceData.nativeLanguageField],
                phonetic: phrase[sourcePhoneticField] || null,
                english: phrase.english
            },
            target: {
                language: targetLanguage,
                languageField: targetData.nativeLanguageField,
                text: phrase[targetLanguage] || phrase[targetData.nativeLanguageField],
                phonetic: phrase[targetPhoneticField] || null,
                english: phrase.english
            },
            category: category
        });
    } catch (error) {
        console.error('Translation error:', error);
        res.status(500).json({ error: 'Failed to translate phrase' });
    }
});

// Home page
app.get('/', (req, res) => {
    res.render('index', {
        title: 'African Translator',
        languages: config.LANGUAGES,
        languageNames: config.LANGUAGE_NAMES
    });
});

// Language selection page
app.get('/start', (req, res) => {
    res.render('language-selection', {
        title: 'Choose Your Languages',
        languages: config.LANGUAGES,
        languageNames: config.LANGUAGE_NAMES
    });
});

// Translation mode page
app.get('/translate', (req, res) => {
    res.render('translate', {
        title: 'Translation Mode',
        languages: config.LANGUAGES,
        languageNames: config.LANGUAGE_NAMES
    });
});

// Participate page
app.get('/participate', (req, res) => {
    res.render('participate', {
        title: 'Participate',
        languages: config.LANGUAGES,
        languageNames: config.LANGUAGE_NAMES
    });
});

// Donate page
app.get('/donate', (req, res) => {
    res.render('donate', {
        title: 'Donate'
    });
});

// About Us page
app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Us'
    });
});

// Matching Game page
app.get('/matching-game', (req, res) => {
    res.render('matching-game', {
        title: 'Word Matching Game',
        languages: config.LANGUAGES,
        languageNames: config.LANGUAGE_NAMES
    });
});

// Conversation Matching Game page
app.get('/conversation-game', (req, res) => {
    res.render('conversation-game', {
        title: 'Conversation Matching Game',
        languages: config.LANGUAGES,
        languageNames: config.LANGUAGE_NAMES
    });
});

// API endpoint to get conversation data
app.get('/api/conversation/:context', (req, res) => {
    const context = req.params.context;
    const conversationFile = path.join(__dirname, 'contextual_conversations', `multilanguage_${context}.json`);
    
    if (!fsSync.existsSync(conversationFile)) {
        return res.status(404).json({ error: 'Conversation not found' });
    }
    
    try {
        const conversationData = JSON.parse(fsSync.readFileSync(conversationFile, 'utf8'));
        res.json(conversationData);
    } catch (error) {
        console.error('Error loading conversation:', error);
        res.status(500).json({ error: 'Failed to load conversation' });
    }
});

// API endpoint to submit translations
app.post('/api/submit-translation', upload.single('translationFile'), async (req, res) => {
    try {
        const { sourceLanguage, targetLanguage, contributorName, contributorEmail, organization, comments } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Validate required fields
        if (!sourceLanguage || !targetLanguage || !contributorName || !contributorEmail) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Log the submission (in production, you'd save to database or send email)
        const submissionData = {
            timestamp: new Date().toISOString(),
            file: {
                originalName: req.file.originalname,
                savedName: req.file.filename,
                size: req.file.size,
                path: req.file.path
            },
            sourceLanguage,
            targetLanguage,
            contributor: {
                name: contributorName,
                email: contributorEmail,
                organization: organization || 'N/A'
            },
            comments: comments || 'No comments provided'
        };

        // Save submission log
        const uploadDir = process.env.UPLOAD_DIR || (
            process.env.NODE_ENV === 'production' 
                ? '/tmp/uploads' 
                : path.join(__dirname, 'uploads')
        );
        const logPath = path.join(uploadDir, 'submissions.log');
        await fs.appendFile(logPath, JSON.stringify(submissionData, null, 2) + '\n\n');

        console.log('New translation submission:', submissionData);

        res.json({
            success: true,
            message: 'Translation submitted successfully! We will review it and get back to you.',
            submissionId: req.file.filename
        });

    } catch (error) {
        console.error('Translation submission error:', error);
        res.status(500).json({
            error: 'Failed to submit translation',
            details: error.message
        });
    }
});

// API endpoint to download translation template
app.get('/api/translation-template', (req, res) => {
    const template = {
        language: "language_name",
        nativeLanguageField: "native_field",
        categoryNames: {
            greetings: "Greetings",
            basic: "Basic Phrases",
            questions: "Common Questions",
            directions: "Directions",
            numbers: "Numbers",
            time: "Time",
            food: "Food & Dining",
            shopping: "Shopping",
            emergency: "Emergency",
            health: "Health",
            travel: "Travel",
            family: "Family",
            weather: "Weather",
            colors: "Colors",
            animals: "Animals"
        },
        ui: {
            pageTitle: "Language Name Learning",
            selectCategory: "Select a Category",
            playAudio: "Play Audio",
            stopAudio: "Stop",
            nextPhrase: "Next Phrase",
            previousPhrase: "Previous Phrase",
            shuffle: "Shuffle",
            repeat: "Repeat",
            progress: "Progress"
        },
        categories: {
            greetings: [
                {
                    english: "Hello",
                    native_field: "Translation",
                    phonetic: "Phonetic spelling"
                },
                {
                    english: "Good morning",
                    native_field: "Translation",
                    phonetic: "Phonetic spelling"
                }
            ],
            basic: [
                {
                    english: "Yes",
                    native_field: "Translation",
                    phonetic: "Phonetic spelling"
                },
                {
                    english: "No",
                    native_field: "Translation",
                    phonetic: "Phonetic spelling"
                }
            ]
        }
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="translation_template.json"');
    res.json(template);
});

// Language-specific demo pages
app.get('/demo/:language', async (req, res) => {
    // FIX: Sanitize language parameter to prevent path traversal
    const targetLanguage = path.basename(req.params.language);
    const nativeLanguage = req.query.native ? path.basename(req.query.native) : targetLanguage;

    if (!config.isValidLanguage(targetLanguage)) {
        return res.status(404).send('Target language not supported');
    }

    if (!config.isValidLanguage(nativeLanguage)) {
        return res.status(404).send('Native language not supported');
    }

    // Load UI strings from NATIVE language (the language user understands)
    let ui = {};

    try {
        const nativeData = getLanguageData(nativeLanguage);
        ui = nativeData.ui || {};
    } catch (error) {
        console.error(`Error loading UI for native language ${nativeLanguage}:`, error);
    }

    res.render('demo', {
        title: ui.pageTitle || `Learn ${config.LANGUAGE_NAMES[targetLanguage] || targetLanguage}`,
        language: targetLanguage,  // The language being learned
        nativeLanguage: nativeLanguage,  // The user's native language
        ui: ui,  // UI in native language
        languages: config.LANGUAGES,
        languageNames: config.LANGUAGE_NAMES
    });
});

// API endpoint to generate speech (with rate limiting)
app.post('/api/speak', ttsLimiter, async (req, res) => {
    try {
        const { text, language } = req.body;

        // Validate language
        if (!language || !config.isValidLanguage(language)) {
            return res.status(400).json({ error: 'Valid language is required' });
        }

        // Validate text input
        const validation = config.validateTextInput(text);
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        console.log(`Generating TTS for: "${validation.text.substring(0, 50)}..." in ${language}`);

        // Call Python TTS service
        const response = await axios.post(
            `${TTS_SERVICE_URL}/tts`,
            {
                text: validation.text,
                language: language
            },
            {
                responseType: 'arraybuffer'
            }
        );

        // Get Content-Type from Python service response (it knows the format)
        const contentType = response.headers['content-type'] || 'audio/wav';

        // Send audio back to client with correct Content-Type
        res.set({
            'Content-Type': contentType,
            'Content-Disposition': 'inline'
        });
        res.send(response.data);

    } catch (error) {
        console.error('TTS Error:', error.message);

        // Check if it's a connection error
        if (error.code === 'ECONNREFUSED') {
            return res.status(503).json({
                error: 'TTS service not available',
                details: `Python TTS service is not running on port ${config.SERVER_CONFIG.TTS_SERVICE_PORT}. Please start it first.`
            });
        }

        res.status(500).json({
            error: 'Failed to generate speech',
            details: error.response?.data || error.message
        });
    }
});

// Get available languages
app.get('/api/languages', async (req, res) => {
    try {
        const response = await axios.get(`${TTS_SERVICE_URL}/languages`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch languages' });
    }
});

// Health check
app.get('/health', async (req, res) => {
    try {
        const ttsHealth = await axios.get(`${TTS_SERVICE_URL}/health`);
        res.json({
            express: 'ok',
            tts: ttsHealth.data
        });
    } catch (error) {
        res.json({
            express: 'ok',
            tts: 'unavailable'
        });
    }
});

// Chrome DevTools well-known endpoint (silences console warning)
// This is optional - only to prevent DevTools CSP warnings
app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => {
    res.status(404).json({
        error: 'Not found',
        message: 'This endpoint is not used by this application'
    });
});

// ===== ADVANCED ROUTES (translations_network) =====

// Advanced: Category Network Browser
app.get('/advanced/categories', async (req, res) => {
    try {
        const fileContent = await fs.readFile(
            path.join(__dirname, 'translations_network', 'categories.json'),
            'utf8'
        );
        const categoriesData = JSON.parse(fileContent);
        res.render('advanced/categories', {
            title: 'Category Network Browser',
            categories: categoriesData.categories
        });
    } catch (error) {
        console.error('Error loading categories:', error);
        res.status(500).send('Failed to load categories');
    }
});

// Advanced: Network Visualizer
app.get('/advanced/visualizer', async (req, res) => {
    try {
        const fileContent = await fs.readFile(
            path.join(__dirname, 'translations_network', 'categories.json'),
            'utf8'
        );
        const categoriesData = JSON.parse(fileContent);
        res.render('advanced/visualizer', {
            title: 'Network Visualizer',
            categoriesJson: JSON.stringify(categoriesData)
        });
    } catch (error) {
        console.error('Error loading network data:', error);
        res.status(500).send('Failed to load network data');
    }
});

// Advanced: Contextual Phrases
app.get('/advanced/contextual', async (req, res) => {
    try {
        const fileContent = await fs.readFile(
            path.join(__dirname, 'translations_network', 'categories_contextual.json'),
            'utf8'
        );
        const contextualData = JSON.parse(fileContent);
        res.render('advanced/contextual', {
            title: 'Contextual Phrases',
            contextualData: contextualData
        });
    } catch (error) {
        console.error('Error loading contextual data:', error);
        res.status(500).send('Failed to load contextual data');
    }
});

// Advanced: Priority Phrases
app.get('/advanced/priority', async (req, res) => {
    try {
        const fileContent = await fs.readFile(
            path.join(__dirname, 'translations_network', 'priority_contextual_phrases.json'),
            'utf8'
        );
        const priorityData = JSON.parse(fileContent);
        res.render('advanced/priority', {
            title: 'Priority Phrases',
            priorityData: priorityData
        });
    } catch (error) {
        console.error('Error loading priority data:', error);
        res.status(500).send('Failed to load priority data');
    }
});

// Emergency Phrases Page
app.get('/emergency', async (req, res) => {
    try {
        const fileContent = await fs.readFile(
            path.join(__dirname, 'translations_network', 'priority_contextual_phrases.json'),
            'utf8'
        );
        const priorityData = JSON.parse(fileContent);

        // Filter for emergency/critical phrases
        const emergencyPhrases = priorityData.phrases.filter(phrase => {
            return phrase.subcategory === 'emergency_help' ||
                   phrase.contexts?.urgency === 'critical' ||
                   phrase.phrase_id.includes('help_urgent') ||
                   phrase.phrase_id.includes('water_request') ||
                   phrase.phrase_id.includes('hospital');
        });

        res.render('emergency', {
            title: 'Emergency Phrases',
            emergencyPhrases: emergencyPhrases
        });
    } catch (error) {
        console.error('Error loading emergency phrases:', error);
        res.status(500).send('Failed to load emergency phrases');
    }
});

// ============================================================================
// CONTEXTUAL CONVERSATIONS PAGES
// ============================================================================

// Conversations index page
app.get('/conversations', async (req, res) => {
    try {
        const indexPath = path.join(__dirname, 'contextual_conversations', 'index.json');
        const fileContent = await fs.readFile(indexPath, 'utf8');
        const indexData = JSON.parse(fileContent);

        // Try to get native language from query parameter (for UI)
        const nativeLanguage = req.query.native ? path.basename(req.query.native) : 'english';

        // Load UI strings from native language
        let ui = {};
        try {
            if (config.isValidLanguage(nativeLanguage)) {
                const nativeData = getLanguageData(nativeLanguage);
                ui = nativeData.ui || {};
            }
        } catch (error) {
            console.error(`Error loading UI for native language ${nativeLanguage}:`, error);
        }

        res.render('conversations/index', {
            title: ui.conversationsTitle || 'Contextual Conversations',
            indexData: indexData,
            nativeLanguage: nativeLanguage,
            ui: ui,
            languages: config.LANGUAGES,
            languageNames: config.LANGUAGE_NAMES
        });
    } catch (error) {
        console.error('Error loading conversations index:', error);
        res.status(500).send('Failed to load conversations');
    }
});

// Legacy route compatibility - redirect old 2-parameter URLs to new 3-parameter format
app.get('/conversations/:context/:language', async (req, res) => {
    const context = req.params.context;
    const language = req.params.language;
    // Default native language to English for backward compatibility
    res.redirect(`/conversations/${context}/english/${language}`);
});

// Specific conversation viewer - Updated for multi-language files
// URL format: /conversations/:context/:nativeLanguage/:targetLanguage
app.get('/conversations/:context/:nativeLanguage/:targetLanguage', async (req, res) => {
    const context = path.basename(req.params.context);
    const nativeLanguage = path.basename(req.params.nativeLanguage);
    const targetLanguage = path.basename(req.params.targetLanguage);

    // Validate context and languages
    if (!/^[a-z_]+$/.test(context) ||
        !config.isValidLanguage(nativeLanguage) ||
        !config.isValidLanguage(targetLanguage)) {
        return res.status(404).send('Conversation not found');
    }

    try {
        // Try to load multi-language file first
        const multiLangPath = path.join(
            __dirname,
            'contextual_conversations',
            `multilanguage_${context}.json`
        );

        let conversationData;
        let isMultiLanguage = false;

        try {
            const fileContent = await fs.readFile(multiLangPath, 'utf8');
            conversationData = JSON.parse(fileContent);
            isMultiLanguage = true;
        } catch (error) {
            // Fallback to old single-language format for backward compatibility
            const singleLangPath = path.join(
                __dirname,
                'contextual_conversations',
                `${context}_${targetLanguage}.json`
            );
            const fileContent = await fs.readFile(singleLangPath, 'utf8');
            conversationData = JSON.parse(fileContent);
            isMultiLanguage = false;
        }

        // Extract conversation title based on format
        let conversationTitle;
        if (isMultiLanguage) {
            conversationTitle = conversationData.conversation_title?.[targetLanguage] ||
                              conversationData.conversation_title?.english ||
                              'Conversation';
        } else {
            conversationTitle = conversationData.conversation_title || 'Conversation';
        }

        // Load UI strings from NATIVE language (the language user understands)
        let ui = {};
        try {
            const nativeData = getLanguageData(nativeLanguage);
            ui = nativeData.ui || {};
        } catch (error) {
            console.error(`Error loading UI for native language ${nativeLanguage}:`, error);
        }

        res.render('conversations/viewer', {
            title: conversationTitle,
            conversation: conversationData,
            context: context,
            nativeLanguage: nativeLanguage,
            targetLanguage: targetLanguage,
            nativeLanguageName: config.LANGUAGE_NAMES[nativeLanguage],
            targetLanguageName: config.LANGUAGE_NAMES[targetLanguage],
            isMultiLanguage: isMultiLanguage,
            ui: ui,  // UI strings in native language
            languages: config.LANGUAGES,
            languageNames: config.LANGUAGE_NAMES
        });
    } catch (error) {
        if (error.code === 'ENOENT') {
            return res.status(404).send('Conversation not found for this context and language combination');
        }
        console.error('Error loading conversation:', error);
        res.status(500).send('Failed to load conversation');
    }
});

// API endpoint to get full categories data for advanced features
app.get('/api/advanced/categories', async (req, res) => {
    try {
        const fileContent = await fs.readFile(
            path.join(__dirname, 'translations_network', 'categories.json'),
            'utf8'
        );
        const categoriesData = JSON.parse(fileContent);
        res.json(categoriesData);
    } catch (error) {
        console.error('Error loading categories:', error);
        res.status(500).json({ error: 'Failed to load categories' });
    }
});

// Start server
async function startServer() {
    // Load unified translations first
    const loaded = await loadUnifiedTranslations();

    if (!loaded) {
        console.error('❌ Failed to load translations. Server cannot start.');
        process.exit(1);
    }

    app.listen(PORT, () => {
        console.log(`\n${'='.repeat(50)}`);
        console.log(`🚀 Express Server running on http://localhost:${PORT}`);
        console.log(`🎤 Make sure Python TTS service is running on port ${config.SERVER_CONFIG.TTS_SERVICE_PORT}`);
        console.log(`${'='.repeat(50)}\n`);
    });
}

// Start the server
startServer().catch(error => {
    console.error('❌ Server startup failed:', error);
    process.exit(1);
});
