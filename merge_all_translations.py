#!/usr/bin/env python3
"""
Merge all individual language JSON files into a comprehensive all_languages_2.json
with normalized phonetics (plain Latin letters)
"""

import json
import os
import re
import unicodedata
from pathlib import Path

def normalize_phonetic(text):
    """Convert phonetic text to plain Latin letters only"""
    if not text or not isinstance(text, str):
        return text
    
    # IPA character mappings
    ipa_map = {
        'ɛ': 'e', 'ɔ': 'o', 'ə': 'e', 'ʃ': 'sh', 'ʒ': 'zh',
        'ŋ': 'ng', 'θ': 'th', 'ð': 'th', 'ʔ': '', 'ː': '',
        'ˈ': '', 'ˌ': '',
    }
    
    result = text
    for ipa_char, latin in ipa_map.items():
        result = result.replace(ipa_char, latin)
    
    # Remove combining diacritics
    result = ''.join(
        c for c in unicodedata.normalize('NFD', result)
        if not unicodedata.combining(c)
    )
    
    extra_map = {
        'ñ': 'n', 'ß': 'ss', 'æ': 'ae', 'œ': 'oe',
        'ø': 'o', 'å': 'a', ''': '', ''': '', '`': '', '´': '',
    }
    
    for char, replacement in extra_map.items():
        result = result.replace(char, replacement)
    
    # Keep only: a-z, A-Z, 0-9, hyphens, spaces, parentheses
    result = re.sub(r'[^a-zA-Z0-9\s\-()]', '', result)
    result = re.sub(r'\s+', ' ', result)
    result = re.sub(r'-+', '-', result)
    
    return result.strip()


def load_individual_language_file(lang_file):
    """Load and return data from individual language JSON file"""
    try:
        with open(lang_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"   ⚠️  Error loading {lang_file}: {e}")
        return None


def merge_translations():
    """Merge all individual language files into comprehensive structure"""
    
    translations_dir = Path('translations')
    
    # Languages to process (individual JSON files)
    languages = [
        'english', 'spanish', 'french', 'italian', 'chinese',
        'arabic', 'amharic', 'oromo', 'somali', 'swahili',
        'tigrinya', 'kinyarwanda', 'kirundi', 'luo',
        'hadiyaa', 'wolyitta', 'gamo', 'afar'
    ]
    
    # Start with existing all_languages.json structure
    print("📖 Loading existing all_languages.json...")
    base_file = translations_dir / 'all_languages.json'
    if base_file.exists():
        with open(base_file, 'r', encoding='utf-8') as f:
            merged = json.load(f)
    else:
        merged = {}
    
    # Get all categories from english.json as reference
    english_file = translations_dir / 'english.json'
    with open(english_file, 'r', encoding='utf-8') as f:
        english_data = json.load(f)
    
    all_categories = list(english_data.get('categories', {}).keys())
    print(f"📊 Found {len(all_categories)} categories in english.json")
    print(f"   Categories: {', '.join(all_categories[:10])}...")
    
    # Initialize categories structure if not present
    if 'categories' not in merged:
        merged['categories'] = {}
    
    # Process each category
    category_stats = {}
    
    for category in all_categories:
        print(f"\n🔄 Processing category: {category}")
        
        # Get phrases from English as base
        english_phrases = english_data['categories'].get(category, [])
        
        if category not in merged['categories']:
            merged['categories'][category] = []
        
        # For each phrase in English
        for phrase_idx, eng_phrase in enumerate(english_phrases):
            english_word = eng_phrase.get('english', '')
            
            # Find or create this phrase entry
            merged_phrase = None
            for mp in merged['categories'][category]:
                if mp.get('english') == english_word:
                    merged_phrase = mp
                    break
            
            if merged_phrase is None:
                merged_phrase = {'english': english_word}
                merged['categories'][category].append(merged_phrase)
            
            # Merge data from each language file
            for lang in languages:
                lang_file = translations_dir / f'{lang}.json'
                if not lang_file.exists():
                    continue
                
                # Load language file
                lang_data = load_individual_language_file(lang_file)
                if not lang_data or 'categories' not in lang_data:
                    continue
                
                # Get this category from this language
                lang_category = lang_data['categories'].get(category, [])
                
                # Find matching phrase by English word
                for lang_phrase in lang_category:
                    if lang_phrase.get('english') == english_word:
                        # Copy language-specific fields
                        for key, value in lang_phrase.items():
                            if key == 'english':
                                continue
                            
                            # Normalize phonetic fields
                            if key.endswith('_phonetic'):
                                value = normalize_phonetic(value)
                            
                            # Only add if not already present or empty
                            if key not in merged_phrase or not merged_phrase[key]:
                                merged_phrase[key] = value
                        break
        
        phrase_count = len(merged['categories'][category])
        category_stats[category] = phrase_count
        print(f"   ✅ {category}: {phrase_count} phrases")
    
    # Add language metadata from existing structure
    print("\n📝 Processing language metadata...")
    for lang in languages:
        lang_file = translations_dir / f'{lang}.json'
        if not lang_file.exists():
            continue
        
        lang_data = load_individual_language_file(lang_file)
        if not lang_data:
            continue
        
        # Extract language metadata (everything except categories)
        if lang not in merged:
            merged[lang] = {}
        
        for key, value in lang_data.items():
            if key == 'categories':
                continue
            
            # Normalize phonetics in metadata
            if isinstance(value, dict):
                normalized_value = {}
                for k, v in value.items():
                    if k.endswith('_phonetic') and isinstance(v, str):
                        normalized_value[k] = normalize_phonetic(v)
                    else:
                        normalized_value[k] = v
                merged[lang][key] = normalized_value
            else:
                merged[lang][key] = value
    
    # Summary
    print("\n" + "="*60)
    print("📊 MERGE SUMMARY")
    print("="*60)
    print(f"Total categories: {len(merged['categories'])}")
    print(f"Total languages: {len([k for k in merged.keys() if k != 'categories'])}")
    print(f"\nCategory breakdown:")
    for cat in sorted(category_stats.keys()):
        print(f"   {cat:20} {category_stats[cat]:3} phrases")
    
    return merged


def main():
    print("🚀 Starting comprehensive translation merge...")
    print("="*60)
    
    merged_data = merge_translations()
    
    output_file = 'translations/all_languages_2.json'
    print(f"\n💾 Saving to {output_file}...")
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(merged_data, f, ensure_ascii=False, indent=2)
    
    # Validate
    file_size = os.path.getsize(output_file) / 1024 / 1024
    print(f"\n✅ Done!")
    print(f"📁 File size: {file_size:.2f} MB")
    print(f"📄 Location: {output_file}")
    
    # Show sample
    print("\n📝 Sample entry (first action):")
    if 'categories' in merged_data and 'actions' in merged_data['categories']:
        sample = merged_data['categories']['actions'][0]
        print(f"   English: {sample.get('english')}")
        print(f"   Spanish: {sample.get('spanish')} ({sample.get('spanish_phonetic')})")
        print(f"   Amharic: {sample.get('amharic')} ({sample.get('amharic_phonetic')})")
        print(f"   Total fields: {len(sample)}")


if __name__ == '__main__':
    main()
