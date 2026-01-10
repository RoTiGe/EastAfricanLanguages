// deepseek-translator.js
const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Configuration
const CONFIG = {
  baseUrl: 'https://api.deepseek.com',
  model: 'deepseek-chat',
  maxTokens: 4000,
  temperature: 0.3,
  timeout: 30000, // 30 seconds
  maxRetries: 3,
  delayBetweenRequests: 1000, // 1 second
  languages: {
    'arabic': 'Arabic',
    'chinese': 'Chinese (Simplified)',
    'english': 'English',
    'french': 'French',
    'german': 'German',
    'italian': 'Italian',
    'japanese': 'Japanese',
    'korean': 'Korean',
    'portuguese': 'Portuguese',
    'russian': 'Russian',
    'spanish': 'Spanish',
    'turkish': 'Turkish',
    'hindi': 'Hindi',
    'amharic': 'Amharic',
    'tigrinya': 'Tigrinya',
    'oromo': 'Oromo',
    'somali': 'Somali',
    'swahili': 'Swahili',
    'gurage': 'Gurage (Guragigna)',
    'kambata': 'Kambata (Kambaatissa)',
    'bengali': 'Bengali',
    'telugu': 'Telugu',
    'farsi': 'Farsi (Persian)',
    'kurdish': 'Kurdish',
    'sidamo': 'Sidamo (Sidaamu Afoo)',
    'wolayta': 'Wolayta',
    'hadiyya': 'Hadiyya',
    'afar': 'Afar (Qafaraf)'
  }
};

class DeepSeekTranslator {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.totalTokens = 0;
    this.totalCost = 0;
  }

  async translateText(text, targetLanguage, context = null) {
    const prompt = this.createTranslationPrompt(text, targetLanguage, context);
    
    const response = await this.callDeepSeekAPI(prompt);
    
    if (!response) {
      throw new Error('Translation failed: No response from API');
    }
    
    // Parse the response
    return this.parseTranslationResponse(response, targetLanguage);
  }

  createTranslationPrompt(text, targetLanguage, context) {
    let prompt = `Translate the following text to ${targetLanguage}.\n\n`;
    
    if (context) {
      prompt += `Context: ${context}\n\n`;
    }
    
    prompt += `Text to translate:\n"${text}"\n\n`;
    
    prompt += `Requirements:
1. Provide ONLY the translation in ${targetLanguage}
2. Do not add explanations, notes, or markdown formatting
3. Maintain the original meaning accurately
4. Keep technical/airport terminology consistent
5. If there are proper names (like "Addis Ababa Airport"), keep them as-is

Translation:`;
    
    return prompt;
  }

  async callDeepSeekAPI(prompt, retryCount = 0) {
    try {
      const response = await fetch(`${CONFIG.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: CONFIG.model,
          messages: [
            {
              role: 'system',
              content: 'You are a professional translator specializing in airport and travel terminology.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: CONFIG.maxTokens,
          temperature: CONFIG.temperature
        }),
        timeout: CONFIG.timeout
      });

      if (!response.ok) {
        if (response.status === 429 && retryCount < CONFIG.maxRetries) {
          console.log(`Rate limited. Retrying in ${(retryCount + 1) * 2} seconds...`);
          await new Promise(resolve => setTimeout(resolve, (retryCount + 1) * 2000));
          return this.callDeepSeekAPI(prompt, retryCount + 1);
        }
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Track usage
      if (data.usage) {
        this.totalTokens += data.usage.total_tokens;
        // Estimate cost (adjust based on actual DeepSeek pricing)
        this.totalCost += data.usage.total_tokens * 0.000001; // Example: $0.001 per 1000 tokens
      }
      
      return data.choices[0].message.content;
    } catch (error) {
      if (retryCount < CONFIG.maxRetries) {
        console.log(`Error: ${error.message}. Retrying (${retryCount + 1}/${CONFIG.maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        return this.callDeepSeekAPI(prompt, retryCount + 1);
      }
      throw error;
    }
  }

  parseTranslationResponse(response, targetLanguage) {
    // Clean up the response
    let translation = response.trim();
    
    // Remove any quotation marks if the API added them
    if (translation.startsWith('"') && translation.endsWith('"')) {
      translation = translation.slice(1, -1);
    }
    
    // Remove language labels
    const languageLabels = [
      `${targetLanguage}:`,
      `Translation:`,
      `In ${targetLanguage}:`,
      `Translated text:`
    ];
    
    for (const label of languageLabels) {
      if (translation.startsWith(label)) {
        translation = translation.slice(label.length).trim();
      }
    }
    
    return translation;
  }

  async translateJSONFile(inputPath, outputPath, targetLanguages) {
    try {
      console.log(`\n📁 Loading file: ${inputPath}`);
      
      // Read input file
      const fileContent = await fs.readFile(inputPath, 'utf8');
      const data = JSON.parse(fileContent);
      
      console.log(`✅ File loaded. Structure: ${Object.keys(data).join(', ')}`);
      
      // Backup original
      const backupPath = outputPath.replace('.json', `.backup.${Date.now()}.json`);
      await fs.writeFile(backupPath, fileContent, 'utf8');
      console.log(`✅ Backup created: ${backupPath}`);
      
      // Process translations
      const result = await this.processJSON(data, targetLanguages);
      
      // Write output
      await fs.writeFile(outputPath, JSON.stringify(result, null, 2), 'utf8');
      
      console.log(`\n✅ Translation complete!`);
      console.log(`📊 Total tokens used: ${this.totalTokens}`);
      console.log(`💰 Estimated cost: $${this.totalCost.toFixed(4)}`);
      console.log(`💾 Output saved to: ${outputPath}`);
      
      return result;
    } catch (error) {
      console.error(`❌ Error translating file: ${error.message}`);
      throw error;
    }
  }

  async processJSON(data, targetLanguages) {
    const translatedData = JSON.parse(JSON.stringify(data)); // Deep clone
    
    // Process based on JSON structure
    if (Array.isArray(data)) {
      await this.processArray(translatedData, targetLanguages);
    } else if (typeof data === 'object' && data !== null) {
      await this.processObject(translatedData, targetLanguages);
    }
    
    return translatedData;
  }

  async processObject(obj, targetLanguages, parentKey = '') {
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string' && this.shouldTranslate(key, value)) {
        await this.translateObjectValue(obj, key, value, targetLanguages, parentKey);
      } else if (typeof value === 'object' && value !== null) {
        await this.processObject(value, targetLanguages, key);
      }
    }
  }

  async processArray(arr, targetLanguages) {
    for (let i = 0; i < arr.length; i++) {
      if (typeof arr[i] === 'string' && arr[i].trim().length > 0) {
        console.log(`🔤 Translating array item ${i + 1}/${arr.length}`);
        for (const lang of targetLanguages) {
          const translation = await this.translateText(arr[i], lang);
          if (!arr[i + '_' + lang]) {
            arr[i + '_' + lang] = translation;
          }
        }
        await new Promise(resolve => setTimeout(resolve, CONFIG.delayBetweenRequests));
      } else if (typeof arr[i] === 'object' && arr[i] !== null) {
        await this.processObject(arr[i], targetLanguages);
      }
    }
  }

  async translateObjectValue(obj, key, value, targetLanguages, parentKey = '') {
    const context = this.getTranslationContext(parentKey, key);
    
    console.log(`\n📝 Translating: "${key}"`);
    console.log(`   Original: ${value.substring(0, 100)}${value.length > 100 ? '...' : ''}`);
    
    for (const lang of targetLanguages) {
      try {
        console.log(`   🌐 ${lang}...`);
        const translation = await this.translateText(value, CONFIG.languages[lang] || lang, context);
        
        // Add translation with language suffix
        const translatedKey = `${key}_${lang}`;
        obj[translatedKey] = translation;
        
        console.log(`     ✅ ${translation.substring(0, 80)}${translation.length > 80 ? '...' : ''}`);
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, CONFIG.delayBetweenRequests));
      } catch (error) {
        console.error(`     ❌ Failed to translate to ${lang}: ${error.message}`);
        obj[`${key}_${lang}_error`] = `Translation failed: ${error.message}`;
      }
    }
  }

  shouldTranslate(key, value) {
    // Skip keys that are already translations or metadata
    const skipPatterns = [
      '_phonetic',
      '_pinyin',
      '_translated',
      '_error',
      'context',
      'speaker',
      'stage'
    ];
    
    const shouldSkip = skipPatterns.some(pattern => key.includes(pattern)) || 
                      value.trim().length === 0;
    
    return !shouldSkip;
  }

  getTranslationContext(parentKey, currentKey) {
    const contexts = {
      'conversation_title': 'Airport conversation title for language learning app',
      'participants': 'Airport personnel roles (passenger, agent, etc.)',
      'scenario': 'Airport scenario description for language learners',
      'stages': 'Airport check-in conversation',
      'summary': 'Summary of airport conversation for language learning',
      'exchanges': 'Dialogue between passenger and airline agent',
      'english': 'Airport/travel terminology',
      'ui': 'User interface text for airport app'
    };
    
    return contexts[parentKey] || contexts[currentKey] || 'Airport and travel context';
  }

  printUsageStats() {
    console.log('\n📊 Translation Statistics:');
    console.log(`   Total tokens: ${this.totalTokens}`);
    console.log(`   Estimated cost: $${this.totalCost.toFixed(4)}`);
    console.log(`   Average tokens per request: ${this.totalTokens > 0 ? Math.round(this.totalTokens / (Object.keys(CONFIG.languages).length)) : 0}`);
  }
}

// CLI Interface
async function main() {
  console.log('🌐 DeepSeek JSON Translator');
  console.log('='.repeat(40));
  
  // Get API Key
  const apiKey = await new Promise((resolve) => {
    rl.question('Enter your DeepSeek API key: ', (answer) => {
      resolve(answer.trim());
    });
  });
  
  if (!apiKey) {
    console.error('❌ API key is required');
    rl.close();
    return;
  }
  
  // Get input file
  const inputFile = await new Promise((resolve) => {
    rl.question('Enter input JSON file path: ', (answer) => {
      resolve(answer.trim());
    });
  });
  
  if (!fs.existsSync(inputFile)) {
    console.error(`❌ File not found: ${inputFile}`);
    rl.close();
    return;
  }
  
  // Get output file
  const defaultOutput = inputFile.replace('.json', '_translated.json');
  const outputFile = await new Promise((resolve) => {
    rl.question(`Enter output file path [${defaultOutput}]: `, (answer) => {
      resolve(answer.trim() || defaultOutput);
    });
  });
  
  // Select languages
  console.log('\n🌍 Available languages:');
  Object.keys(CONFIG.languages).forEach((lang, index) => {
    console.log(`  ${index + 1}. ${lang} (${CONFIG.languages[lang]})`);
  });
  
  const languagesInput = await new Promise((resolve) => {
    rl.question('\nEnter languages to translate to (comma-separated, e.g., spanish,french,german): ', (answer) => {
      resolve(answer.trim().toLowerCase());
    });
  });
  
  const selectedLanguages = languagesInput.split(',')
    .map(lang => lang.trim())
    .filter(lang => CONFIG.languages[lang]);
  
  if (selectedLanguages.length === 0) {
    console.error('❌ No valid languages selected');
    rl.close();
    return;
  }
  
  console.log(`\n🎯 Selected languages: ${selectedLanguages.join(', ')}`);
  
  // Confirm
  const confirm = await new Promise((resolve) => {
    rl.question('\nStart translation? (y/n): ', (answer) => {
      resolve(answer.trim().toLowerCase() === 'y');
    });
  });
  
  if (!confirm) {
    console.log('❌ Translation cancelled');
    rl.close();
    return;
  }
  
  // Initialize translator
  const translator = new DeepSeekTranslator(apiKey);
  
  try {
    console.log('\n🚀 Starting translation...');
    console.log('='.repeat(40));
    
    await translator.translateJSONFile(inputFile, outputFile, selectedLanguages);
    
    translator.printUsageStats();
    
    console.log('\n🎉 Translation completed successfully!');
    
  } catch (error) {
    console.error(`\n💥 Translation failed: ${error.message}`);
    console.error(error.stack);
  } finally {
    rl.close();
  }
}

// Export for use in other modules
if (require.main === module) {
  main().catch(console.error);
} else {
  module.exports = {
    DeepSeekTranslator,
    CONFIG
  };
}