"""
Fix Chinese character encoding in JSON translation files.
Converts mojibake like 'æ"»å‡»' back to proper Chinese characters '攻击'.
"""

import json
import os
from pathlib import Path

def fix_chinese_text(text):
    """
    Fix Chinese characters that were incorrectly encoded.
    The text appears to be UTF-8 bytes misinterpreted as Windows-1252/CP1252.
    """
    if not text or not isinstance(text, str):
        return text
    
    # Skip if it looks already correct (has actual Chinese characters)
    if any('\u4e00' <= char <= '\u9fff' for char in text):
        return text
    
    try:
        # The string is UTF-8 bytes that were decoded as Windows-1252
        # Re-encode to Windows-1252 to get original bytes, then decode as UTF-8
        fixed = text.encode('cp1252').decode('utf-8')
        return fixed
    except (UnicodeDecodeError, UnicodeEncodeError, LookupError):
        # If it fails, return original
        return text

def fix_phrase_object(phrase_obj):
    """Fix all string values in a phrase object."""
    if not isinstance(phrase_obj, dict):
        return phrase_obj
    
    fixed_obj = {}
    for key, value in phrase_obj.items():
        if isinstance(value, str):
            fixed_obj[key] = fix_chinese_text(value)
        elif isinstance(value, list):
            fixed_obj[key] = [fix_chinese_text(item) if isinstance(item, str) else item for item in value]
        elif isinstance(value, dict):
            fixed_obj[key] = fix_phrase_object(value)
        else:
            fixed_obj[key] = value
    
    return fixed_obj

def fix_json_file(file_path):
    """Fix encoding in a single JSON file."""
    print(f"Processing: {file_path}")
    
    # Read the file
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Fix the data
    if 'categories' in data and isinstance(data['categories'], dict):
        for category_name, phrases in data['categories'].items():
            if isinstance(phrases, list):
                data['categories'][category_name] = [fix_phrase_object(phrase) for phrase in phrases]
    
    # Also fix other top-level fields
    for key, value in data.items():
        if key != 'categories' and isinstance(value, dict):
            data[key] = fix_phrase_object(value)
    
    # Write back with proper encoding
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"✓ Fixed: {file_path}")

def main():
    """Fix all JSON files in the translations directory."""
    translations_dir = Path(__file__).parent / 'translations'
    
    if not translations_dir.exists():
        print(f"Error: {translations_dir} not found")
        return
    
    # Find all JSON files
    json_files = list(translations_dir.glob('*.json'))
    
    print(f"Found {len(json_files)} JSON files to process\n")
    
    for json_file in json_files:
        try:
            fix_json_file(json_file)
        except Exception as e:
            print(f"✗ Error processing {json_file}: {e}")
    
    print(f"\n✓ Processing complete!")
    print(f"Fixed {len(json_files)} files")

if __name__ == '__main__':
    main()
