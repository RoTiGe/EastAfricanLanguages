import json
import re
import os
from pathlib import Path
import glob

# Read the .js files
def extract_translations_from_js(filepath):
    """Extract translation dictionary from a JavaScript file"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract all translation entries using regex
    # Pattern: "key": { "lang": "value", "phonetic": "ph", "category": "cat" }
    pattern = r'"([^"]+)":\s*{\s*"(\w+)":\s*"([^"]*)",\s*"phonetic":\s*"([^"]*)",\s*"category":\s*"([^"]*)"'
    matches = re.findall(pattern, content)
    
    translations = {}
    for english_key, lang_field, translation, phonetic, category in matches:
        translations[english_key] = {
            'translation': translation,
            'category': category,
            'lang_field': lang_field
        }
    
    return translations

print("Loading translation files...")

# Auto-discover all *_translations.js files
translations_dir = Path('./translations')
js_files = list(translations_dir.glob('*_translations.js'))

if not js_files:
    print("❌ No translation files found!")
    exit(1)

print(f"Found {len(js_files)} translation files:")
for f in js_files:
    print(f"  - {f.name}")

# Load all translation data
translation_data = {}
for js_file in js_files:
    language = js_file.stem.replace('_translations', '')
    translation_data[language] = extract_translations_from_js(str(js_file))
    print(f"Loaded {language}: {len(translation_data[language])} entries")

# Collect all unique keys from all languages
all_keys = set()
for lang_data in translation_data.values():
    all_keys.update(lang_data.keys())
print(f"Total unique phrases: {len(all_keys)}")

# Build multi-language phrase objects organized by category
category_phrases = {}

for key in sorted(all_keys):
    # Determine category from any available source
    category = 'other'
    for lang_data in translation_data.values():
        if key in lang_data and lang_data[key].get('category'):
            category = lang_data[key]['category']
            break
    
    # Build multi-language object
    phrase_obj = {'english': key}
    
    # Add translation from each language
    for language, lang_data in translation_data.items():
        if key in lang_data:
            phrase_obj[language] = lang_data[key].get('translation', '')
        else:
            phrase_obj[language] = ''
    
    # Add to category
    if category not in category_phrases:
        category_phrases[category] = []
    category_phrases[category].append(phrase_obj)

print(f"Categories found: {sorted(category_phrases.keys())}")

# Category name translations
category_names = {
    'basics': {
        'spanish': 'Básicos & Saludos',
        'french': 'Bases & Salutations',
        'amharic': 'መሰረታዊ & ሰላምታዎች',
        'tigrinya': 'መሰረታዊ & ሰላምታት',
        'tigrigna': 'መሰረታዊ & ሰላምታት',
        'oromo': "Bu'uuraalee & Nagannoowwan",
        'italian': 'Base & Saluti'
    },
    'family': {
        'spanish': 'Familia',
        'french': 'Famille',
        'amharic': 'ቤተሰብ',
        'tigrinya': 'ስድራ',
        'tigrigna': 'ስድራ',
        'oromo': 'Maatii',
        'italian': 'Famiglia'
    },
    'people': {
        'spanish': 'Personas',
        'french': 'Personnes',
        'amharic': 'ሰዎች',
        'tigrinya': 'ሰባት',
        'tigrigna': 'ሰባት',
        'oromo': 'Namoota',
        'italian': 'Persone'
    },
    'body': {
        'spanish': 'Partes del Cuerpo',
        'french': 'Parties du Corps',
        'amharic': 'የሰውነት ክፍሎች',
        'tigrinya': 'ክፍልታት ኣካላት',
        'tigrigna': 'ክፍልታት ኣካላት',
        'oromo': 'Qaamolee Qaama',
        'italian': 'Parti del Corpo'
    },
    'clothing': {
        'spanish': 'Ropa',
        'french': 'Vêtements',
        'amharic': 'ልብሶች',
        'tigrinya': 'ክዳውንቲ',
        'tigrigna': 'ክዳውንቲ',
        'oromo': 'Uffata',
        'italian': 'Abbigliamento'
    },
    'colors': {
        'spanish': 'Colores',
        'french': 'Couleurs',
        'amharic': 'ቀለሞች',
        'tigrinya': 'ሕብሪታት',
        'tigrigna': 'ሕብሪታት',
        'oromo': 'Halluulee',
        'italian': 'Colori'
    },
    'numbers': {
        'spanish': 'Números',
        'french': 'Nombres',
        'amharic': 'ቁጥሮች',
        'tigrinya': 'ኣሃዱታት',
        'tigrigna': 'ኣሃዱታት',
        'oromo': 'Lakkoofsa',
        'italian': 'Numeri'
    },
    'emotions': {
        'spanish': 'Emociones',
        'french': 'Émotions',
        'amharic': 'ስሜቶች',
        'tigrinya': 'ስምዒታት',
        'tigrigna': 'ስምዒታት',
        'oromo': 'Miiraa',
        'italian': 'Emozioni'
    },
    'school': {
        'spanish': 'Escuela',
        'french': 'École',
        'amharic': 'ትምህርት ቤት',
        'tigrinya': 'ቤት ትምህርቲ',
        'tigrigna': 'ቤት ትምህርቲ',
        'oromo': 'Mana Barumsaa',
        'italian': 'Scuola'
    },
    'toys': {
        'spanish': 'Juguetes & Juegos',
        'french': 'Jouets & Jeux',
        'amharic': 'መጫወቻዎች & ጨዋታዎች',
        'tigrinya': 'መጻወቲታት & ጸወታታት',
        'tigrigna': 'መጻወቲታት & ጸወታታት',
        'oromo': 'Meeshaalee Tapha & Taphaalee',
        'italian': 'Giocattoli & Giochi'
    },
    'house': {
        'spanish': 'Casa',
        'french': 'Maison',
        'amharic': 'ቤት',
        'tigrinya': 'ቤት',
        'tigrigna': 'ቤት',
        'oromo': 'Mana',
        'italian': 'Casa'
    },
    'food': {
        'spanish': 'Comida',
        'french': 'Nourriture',
        'amharic': 'ምግብ',
        'tigrinya': 'መግቢ',
        'tigrigna': 'መግቢ',
        'oromo': 'Nyaata',
        'italian': 'Cibo'
    },
    'animals': {
        'spanish': 'Animales',
        'french': 'Animaux',
        'amharic': 'እንስሳት',
        'tigrinya': 'እንስሳታት',
        'tigrigna': 'እንስሳታት',
        'oromo': 'Bineensota',
        'italian': 'Animali'
    },
    'nature': {
        'spanish': 'Naturaleza',
        'french': 'Nature',
        'amharic': 'ተፈጥሮ',
        'tigrinya': 'ተፈጥሮ',
        'tigrigna': 'ተፈጥሮ',
        'oromo': 'Uumama',
        'italian': 'Natura'
    },
    'time': {
        'spanish': 'Tiempo',
        'french': 'Temps',
        'amharic': 'ጊዜ',
        'tigrinya': 'ግዜ',
        'tigrigna': 'ግዜ',
        'oromo': 'Yeroo',
        'italian': 'Tempo'
    },
    'seasons': {
        'spanish': 'Estaciones',
        'french': 'Saisons',
        'amharic': 'ወቅቶች',
        'tigrinya': 'ወቕትታት',
        'tigrigna': 'ወቕትታት',
        'oromo': 'Waqtilee',
        'italian': 'Stagioni'
    },
    'transport': {
        'spanish': 'Transporte',
        'french': 'Transport',
        'amharic': 'ትራንስፖርት',
        'tigrinya': 'መጎዓዝያ',
        'tigrigna': 'መጎዓዝያ',
        'oromo': 'Geejjiba',
        'italian': 'Trasporto'
    },
    'places': {
        'spanish': 'Lugares',
        'french': 'Lieux',
        'amharic': 'ቦታዎች',
        'tigrinya': 'ቦታታት',
        'tigrigna': 'ቦታታት',
        'oromo': 'Bakkeewwan',
        'italian': 'Luoghi'
    },
    'music': {
        'spanish': 'Música',
        'french': 'Musique',
        'amharic': 'ሙዚቃ',
        'tigrinya': 'ሙዚቃ',
        'tigrigna': 'ሙዚቃ',
        'oromo': 'Muuziqaa',
        'italian': 'Musica'
    },
    'actions': {
        'spanish': 'Acciones',
        'french': 'Actions',
        'amharic': 'ድርጊቶች',
        'tigrinya': 'ተግባራት',
        'tigrigna': 'ተግባራት',
        'oromo': 'Gochaalee',
        'italian': 'Azioni'
    },
    'objects': {
        'spanish': 'Objetos',
        'french': 'Objets',
        'amharic': 'ነገሮች',
        'tigrinya': 'ነገራት',
        'tigrigna': 'ነገራት',
        'oromo': 'Meesha',
        'italian': 'Oggetti'
    },
    'shapes': {
        'spanish': 'Formas',
        'french': 'Formes',
        'amharic': 'ቅርጾች',
        'tigrinya': 'ቅርጽታት',
        'tigrigna': 'ቅርጽታት',
        'oromo': 'Bocawwan',
        'italian': 'Forme'
    },
    'holidays': {
        'spanish': 'Días Festivos',
        'french': 'Jours Fériés',
        'amharic': 'በዓላት',
        'tigrinya': 'በዓላት',
        'tigrigna': 'በዓላት',
        'oromo': 'Ayyaanalee',
        'italian': 'Festività'
    },
    'weather': {
        'spanish': 'Clima',
        'french': 'Météo',
        'amharic': 'የአየር ሁኔታ',
        'tigrinya': 'ኩነታት ኣየር',
        'tigrigna': 'ኩነታት ኣየር',
        'oromo': 'Haala Qilleensaa',
        'italian': 'Tempo'
    },
    'descriptive': {
        'spanish': 'Descriptivos',
        'french': 'Descriptifs',
        'amharic': 'መግለጫ',
        'tigrinya': 'መግለጺ',
        'tigrigna': 'መግለጺ',
        'oromo': 'Ibsituu',
        'italian': 'Descrittivo'
    },
    'military': {
        'spanish': 'Militar',
        'french': 'Militaire',
        'amharic': 'ወታደራዊ',
        'tigrinya': 'ወተሃደራዊ',
        'tigrigna': 'ወተሃደራዊ',
        'oromo': 'Waraanaa',
        'italian': 'Militare'
    },
    'weapons': {
        'spanish': 'Armas',
        'french': 'Armes',
        'amharic': 'የጦር መሳሪያዎች',
        'tigrinya': 'መሳርያታት',
        'tigrigna': 'መሳርያታት',
        'oromo': 'Meeshaalee Waraanaa',
        'italian': 'Armi'
    },
    'vehicles': {
        'spanish': 'Vehículos',
        'french': 'Véhicules',
        'amharic': 'ተሸከርካሪዎች',
        'tigrinya': 'መጎዓዝያታት',
        'tigrigna': 'መጎዓዝያታት',
        'oromo': 'Konkolaatalee',
        'italian': 'Veicoli'
    },
    'medical': {
        'spanish': 'Médico',
        'french': 'Médical',
        'amharic': 'ሕክምና',
        'tigrinya': 'ሕክምናዊ',
        'tigrigna': 'ሕክምናዊ',
        'oromo': 'Yaalaa',
        'italian': 'Medico'
    },
    'outcomes': {
        'spanish': 'Resultados',
        'french': 'Résultats',
        'amharic': 'ውጤቶች',
        'tigrinya': 'ውጽኢታት',
        'tigrigna': 'ውጽኢታት',
        'oromo': "Bu'ura",
        'italian': 'Risultati'
    },
    'qualities': {
        'spanish': 'Cualidades',
        'french': 'Qualités',
        'amharic': 'ባህሪያት',
        'tigrinya': 'ባህርያት',
        'tigrigna': 'ባህርያት',
        'oromo': 'Amalalee',
        'italian': 'Qualità'
    },
    'tactics': {
        'spanish': 'Tácticas',
        'french': 'Tactiques',
        'amharic': 'ስልቶች',
        'tigrinya': 'ስልቲታት',
        'tigrigna': 'ስልቲታት',
        'oromo': 'Tooftaalee',
        'italian': 'Tattiche'
    },
    'equipment': {
        'spanish': 'Equipamiento',
        'french': 'Équipement',
        'amharic': 'መሳሪያዎች',
        'tigrinya': 'መሳርሒታት',
        'tigrigna': 'መሳርሒታት',
        'oromo': 'Meeshaalee',
        'italian': 'Attrezzatura'
    },
    'political': {
        'spanish': 'Político',
        'french': 'Politique',
        'amharic': 'ፖለቲካ',
        'tigrinya': 'ፖለቲካዊ',
        'tigrigna': 'ፖለቲካዊ',
        'oromo': 'Siyaasaa',
        'italian': 'Politico'
    },
    'games': {
        'spanish': 'Juegos',
        'french': 'Jeux',
        'amharic': 'ጨዋታዎች',
        'tigrinya': 'ጸወታታት',
        'tigrigna': 'ጸወታታት',
        'oromo': 'Taphaalee',
        'italian': 'Giochi'
    },
    'other': {
        'spanish': 'Otros',
        'french': 'Autres',
        'amharic': 'ሌሎች',
        'tigrinya': 'ካልኦት',
        'tigrigna': 'ካልኦት',
        'oromo': 'Biroo',
        'italian': 'Altri'
    }
}

# UI translations
ui_translations = {
    'oromo': {
        'pageTitle': 'Afaan Oromoo Baruu',
        'enterText': 'Barruu kee galchi',
        'placeholder': 'Mee asitti barruu kee galchi...',
        'speakButton': 'Dubbisi',
        'clearButton': 'Haquu',
        'audioOutput': 'Sagalee Bahe',
        'languageLabel': 'Afaan:',
        'examplePhrases': 'Hima Fakkaataa',
        'showTranslation': 'Hiika agarsiisi:',
        'selectCategory': 'Ramaddii filadhu',
        'selectPhrase': 'Hima filadhu',
        'usePhrase': 'Hima fayyadami',
        'footer': '© 2026 Sound Training App. Mirga hunduu kan eegame.'
    },
    'spanish': {
        'pageTitle': 'Aprende Español',
        'enterText': 'Ingresa tu texto',
        'placeholder': 'Escribe tu texto aquí...',
        'speakButton': 'Hablar',
        'clearButton': 'Limpiar',
        'audioOutput': 'Salida de Audio',
        'languageLabel': 'Idioma:',
        'examplePhrases': 'Frases de Ejemplo',
        'showTranslation': 'Mostrar traducción en:',
        'selectCategory': 'Selecciona una categoría',
        'selectPhrase': 'Selecciona una frase',
        'usePhrase': 'Usar frase',
        'footer': '© 2026 Sound Training App. Todos los derechos reservados.'
    },
    'french': {
        'pageTitle': 'Apprendre le Français',
        'enterText': 'Entrez votre texte',
        'placeholder': 'Tapez votre texte ici...',
        'speakButton': 'Parler',
        'clearButton': 'Effacer',
        'audioOutput': 'Sortie Audio',
        'languageLabel': 'Langue:',
        'examplePhrases': "Phrases d'Exemple",
        'showTranslation': 'Afficher la traduction en:',
        'selectCategory': 'Sélectionnez une catégorie',
        'selectPhrase': 'Sélectionnez une phrase',
        'usePhrase': 'Utiliser la phrase',
        'footer': '© 2026 Sound Training App. Tous droits réservés.'
    },
    'amharic': {
        'pageTitle': 'አማርኛ ይማሩ',
        'enterText': 'ጽሑፍዎን ያስገቡ',
        'placeholder': 'እዚህ ጽሑፍዎን ይጻፉ...',
        'speakButton': 'ተናገር',
        'clearButton': 'አጥፋ',
        'audioOutput': 'የድምጽ ውጤት',
        'languageLabel': 'ቋንቋ:',
        'examplePhrases': 'ምሳሌ ሃሳቦች',
        'showTranslation': 'ትርጉም አሳይ በ:',
        'selectCategory': 'ምድብ ይምረጡ',
        'selectPhrase': 'ሀረግ ይምረጡ',
        'usePhrase': 'ሀረግ ተጠቀም',
        'footer': '© 2026 Sound Training App. መብቱ በህግ የተጠበቀ ነው።'
    },
    'tigrinya': {
        'pageTitle': 'ትግርኛ ተማሃሩ',
        'enterText': 'ጽሑፍኩም ኣእትውዎ',
        'placeholder': 'ኣብዚ ጽሑፍኩም ጽሓፉ...',
        'speakButton': 'ተዛረብ',
        'clearButton': 'ደምስስ',
        'audioOutput': 'ውጽኢት ድምጺ',
        'languageLabel': 'ቋንቋ:',
        'examplePhrases': 'ኣብነታት ሓሳባት',
        'showTranslation': 'ትርጉም ኣርእዩ ብ:',
        'selectCategory': 'ምድብ መረጽ',
        'selectPhrase': 'ሓሳብ መረጽ',
        'usePhrase': 'ሓሳብ ተጠቐም',
        'footer': '© 2026 Sound Training App. ኩሉ መሰል ተሓልዩ።'
    },
    'tigrigna': {
        'pageTitle': 'ትግርኛ ተማሃሩ',
        'enterText': 'ጽሑፍኩም ኣእትውዎ',
        'placeholder': 'ኣብዚ ጽሑፍኩም ጽሓፉ...',
        'speakButton': 'ተዛረብ',
        'clearButton': 'ደምስስ',
        'audioOutput': 'ውጽኢት ድምጺ',
        'languageLabel': 'ቋንቋ:',
        'examplePhrases': 'ኣብነታት ሓሳባት',
        'showTranslation': 'ትርጉም ኣርእዩ ብ:',
        'selectCategory': 'ምድብ መረጽ',
        'selectPhrase': 'ሓሳብ መረጽ',
        'usePhrase': 'ሓሳብ ተጠቐም',
        'footer': '© 2026 Sound Training App. ኩሉ መሰል ተሓልዩ።'
    },
    'italian': {
        'pageTitle': 'Impara l\'Italiano',
        'enterText': 'Inserisci il tuo testo',
        'placeholder': 'Scrivi il tuo testo qui...',
        'speakButton': 'Parla',
        'clearButton': 'Cancella',
        'audioOutput': 'Uscita Audio',
        'languageLabel': 'Lingua:',
        'examplePhrases': 'Frasi di Esempio',
        'showTranslation': 'Mostra traduzione in:',
        'selectCategory': 'Seleziona una categoria',
        'selectPhrase': 'Seleziona una frase',
        'usePhrase': 'Usa frase',
        'footer': '© 2026 Sound Training App. Tutti i diritti riservati.'
    }
}


# Generate JSON files for each language that has UI translations
discovered_languages = list(translation_data.keys())
print(f"\n{'='*60}")
print(f"Generating JSON files for languages with UI translations...")
print(f"{'='*60}")

for lang in discovered_languages:
    # Skip if no UI translations defined for this language
    if lang not in ui_translations:
        print(f"\n⚠️  Skipping {lang} - no UI translations defined")
        continue
    
    json_data = {
        'language': lang,
        'nativeLanguageField': lang,
        'ui': ui_translations[lang],
        'categoryNames': {},
        'categories': {}
    }
    
    # Add all categories with English keys and translated names
    for cat_key in sorted(category_phrases.keys()):
        cat_name = category_names.get(cat_key, {}).get(lang, cat_key)
        json_data['categoryNames'][cat_key] = cat_name
        json_data['categories'][cat_key] = category_phrases[cat_key]
    
    # Write to file
    filename = f'./translations/{lang}.json'
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(json_data, f, ensure_ascii=False, indent=2)
    
    print(f"✓ Created {filename} with {len(json_data['categories'])} categories, {sum(len(p) for p in json_data['categories'].values())} phrases")

print("\n✅ All translation files generated successfully!")
