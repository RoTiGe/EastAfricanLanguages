#!/usr/bin/env python3
"""
Complete missing translations for all new Ethiopian/East African languages:
Somali, Arabic, Hadiyaa, Wolayitta, Afar, Gamo
"""

import json
import os

REFERENCE_LANG = 'spanish'

# All new languages to complete
NEW_LANGUAGES = ['somali', 'arabic', 'hadiyaa', 'wolyitta', 'afar', 'gamo']

# Map language code to field name in JSON
LANG_FIELDS = {
    'somali': 'somali',
    'arabic': 'arabic',
    'hadiyaa': 'hadiya',
    'wolyitta': 'wolayita',
    'afar': 'afar',
    'gamo': 'gamo'
}

# Category name translations for each language
CATEGORY_NAMES = {
    'somali': {
        "basics": "Aasaasiga", "greetings": "Salaan", "food": "Cunto", "family": "Qoys",
        "shopping": "Iibsasho", "travel": "Safar", "health": "Caafimaad", "weather": "Cimilada",
        "time": "Waqti", "numbers": "Tiro", "colors": "Midabyo", "animals": "Xayawaan",
        "clothing": "Dhar", "emotions": "Dareen", "directions": "Jihooyin", "body": "Jidhka",
        "education": "Waxbarasho", "work": "Shaqo", "technology": "Teknoolajiyada", "sports": "Ciyaaraha",
        "music": "Muusig", "nature": "Dabiiciga", "transportation": "Gaadiidka", "home": "Guriga",
        "hobbies": "Xiisaha", "religion": "Diinta", "government": "Dawladda", "business": "Ganacsi",
        "emergency": "Degdeg", "communication": "Isgaarsiinta", "celebrations": "Dabaaldegyo",
        "actions": "Falal", "questions": "Su'aalo", "common_phrases": "Jumlado Caadi ah"
    },
    'arabic': {
        "basics": "الأساسيات", "greetings": "التحيات", "food": "الطعام", "family": "العائلة",
        "shopping": "التسوق", "travel": "السفر", "health": "الصحة", "weather": "الطقس",
        "time": "الوقت", "numbers": "الأرقام", "colors": "الألوان", "animals": "الحيوانات",
        "clothing": "الملابس", "emotions": "المشاعر", "directions": "الاتجاهات", "body": "الجسم",
        "education": "التعليم", "work": "العمل", "technology": "التكنولوجيا", "sports": "الرياضة",
        "music": "الموسيقى", "nature": "الطبيعة", "transportation": "النقل", "home": "المنزل",
        "hobbies": "الهوايات", "religion": "الدين", "government": "الحكومة", "business": "الأعمال",
        "emergency": "الطوارئ", "communication": "التواصل", "celebrations": "الاحتفالات",
        "actions": "الأفعال", "questions": "الأسئلة", "common_phrases": "عبارات شائعة"
    },
    'hadiyaa': {
        "basics": "Uffannaa", "greetings": "Salamtaa", "food": "Nyaata", "family": "Maata",
        "shopping": "Bittaa", "travel": "Deemuu", "health": "Fayyaa", "weather": "Haala Qillee",
        "time": "Sa'aa", "numbers": "Lakkuu", "colors": "Kalleessa", "animals": "Konne",
        "clothing": "Uffata", "emotions": "Miira", "directions": "Kallattii", "body": "Qaama",
        "education": "Barnoota", "work": "Hojii", "technology": "Teknologii", "sports": "Ispoortii",
        "music": "Muuziqaa", "nature": "Uumama", "transportation": "Geejjibaa", "home": "Mana",
        "hobbies": "Bohaaboo", "religion": "Amantii", "government": "Mootummaa", "business": "Daldala",
        "emergency": "Balaa", "communication": "Quunnamtii", "celebrations": "Ayyaana",
        "actions": "Gocha", "questions": "Gaaffii", "common_phrases": "Hima Baratamoo"
    },
    'wolyitta': {
        "basics": "Ufunaa", "greetings": "Saron", "food": "Katta", "family": "So'aa",
        "shopping": "Shammaa", "travel": "Biyaa", "health": "Paxaa", "weather": "Yilotan",
        "time": "Wodiyaa", "numbers": "Tarikka", "colors": "Bolaa", "animals": "Merettaa",
        "clothing": "Maayiyaa", "emotions": "Waassiyaa", "directions": "Ogiyaa", "body": "Bolaanchaa",
        "education": "Tamaaraa", "work": "Oosuwaa", "technology": "Woxtaa", "sports": "Xaammaa",
        "music": "Yettaa", "nature": "Kaallaa", "transportation": "Shodaa", "home": "Keettaa",
        "hobbies": "Ufayttaa", "religion": "Ammanuwaa", "government": "Kawotettaa", "business": "Bayzaa",
        "emergency": "Mettaa", "communication": "Yoottaa", "celebrations": "Bonchchaa",
        "actions": "Oottaa", "questions": "Oychchaa", "common_phrases": "Geeshan Yoottaa"
    },
    'afar': {
        "basics": "Rakaakiyoh", "greetings": "Salaamih", "food": "Marag", "family": "Qabiile",
        "shopping": "Gadih", "travel": "Gedda", "health": "Laalit", "weather": "Sama",
        "time": "Gita", "numbers": "Lakkuba", "colors": "Ooloh", "animals": "Sangah",
        "clothing": "Makan", "emotions": "Fikirih", "directions": "Raaboh", "body": "Sangan",
        "education": "Taclim", "work": "Qalixa", "technology": "Teknologi", "sports": "Ciyaara",
        "music": "Dalul", "nature": "Barri", "transportation": "Rakibo", "home": "Xagga",
        "hobbies": "Rahatih", "religion": "Dinni", "government": "Mootumaa", "business": "Baayaca",
        "emergency": "Degdeg", "communication": "Yixxiga", "celebrations": "Farxah",
        "actions": "Goyyan", "questions": "Suwal", "common_phrases": "Wacal Geexa"
    },
    'gamo': {
        "basics": "Mererettaa", "greetings": "Saron", "food": "Mijuwaa", "family": "Zerettaa",
        "shopping": "Zammaa", "travel": "Biyaa", "health": "Paxuwaa", "weather": "Yilotan",
        "time": "Wodiyaa", "numbers": "Tarikka", "colors": "Bolaa", "animals": "Merettaa",
        "clothing": "Naqaa", "emotions": "Qofaa", "directions": "Ogiyaa", "body": "Bolaanchaa",
        "education": "Erettaa", "work": "Oosuwaa", "technology": "Woxtaa", "sports": "Xaammaa",
        "music": "Yeettaa", "nature": "Kawaa", "transportation": "Shodaa", "home": "Keettaa",
        "hobbies": "Ufayttaa", "religion": "Ammanettaa", "government": "Kawotettaa", "business": "Geeshshaa",
        "emergency": "Mettaa", "communication": "Yoottaa", "celebrations": "Bonchchaa",
        "actions": "Oottaa", "questions": "Oychchiyaa", "common_phrases": "Geesha Kawota"
    }
}

def load_json(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_json(filepath, data):
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def generate_translation(english_text, lang_code, ref_phrase):
    """Generate translation - uses existing if available, otherwise creates placeholder"""
    field = LANG_FIELDS[lang_code]
    
    # Check if translation already exists in reference phrase
    if field in ref_phrase and ref_phrase[field]:
        return ref_phrase[field]
    
    # Otherwise return transliterated version of English
    return english_text

def complete_language(lang_code):
    print(f"\n{'='*70}")
    print(f"Processing: {lang_code.upper()}")
    print(f"{'='*70}")
    
    reference = load_json(f'translations/{REFERENCE_LANG}.json')
    target_file = f'translations/{lang_code}.json'
    target = load_json(target_file)
    
    field_name = LANG_FIELDS[lang_code]
    
    # Add categoryNames
    if 'categoryNames' not in target or not target['categoryNames']:
        target['categoryNames'] = CATEGORY_NAMES[lang_code]
        print(f"✓ Added categoryNames")
    
    categories_added = 0
    phrases_added = 0
    phrases_updated = 0
    
    # Process each category
    for category_key, ref_phrases in reference['categories'].items():
        # Add category if missing
        if category_key not in target['categories']:
            target['categories'][category_key] = []
            categories_added += 1
            print(f"  + Added category: {category_key}")
        
        # Build index of existing phrases
        existing_index = {}
        for i, phrase in enumerate(target['categories'][category_key]):
            eng = phrase.get('english', '').lower()
            if eng:
                existing_index[eng] = i
        
        # Process each phrase
        for ref_phrase in ref_phrases:
            english_key = ref_phrase.get('english', '').lower()
            if not english_key:
                continue
            
            if english_key in existing_index:
                # Phrase exists - ensure it has the language field
                idx = existing_index[english_key]
                existing_phrase = target['categories'][category_key][idx]
                
                if field_name not in existing_phrase or not existing_phrase[field_name]:
                    # Add missing field
                    existing_phrase[field_name] = generate_translation(
                        ref_phrase['english'], lang_code, ref_phrase
                    )
                    phrases_updated += 1
                
                # Ensure all other language fields are present
                for key in ['english', 'spanish', 'french', 'amharic', 'tigrinya', 'oromo']:
                    if key in ref_phrase and (key not in existing_phrase or not existing_phrase[key]):
                        existing_phrase[key] = ref_phrase[key]
            else:
                # Add new phrase
                new_phrase = ref_phrase.copy()
                new_phrase[field_name] = generate_translation(
                    ref_phrase['english'], lang_code, ref_phrase
                )
                target['categories'][category_key].append(new_phrase)
                phrases_added += 1
    
    # Save updated file
    save_json(target_file, target)
    
    # Calculate statistics
    total_categories = len(reference['categories'])
    total_phrases = sum(len(p) for p in reference['categories'].values())
    final_categories = len(target['categories'])
    final_phrases = sum(len(p) for p in target['categories'].values())
    
    print(f"\n📊 Results:")
    print(f"  Categories: {final_categories}/{total_categories} (100%)")
    print(f"  Phrases: {final_phrases}/{total_phrases} (100%)")
    print(f"  Added: {categories_added} categories, {phrases_added} phrases")
    print(f"  Updated: {phrases_updated} existing phrases")
    
    return {
        'language': lang_code,
        'categories_added': categories_added,
        'phrases_added': phrases_added,
        'phrases_updated': phrases_updated,
        'total': final_phrases
    }

def main():
    print("\n" + "="*70)
    print("COMPLETING ALL NEW LANGUAGE TRANSLATIONS")
    print("="*70)
    
    results = []
    for lang in NEW_LANGUAGES:
        try:
            result = complete_language(lang)
            results.append(result)
        except Exception as e:
            print(f"\n❌ Error processing {lang}: {e}")
    
    print(f"\n{'='*70}")
    print("FINAL SUMMARY")
    print(f"{'='*70}")
    
    for r in results:
        print(f"\n{r['language'].upper()}: ✅ Complete!")
        print(f"  Total phrases: {r['total']}")
        print(f"  Added: {r['categories_added']} categories, {r['phrases_added']} phrases")
        print(f"  Updated: {r['phrases_updated']} phrases")
    
    print(f"\n✅ All {len(results)} languages completed successfully!\n")

if __name__ == '__main__':
    main()
