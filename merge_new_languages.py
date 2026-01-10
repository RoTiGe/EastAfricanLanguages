#!/usr/bin/env python3
"""
Merge new languages from multi_languages_3.json into all_languages.json
New languages: Korean, Hindi, Bengali, Telugu, Kurdish, Farsi, Bantu, German
"""

import json
from pathlib import Path

def merge_new_languages():
    """Merge multi_languages_3.json into all_languages.json"""
    
    translations_dir = Path('translations')
    
    # Load existing all_languages.json
    print("📖 Loading all_languages.json...")
    with open(translations_dir / 'all_languages.json', 'r', encoding='utf-8') as f:
        all_langs = json.load(f)
    
    # Load multi_languages_3.json with new languages
    print("📖 Loading multi_languages_3.json...")
    with open(translations_dir / 'multi_languages_3.json', 'r', encoding='utf-8') as f:
        multi_langs = json.load(f)
    
    # Languages to add (excluding english which already exists, and categories)
    new_languages = ['korean', 'hindi', 'bengali', 'telugu', 'kurdish', 'farsi', 'bantu', 'german']
    
    print(f"\n🔄 Adding {len(new_languages)} new languages:")
    for lang in new_languages:
        print(f"   - {lang}")
    
    # Add new language metadata
    for lang in new_languages:
        if lang in multi_langs and lang not in all_langs:
            all_langs[lang] = multi_langs[lang]
            print(f"✅ Added {lang} metadata")
    
    # Merge categories
    print("\n🔄 Merging category data...")
    
    if 'categories' not in all_langs:
        all_langs['categories'] = {}
    
    if 'categories' in multi_langs:
        multi_categories = multi_langs['categories']
        
        for category_name, phrases in multi_categories.items():
            if category_name not in all_langs['categories']:
                all_langs['categories'][category_name] = []
            
            existing_phrases = all_langs['categories'][category_name]
            
            # For each phrase in multi_languages
            for multi_phrase in phrases:
                english_word = multi_phrase.get('english', '')
                
                # Find matching phrase in all_languages by english field
                matched = False
                for existing_phrase in existing_phrases:
                    if existing_phrase.get('english') == english_word:
                        # Merge new language fields into existing phrase
                        for lang in new_languages:
                            if lang in multi_phrase:
                                existing_phrase[lang] = multi_phrase[lang]
                            phonetic_key = f'{lang}_phonetic'
                            if phonetic_key in multi_phrase:
                                existing_phrase[phonetic_key] = multi_phrase[phonetic_key]
                        matched = True
                        break
                
                # If no match found, add as new phrase
                if not matched:
                    all_langs['categories'][category_name].append(multi_phrase)
            
            phrase_count = len(all_langs['categories'][category_name])
            print(f"   ✅ {category_name}: {phrase_count} phrases")
    
    # Summary
    print("\n" + "="*60)
    print("📊 MERGE SUMMARY")
    print("="*60)
    
    total_langs = len([k for k in all_langs.keys() if k != 'categories'])
    total_categories = len(all_langs.get('categories', {}))
    
    print(f"Total languages: {total_langs}")
    print(f"Total categories: {total_categories}")
    
    print(f"\n🌍 All languages now included:")
    langs = sorted([k for k in all_langs.keys() if k != 'categories'])
    for i, lang in enumerate(langs, 1):
        print(f"   {i:2}. {lang}")
    
    return all_langs


def main():
    print("🚀 Starting new language merge...")
    print("="*60)
    print("Adding: Korean, Hindi, Bengali, Telugu, Kurdish, Farsi, Bantu, German")
    print("="*60 + "\n")
    
    merged_data = merge_new_languages()
    
    # Save to all_languages.json
    output_file = 'translations/all_languages.json'
    print(f"\n💾 Saving to {output_file}...")
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(merged_data, f, ensure_ascii=False, indent=2)
    
    import os
    file_size = os.path.getsize(output_file) / 1024 / 1024
    print(f"\n✅ Done!")
    print(f"📁 File size: {file_size:.2f} MB")
    print(f"📄 Location: {output_file}")
    
    # Show sample
    if 'korean' in merged_data:
        print(f"\n📝 Sample Korean UI translation:")
        korean_ui = merged_data['korean'].get('ui', {})
        print(f"   Page Title: {korean_ui.get('pageTitle')} ({korean_ui.get('pageTitle_phonetic')})")


if __name__ == '__main__':
    main()
