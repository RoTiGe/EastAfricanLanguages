import json

# Read Spanish as the master template
print("Loading Spanish JSON as master template...")
with open('./translations/spanish.json', 'r', encoding='utf-8') as f:
    spanish_master = json.load(f)

print(f"Master has {len(spanish_master['categories'])} categories")
total_phrases = sum(len(phrases) for phrases in spanish_master['categories'].values())
print(f"Master has {total_phrases} total phrases")

# Load existing translations for other languages
languages = {
    'afar': './translations/afar.json',
    'amharic': './translations/amharic.json',
    'arabic': './translations/arabic.json',
    'english': './translations/english.json',
    'french': './translations/french.json',
    'gamo': './translations/gamo.json',
    'hadiyaa': './translations/hadiyaa.json',
    'kinyarwanda': './translations/kinyarwanda.json',
    'kirundi': './translations/kirundi.json',
    'luo': './translations/luo.json',
    'oromo': './translations/oromo.json',
    'somali': './translations/somali.json',
    'swahili': './translations/swahili.json',
    'tigrinya': './translations/tigrinya.json',
    'wolyitta': './translations/wolyitta.json'
}

for lang_code, filepath in languages.items():
    print(f"\n{'='*60}")
    print(f"Processing {lang_code.upper()}...")
    print(f"{'='*60}")
    
    # Load existing data
    with open(filepath, 'r', encoding='utf-8') as f:
        existing_data = json.load(f)
    
    # Create lookup dictionary for existing translations by english key
    existing_translations = {}
    for category, phrases in existing_data['categories'].items():
        for phrase in phrases:
            english_key = phrase.get('english', '')
            if english_key:
                existing_translations[english_key] = phrase.get(lang_code, '')
    
    print(f"  Found {len(existing_translations)} existing translations")
    
    # Build new data using Spanish structure
    new_data = {
        'language': lang_code,
        'nativeLanguageField': lang_code,
        'ui': existing_data['ui'],  # Keep existing UI translations
        'categories': {}
    }
    
    # Process each category from Spanish master
    filled_count = 0
    missing_count = 0
    
    for category_name, spanish_phrases in spanish_master['categories'].items():
        new_data['categories'][category_name] = []
        
        for phrase in spanish_phrases:
            english_key = phrase['english']
            
            # Get translation if it exists
            translation = existing_translations.get(english_key, '')
            
            if translation:
                filled_count += 1
            else:
                missing_count += 1
            
            # Build phrase object with same structure as Spanish
            new_phrase = {
                'english': phrase['english'],
                'spanish': phrase['spanish'],
                'french': phrase['french'],
                'amharic': phrase['amharic'],
                'tigrinya': phrase['tigrinya'],
                'oromo': phrase['oromo']
            }
            
            # Update the target language field with existing translation
            new_phrase[lang_code] = translation
            
            new_data['categories'][category_name].append(new_phrase)
    
    # Write updated file
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(new_data, f, ensure_ascii=False, indent=2)
    
    coverage = (filled_count / total_phrases * 100) if total_phrases > 0 else 0
    print(f"  ✓ Updated {filepath}")
    print(f"  - Filled: {filled_count} phrases ({coverage:.1f}%)")
    print(f"  - Missing: {missing_count} phrases")

print(f"\n{'='*60}")
print("✅ All files synchronized with Spanish master structure!")
print(f"{'='*60}")
