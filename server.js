/**
 * Express Server for Multi-language TTS Game
 * Integrates with Python TTS service
 */

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
const TTS_SERVICE_URL = 'http://localhost:5000';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

// Routes

// API endpoint to get categories for a language
app.get('/api/categories/:language', (req, res) => {
    const language = req.params.language;
    const validLanguages = ['spanish', 'french', 'amharic', 'tigrinya', 'oromo', 'somali', 'arabic', 'hadiyaa', 'wolyitta', 'afar', 'gamo'];
    
    if (!validLanguages.includes(language)) {
        return res.status(404).json({ error: 'Language not supported' });
    }
    
    const fs = require('fs');
    const translationPath = path.join(__dirname, 'translations', `${language}.json`);
    
    try {
        const translationData = JSON.parse(fs.readFileSync(translationPath, 'utf8'));
        
        // Return only category names, not the phrases
        res.json({
            language: translationData.language,
            nativeLanguageField: translationData.nativeLanguageField,
            categoryNames: translationData.categoryNames,
            categories: Object.keys(translationData.categories)
        });
    } catch (error) {
        console.error(`Error loading categories for ${language}:`, error);
        res.status(500).json({ error: 'Failed to load categories' });
    }
});

// API endpoint to get phrases for a specific category
app.get('/api/phrases/:language/:category', (req, res) => {
    const { language, category } = req.params;
    const validLanguages = ['spanish', 'french', 'amharic', 'tigrinya', 'oromo', 'somali', 'arabic', 'hadiyaa', 'wolyitta', 'afar', 'gamo'];
    
    if (!validLanguages.includes(language)) {
        return res.status(404).json({ error: 'Language not supported' });
    }
    
    const fs = require('fs');
    const translationPath = path.join(__dirname, 'translations', `${language}.json`);
    
    try {
        const translationData = JSON.parse(fs.readFileSync(translationPath, 'utf8'));
        
        if (!translationData.categories[category]) {
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
        console.error(`Error loading phrases for ${language}/${category}:`, error);
        res.status(500).json({ error: 'Failed to load phrases' });
    }
});

// Home page
app.get('/', (req, res) => {
    res.render('index', {
        title: 'Multi-language TTS Game',
        languages: ['spanish', 'french', 'amharic', 'tigrinya', 'oromo', 'somali', 'arabic', 'hadiyaa', 'wolyitta', 'afar', 'gamo']
    });
});

// Language-specific demo pages
app.get('/demo/:language', (req, res) => {
    const language = req.params.language;
    const validLanguages = ['spanish', 'french', 'amharic', 'tigrinya', 'oromo', 'somali', 'arabic', 'hadiyaa', 'wolyitta', 'afar', 'gamo'];
    
    if (!validLanguages.includes(language)) {
        return res.status(404).send('Language not supported');
    }
    
    // Load translation file to get UI strings
    const fs = require('fs');
    const translationPath = path.join(__dirname, 'translations', `${language}.json`);
    let ui = {};
    
    try {
        const translationData = JSON.parse(fs.readFileSync(translationPath, 'utf8'));
        ui = translationData.ui || {};
    } catch (error) {
        console.error(`Error loading translations for ${language}:`, error);
    }
    
    res.render('demo', {
        title: ui.pageTitle || `${language.charAt(0).toUpperCase() + language.slice(1)} TTS Demo`,
        language: language,
        ui: ui
    });
});

// API endpoint to generate speech
app.post('/api/speak', async (req, res) => {
    try {
        const { text, language } = req.body;
        
        if (!text || !language) {
            return res.status(400).json({ error: 'Text and language are required' });
        }
        
        console.log(`Generating TTS for: "${text}" in ${language}`);
        
        // Call Python TTS service
        const response = await axios.post(
            `${TTS_SERVICE_URL}/tts`,
            {
                text: text,
                language: language
            },
            {
                responseType: 'arraybuffer'
            }
        );
        
        // Send audio back to client
        res.set({
            'Content-Type': 'audio/wav',
            'Content-Disposition': 'inline'
        });
        res.send(response.data);
        
    } catch (error) {
        console.error('TTS Error:', error.message);
        console.error('Full error:', error);
        
        // Check if it's a connection error
        if (error.code === 'ECONNREFUSED') {
            return res.status(503).json({ 
                error: 'TTS service not available',
                details: 'Python TTS service is not running on port 5000. Please start it first.'
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

// Start server
app.listen(PORT, () => {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`🚀 Express Server running on http://localhost:${PORT}`);
    console.log(`🎤 Make sure Python TTS service is running on port 5000`);
    console.log(`${'='.repeat(50)}\n`);
});
