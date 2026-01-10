// add_new_languages.js
// Script to add new languages to all_languages.json using DeepSeek AI translation

const fs = require('fs').promises;
const path = require('path');
const { DeepSeekTranslator, CONFIG } = require('./aquire..js');

// Configuration for new languages
const NEW_LANGUAGES = {
  'gurage': {
    fullName: 'Gurage (Guragigna)',
    nativeLanguageField: 'ጉራጌ', // Gurage in Ethiopic script
    iso639: 'gru',
    script: 'Ethiopic (Ge\'ez)',
    family: 'Afro-Asiatic, Semitic, South Ethiopic'
  },
  'kambata': {
    fullName: 'Kambata (Kambaatissa)',
    nativeLanguageField: 'ቃምባታ', // Kambata in Ethiopic script
    iso639: 'ktb',
    script: 'Ethiopic (Ge\'ez)',
    family: 'Afro-Asiatic, Cushitic, Highland East Cushitic'
  }
};

class LanguageAdder {
  constructor(apiKey) {
    this.translator = new DeepSeekTranslator(apiKey);
    this.allLanguagesPath = path.join(__dirname, 'all_languages.json');
  }

  async addNewLanguages(languagesToAdd = Object.keys(NEW_LANGUAGES)) {
    console.log('🌐 Adding New Languages to all_languages.json');
    console.log('='.repeat(60));
    
    try {
      // 1. Load existing all_languages.json
      console.log('\n📁 Loading all_languages.json...');
      const fileContent = await fs.readFile(this.allLanguagesPath, 'utf8');
      const allLanguages = JSON.parse(fileContent);
      
      // 2. Extract English language data as source
      if (!allLanguages.english) {
        throw new Error('English language not found in all_languages.json');
      }
      
      const englishData = allLanguages.english;
      
      // Use global categories if language-specific ones don't exist
      const globalCategories = allLanguages.categories || {};
      if (!englishData.categories || Object.keys(englishData.categories).length === 0) {
        console.log('   ℹ️  Using global categories (shared across all languages)');
        englishData.categories = globalCategories;
      }
      
      console.log('✅ English data loaded successfully');
      console.log(`   📊 UI fields: ${Object.keys(englishData.ui || {}).length / 2}`);
      console.log(`   📊 Category names: ${Object.keys(englishData.categoryNames || {}).length / 2}`);
      console.log(`   📊 Categories: ${Object.keys(englishData.categories || {}).length}`);
      
      // 3. Create backup
      const backupPath = this.allLanguagesPath.replace('.json', `.backup.${Date.now()}.json`);
      await fs.writeFile(backupPath, fileContent, 'utf8');
      console.log(`✅ Backup created: ${path.basename(backupPath)}`);
      
      // 4. Translate each new language
      for (const langKey of languagesToAdd) {
        if (!NEW_LANGUAGES[langKey]) {
          console.log(`⚠️  Skipping unknown language: ${langKey}`);
          continue;
        }
        
        if (allLanguages[langKey]) {
          console.log(`⚠️  Language '${langKey}' already exists. Skipping...`);
          continue;
        }
        
        console.log(`\n${'='.repeat(60)}`);
        console.log(`🔤 Translating to ${NEW_LANGUAGES[langKey].fullName}`);
        console.log(`${'='.repeat(60)}`);
        
        const newLangData = await this.translateLanguage(
          englishData,
          langKey,
          NEW_LANGUAGES[langKey]
        );
        
        allLanguages[langKey] = newLangData;
        console.log(`✅ ${langKey} translation complete!`);
      }
      
      // 5. Save updated all_languages.json
      console.log(`\n${'='.repeat(60)}`);
      console.log('💾 Saving updated all_languages.json...');
      await fs.writeFile(
        this.allLanguagesPath,
        JSON.stringify(allLanguages, null, 2),
        'utf8'
      );
      console.log('✅ File saved successfully!');
      
      // 6. Print summary
      this.printSummary(languagesToAdd);
      
      return allLanguages;
      
    } catch (error) {
      console.error(`\n❌ Error: ${error.message}`);
      throw error;
    }
  }

  async translateLanguage(englishData, langKey, langInfo) {
    const targetLanguage = langInfo.fullName;
    
    // Initialize new language object
    const newLangData = {
      language: langKey,
      nativeLanguageField: langInfo.nativeLanguageField,
      ui: {},
      categoryNames: {},
      categories: {}
    };
    
    console.log(`\n📝 Translating UI fields...`);
    await this.translateSection(
      englishData.ui,
      newLangData.ui,
      targetLanguage,
      'UI field',
      'User interface text for language learning app'
    );
    
    console.log(`\n📝 Translating category names...`);
    await this.translateSection(
      englishData.categoryNames,
      newLangData.categoryNames,
      targetLanguage,
      'Category',
      'Category name for language learning topics'
    );
    
    console.log(`\n📝 Translating category phrases...`);
    const categories = englishData.categories || {};
    const categoryCount = Object.keys(categories).length;
    let categoryIndex = 0;
    
    for (const [categoryKey, phrases] of Object.entries(categories)) {
      categoryIndex++;
      console.log(`\n   🗂️  Category ${categoryIndex}/${categoryCount}: ${categoryKey}`);
      
      newLangData.categories[categoryKey] = [];
      
      for (let i = 0; i < phrases.length; i++) {
        const phrase = phrases[i];
        const translatedPhrase = await this.translatePhrase(
          phrase,
          targetLanguage,
          categoryKey,
          i + 1,
          phrases.length
        );
        
        newLangData.categories[categoryKey].push(translatedPhrase);
      }
    }
    
    return newLangData;
  }

  async translateSection(sourceObj, targetObj, targetLanguage, itemType, context) {
    const keys = Object.keys(sourceObj).filter(k => !k.endsWith('_phonetic'));
    const totalKeys = keys.length;
    
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const englishText = sourceObj[key];
      
      console.log(`   [${i + 1}/${totalKeys}] ${key}`);
      console.log(`      EN: "${englishText}"`);
      
      try {
        // Translate main text
        const translation = await this.translator.translateText(
          englishText,
          targetLanguage,
          context
        );
        targetObj[key] = translation;
        console.log(`      ${targetLanguage.split('(')[0].trim()}: "${translation}"`);
        
        // Create phonetic version (romanization)
        const phonetic = await this.createPhonetic(translation, targetLanguage);
        targetObj[`${key}_phonetic`] = phonetic;
        console.log(`      Phonetic: "${phonetic}"`);
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`      ❌ Error: ${error.message}`);
        targetObj[key] = englishText; // Fallback to English
        targetObj[`${key}_phonetic`] = englishText.toLowerCase();
      }
    }
  }

  async translatePhrase(englishPhrase, targetLanguage, category, index, total) {
    const translatedPhrase = {
      english: englishPhrase.english,
      english_phonetic: englishPhrase.english_phonetic
    };
    
    console.log(`      [${index}/${total}] "${englishPhrase.english}"`);
    
    try {
      // Translate the phrase
      const langKey = targetLanguage.split('(')[0].trim().toLowerCase().replace(/\s+/g, '_');
      const translation = await this.translator.translateText(
        englishPhrase.english,
        targetLanguage,
        `${category} vocabulary for language learning`
      );
      
      translatedPhrase[langKey] = translation;
      console.log(`         → "${translation}"`);
      
      // Create phonetic
      const phonetic = await this.createPhonetic(translation, targetLanguage);
      translatedPhrase[`${langKey}_phonetic`] = phonetic;
      console.log(`         → (phonetic) "${phonetic}"`);
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 800));
      
    } catch (error) {
      console.error(`         ❌ Error: ${error.message}`);
      const langKey = targetLanguage.split('(')[0].trim().toLowerCase().replace(/\s+/g, '_');
      translatedPhrase[langKey] = englishPhrase.english;
      translatedPhrase[`${langKey}_phonetic`] = englishPhrase.english_phonetic;
    }
    
    return translatedPhrase;
  }

  async createPhonetic(text, targetLanguage) {
    try {
      const prompt = `Convert the following ${targetLanguage} text to phonetic romanization (Latin alphabet pronunciation guide).

${targetLanguage} text: "${text}"

Requirements:
1. Provide ONLY the phonetic romanization
2. Use hyphens to separate syllables (e.g., "sa-lam")
3. Use simple Latin letters (a-z)
4. No explanations or notes
5. Lowercase only

Phonetic romanization:`;

      const phonetic = await this.translator.callDeepSeekAPI(prompt);
      return phonetic.trim().toLowerCase();
      
    } catch (error) {
      console.error(`      ⚠️  Phonetic creation failed: ${error.message}`);
      return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    }
  }

  printSummary(languagesAdded) {
    console.log(`\n${'='.repeat(60)}`);
    console.log('📊 TRANSLATION SUMMARY');
    console.log(`${'='.repeat(60)}`);
    console.log(`✅ Languages added: ${languagesAdded.length}`);
    languagesAdded.forEach((lang, i) => {
      const info = NEW_LANGUAGES[lang];
      console.log(`   ${i + 1}. ${lang} - ${info.fullName}`);
      console.log(`      Script: ${info.script}`);
      console.log(`      Family: ${info.family}`);
    });
    
    this.translator.printUsageStats();
    
    console.log(`\n💡 Next Steps:`);
    console.log(`   1. Review translations in all_languages.json`);
    console.log(`   2. Verify phonetics with native speakers`);
    console.log(`   3. Update UI to add language buttons`);
    console.log(`   4. Test TTS support for new languages`);
    console.log(`   5. Restart server: npm start`);
  }
}

// Main execution
async function main() {
  console.log('🌍 New Language Addition Tool');
  console.log('='.repeat(60));
  
  // Get API key from environment
  const apiKey = process.env.DEEPSEEK_API_KEY;
  
  if (!apiKey) {
    console.error('\n❌ Error: DEEPSEEK_API_KEY environment variable not set');
    console.log('\nSet your API key first:');
    console.log('  PowerShell: $env:DEEPSEEK_API_KEY = "your-api-key"');
    console.log('  Linux/Mac:  export DEEPSEEK_API_KEY="your-api-key"');
    process.exit(1);
  }
  
  // Get languages from command line args or use defaults
  const languagesToAdd = process.argv.slice(2);
  if (languagesToAdd.length === 0) {
    languagesToAdd.push('gurage', 'kambata');
    console.log('\n📋 No languages specified. Using defaults: gurage, kambata');
    console.log('   (To specify: node add_new_languages.js gurage kambata)');
  } else {
    console.log(`\n📋 Languages to add: ${languagesToAdd.join(', ')}`);
  }
  
  // Confirm
  console.log(`\n⚠️  This will translate ${languagesToAdd.length} language(s) from English`);
  console.log('   This may take several minutes and use API credits.');
  console.log('\n   Press Ctrl+C to cancel, or wait 5 seconds to continue...');
  
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  try {
    const adder = new LanguageAdder(apiKey);
    await adder.addNewLanguages(languagesToAdd);
    
    console.log('\n🎉 Language addition completed successfully!');
    
  } catch (error) {
    console.error(`\n💥 Failed: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
}

// Export for use as module
if (require.main === module) {
  main().catch(console.error);
} else {
  module.exports = { LanguageAdder, NEW_LANGUAGES };
}
