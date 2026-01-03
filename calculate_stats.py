import json

files = {
    'spanish': 'translations/spanish.json',
    'french': 'translations/french.json',
    'oromo': 'translations/oromo.json',
    'amharic': 'translations/amharic.json',
    'tigrinya': 'translations/tigrinya.json'
}

langs = ['spanish', 'french', 'oromo', 'amharic', 'tigrinya']

print('=' * 70)
print('Translation Completeness Statistics')
print('=' * 70)

for file_name, file_path in files.items():
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    total_phrases = sum(len(phrases) for phrases in data['categories'].values())
    
    print(f'\n{file_name.upper()} FILE:')
    print(f'  Total phrases: {total_phrases}')
    
    for lang in langs:
        filled = sum(1 for category in data['categories'].values() 
                    for phrase in category 
                    if phrase.get(lang, '').strip())
        percentage = (filled / total_phrases * 100) if total_phrases > 0 else 0
        print(f'  {lang.capitalize():12} {filled:3} / {total_phrases} ({percentage:5.1f}%)')

print('\n' + '=' * 70)
print('SUMMARY BY LANGUAGE (across all files):')
print('=' * 70)

# Calculate overall statistics
for lang in langs:
    total_count = 0
    filled_count = 0
    
    for file_path in files.values():
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        total = sum(len(phrases) for phrases in data['categories'].values())
        filled = sum(1 for category in data['categories'].values() 
                    for phrase in category 
                    if phrase.get(lang, '').strip())
        
        total_count += total
        filled_count += filled
    
    avg_percentage = (filled_count / total_count * 100) if total_count > 0 else 0
    print(f'{lang.capitalize():12} {filled_count:4} / {total_count} ({avg_percentage:5.1f}%)')

print('=' * 70)
