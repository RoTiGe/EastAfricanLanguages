/**
 * Migration Script: Merge all translation files into unified structure
 * 
 * This script:
 * 1. Reads all individual language JSON files from translations/
 * 2. Merges them into a single unified structure
 * 3. Removes duplication
 * 4. Adds phrase IDs
 * 5. Organizes data efficiently
 */

const fs = require('fs').promises;
const path = require('path');

// List of all language files to merge
const LANGUAGE_FILES = [
    'afar', 'amharic', 'arabic', 'chinese', 'english', 'french',
    'gamo', 'hadiyaa', 'italian', 'kinyarwanda', 'kirundi', 'luo',
    'oromo', 'somali', 'spanish', 'swahili', 'tigrigna', 'tigrinya', 'wolyitta'
];

async function migrateToUnified() {
    console.log('🚀 Starting migration to unified translation structure...\n');

    const translationsDir = path.join(__dirname, '..', 'translations');
    const outputFile = path.join(translationsDir, 'unified_translations.json');

    // Step 1: Load all language files
    console.log('📖 Step 1: Loading all language files...');
    const languageData = {};
    
    for (const lang of LANGUAGE_FILES) {
        const filePath = path.join(translationsDir, `${lang}.json`);
        try {
            const content = await fs.readFile(filePath, 'utf8');
            languageData[lang] = JSON.parse(content);
            console.log(`   ✅ Loaded ${lang}.json`);
        } catch (error) {
            console.log(`   ⚠️  Skipped ${lang}.json (${error.message})`);
        }
    }

    console.log(`\n✅ Loaded ${Object.keys(languageData).length} language files\n`);

    // Step 2: Build unified structure
    console.log('🔨 Step 2: Building unified structure...');

    const unified = {
        version: '2.0',
        format: 'unified',
        generatedAt: new Date().toISOString(),
        languages: {},
        categoryNames: {},
        phrases: []
    };

    // Step 2a: Extract language metadata and UI strings
    console.log('   📝 Extracting language metadata...');
    for (const [lang, data] of Object.entries(languageData)) {
        unified.languages[lang] = {
            name: getLanguageName(lang),
            nativeField: data.nativeLanguageField || lang,
            ui: data.ui || {}
        };
    }

    // Step 2b: Extract category names
    console.log('   📝 Extracting category names...');
    const allCategories = new Set();
    
    // Collect all unique categories
    for (const data of Object.values(languageData)) {
        if (data.categories) {
            Object.keys(data.categories).forEach(cat => allCategories.add(cat));
        }
    }

    // Build category names object
    for (const category of allCategories) {
        unified.categoryNames[category] = {};
        for (const [lang, data] of Object.entries(languageData)) {
            if (data.categoryNames && data.categoryNames[category]) {
                unified.categoryNames[category][lang] = data.categoryNames[category];
            }
        }
    }

    console.log(`   ✅ Found ${allCategories.size} categories\n`);

    // Step 3: Merge phrases (most complex part)
    console.log('🔀 Step 3: Merging phrases from all languages...');
    
    const phraseMap = new Map(); // Key: category_english, Value: merged phrase object
    let totalPhrases = 0;

    for (const [lang, data] of Object.entries(languageData)) {
        if (!data.categories) continue;

        for (const [category, phrases] of Object.entries(data.categories)) {
            if (!Array.isArray(phrases)) continue;

            for (const phrase of phrases) {
                const englishText = phrase.english;
                if (!englishText) continue;

                const key = `${category}|||${englishText}`;
                
                if (!phraseMap.has(key)) {
                    // Create new phrase entry
                    phraseMap.set(key, {
                        id: `${category}_${sanitizeId(englishText)}`,
                        category: category,
                        english: englishText
                    });
                }

                // Add all language translations from this phrase
                const mergedPhrase = phraseMap.get(key);
                for (const [field, value] of Object.entries(phrase)) {
                    if (field !== 'english' && value && value.trim() !== '') {
                        mergedPhrase[field] = value;
                    }
                }
            }
        }
    }

    unified.phrases = Array.from(phraseMap.values());
    totalPhrases = unified.phrases.length;

    console.log(`   ✅ Merged ${totalPhrases} unique phrases\n`);

    // Step 4: Sort phrases by category and English text
    console.log('📊 Step 4: Sorting phrases...');
    unified.phrases.sort((a, b) => {
        if (a.category !== b.category) {
            return a.category.localeCompare(b.category);
        }
        return a.english.localeCompare(b.english);
    });

    // Step 5: Write unified file
    console.log('💾 Step 5: Writing unified file...');
    await fs.writeFile(outputFile, JSON.stringify(unified, null, 2), 'utf8');
    
    console.log(`   ✅ Written to: ${outputFile}\n`);

    // Step 6: Generate statistics
    console.log('📊 Step 6: Generating statistics...\n');

    const stats = {
        totalLanguages: Object.keys(unified.languages).length,
        totalCategories: Object.keys(unified.categoryNames).length,
        totalPhrases: unified.phrases.length,
        phrasesPerCategory: {},
        languageCoverage: {}
    };

    // Count phrases per category
    for (const phrase of unified.phrases) {
        stats.phrasesPerCategory[phrase.category] =
            (stats.phrasesPerCategory[phrase.category] || 0) + 1;
    }

    // Calculate language coverage
    for (const lang of Object.keys(unified.languages)) {
        let count = 0;
        for (const phrase of unified.phrases) {
            if (phrase[lang] && phrase[lang].trim() !== '') {
                count++;
            }
        }
        stats.languageCoverage[lang] = {
            translated: count,
            total: totalPhrases,
            percentage: ((count / totalPhrases) * 100).toFixed(1) + '%'
        };
    }

    // Print summary
    console.log('═══════════════════════════════════════════════════════');
    console.log('                  MIGRATION SUMMARY                    ');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`✅ Total Languages:  ${stats.totalLanguages}`);
    console.log(`✅ Total Categories: ${stats.totalCategories}`);
    console.log(`✅ Total Phrases:    ${stats.totalPhrases}`);
    console.log('');
    console.log('📊 Top 10 Categories by Phrase Count:');

    const topCategories = Object.entries(stats.phrasesPerCategory)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

    for (const [cat, count] of topCategories) {
        console.log(`   ${cat.padEnd(20)} ${count.toString().padStart(4)} phrases`);
    }

    console.log('');
    console.log('🌍 Language Coverage:');

    const sortedCoverage = Object.entries(stats.languageCoverage)
        .sort((a, b) => b[1].translated - a[1].translated);

    for (const [lang, coverage] of sortedCoverage) {
        const bar = '█'.repeat(Math.floor(parseFloat(coverage.percentage) / 5));
        console.log(`   ${lang.padEnd(15)} ${coverage.percentage.padStart(6)} ${bar}`);
    }

    console.log('');
    console.log('═══════════════════════════════════════════════════════');
    console.log('✅ Migration completed successfully!');
    console.log(`📁 Output file: ${path.basename(outputFile)}`);
    console.log('═══════════════════════════════════════════════════════\n');

    // Save statistics to file
    const statsFile = path.join(translationsDir, 'migration_stats.json');
    await fs.writeFile(statsFile, JSON.stringify(stats, null, 2), 'utf8');
    console.log(`📊 Statistics saved to: migration_stats.json\n`);
}

/**
 * Get human-readable language name
 */
function getLanguageName(lang) {
    const names = {
        'afar': 'Qafar (Afar)',
        'amharic': 'አማርኛ (Amharic)',
        'arabic': 'العربية (Arabic)',
        'chinese': '中文 (Chinese)',
        'english': 'English',
        'french': 'Français (French)',
        'gamo': 'Gamo',
        'hadiyaa': 'Hadiyya',
        'italian': 'Italiano (Italian)',
        'kinyarwanda': 'Ikinyarwanda (Kinyarwanda)',
        'kirundi': 'Ikirundi (Kirundi)',
        'luo': 'Dholuo (Luo)',
        'oromo': 'Afaan Oromoo (Oromo)',
        'somali': 'Soomaali (Somali)',
        'spanish': 'Español (Spanish)',
        'swahili': 'Kiswahili (Swahili)',
        'tigrigna': 'ትግርኛ (Tigrinya)',
        'tigrinya': 'ትግርኛ (Tigrinya)',
        'wolyitta': 'Wolaytta'
    };
    return names[lang] || lang.charAt(0).toUpperCase() + lang.slice(1);
}

/**
 * Sanitize English text to create valid ID
 */
function sanitizeId(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '')
        .substring(0, 50); // Limit length
}

// Run migration
migrateToUnified().catch(error => {
    console.error('❌ Migration failed:', error);
    process.exit(1);
});

