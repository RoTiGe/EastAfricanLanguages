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
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = config.SERVER_CONFIG.EXPRESS_PORT;
const TTS_SERVICE_URL = config.SERVER_CONFIG.TTS_SERVICE_URL;

// ============================================================================
// MONGODB CONNECTION
// ============================================================================

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sound_training';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.log('⚠️ MongoDB connection optional:', err.message));

// Import Advert model
const Advert = require('./models/advert');

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
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://code.jquery.com",
        "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
        "font-src 'self' data: https://cdn.jsdelivr.net",
        "img-src 'self' data: https: blob:",
        "media-src 'self' blob: data:",
            isDevelopment
                ? "connect-src 'self' http://localhost:* ws://localhost:* wss://localhost:* http://127.0.0.1:* ws://127.0.0.1:* https://cdn.jsdelivr.net"
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

// In-memory store for demo (replace with DB in production)
const pendingAdverts = {};
const verifiedAdverts = [];
const crypto = require('crypto');

// GET: Advertiser upload page
app.get('/advertiser/upload', (req, res) => {
    res.render('advertiser_upload', {
        title: 'Upload Advert',
        languages: config.LANGUAGES,
        languageNames: config.LANGUAGE_NAMES
    });
});

// POST: Handle advert upload and send verification email
app.post('/advertiser/upload', upload.single('file'), async (req, res) => {
    const { email, language, content } = req.body;
    if (!config.isValidLanguage(language)) {
        return res.status(400).send('Invalid language selected.');
    }
    // Generate verification token
    const token = crypto.randomBytes(24).toString('hex');
    pendingAdverts[token] = {
        email,
        language,
        content,
        file: req.file ? req.file.filename : null,
        verified: false
    };
    // TODO: Send verification email with link (placeholder)
    const verifyUrl = `${req.protocol}://${req.get('host')}/advertiser/verify/${token}`;
    console.log(`Verification link for ${email}: ${verifyUrl}`);
    res.render('advertiser_upload', {
        title: 'Upload Advert',
        languages: config.LANGUAGES,
        languageNames: config.LANGUAGE_NAMES,
        message: 'Check your email for a verification link to publish your advert.'
    });
});

// GET: Email verification link
app.get('/advertiser/verify/:token', (req, res) => {
    const { token } = req.params;
    const advert = pendingAdverts[token];
    if (!advert) {
        return res.status(404).send('Invalid or expired verification link.');
    }
    advert.verified = true;
    verifiedAdverts.push(advert);
    delete pendingAdverts[token];
    res.render('advertiser_upload', {
        title: 'Upload Advert',
        languages: config.LANGUAGES,
        languageNames: config.LANGUAGE_NAMES,
        message: 'Your advert is now published!'
    });
});

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
        title: 'Language Bridge - Free Multi-Language Translator',
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

// Close to Heart - Religious/Spiritual content page
app.get('/close-to-heart', async (req, res) => {
    try {
        // Get language selections from query params (with defaults)
        const nativeLanguage = req.query.native && config.isValidLanguage(req.query.native)
            ? req.query.native : 'english';
        const targetLanguage = req.query.target && config.isValidLanguage(req.query.target)
            ? req.query.target : 'amharic';

        // Load the content index for dynamic content loading
        const indexPath = path.join(__dirname, 'contextual_conversations', 'religious_content_index.json');
        const contentIndex = JSON.parse(await fs.readFile(indexPath, 'utf8'));

        // Load all enabled content files dynamically
        const religiousContent = [];
        for (const item of contentIndex.content_files.filter(f => f.enabled)) {
            try {
                const filePath = path.join(__dirname, 'contextual_conversations', item.file);
                const content = JSON.parse(await fs.readFile(filePath, 'utf8'));
                religiousContent.push({
                    id: item.id,
                    icon: item.icon,
                    color: item.color,
                    order: item.order,
                    data: content
                });
            } catch (fileError) {
                console.warn(`Warning: Could not load ${item.file}:`, fileError.message);
            }
        }

        // Sort by order
        religiousContent.sort((a, b) => a.order - b.order);

        res.render('close-to-heart', {
            title: 'Close to Heart - Spiritual Wisdom',
            languages: config.LANGUAGES,
            languageNames: config.LANGUAGE_NAMES,
            religiousContent: religiousContent,
            nativeLanguage: nativeLanguage,
            targetLanguage: targetLanguage
        });
    } catch (error) {
        console.error('Error loading spiritual content:', error);
        res.status(500).render('error', { message: 'Failed to load spiritual content' });
    }
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

// Learn Letters page
app.get('/learn-letters', (req, res) => {
    // Load alphabets data from JSON file
    let alphabets = {};
    let pronunciationTranslations = {};
    try {
        const alphabetsPath = path.join(__dirname, 'data', 'alphabets.json');
        if (fsSync.existsSync(alphabetsPath)) {
            alphabets = JSON.parse(fsSync.readFileSync(alphabetsPath, 'utf8'));
        }
        // Load pronunciation translations for native language support
        const pronunciationPath = path.join(__dirname, 'data', 'pronunciation_translations.json');
        if (fsSync.existsSync(pronunciationPath)) {
            pronunciationTranslations = JSON.parse(fsSync.readFileSync(pronunciationPath, 'utf8'));
        }
    } catch (err) {
        console.error('Error loading alphabets or pronunciation data:', err);
    }

    res.render('learn-letters', {
        title: 'Learn to Read & Spell Letters',
        languages: config.LANGUAGES,
        languageNames: config.LANGUAGE_NAMES,
        alphabets: alphabets,
        pronunciationTranslations: pronunciationTranslations
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

// API endpoint to get the Beatitudes conversation (special context)
app.get('/api/conversation/the_beatitu', (req, res) => {
    const beatituFile = path.join(__dirname, 'contextual_conversations', 'the beatitu.json');
    if (!fsSync.existsSync(beatituFile)) {
        return res.status(404).json({ error: 'Beatitudes conversation not found' });
    }
    try {
        const beatituData = JSON.parse(fsSync.readFileSync(beatituFile, 'utf8'));
        res.json(beatituData);
    } catch (error) {
        console.error('Error loading Beatitudes conversation:', error);
        res.status(500).json({ error: 'Failed to load Beatitudes conversation' });
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

        // Clean phonetic text for better TTS pronunciation:
        // - Remove dashes (syllable separators) so TTS reads it smoothly
        // - Collapse multiple spaces into single space
        let ttsText = validation.text
            .replace(/-/g, '')           // Remove all dashes
            .replace(/\s+/g, ' ')        // Collapse multiple spaces
            .trim();

        console.log(`Generating TTS for: "${ttsText.substring(0, 50)}..." in ${language}`);

        // Call Python TTS service
        const response = await axios.post(
            `${TTS_SERVICE_URL}/tts`,
            {
                text: ttsText,
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
app.get('/demo/:language', async (req, res) => {
    const language = path.basename(req.params.language);
    if (!config.isValidLanguage(language)) {
        return res.status(404).render('error', { message: 'Language not supported' });
    }
    try {
        const translationData = getLanguageData(language);
        // Find a verified advert for this language (show the first one)
        const advertForLanguage = verifiedAdverts.find(a => a.language === language);
        res.render('demo', {
            title: `Demo: ${config.LANGUAGE_NAMES[language] || language}`,
            language,
            languages: config.LANGUAGES,
            languageNames: config.LANGUAGE_NAMES,
            ui: translationData.ui || {},
            nativeLanguage: req.query.native || language,
            advertForLanguage
        });
    } catch (error) {
        res.status(500).render('error', { message: 'Failed to load language data' });
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
app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => {
    // Set a permissive CSP for this endpoint only to silence DevTools warning
    res.set('Content-Security-Policy', [
        "default-src 'none'",
        "connect-src 'self' devtools://* http://localhost:3000 http://127.0.0.1:3000",
    ].join('; '));
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

        // Find a verified advert for the native language (show the first one)
        const advertForLanguage = verifiedAdverts.find(a => a.language === nativeLanguage);
        res.render('conversations/index', {
            title: ui.conversationsTitle || 'Contextual Conversations',
            indexData: indexData,
            nativeLanguage: nativeLanguage,
            ui: ui,
            languages: config.LANGUAGES,
            languageNames: config.LANGUAGE_NAMES,
            advertForLanguage
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
            const parsed = JSON.parse(fileContent);
            // Only use the multilanguage file if it actually has stages populated
            if (!parsed.stages || parsed.stages.length === 0) {
                throw new Error('Multilanguage file has no stages — falling back to single-language file');
            }
            conversationData = parsed;
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

// ============================================================================
// ADVERT ROUTES
// ============================================================================

// Configure multer for advert image uploads
const advertStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, 'public', 'uploads', 'adverts');
        if (!fsSync.existsSync(uploadDir)) {
            fsSync.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const advertUpload = multer({
    storage: advertStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

// Get all verified adverts (public)
app.get('/api/adverts', async (req, res) => {
    try {
        const { language } = req.query;
        const filter = { verified: true, expiresAt: { $gt: new Date() } };
        if (language) filter.language = language;

        const adverts = await Advert.find(filter).sort({ createdAt: -1 }).limit(20);
        res.json(adverts);
    } catch (error) {
        console.error('Error fetching adverts:', error);
        res.status(500).json({ error: 'Failed to fetch adverts' });
    }
});

// Get adverts by language
app.get('/api/adverts/language/:language', async (req, res) => {
    try {
        const language = req.params.language;
        const adverts = await Advert.find({
            language,
            verified: true,
            expiresAt: { $gt: new Date() }
        }).sort({ createdAt: -1 });
        res.json(adverts);
    } catch (error) {
        console.error('Error fetching adverts:', error);
        res.status(500).json({ error: 'Failed to fetch adverts' });
    }
});

// Submit a new advert
app.post('/api/adverts', advertUpload.single('image'), async (req, res) => {
    try {
        const { email, language, title, description } = req.body;

        if (!email || !language || !title || !description) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Generate verification token
        const verificationToken = uuidv4();

        // Set expiration to 30 days from now
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);

        const advert = new Advert({
            email,
            language,
            title,
            description,
            imagePath: req.file ? `/uploads/adverts/${req.file.filename}` : null,
            verificationToken,
            expiresAt,
            verified: false
        });

        await advert.save();

        // In production, you would send a verification email here
        console.log(`📧 Verification link: /api/adverts/verify/${verificationToken}`);

        res.status(201).json({
            message: 'Advert submitted successfully. Please check your email for verification.',
            advertId: advert._id
        });
    } catch (error) {
        console.error('Error creating advert:', error);
        res.status(500).json({ error: 'Failed to create advert' });
    }
});

// Verify an advert
app.get('/api/adverts/verify/:token', async (req, res) => {
    try {
        const advert = await Advert.findOne({ verificationToken: req.params.token });

        if (!advert) {
            return res.status(404).json({ error: 'Invalid verification token' });
        }

        advert.verified = true;
        advert.verificationToken = null;
        await advert.save();

        res.json({ message: 'Advert verified successfully!' });
    } catch (error) {
        console.error('Error verifying advert:', error);
        res.status(500).json({ error: 'Failed to verify advert' });
    }
});

// Delete an advert (by email owner)
app.delete('/api/adverts/:id', async (req, res) => {
    try {
        const { email } = req.body;
        const advert = await Advert.findById(req.params.id);

        if (!advert) {
            return res.status(404).json({ error: 'Advert not found' });
        }

        if (advert.email !== email) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        // Delete the image file if it exists
        if (advert.imagePath) {
            const imagePath = path.join(__dirname, 'public', advert.imagePath);
            if (fsSync.existsSync(imagePath)) {
                fsSync.unlinkSync(imagePath);
            }
        }

        await Advert.findByIdAndDelete(req.params.id);
        res.json({ message: 'Advert deleted successfully' });
    } catch (error) {
        console.error('Error deleting advert:', error);
        res.status(500).json({ error: 'Failed to delete advert' });
    }
});

// Adverts page
app.get('/adverts', (req, res) => {
    res.render('adverts', {
        title: 'Community Adverts',
        languages: config.LANGUAGES,
        languageNames: config.LANGUAGE_NAMES
    });
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
