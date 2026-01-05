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

const app = express();
const PORT = config.SERVER_CONFIG.EXPRESS_PORT;
const TTS_SERVICE_URL = config.SERVER_CONFIG.TTS_SERVICE_URL;

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

// Home page
app.get('/', (req, res) => {
    res.render('index', {
        title: 'African Translator',
        languages: config.LANGUAGES,
        languageNames: config.LANGUAGE_NAMES
    });
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
