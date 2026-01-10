// verify_setup.js
// Quick verification that everything is ready for translation

const fs = require('fs');
const path = require('path');

console.log('🔍 Translation Setup Verification');
console.log('='.repeat(60));

// Check 1: all_languages.json exists and has English
console.log('\n✅ Check 1: Verifying all_languages.json...');
try {
  const allLangsPath = path.join(__dirname, 'all_languages.json');
  const data = JSON.parse(fs.readFileSync(allLangsPath, 'utf8'));
  
  if (!data.english) {
    console.log('   ❌ English language not found!');
    process.exit(1);
  }
  
  console.log('   ✅ English language found');
  console.log(`   📊 UI fields: ${Object.keys(data.english.ui || {}).filter(k => !k.endsWith('_phonetic')).length}`);
  
  // Check for categories (could be in english object or global)
  const categories = data.english.categories || data.categories || {};
  console.log(`   📊 Categories: ${Object.keys(categories).length}`);
  
  // Count total phrases
  let totalPhrases = 0;
  for (const category in categories) {
    totalPhrases += (categories[category] || []).length;
  }
  console.log(`   📊 Total phrases: ${totalPhrases}`);
  
  // Check if Gurage/Kambata already exist
  const existingLangs = Object.keys(data).filter(k => k !== 'categories');
  console.log(`   📊 Existing languages: ${existingLangs.length}`);
  
  if (data.gurage) {
    console.log('   ⚠️  WARNING: Gurage already exists in file!');
  }
  if (data.kambata) {
    console.log('   ⚠️  WARNING: Kambata already exists in file!');
  }
  
} catch (error) {
  console.log(`   ❌ Error: ${error.message}`);
  process.exit(1);
}

// Check 2: Translation scripts exist
console.log('\n✅ Check 2: Verifying translation scripts...');
const requiredFiles = [
  'aquire..js',
  'add_new_languages.js'
];

for (const file of requiredFiles) {
  if (fs.existsSync(path.join(__dirname, file))) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} not found!`);
  }
}

// Check 3: API Key
console.log('\n✅ Check 3: Checking API key...');
if (process.env.DEEPSEEK_API_KEY) {
  const key = process.env.DEEPSEEK_API_KEY;
  console.log(`   ✅ API key is set (${key.substring(0, 8)}...)`);
} else {
  console.log('   ⚠️  DEEPSEEK_API_KEY not set');
  console.log('   Set it with: $env:DEEPSEEK_API_KEY = "your-api-key"');
}

// Check 4: Node.js version
console.log('\n✅ Check 4: Node.js version...');
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.split('.')[0].replace('v', ''));
console.log(`   📦 Node.js ${nodeVersion}`);
if (majorVersion >= 18) {
  console.log('   ✅ fetch API supported natively');
} else {
  console.log('   ⚠️  Node.js < 18, may need node-fetch package');
}

// Summary
console.log('\n' + '='.repeat(60));
console.log('📋 SUMMARY');
console.log('='.repeat(60));

const apiKeySet = !!process.env.DEEPSEEK_API_KEY;

if (apiKeySet) {
  console.log('\n✅ Everything is ready!');
  console.log('\nTo start translation, run:');
  console.log('   cd translations');
  console.log('   node add_new_languages.js');
  console.log('\nThis will translate English to Gurage and Kambata.');
  console.log('Estimated time: 15-25 minutes');
  console.log('Estimated cost: $0.22 - $0.30');
} else {
  console.log('\n⚠️  Almost ready! Set your API key first:');
  console.log('   $env:DEEPSEEK_API_KEY = "your-deepseek-api-key"');
  console.log('\nThen run:');
  console.log('   node add_new_languages.js');
}

console.log('\n' + '='.repeat(60));
