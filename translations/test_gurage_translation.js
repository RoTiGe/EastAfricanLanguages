// Test script for Gurage translation
const { DeepSeekTranslator, CONFIG } = require('./aquire..js');
const fs = require('fs').promises;

async function testGurageTranslation() {
  console.log('🌐 Testing Gurage Translation');
  console.log('='.repeat(50));
  
  // Check for API key in environment
  const apiKey = process.env.DEEPSEEK_API_KEY;
  
  if (!apiKey) {
    console.error('❌ Error: DEEPSEEK_API_KEY environment variable not set');
    console.log('\nTo use this script, set your API key:');
    console.log('  $env:DEEPSEEK_API_KEY="your-api-key-here"  (PowerShell)');
    console.log('  export DEEPSEEK_API_KEY="your-api-key-here"  (Linux/Mac)');
    process.exit(1);
  }
  
  const inputFile = './gurage_test.json';
  const outputFile = './gurage_test_translated.json';
  const targetLanguages = ['gurage', 'amharic']; // Test Gurage + Amharic
  
  console.log(`\n📁 Input file: ${inputFile}`);
  console.log(`📁 Output file: ${outputFile}`);
  console.log(`🎯 Target languages: ${targetLanguages.join(', ')}\n`);
  
  try {
    // Initialize translator
    const translator = new DeepSeekTranslator(apiKey);
    
    // Run translation
    console.log('🚀 Starting translation...\n');
    await translator.translateJSONFile(inputFile, outputFile, targetLanguages);
    
    // Show results
    console.log('\n📊 Results:');
    const result = JSON.parse(await fs.readFile(outputFile, 'utf8'));
    
    // Display first few translations
    console.log('\n✨ Sample Translations:');
    console.log(JSON.stringify(result.test_phrases, null, 2));
    
    translator.printUsageStats();
    
    console.log('\n✅ Test completed successfully!');
    console.log(`💾 Full results saved to: ${outputFile}`);
    
  } catch (error) {
    console.error(`\n💥 Test failed: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the test
testGurageTranslation();
