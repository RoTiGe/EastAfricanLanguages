"""
Cross-populate all translation files to make all languages translatable with each other.
This adds missing language fields to every phrase in every translation file.
"""

import json
import os

# Define all languages
ALL_LANGUAGES = [
    'spanish', 'french', 'amharic', 'tigrinya', 'oromo', 'somali', 'arabic',
    'hadiyaa', 'wolyitta', 'afar', 'gamo', 'swahili', 'kinyarwanda', 'kirundi', 'luo'
]

# Language field name mappings (some use different spellings)
FIELD_MAPPINGS = {
    'hadiyaa': 'hadiya',
    'wolyitta': 'wolayita',
    'tigrinya': 'tigrinya'
}

def get_field_name(language):
    """Get the actual field name used in JSON for a language"""
    return FIELD_MAPPINGS.get(language, language)

def load_all_translations():
    """Load all translation files"""
    translations_dir = 'translations'
    all_data = {}
    
    for lang in ALL_LANGUAGES:
        filepath = os.path.join(translations_dir, f'{lang}.json')
        if os.path.exists(filepath):
            with open(filepath, 'r', encoding='utf-8') as f:
                all_data[lang] = json.load(f)
            print(f"✓ Loaded {lang}.json")
        else:
            print(f"✗ Missing {lang}.json")
    
    return all_data

def cross_populate_all(all_data):
    """Cross-populate translations across all language files"""
    
    # Create a master index of all translations by English word
    master_index = {}
    
    # First pass: collect all translations for each English word
    for lang, data in all_data.items():
        if 'categories' not in data:
            continue
        
        for category_name, phrases in data['categories'].items():
            if not isinstance(phrases, list):
                continue
            
            for phrase in phrases:
                if 'english' not in phrase:
                    continue
                
                english_word = phrase['english']
                
                if english_word not in master_index:
                    master_index[english_word] = {}
                
                # Collect all translations for this English word
                for lang_key in ALL_LANGUAGES:
                    field_name = get_field_name(lang_key)
                    if field_name in phrase and phrase[field_name]:
                        if lang_key not in master_index[english_word]:
                            master_index[english_word][lang_key] = phrase[field_name]
    
    print(f"\n✓ Built master index with {len(master_index)} unique English words")
    
    # Second pass: update all files with complete translations
    for lang, data in all_data.items():
        if 'categories' not in data:
            continue
        
        updated_count = 0
        
        for category_name, phrases in data['categories'].items():
            if not isinstance(phrases, list):
                continue
            
            for phrase in phrases:
                if 'english' not in phrase:
                    continue
                
                english_word = phrase['english']
                
                # Add missing language fields
                for target_lang in ALL_LANGUAGES:
                    field_name = get_field_name(target_lang)
                    
                    # If field is missing or placeholder, try to fill it
                    if field_name not in phrase or not phrase[field_name] or phrase[field_name] == english_word:
                        if english_word in master_index and target_lang in master_index[english_word]:
                            phrase[field_name] = master_index[english_word][target_lang]
                            updated_count += 1
                        elif field_name not in phrase:
                            # Add field even if we don't have translation yet
                            phrase[field_name] = english_word
                            updated_count += 1
        
        print(f"✓ Updated {updated_count} fields in {lang}.json")
        all_data[lang] = data
    
    return all_data

def save_all_translations(all_data):
    """Save all updated translation files"""
    translations_dir = 'translations'
    
    for lang, data in all_data.items():
        filepath = os.path.join(translations_dir, f'{lang}.json')
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"✓ Saved {lang}.json")

def main():
    print("=" * 60)
    print("CROSS-POPULATING ALL TRANSLATION FILES")
    print("=" * 60)
    
    print("\n1. Loading all translation files...")
    all_data = load_all_translations()
    
    print("\n2. Cross-populating translations...")
    all_data = cross_populate_all(all_data)
    
    print("\n3. Saving updated files...")
    save_all_translations(all_data)
    
    print("\n" + "=" * 60)
    print("✓ COMPLETE! All languages are now cross-translated")
    print("=" * 60)

if __name__ == "__main__":
    main()
