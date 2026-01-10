/**
 * Script to add missing languages (hadiyaa, wolyitta, afar, gamo) to all_languages.json
 */

const fs = require('fs');
const path = require('path');

// Load the main all_languages.json file
const allLanguagesPath = path.join(__dirname, 'all_languages.json');
const allLanguages = JSON.parse(fs.readFileSync(allLanguagesPath, 'utf8'));

// Languages to add
const languagesToAdd = ['hadiyaa', 'wolyitta', 'afar', 'gamo'];

// Category mapping (English category names to keys used in all_languages.json)
const categoryMap = {
    'actions': 'actions',
    'animals': 'animals',
    'basics': 'basics',
    'body': 'body',
    'clothing': 'clothing',
    'colors': 'colors',
    'descriptive': 'descriptive',
    'emotions': 'emotions',
    'equipment': 'equipment',
    'family': 'family',
    'food': 'food',
    'holidays': 'holidays',
    'house': 'house',
    'medical': 'medical',
    'military': 'military',
    'music': 'music',
    'nature': 'nature',
    'numbers': 'numbers',
    'objects': 'objects',
    'outcomes': 'outcomes',
    'people': 'people',
    'places': 'places',
    'political': 'political',
    'qualities': 'qualities',
    'school': 'school',
    'seasons': 'seasons',
    'shapes': 'shapes',
    'tactics': 'tactics',
    'time': 'time',
    'toys': 'toys',
    'transport': 'transport',
    'vehicles': 'vehicles',
    'weapons': 'weapons',
    'weather': 'weather'
};

console.log('🔄 Adding missing languages to all_languages.json...\n');

// Process each language
for (const lang of languagesToAdd) {
    console.log(`Processing ${lang}...`);
    
    // Load individual language file
    const langFilePath = path.join(__dirname, `${lang}.json`);
    
    if (!fs.existsSync(langFilePath)) {
        console.log(`  ⚠️  File not found: ${langFilePath}`);
        continue;
    }
    
    const langData = JSON.parse(fs.readFileSync(langFilePath, 'utf8'));
    
    // Create language entry for all_languages.json
    const languageEntry = {
        language: langData.language || lang,
        nativeLanguageField: langData.nativeLanguageField || lang,
        ui: langData.ui || {},
        categoryNames: {}
    };
    
    // Extract category names from the phrases
    // We'll use the first phrase in each category to get the category name
    if (langData.categories) {
        for (const [categoryKey, phrases] of Object.entries(langData.categories)) {
            const normalizedKey = categoryKey.toLowerCase();
            const mappedKey = categoryMap[normalizedKey] || normalizedKey;
            
            // For now, use English category names as placeholders
            // These should be translated properly later
            languageEntry.categoryNames[mappedKey] = categoryKey;
            languageEntry.categoryNames[`${mappedKey}_phonetic`] = categoryKey.toLowerCase();
        }
    }
    
    // Add the language entry to all_languages.json
    allLanguages[lang] = languageEntry;
    
    // Now update the categories section with phrases from this language
    if (langData.categories && allLanguages.categories) {
        for (const [categoryKey, phrases] of Object.entries(langData.categories)) {
            const normalizedKey = categoryKey.toLowerCase();
            const mappedKey = categoryMap[normalizedKey] || normalizedKey;
            
            if (allLanguages.categories[mappedKey]) {
                // Add translations for each phrase
                for (const phrase of phrases) {
                    const englishText = phrase.english;
                    
                    // Find matching phrase in all_languages.json categories
                    const existingPhrase = allLanguages.categories[mappedKey].find(
                        p => p.english === englishText
                    );
                    
                    if (existingPhrase) {
                        // Add the translation
                        existingPhrase[lang] = phrase[lang] || phrase[langData.nativeLanguageField];
                        if (phrase[`${lang}_phonetic`] || phrase[`${langData.nativeLanguageField}_phonetic`]) {
                            existingPhrase[`${lang}_phonetic`] = phrase[`${lang}_phonetic`] || phrase[`${langData.nativeLanguageField}_phonetic`];
                        }
                    }
                }
            }
        }
    }
    
    console.log(`  ✅ Added ${lang}`);
}

// Save the updated all_languages.json
fs.writeFileSync(allLanguagesPath, JSON.stringify(allLanguages, null, 2), 'utf8');

console.log('\n✅ Successfully updated all_languages.json!');
console.log(`📊 Total languages: ${Object.keys(allLanguages).filter(k => k !== 'categories').length}`);

