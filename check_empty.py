import json

print('Checking for empty translations in each file...\n')

files = {
    'spanish': 'translations/spanish.json',
    'french': 'translations/french.json',
    'oromo': 'translations/oromo.json',
    'amharic': 'translations/amharic.json',
    'tigrinya': 'translations/tigrinya.json'
}

for file_name, file_path in files.items():
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Check the native language field for this file
    native_lang = data['nativeLanguageField']
    
    total = sum(len(phrases) for phrases in data['categories'].values())
    empty = []
    
    for cat_name, phrases in data['categories'].items():
        for phrase in phrases:
            translation = phrase.get(native_lang, '')
            if not translation or translation.strip() == '':
                empty.append((cat_name, phrase['english']))
    
    print(f'{file_name.upper()} ({native_lang}):')
    print(f'  Total phrases: {total}')
    print(f'  Empty {native_lang} translations: {len(empty)}')
    print(f'  Coverage: {((total - len(empty)) / total * 100):.1f}%')
    
    if empty and len(empty) <= 20:
        print(f'  Missing phrases:')
        for cat, eng in empty[:20]:
            print(f'    - {eng} (in {cat})')
    elif empty:
        print(f'  Sample missing phrases:')
        for cat, eng in empty[:10]:
            print(f'    - {eng} (in {cat})')
    print()
