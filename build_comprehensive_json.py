import json
import re
import os

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
oromo_data = extract_translations_from_js('./translations/oromo_translations.js')
spanish_data = extract_translations_from_js('./translations/spanish_translations.js')
french_data = extract_translations_from_js('./translations/french_translations.js')
amharic_data = extract_translations_from_js('./translations/amharic_translations.js')
tigrinya_data = extract_translations_from_js('./translations/tigrigna_translations.js')

print(f"Loaded: Oromo={len(oromo_data)}, Spanish={len(spanish_data)}, French={len(french_data)}, Amharic={len(amharic_data)}, Tigrinya={len(tigrinya_data)}")

# Collect all unique keys
all_keys = set(list(oromo_data.keys()) + list(spanish_data.keys()) + list(french_data.keys()) + list(amharic_data.keys()) + list(tigrinya_data.keys()))
print(f"Total unique phrases: {len(all_keys)}")

# Build multi-language phrase objects organized by category
category_phrases = {}

for key in sorted(all_keys):
    # Get data from each language
    oromo = oromo_data.get(key, {})
    spanish = spanish_data.get(key, {})
    french = french_data.get(key, {})
    amharic = amharic_data.get(key, {})
    tigrinya = tigrinya_data.get(key, {})
    
    # Determine category
    category = (oromo.get('category') or spanish.get('category') or 
                french.get('category') or amharic.get('category') or 
                tigrinya.get('category') or 'other')
    
    # Build multi-language object
    phrase_obj = {
        'english': key,
        'spanish': spanish.get('translation', ''),
        'french': french.get('translation', ''),
        'amharic': amharic.get('translation', ''),
        'tigrinya': tigrinya.get('translation', ''),
        'oromo': oromo.get('translation', '')
    }
    
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
        'oromo': "Bu'uuraalee & Nagannoowwan"
    },
    'family': {
        'spanish': 'Familia',
        'french': 'Famille',
        'amharic': 'ቤተሰብ',
        'tigrinya': 'ስድራ',
        'oromo': 'Maatii'
    },
    'people': {
        'spanish': 'Personas',
        'french': 'Personnes',
        'amharic': 'ሰዎች',
        'tigrinya': 'ሰባት',
        'oromo': 'Namoota'
    },
    'body': {
        'spanish': 'Partes del Cuerpo',
        'french': 'Parties du Corps',
        'amharic': 'የሰውነት ክፍሎች',
        'tigrinya': 'ክፍልታት ኣካላት',
        'oromo': 'Qaamolee Qaama'
    },
    'clothing': {
        'spanish': 'Ropa',
        'french': 'Vêtements',
        'amharic': 'ልብሶች',
        'tigrinya': 'ክዳውንቲ',
        'oromo': 'Uffata'
    },
    'colors': {
        'spanish': 'Colores',
        'french': 'Couleurs',
        'amharic': 'ቀለሞች',
        'tigrinya': 'ሕብሪታት',
        'oromo': 'Halluulee'
    },
    'numbers': {
        'spanish': 'Números',
        'french': 'Nombres',
        'amharic': 'ቁጥሮች',
        'tigrinya': 'ኣሃዱታት',
        'oromo': 'Lakkoofsa'
    },
    'emotions': {
        'spanish': 'Emociones',
        'french': 'Émotions',
        'amharic': 'ስሜቶች',
        'tigrinya': 'ስምዒታት',
        'oromo': 'Miiraa'
    },
    'school': {
        'spanish': 'Escuela',
        'french': 'École',
        'amharic': 'ትምህርት ቤት',
        'tigrinya': 'ቤት ትምህርቲ',
        'oromo': 'Mana Barumsaa'
    },
    'toys': {
        'spanish': 'Juguetes & Juegos',
        'french': 'Jouets & Jeux',
        'amharic': 'መጫወቻዎች & ጨዋታዎች',
        'tigrinya': 'መጻወቲታት & ጸወታታት',
        'oromo': 'Meeshaalee Tapha & Taphaalee'
    },
    'house': {
        'spanish': 'Casa',
        'french': 'Maison',
        'amharic': 'ቤት',
        'tigrinya': 'ቤት',
        'oromo': 'Mana'
    },
    'food': {
        'spanish': 'Comida',
        'french': 'Nourriture',
        'amharic': 'ምግብ',
        'tigrinya': 'መግቢ',
        'oromo': 'Nyaata'
    },
    'animals': {
        'spanish': 'Animales',
        'french': 'Animaux',
        'amharic': 'እንስሳት',
        'tigrinya': 'እንስሳታት',
        'oromo': 'Bineensota'
    },
    'nature': {
        'spanish': 'Naturaleza',
        'french': 'Nature',
        'amharic': 'ተፈጥሮ',
        'tigrinya': 'ተፈጥሮ',
        'oromo': 'Uumama'
    },
    'time': {
        'spanish': 'Tiempo',
        'french': 'Temps',
        'amharic': 'ጊዜ',
        'tigrinya': 'ግዜ',
        'oromo': 'Yeroo'
    },
    'seasons': {
        'spanish': 'Estaciones',
        'french': 'Saisons',
        'amharic': 'ወቅቶች',
        'tigrinya': 'ወቕትታት',
        'oromo': 'Waqtilee'
    },
    'transport': {
        'spanish': 'Transporte',
        'french': 'Transport',
        'amharic': 'ትራንስፖርት',
        'tigrinya': 'መጎዓዝያ',
        'oromo': 'Geejjiba'
    },
    'places': {
        'spanish': 'Lugares',
        'french': 'Lieux',
        'amharic': 'ቦታዎች',
        'tigrinya': 'ቦታታት',
        'oromo': 'Bakkeewwan'
    },
    'music': {
        'spanish': 'Música',
        'french': 'Musique',
        'amharic': 'ሙዚቃ',
        'tigrinya': 'ሙዚቃ',
        'oromo': 'Muuziqaa'
    },
    'actions': {
        'spanish': 'Acciones',
        'french': 'Actions',
        'amharic': 'ድርጊቶች',
        'tigrinya': 'ተግባራት',
        'oromo': 'Gochaalee'
    },
    'objects': {
        'spanish': 'Objetos',
        'french': 'Objets',
        'amharic': 'ነገሮች',
        'tigrinya': 'ነገራት',
        'oromo': 'Meesha'
    },
    'shapes': {
        'spanish': 'Formas',
        'french': 'Formes',
        'amharic': 'ቅርጾች',
        'tigrinya': 'ቅርጽታት',
        'oromo': 'Bocawwan'
    },
    'holidays': {
        'spanish': 'Días Festivos',
        'french': 'Jours Fériés',
        'amharic': 'በዓላት',
        'tigrinya': 'በዓላት',
        'oromo': 'Ayyaanalee'
    },
    'weather': {
        'spanish': 'Clima',
        'french': 'Météo',
        'amharic': 'የአየር ሁኔታ',
        'tigrinya': 'ኩነታት ኣየር',
        'oromo': 'Haala Qilleensaa'
    },
    'descriptive': {
        'spanish': 'Descriptivos',
        'french': 'Descriptifs',
        'amharic': 'መግለጫ',
        'tigrinya': 'መግለጺ',
        'oromo': 'Ibsituu'
    },
    'military': {
        'spanish': 'Militar',
        'french': 'Militaire',
        'amharic': 'ወታደራዊ',
        'tigrinya': 'ወተሃደራዊ',
        'oromo': 'Waraanaa'
    },
    'weapons': {
        'spanish': 'Armas',
        'french': 'Armes',
        'amharic': 'የጦር መሳሪያዎች',
        'tigrinya': 'መሳርያታት',
        'oromo': 'Meeshaalee Waraanaa'
    },
    'vehicles': {
        'spanish': 'Vehículos',
        'french': 'Véhicules',
        'amharic': 'ተሸከርካሪዎች',
        'tigrinya': 'መጎዓዝያታት',
        'oromo': 'Konkolaatalee'
    },
    'medical': {
        'spanish': 'Médico',
        'french': 'Médical',
        'amharic': 'ሕክምና',
        'tigrinya': 'ሕክምናዊ',
        'oromo': 'Yaalaa'
    },
    'outcomes': {
        'spanish': 'Resultados',
        'french': 'Résultats',
        'amharic': 'ውጤቶች',
        'tigrinya': 'ውጽኢታት',
        'oromo': "Bu'ura"
    },
    'qualities': {
        'spanish': 'Cualidades',
        'french': 'Qualités',
        'amharic': 'ባህሪያት',
        'tigrinya': 'ባህርያት',
        'oromo': 'Amalalee'
    },
    'tactics': {
        'spanish': 'Tácticas',
        'french': 'Tactiques',
        'amharic': 'ስልቶች',
        'tigrinya': 'ስልቲታት',
        'oromo': 'Tooftaalee'
    },
    'equipment': {
        'spanish': 'Equipamiento',
        'french': 'Équipement',
        'amharic': 'መሳሪያዎች',
        'tigrinya': 'መሳርሒታት',
        'oromo': 'Meeshaalee'
    },
    'political': {
        'spanish': 'Político',
        'french': 'Politique',
        'amharic': 'ፖለቲካ',
        'tigrinya': 'ፖለቲካዊ',
        'oromo': 'Siyaasaa'
    },
    'games': {
        'spanish': 'Juegos',
        'french': 'Jeux',
        'amharic': 'ጨዋታዎች',
        'tigrinya': 'ጸወታታት',
        'oromo': 'Taphaalee'
    },
    'other': {
        'spanish': 'Otros',
        'french': 'Autres',
        'amharic': 'ሌሎች',
        'tigrinya': 'ካልኦት',
        'oromo': 'Biroo'
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
    }
}

# Generate JSON files for each language
languages = ['oromo', 'spanish', 'french', 'amharic', 'tigrinya']

for lang in languages:
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
