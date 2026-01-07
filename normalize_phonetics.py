#!/usr/bin/env python3
"""
Convert IPA/special characters in phonetic fields to plain Latin letters (a-z)
Saves normalized version to translations/all_languages_2.json
"""

import json
import re
import unicodedata

def normalize_phonetic(text):
    """
    Convert phonetic text to plain Latin letters only
    
    IPA → Latin mappings:
    - ɛ (open e) → e
    - ɔ (open o) → o  
    - ï, ë, ü, etc → remove diacritics → i, e, u
    - ñ → n
    - Special vowels with combining diacritics → base letter
    """
    if not text or not isinstance(text, str):
        return text
    
    # IPA character mappings
    ipa_map = {
        'ɛ': 'e',   # open e
        'ɔ': 'o',   # open o
        'ə': 'e',   # schwa
        'ʃ': 'sh',  # sh sound
        'ʒ': 'zh',  # zh sound
        'ŋ': 'ng',  # ng sound
        'θ': 'th',  # th sound
        'ð': 'th',  # voiced th
        'ʔ': '',    # glottal stop (silent)
        'ː': '',    # length marker (remove)
        'ˈ': '',    # stress marker (remove)
        'ˌ': '',    # secondary stress (remove)
    }
    
    # Apply IPA mappings
    result = text
    for ipa_char, latin in ipa_map.items():
        result = result.replace(ipa_char, latin)
    
    # Remove combining diacritics (e.g., ɛ̈ → ɛ → e)
    # NFD = decompose characters, then filter out combining marks
    result = ''.join(
        c for c in unicodedata.normalize('NFD', result)
        if not unicodedata.combining(c)
    )
    
    # Additional character mappings after diacritic removal
    extra_map = {
        'ñ': 'n',
        'ß': 'ss',
        'æ': 'ae',
        'œ': 'oe',
        'ø': 'o',
        'å': 'a',
        ''': '',  # right single quotation mark
        ''': '',  # left single quotation mark
        '`': '',  # grave accent
        '´': '',  # acute accent
    }
    
    for char, replacement in extra_map.items():
        result = result.replace(char, replacement)
    
    # Keep only: a-z, A-Z, 0-9, hyphens, spaces, parentheses
    result = re.sub(r'[^a-zA-Z0-9\s\-()]', '', result)
    
    # Clean up multiple spaces/hyphens
    result = re.sub(r'\s+', ' ', result)
    result = re.sub(r'-+', '-', result)
    result = result.strip()
    
    return result


def process_translations(data):
    """
    Recursively process all phonetic fields in the data structure
    """
    if isinstance(data, dict):
        new_dict = {}
        for key, value in data.items():
            # Process phonetic fields
            if key.endswith('_phonetic') and isinstance(value, str):
                new_dict[key] = normalize_phonetic(value)
            else:
                new_dict[key] = process_translations(value)
        return new_dict
    elif isinstance(data, list):
        return [process_translations(item) for item in data]
    else:
        return data


def main():
    input_file = 'translations/all_languages.json'
    output_file = 'translations/all_languages_2.json'
    
    print(f"📖 Reading {input_file}...")
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    print("🔄 Normalizing phonetic fields...")
    normalized_data = process_translations(data)
    
    # Count changes
    original_str = json.dumps(data, ensure_ascii=False)
    normalized_str = json.dumps(normalized_data, ensure_ascii=False)
    
    original_special = len(re.findall(r'[^\x00-\x7F]', original_str))
    normalized_special = len(re.findall(r'[^\x00-\x7F]', normalized_str))
    
    print(f"📊 Special characters in phonetics:")
    print(f"   Before: {original_special}")
    print(f"   After:  {normalized_special}")
    print(f"   Removed: {original_special - normalized_special}")
    
    print(f"💾 Saving to {output_file}...")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(normalized_data, f, ensure_ascii=False, indent=2)
    
    print("✅ Done! Phonetics normalized to plain Latin letters.")
    print(f"\n📁 Output: {output_file}")
    
    # Show some examples
    print("\n📝 Sample transformations:")
    if 'categories' in data and 'animals' in data['categories']:
        for i, phrase in enumerate(data['categories']['animals'][:3]):
            if 'dinka_phonetic' in phrase:
                original = phrase['dinka_phonetic']
                normalized = normalized_data['categories']['animals'][i]['dinka_phonetic']
                if original != normalized:
                    print(f"   {phrase.get('english', '???'):15} {original:20} → {normalized}")


if __name__ == '__main__':
    main()
