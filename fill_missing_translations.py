import json
from collections import defaultdict

print("Loading all JSON files...")

files = {
    'spanish': 'translations/spanish.json',
    'french': 'translations/french.json',
    'oromo': 'translations/oromo.json',
    'amharic': 'translations/amharic.json',
    'tigrinya': 'translations/tigrinya.json'
}

# Collect all translations for each English key across all files
translation_pool = defaultdict(lambda: {
    'spanish': '',
    'french': '',
    'oromo': '',
    'amharic': '',
    'tigrinya': ''
})

# Load all files and collect translations
for file_name, file_path in files.items():
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    for category, phrases in data['categories'].items():
        for phrase in phrases:
            english_key = phrase['english']
            
            # Collect non-empty translations for each language
            for lang in ['spanish', 'french', 'oromo', 'amharic', 'tigrinya']:
                if phrase.get(lang, '').strip():
                    # Only update if we don't have a translation yet, or this one is longer (more complete)
                    existing = translation_pool[english_key][lang]
                    new_val = phrase[lang]
                    if not existing or len(new_val) > len(existing):
                        translation_pool[english_key][lang] = new_val

print(f"Collected translations for {len(translation_pool)} unique phrases")

# Now rebuild each file with the most complete translations
for file_name, file_path in files.items():
    print(f"\nProcessing {file_name.upper()}...")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    before_count = 0
    after_count = 0
    native_lang = data['nativeLanguageField']
    
    # Count before
    for category, phrases in data['categories'].items():
        for phrase in phrases:
            if not phrase.get(native_lang, '').strip():
                before_count += 1
    
    # Update phrases with translations from the pool
    for category, phrases in data['categories'].items():
        for phrase in phrases:
            english_key = phrase['english']
            
            # Fill in all language fields with best available translations
            for lang in ['spanish', 'french', 'oromo', 'amharic', 'tigrinya']:
                if translation_pool[english_key][lang]:
                    phrase[lang] = translation_pool[english_key][lang]
    
    # Count after
    for category, phrases in data['categories'].items():
        for phrase in phrases:
            if not phrase.get(native_lang, '').strip():
                after_count += 1
    
    # Write updated file
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    filled = before_count - after_count
    total = sum(len(phrases) for phrases in data['categories'].values())
    
    print(f"  Missing {native_lang} before: {before_count}")
    print(f"  Missing {native_lang} after: {after_count}")
    print(f"  Filled: {filled} phrases")
    print(f"  Coverage: {((total - after_count) / total * 100):.1f}%")

print("\n" + "="*70)
print("✅ All files updated with most complete translations!")
print("="*70)
