const fs = require('fs');
const path = require('path');

// Automatically discover all .js translation files
const translationsDir = './translations';
const jsFiles = fs.readdirSync(translationsDir)
  .filter(file => file.endsWith('_translations.js'))
  .map(file => ({
    filename: file,
    language: file.replace('_translations.js', '')
  }));

console.log('Found translation files:', jsFiles.map(f => f.filename).join(', '));

// Extract translation objects using eval (safe since we control the source)
const extractTranslations = (jsContent, filename) => {
  // Create a safe execution context with window object
  const window = {};
  let translations = null;
  let frenchTranslations = null;
  
  try {
    // Execute the code in current scope
    eval(jsContent);
    
    const result = window.translations || translations || frenchTranslations;
    if (!result) {
      console.warn(`⚠️  Warning: Could not extract translations from ${filename}`);
      return {};
    }
    return result;
  } catch (error) {
    console.error(`❌ Error extracting translations from ${filename}:`, error.message);
    return {};
  }
};

// Read and extract all translation data
const translationData = {};
jsFiles.forEach(({ filename, language }) => {
  const filePath = path.join(translationsDir, filename);
  const jsContent = fs.readFileSync(filePath, 'utf8');
  translationData[language] = extractTranslations(jsContent, filename);
});


console.log('Loaded translation data:');
jsFiles.forEach(({ language }) => {
  const count = Object.keys(translationData[language] || {}).length;
  console.log(`- ${language}: ${count} entries`);
});

// Collect all unique English keys from all languages
const allKeys = new Set();
jsFiles.forEach(({ language }) => {
  Object.keys(translationData[language] || {}).forEach(key => allKeys.add(key));
});

console.log('\nTotal unique phrases:', allKeys.size);


// Build multi-language phrase objects
const multiLangPhrases = {};
const categoryPhrases = {};

allKeys.forEach(key => {
  // Get translations from all languages
  const languageTranslations = {};
  let category = 'other';
  
  jsFiles.forEach(({ language }) => {
    const data = translationData[language];
    if (data && data[key]) {
      languageTranslations[language] = data[key][language] || '';
      // Get category from first available source
      if (category === 'other' && data[key].category) {
        category = data[key].category;
      }
    } else {
      languageTranslations[language] = '';
    }
  });
  
  // Build multi-language object
  const phraseObj = {
    english: key,
    ...languageTranslations
  };
  
  // Organize by category
  if (!categoryPhrases[category]) {
    categoryPhrases[category] = [];
  }
  categoryPhrases[category].push(phraseObj);
});


console.log('\nCategories found:', Object.keys(categoryPhrases).sort());

// Category name translations - dynamically include all languages
const categoryNames = {
  basics: {
    spanish: 'Básicos & Saludos',
    french: 'Bases & Salutations',
    amharic: 'መሰረታዊ & ሰላምታዎች',
    tigrigna: 'መሰረታዊ & ሰላምታት',
    oromo: 'Bu\'uuraalee & Nagannoowwan',
    italian: 'Base & Saluti'
  },
  family: {
    spanish: 'Familia',
    french: 'Famille',
    amharic: 'ቤተሰብ',
    tigrigna: 'ስድራ',
    oromo: 'Maatii',
    italian: 'Famiglia'
  },
  people: {
    spanish: 'Personas',
    french: 'Personnes',
    amharic: 'ሰዎች',
    tigrigna: 'ሰባት',
    oromo: 'Namoota',
    italian: 'Persone'
  },
  body: {
    spanish: 'Partes del Cuerpo',
    french: 'Parties du Corps',
    amharic: 'የሰውነት ክፍሎች',
    tigrigna: 'ክፍልታት ኣካላት',
    oromo: 'Qaamolee Qaama',
    italian: 'Parti del Corpo'
  },
  clothing: {
    spanish: 'Ropa',
    french: 'Vêtements',
    amharic: 'ልብሶች',
    tigrigna: 'ክዳውንቲ',
    oromo: 'Uffata',
    italian: 'Abbigliamento'
  },
  colors: {
    spanish: 'Colores',
    french: 'Couleurs',
    amharic: 'ቀለሞች',
    tigrigna: 'ሕብሪታት',
    oromo: 'Halluulee',
    italian: 'Colori'
  },
  numbers: {
    spanish: 'Números',
    french: 'Nombres',
    amharic: 'ቁጥሮች',
    tigrigna: 'ኣሃዱታት',
    oromo: 'Lakkoofsa',
    italian: 'Numeri'
  },
  emotions: {
    spanish: 'Emociones',
    french: 'Émotions',
    amharic: 'ስሜቶች',
    tigrigna: 'ስምዒታት',
    oromo: 'Miiraa',
    italian: 'Emozioni'
  },
  school: {
    spanish: 'Escuela',
    french: 'École',
    amharic: 'ትምህርት ቤት',
    tigrigna: 'ቤት ትምህርቲ',
    oromo: 'Mana Barumsaa',
    italian: 'Scuola'
  },
  toys: {
    spanish: 'Juguetes & Juegos',
    french: 'Jouets & Jeux',
    amharic: 'መጫወቻዎች & ጨዋታዎች',
    tigrigna: 'መጻወቲታት & ጸወታታት',
    oromo: 'Meeshaalee Tapha & Tapha',
    italian: 'Giocattoli & Giochi'
  },
  house: {
    spanish: 'Casa',
    french: 'Maison',
    amharic: 'ቤት',
    tigrigna: 'ቤት',
    oromo: 'Mana',
    italian: 'Casa'
  },
  food: {
    spanish: 'Comida',
    french: 'Nourriture',
    amharic: 'ምግብ',
    tigrigna: 'መግቢ',
    oromo: 'Nyaata',
    italian: 'Cibo'
  },
  animals: {
    spanish: 'Animales',
    french: 'Animaux',
    amharic: 'እንስሳት',
    tigrigna: 'እንስሳታት',
    oromo: 'Bineensota',
    italian: 'Animali'
  },
  nature: {
    spanish: 'Naturaleza',
    french: 'Nature',
    amharic: 'ተፈጥሮ',
    tigrigna: 'ተፈጥሮ',
    oromo: 'Uumama',
    italian: 'Natura'
  },
  time: {
    spanish: 'Tiempo',
    french: 'Temps',
    amharic: 'ጊዜ',
    tigrigna: 'ግዜ',
    oromo: 'Yeroo',
    italian: 'Tempo'
  },
  seasons: {
    spanish: 'Estaciones',
    french: 'Saisons',
    amharic: 'ወቅቶች',
    tigrigna: 'ወቕትታት',
    oromo: 'Waqtilee',
    italian: 'Stagioni'
  },
  transport: {
    spanish: 'Transporte',
    french: 'Transport',
    amharic: 'ትራንስፖርት',
    tigrigna: 'መጎዓዝያ',
    oromo: 'Geejjiba',
    italian: 'Trasporto'
  },
  places: {
    spanish: 'Lugares',
    french: 'Lieux',
    amharic: 'ቦታዎች',
    tigrigna: 'ቦታታት',
    oromo: 'Bakkeewwan',
    italian: 'Luoghi'
  },
  music: {
    spanish: 'Música',
    french: 'Musique',
    amharic: 'ሙዚቃ',
    tigrigna: 'ሙዚቃ',
    oromo: 'Muuziqaa',
    italian: 'Musica'
  },
  actions: {
    spanish: 'Acciones',
    french: 'Actions',
    amharic: 'ድርጊቶች',
    tigrigna: 'ተግባራት',
    oromo: 'Gochaalee',
    italian: 'Azioni'
  },
  objects: {
    spanish: 'Objetos',
    french: 'Objets',
    amharic: 'ነገሮች',
    tigrigna: 'ነገራት',
    oromo: 'Meesha',
    italian: 'Oggetti'
  },
  shapes: {
    spanish: 'Formas',
    french: 'Formes',
    amharic: 'ቅርጾች',
    tigrigna: 'ቅርጽታት',
    oromo: 'Bocawwan',
    italian: 'Forme'
  },
  holidays: {
    spanish: 'Días Festivos',
    french: 'Jours Fériés',
    amharic: 'በዓላት',
    tigrigna: 'በዓላት',
    oromo: 'Ayyaanalee',
    italian: 'Festività'
  },
  weather: {
    spanish: 'Clima',
    french: 'Météo',
    amharic: 'የአየር ሁኔታ',
    tigrigna: 'ኩነታት ኣየር',
    oromo: 'Haala Qilleensaa',
    italian: 'Tempo'
  },
  descriptive: {
    spanish: 'Descriptivos',
    french: 'Descriptifs',
    amharic: 'መግለጫ',
    tigrigna: 'መግለጺ',
    oromo: 'Ibsituu',
    italian: 'Descrittivo'
  },
  military: {
    spanish: 'Militar',
    french: 'Militaire',
    amharic: 'ወታደራዊ',
    tigrigna: 'ወተሃደራዊ',
    oromo: 'Waraanaa',
    italian: 'Militare'
  },
  weapons: {
    spanish: 'Armas',
    french: 'Armes',
    amharic: 'የጦር መሳሪያዎች',
    tigrigna: 'መሳርያታት',
    oromo: 'Meeshaalee Waraanaa',
    italian: 'Armi'
  },
  vehicles: {
    spanish: 'Vehículos',
    french: 'Véhicules',
    amharic: 'ተሽከርካሪዎች',
    tigrigna: 'መጎዓዝያታት',
    oromo: 'Konkolaatalee',
    italian: 'Veicoli'
  },
  medical: {
    spanish: 'Médico',
    french: 'Médical',
    amharic: 'ሕክምና',
    tigrigna: 'ሕክምናዊ',
    oromo: 'Yaalaa',
    italian: 'Medico'
  },
  outcomes: {
    spanish: 'Resultados',
    french: 'Résultats',
    amharic: 'ውጤቶች',
    tigrigna: 'ውጽኢታት',
    oromo: 'Bu\'uuraa',
    italian: 'Risultati'
  },
  qualities: {
    spanish: 'Cualidades',
    french: 'Qualités',
    amharic: 'ባህሪያት',
    tigrigna: 'ባህርያት',
    oromo: 'Amalalee',
    italian: 'Qualità'
  },
  tactics: {
    spanish: 'Tácticas',
    french: 'Tactiques',
    amharic: 'ስልቶች',
    tigrigna: 'ስልቲታት',
    oromo: 'Tooftaalee',
    italian: 'Tattiche'
  },
  equipment: {
    spanish: 'Equipamiento',
    french: 'Équipement',
    amharic: 'መሳሪያዎች',
    tigrigna: 'መሳርሒታት',
    oromo: 'Meeshaalee',
    italian: 'Attrezzatura'
  },
  political: {
    spanish: 'Político',
    french: 'Politique',
    amharic: 'ፖለቲካ',
    tigrigna: 'ፖለቲካዊ',
    oromo: 'Siyaasaa',
    italian: 'Politico'
  },
  games: {
    spanish: 'Juegos',
    french: 'Jeux',
    amharic: 'ጨዋታዎች',
    tigrigna: 'ጸወታታት',
    oromo: 'Taphaalee',
    italian: 'Giochi'
  },
  other: {
    spanish: 'Otros',
    french: 'Autres',
    amharic: 'ሌሎች',
    tigrigna: 'ካልኦት',
    oromo: 'Biroo',
    italian: 'Altri'
  }
};


// UI translations - dynamically include all languages
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
  tigrigna: {
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
  },
  italian: {
    pageTitle: 'Impara l\'Italiano',
    enterText: 'Inserisci il tuo testo',
    placeholder: 'Scrivi il tuo testo qui...',
    speakButton: 'Parla',
    clearButton: 'Cancella',
    audioOutput: 'Uscita Audio',
    languageLabel: 'Lingua:',
    examplePhrases: 'Frasi di Esempio',
    showTranslation: 'Mostra traduzione in:',
    selectCategory: 'Seleziona una categoria',
    selectPhrase: 'Seleziona una frase',
    usePhrase: 'Usa frase',
    footer: '© 2026 Sound Training App. Tutti i diritti riservati.'
  }
};


// Generate JSON files for each language
jsFiles.forEach(({ language }) => {
  // Skip if no UI translations defined for this language
  if (!uiTranslations[language]) {
    console.log(`\n⚠️  Skipping ${language} - no UI translations defined`);
    return;
  }
  
  const jsonData = {
    language: language,
    nativeLanguageField: language,
    ui: uiTranslations[language],
    categories: {}
  };
  
  // Add all categories with translated names and phrases
  Object.keys(categoryPhrases).forEach(catKey => {
    const catName = categoryNames[catKey]?.[language] || catKey;
    jsonData.categories[catName] = categoryPhrases[catKey];
  });
  
  // Write to file
  const filename = `./translations/${language}.json`;
  fs.writeFileSync(filename, JSON.stringify(jsonData, null, 2), 'utf8');
  console.log(`\n✓ Created ${filename} with ${Object.keys(jsonData.categories).length} categories`);
});

console.log('\n✅ All translation files generated successfully!');
