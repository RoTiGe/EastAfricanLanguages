#!/usr/bin/env python3
"""
Add missing language fields to all phrases in all translation files
Ensures every phrase has all 11 language fields
"""

import json
import os

ALL_LANGUAGES = ['english', 'spanish', 'french', 'amharic', 'tigrinya', 'oromo', 
                 'somali', 'arabic', 'hadiyaa', 'wolyitta', 'afar', 'gamo']

# Map to native field names
FIELD_MAP = {
    'hadiyaa': 'hadiya',
    'wolyitta': 'wolayita'
}

def get_field_name(lang):
    return FIELD_MAP.get(lang, lang)

def load_json(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_json(filepath, data):
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def add_missing_fields_to_file(filepath):
    print(f"\nProcessing: {os.path.basename(filepath)}")
    data = load_json(filepath)
    
    updates = 0
    total_phrases = 0
    
    for category_key, phrases in data['categories'].items():
        for phrase in phrases:
            total_phrases += 1
            
            # Ensure all language fields exist
            for lang in ALL_LANGUAGES:
                field = get_field_name(lang)
                
                if field not in phrase or not phrase[field]:
                    # Use English as fallback
                    phrase[field] = phrase.get('english', '')
                    updates += 1
    
    save_json(filepath, data)
    print(f"  Total phrases: {total_phrases}")
    print(f"  Fields added/updated: {updates}")
    
    return updates

def main():
    print("="*70)
    print("ADDING MISSING LANGUAGE FIELDS TO ALL PHRASES")
    print("="*70)
    
    translation_files = [
        'translations/spanish.json',
        'translations/french.json',
        'translations/amharic.json',
        'translations/tigrinya.json',
        'translations/oromo.json',
        'translations/somali.json',
        'translations/arabic.json',
        'translations/hadiyaa.json',
        'translations/wolyitta.json',
        'translations/afar.json',
        'translations/gamo.json'
    ]
    
    total_updates = 0
    
    for filepath in translation_files:
        if os.path.exists(filepath):
            updates = add_missing_fields_to_file(filepath)
            total_updates += updates
        else:
            print(f"\nSkipping {filepath} - file not found")
    
    print(f"\n{'='*70}")
    print(f"COMPLETE - Total fields added: {total_updates}")
    print(f"{'='*70}\n")

if __name__ == '__main__':
    main()
