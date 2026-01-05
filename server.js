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

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, 'uploads');
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

// Disable caching for development
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
});

app.use(express.static('public'));
// Translation files are NOT publicly accessible - served only via API

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

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

    const translationPath = path.join(__dirname, 'translations', `${language}.json`);

    try {
        // FIX: Use async file reading to prevent blocking event loop
        const fileContent = await fs.readFile(translationPath, 'utf8');
        const translationData = JSON.parse(fileContent);

        // Return only category names, not the phrases
        res.json({
            language: translationData.language,
            nativeLanguageField: translationData.nativeLanguageField,
            categoryNames: translationData.categoryNames,
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

    const translationPath = path.join(__dirname, 'translations', `${language}.json`);

    try {
        // FIX: Use async file reading to prevent blocking event loop
        const fileContent = await fs.readFile(translationPath, 'utf8');
        const translationData = JSON.parse(fileContent);

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
        // Load both source and target language files
        const sourceContent = await fs.readFile(
            path.join(__dirname, 'translations', `${sourceLanguage}.json`),
            'utf8'
        );
        const targetContent = await fs.readFile(
            path.join(__dirname, 'translations', `${targetLanguage}.json`),
            'utf8'
        );

        const sourceData = JSON.parse(sourceContent);
        const targetData = JSON.parse(targetContent);

        // Find the phrase in source language by English text
        let sourcePhrase = null;
        let targetPhrase = null;

        if (sourceData.categories[category]) {
            sourcePhrase = sourceData.categories[category].find(p => p.english === englishPhrase);
        }

        if (targetData.categories[category]) {
            targetPhrase = targetData.categories[category].find(p => p.english === englishPhrase);
        }

        if (!sourcePhrase || !targetPhrase) {
            return res.status(404).json({ error: 'Phrase not found in one or both languages' });
        }

        res.json({
            source: {
                language: sourceLanguage,
                languageField: sourceData.nativeLanguageField,
                text: sourcePhrase[sourceData.nativeLanguageField],
                phonetic: sourcePhrase.phonetic,
                english: sourcePhrase.english
            },
            target: {
                language: targetLanguage,
                languageField: targetData.nativeLanguageField,
                text: targetPhrase[targetData.nativeLanguageField],
                phonetic: targetPhrase.phonetic,
                english: targetPhrase.english
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
        const logPath = path.join(__dirname, 'uploads', 'submissions.log');
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
    const language = path.basename(req.params.language);

    if (!config.isValidLanguage(language)) {
        return res.status(404).send('Language not supported');
    }

    // Load translation file to get UI strings
    const translationPath = path.join(__dirname, 'translations', `${language}.json`);
    let ui = {};

    try {
        // FIX: Use async file reading to prevent blocking event loop
        const fileContent = await fs.readFile(translationPath, 'utf8');
        const translationData = JSON.parse(fileContent);
        ui = translationData.ui || {};
    } catch (error) {
        console.error(`Error loading translations for ${language}:`, error);
    }

    res.render('demo', {
        title: ui.pageTitle || `${language.charAt(0).toUpperCase() + language.slice(1)} TTS Demo`,
        language: language,
        ui: ui,
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
app.listen(PORT, () => {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`🚀 Express Server running on http://localhost:${PORT}`);
    console.log(`🎤 Make sure Python TTS service is running on port ${config.SERVER_CONFIG.TTS_SERVICE_PORT}`);
    console.log(`${'='.repeat(50)}\n`);
});
