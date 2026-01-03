const fs = require('fs');
const path = require('path');

// Read all .js translation files
const oromoJS = fs.readFileSync('./translations/oromo_translations.js', 'utf8');
const spanishJS = fs.readFileSync('./translations/spanish_translations.js', 'utf8');
const frenchJS = fs.readFileSync('./translations/french_translations.js', 'utf8');
const amharicJS = fs.readFileSync('./translations/amharic_translations.js', 'utf8');
const tigrignaJS = fs.readFileSync('./translations/tigrigna_translations.js', 'utf8');

// Extract translation objects using eval (safe since we control the source)
const extractTranslations = (jsContent) => {
  // Create a safe execution context with window object
  const window = {};
  let translations = null;
  let frenchTranslations = null;
  
  // Execute the code in current scope
  eval(jsContent);
  
  return window.translations || translations || frenchTranslations;
};

const oromoData = extractTranslations(oromoJS);
const spanishData = extractTranslations(spanishJS);
const frenchData = extractTranslations(frenchJS);
const amharicData = extractTranslations(amharicJS);
const tigrignaData = extractTranslations(tigrignaJS);

console.log('Loaded translation data:');
console.log('- Oromo entries:', Object.keys(oromoData).length);
console.log('- Spanish entries:', Object.keys(spanishData).length);
console.log('- French entries:', Object.keys(frenchData).length);
console.log('- Amharic entries:', Object.keys(amharicData).length);
console.log('- Tigrinya entries:', Object.keys(tigrignaData).length);

// Collect all unique English keys
const allKeys = new Set([
  ...Object.keys(oromoData),
  ...Object.keys(spanishData),
  ...Object.keys(frenchData),
  ...Object.keys(amharicData),
  ...Object.keys(tigrignaData)
]);

console.log('\nTotal unique phrases:', allKeys.size);

// Build multi-language phrase objects
const multiLangPhrases = {};
const categoryPhrases = {};

allKeys.forEach(key => {
  const oromo = oromoData[key];
  const spanish = spanishData[key];
  const french = frenchData[key];
  const amharic = amharicData[key];
  const tigrinya = tigrignaData[key];
  
  // Determine category (prefer non-undefined)
  const category = oromo?.category || spanish?.category || french?.category || amharic?.category || tigrinya?.category || 'other';
  
  // Build multi-language object
  const phraseObj = {
    english: key,
    spanish: spanish?.spanish || '',
    french: french?.french || '',
    amharic: amharic?.amharic || '',
    tigrinya: tigrinya?.tigrinya || '',
    oromo: oromo?.oromo || ''
  };
  
  // Organize by category
  if (!categoryPhrases[category]) {
    categoryPhrases[category] = [];
  }
  categoryPhrases[category].push(phraseObj);
});

console.log('\nCategories found:', Object.keys(categoryPhrases).sort());

// Category name translations
const categoryNames = {
  basics: {
    spanish: 'Básicos & Saludos',
    french: 'Bases & Salutations',
    amharic: 'መሰረታዊ & ሰላምታዎች',
    tigrinya: 'መሰረታዊ & ሰላምታት',
    oromo: 'Bu\'uuraalee & Nagannoowwan'
  },
  family: {
    spanish: 'Familia',
    french: 'Famille',
    amharic: 'ቤተሰብ',
    tigrinya: 'ስድራ',
    oromo: 'Maatii'
  },
  people: {
    spanish: 'Personas',
    french: 'Personnes',
    amharic: 'ሰዎች',
    tigrinya: 'ሰባት',
    oromo: 'Namoota'
  },
  body: {
    spanish: 'Partes del Cuerpo',
    french: 'Parties du Corps',
    amharic: 'የሰውነት ክፍሎች',
    tigrinya: 'ክፍልታት ኣካላት',
    oromo: 'Qaamolee Qaama'
  },
  clothing: {
    spanish: 'Ropa',
    french: 'Vêtements',
    amharic: 'ልብሶች',
    tigrinya: 'ክዳውንቲ',
    oromo: 'Uffata'
  },
  colors: {
    spanish: 'Colores',
    french: 'Couleurs',
    amharic: 'ቀለሞች',
    tigrinya: 'ሕብሪታት',
    oromo: 'Halluulee'
  },
  numbers: {
    spanish: 'Números',
    french: 'Nombres',
    amharic: 'ቁጥሮች',
    tigrinya: 'ኣሃዱታት',
    oromo: 'Lakkoofsa'
  },
  emotions: {
    spanish: 'Emociones',
    french: 'Émotions',
    amharic: 'ስሜቶች',
    tigrinya: 'ስምዒታት',
    oromo: 'Miiraa'
  },
  school: {
    spanish: 'Escuela',
    french: 'École',
    amharic: 'ትምህርት ቤት',
    tigrinya: 'ቤት ትምህርቲ',
    oromo: 'Mana Barumsaa'
  },
  toys: {
    spanish: 'Juguetes & Juegos',
    french: 'Jouets & Jeux',
    amharic: 'መጫወቻዎች & ጨዋታዎች',
    tigrinya: 'መጻወቲታት & ጸወታታት',
    oromo: 'Meeshaalee Tapha & Tapha'
  },
  house: {
    spanish: 'Casa',
    french: 'Maison',
    amharic: 'ቤት',
    tigrinya: 'ቤት',
    oromo: 'Mana'
  },
  food: {
    spanish: 'Comida',
    french: 'Nourriture',
    amharic: 'ምግብ',
    tigrinya: 'መግቢ',
    oromo: 'Nyaata'
  },
  animals: {
    spanish: 'Animales',
    french: 'Animaux',
    amharic: 'እንስሳት',
    tigrinya: 'እንስሳታት',
    oromo: 'Bineensota'
  },
  nature: {
    spanish: 'Naturaleza',
    french: 'Nature',
    amharic: 'ተፈጥሮ',
    tigrinya: 'ተፈጥሮ',
    oromo: 'Uumama'
  },
  time: {
    spanish: 'Tiempo',
    french: 'Temps',
    amharic: 'ጊዜ',
    tigrinya: 'ግዜ',
    oromo: 'Yeroo'
  },
  seasons: {
    spanish: 'Estaciones',
    french: 'Saisons',
    amharic: 'ወቅቶች',
    tigrinya: 'ወቕትታት',
    oromo: 'Waqtilee'
  },
  transport: {
    spanish: 'Transporte',
    french: 'Transport',
    amharic: 'ትራንስፖርት',
    tigrinya: 'መጎዓዝያ',
    oromo: 'Geejjiba'
  },
  places: {
    spanish: 'Lugares',
    french: 'Lieux',
    amharic: 'ቦታዎች',
    tigrinya: 'ቦታታት',
    oromo: 'Bakkeewwan'
  },
  music: {
    spanish: 'Música',
    french: 'Musique',
    amharic: 'ሙዚቃ',
    tigrinya: 'ሙዚቃ',
    oromo: 'Muuziqaa'
  },
  actions: {
    spanish: 'Acciones',
    french: 'Actions',
    amharic: 'ድርጊቶች',
    tigrinya: 'ተግባራት',
    oromo: 'Gochaalee'
  },
  objects: {
    spanish: 'Objetos',
    french: 'Objets',
    amharic: 'ነገሮች',
    tigrinya: 'ነገራት',
    oromo: 'Meesha'
  },
  shapes: {
    spanish: 'Formas',
    french: 'Formes',
    amharic: 'ቅርጾች',
    tigrinya: 'ቅርጽታት',
    oromo: 'Bocawwan'
  },
  holidays: {
    spanish: 'Días Festivos',
    french: 'Jours Fériés',
    amharic: 'በዓላት',
    tigrinya: 'በዓላት',
    oromo: 'Ayyaanalee'
  },
  weather: {
    spanish: 'Clima',
    french: 'Météo',
    amharic: 'የአየር ሁኔታ',
    tigrinya: 'ኩነታት ኣየር',
    oromo: 'Haala Qilleensaa'
  },
  descriptive: {
    spanish: 'Descriptivos',
    french: 'Descriptifs',
    amharic: 'መግለጫ',
    tigrinya: 'መግለጺ',
    oromo: 'Ibsituu'
  },
  military: {
    spanish: 'Militar',
    french: 'Militaire',
    amharic: 'ወታደራዊ',
    tigrinya: 'ወተሃደራዊ',
    oromo: 'Waraanaa'
  },
  weapons: {
    spanish: 'Armas',
    french: 'Armes',
    amharic: 'የጦር መሳሪያዎች',
    tigrinya: 'መሳርያታት',
    oromo: 'Meeshaalee Waraanaa'
  },
  vehicles: {
    spanish: 'Vehículos',
    french: 'Véhicules',
    amharic: 'ተሽከርካሪዎች',
    tigrinya: 'መጎዓዝያታት',
    oromo: 'Konkolaatalee'
  },
  medical: {
    spanish: 'Médico',
    french: 'Médical',
    amharic: 'ሕክምና',
    tigrinya: 'ሕክምናዊ',
    oromo: 'Yaalaa'
  },
  outcomes: {
    spanish: 'Resultados',
    french: 'Résultats',
    amharic: 'ውጤቶች',
    tigrinya: 'ውጽኢታት',
    oromo: 'Bu\'uuraa'
  },
  qualities: {
    spanish: 'Cualidades',
    french: 'Qualités',
    amharic: 'ባህሪያት',
    tigrinya: 'ባህርያት',
    oromo: 'Amalalee'
  },
  tactics: {
    spanish: 'Tácticas',
    french: 'Tactiques',
    amharic: 'ስልቶች',
    tigrinya: 'ስልቲታት',
    oromo: 'Tooftaalee'
  },
  equipment: {
    spanish: 'Equipamiento',
    french: 'Équipement',
    amharic: 'መሳሪያዎች',
    tigrinya: 'መሳርሒታት',
    oromo: 'Meeshaalee'
  },
  political: {
    spanish: 'Político',
    french: 'Politique',
    amharic: 'ፖለቲካ',
    tigrinya: 'ፖለቲካዊ',
    oromo: 'Siyaasaa'
  },
  games: {
    spanish: 'Juegos',
    french: 'Jeux',
    amharic: 'ጨዋታዎች',
    tigrinya: 'ጸወታታት',
    oromo: 'Taphaalee'
  },
  other: {
    spanish: 'Otros',
    french: 'Autres',
    amharic: 'ሌሎች',
    tigrinya: 'ካልኦት',
    oromo: 'Biroo'
  }
};

// UI translations
const uiTranslations = {
  oromo: {
    pageTitle: 'Afaan Oromoo Baruu',
    enterText: 'Barruu kee galchi',
    placeholder: 'Mee asitti barruu kee galchi...',
    speakButton: 'Dubbisi',
    clearButton: 'Haquu',
    audioOutput: 'Sagalee Bahe',
    languageLabel: 'Afaan:',
    examplePhrases: 'Hima Fakkaataa',
    showTranslation: 'Hiika agarsiisi:',
    selectCategory: 'Ramaddii filadhu',
    selectPhrase: 'Hima filadhu',
    usePhrase: 'Hima fayyadami',
    footer: '© 2026 Sound Training App. Mirga hunduu kan eegame.'
  },
  spanish: {
    pageTitle: 'Aprende Español',
    enterText: 'Ingresa tu texto',
    placeholder: 'Escribe tu texto aquí...',
    speakButton: 'Hablar',
    clearButton: 'Limpiar',
    audioOutput: 'Salida de Audio',
    languageLabel: 'Idioma:',
    examplePhrases: 'Frases de Ejemplo',
    showTranslation: 'Mostrar traducción en:',
    selectCategory: 'Selecciona una categoría',
    selectPhrase: 'Selecciona una frase',
    usePhrase: 'Usar frase',
    footer: '© 2026 Sound Training App. Todos los derechos reservados.'
  },
  french: {
    pageTitle: 'Apprendre le Français',
    enterText: 'Entrez votre texte',
    placeholder: 'Tapez votre texte ici...',
    speakButton: 'Parler',
    clearButton: 'Effacer',
    audioOutput: 'Sortie Audio',
    languageLabel: 'Langue:',
    examplePhrases: 'Phrases d\'Exemple',
    showTranslation: 'Afficher la traduction en:',
    selectCategory: 'Sélectionnez une catégorie',
    selectPhrase: 'Sélectionnez une phrase',
    usePhrase: 'Utiliser la phrase',
    footer: '© 2026 Sound Training App. Tous droits réservés.'
  },
  amharic: {
    pageTitle: 'አማርኛ ይማሩ',
    enterText: 'ጽሑፍዎን ያስገቡ',
    placeholder: 'እዚህ ጽሑፍዎን ይጻፉ...',
    speakButton: 'ተናገር',
    clearButton: 'አጥፋ',
    audioOutput: 'የድምጽ ውጤት',
    languageLabel: 'ቋንቋ:',
    examplePhrases: 'ምሳሌ ሃሳቦች',
    showTranslation: 'ትርጉም አሳይ በ:',
    selectCategory: 'ምድብ ይምረጡ',
    selectPhrase: 'ሀረግ ይምረጡ',
    usePhrase: 'ሀረግ ተጠቀም',
    footer: '© 2026 Sound Training App. መብቱ በህግ የተጠበቀ ነው።'
  },
  tigrinya: {
    pageTitle: 'ትግርኛ ተማሃሩ',
    enterText: 'ጽሑፍኩም ኣእትውዎ',
    placeholder: 'ኣብዚ ጽሑፍኩም ጽሓፉ...',
    speakButton: 'ተዛረብ',
    clearButton: 'ደምስስ',
    audioOutput: 'ውጽኢት ድምጺ',
    languageLabel: 'ቋንቋ:',
    examplePhrases: 'ኣብነታት ሓሳባት',
    showTranslation: 'ትርጉም ኣርእዩ ብ:',
    selectCategory: 'ምድብ መረጽ',
    selectPhrase: 'ሓሳብ መረጽ',
    usePhrase: 'ሓሳብ ተጠቐም',
    footer: '© 2026 Sound Training App. ኩሉ መሰል ተሓልዩ።'
  }
};

// Generate JSON files for each language
const languages = ['oromo', 'spanish', 'french', 'amharic', 'tigrinya'];

languages.forEach(lang => {
  const jsonData = {
    language: lang,
    nativeLanguageField: lang,
    ui: uiTranslations[lang],
    categories: {}
  };
  
  // Add all categories with translated names and phrases
  Object.keys(categoryPhrases).forEach(catKey => {
    const catName = categoryNames[catKey]?.[lang] || catKey;
    jsonData.categories[catName] = categoryPhrases[catKey];
  });
  
  // Write to file
  const filename = `./translations/${lang}.json`;
  fs.writeFileSync(filename, JSON.stringify(jsonData, null, 2), 'utf8');
  console.log(`\n✓ Created ${filename} with ${Object.keys(jsonData.categories).length} categories`);
});

console.log('\n✅ All translation files generated successfully!');
