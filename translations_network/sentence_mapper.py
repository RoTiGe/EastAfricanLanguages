"""
Maps existing translation sentences to network categories.
Analyzes current translations and assigns them to appropriate categories and subcategories.
"""

import json
from pathlib import Path
from typing import Dict, List, Set
import re

class SentenceMapper:
    """Maps sentences from translation files to learning categories."""
    
    def __init__(self, categories_file: str = None):
        """Initialize the mapper."""
        if categories_file is None:
            categories_file = Path(__file__).parent / "categories.json"
        
        with open(categories_file, 'r', encoding='utf-8') as f:
            self.categories_data = json.load(f)
        
        # Build keyword mapping for automatic categorization
        self.keyword_map = self._build_keyword_map()
    
    def _build_keyword_map(self) -> Dict[str, List[str]]:
        """Build a mapping of keywords to categories/subcategories."""
        keyword_map = {
            # Survival & Emergency
            'emergency_help': ['help', 'emergency', 'police', 'fire', 'ambulance', 'danger', 'accident'],
            'medical_urgent': ['hospital', 'doctor', 'pain', 'sick', 'injury', 'hurt', 'bleeding'],
            'basic_needs': ['water', 'food', 'toilet', 'bathroom', 'hungry', 'thirsty', 'tired'],
            'safety': ['safe', 'unsafe', 'protect', 'security', 'lost', 'scared'],
            
            # Basic Communication
            'greetings': ['hello', 'hi', 'goodbye', 'good morning', 'good evening', 'welcome'],
            'politeness': ['please', 'thank you', 'sorry', 'excuse me', 'pardon'],
            'yes_no_questions': ['yes', 'no', 'maybe', 'understand', 'don\'t understand'],
            'gratitude': ['thanks', 'grateful', 'appreciate'],
            
            # Navigation & Transportation
            'directions': ['where', 'direction', 'left', 'right', 'straight', 'here', 'there', 'near', 'far'],
            'transportation': ['bus', 'train', 'taxi', 'car', 'airport', 'station', 'ticket', 'stop'],
            'locations': ['street', 'address', 'building', 'city', 'town', 'village', 'country'],
            'addresses': ['number', 'name', 'road', 'avenue'],
            
            # Accommodation & Shelter
            'hotel_hostel': ['hotel', 'room', 'bed', 'reservation', 'check-in', 'check-out'],
            'rental': ['rent', 'apartment', 'house', 'lease', 'landlord', 'tenant'],
            'facilities': ['shower', 'kitchen', 'heating', 'air conditioning', 'wifi'],
            'complaints': ['problem', 'broken', 'dirty', 'noise', 'complaint'],
            
            # Food & Water
            'restaurant': ['restaurant', 'menu', 'order', 'waiter', 'bill', 'eat', 'drink'],
            'market': ['market', 'shop', 'store', 'buy', 'sell', 'grocery'],
            'dietary_needs': ['vegetarian', 'halal', 'kosher', 'allergy', 'spicy', 'sugar'],
            'water_requests': ['water', 'juice', 'coffee', 'tea', 'milk'],
            
            # Numbers & Money
            'counting': ['one', 'two', 'three', 'four', 'five', 'number', 'count', 'how many'],
            'prices': ['price', 'cost', 'expensive', 'cheap', 'how much'],
            'bargaining': ['discount', 'bargain', 'negotiate', 'less', 'more'],
            'currency_exchange': ['money', 'dollar', 'euro', 'exchange', 'bank', 'ATM'],
            
            # Basic Work Communication
            'job_seeking': ['job', 'work', 'employment', 'hire', 'application', 'CV', 'resume'],
            'understanding_instructions': ['do', 'task', 'instruction', 'show me', 'how to'],
            'work_schedule': ['time', 'hours', 'shift', 'schedule', 'day off', 'break'],
            'salary_payment': ['salary', 'wage', 'pay', 'payment', 'money', 'paycheck'],
            
            # Healthcare & Medical
            'symptoms': ['headache', 'fever', 'cough', 'cold', 'dizzy', 'nausea', 'symptoms'],
            'pharmacy': ['pharmacy', 'medicine', 'drug', 'prescription', 'tablet', 'pill'],
            'appointments': ['appointment', 'visit', 'consultation', 'when', 'available'],
            'prescriptions': ['prescription', 'dosage', 'take', 'medicine', 'instructions'],
            
            # Documentation & Legal
            'immigration': ['visa', 'passport', 'immigration', 'border', 'customs'],
            'permits': ['permit', 'license', 'permission', 'authorization', 'document'],
            'identification': ['ID', 'identity', 'card', 'certificate', 'proof'],
            'forms': ['form', 'fill', 'sign', 'application', 'paper'],
            
            # Shopping & Services
            'clothing': ['clothes', 'shirt', 'pants', 'shoes', 'size', 'color'],
            'electronics': ['phone', 'computer', 'charger', 'battery', 'electronics'],
            'repairs': ['fix', 'repair', 'broken', 'service', 'maintenance'],
            'returns': ['return', 'exchange', 'refund', 'receipt'],
            
            # Social Interaction
            'introductions': ['name', 'from', 'meet', 'introduce', 'my name is'],
            'small_talk': ['how are you', 'weather', 'family', 'children', 'like', 'dislike'],
            'invitations': ['invite', 'come', 'join', 'would you like', 'let\'s'],
            'refusals': ['no thank you', 'can\'t', 'unable', 'busy', 'decline'],
            
            # Specialized Work Terms
            'technical_terms': ['technical', 'system', 'process', 'procedure', 'specification'],
            'meetings': ['meeting', 'conference', 'discuss', 'agenda', 'presentation'],
            'reports': ['report', 'document', 'analysis', 'data', 'results'],
            'negotiations': ['negotiate', 'contract', 'agreement', 'terms', 'deal'],
            
            # Household Management
            'cleaning': ['clean', 'wash', 'vacuum', 'sweep', 'mop', 'dust'],
            'cooking': ['cook', 'prepare', 'recipe', 'ingredients', 'kitchen'],
            'childcare': ['children', 'baby', 'child', 'kids', 'care', 'school'],
            'appliances': ['washing machine', 'dishwasher', 'oven', 'stove', 'microwave'],
            
            # Education & Learning
            'enrollment': ['school', 'enroll', 'register', 'admission', 'course'],
            'classroom': ['class', 'teacher', 'student', 'learn', 'study'],
            'homework': ['homework', 'assignment', 'exercise', 'practice'],
            'certificates': ['certificate', 'diploma', 'degree', 'qualification'],
            
            # Cultural & Religious
            'religious_places': ['mosque', 'church', 'temple', 'synagogue', 'prayer'],
            'holidays': ['holiday', 'festival', 'celebration', 'Ramadan', 'Christmas', 'Eid'],
            'customs': ['custom', 'tradition', 'culture', 'respect'],
            'respect': ['respect', 'honor', 'courtesy', 'polite'],
            
            # Entertainment & Leisure
            'sightseeing': ['tourist', 'visit', 'see', 'tour', 'attraction', 'monument'],
            'sports': ['sport', 'football', 'basketball', 'game', 'play'],
            'events': ['event', 'concert', 'show', 'performance', 'exhibition'],
            'hobbies': ['hobby', 'interest', 'free time', 'enjoy', 'like'],
            
            # Advanced Legal & Rights
            'contracts': ['contract', 'agreement', 'terms', 'condition', 'legal'],
            'rights': ['right', 'law', 'legal', 'protect', 'justice'],
            'complaints': ['complain', 'complaint', 'problem', 'issue', 'dispute'],
            'legal_aid': ['lawyer', 'attorney', 'legal aid', 'counsel', 'advice'],
            
            # Business & Trade
            'import_export': ['import', 'export', 'customs', 'tariff', 'trade'],
            'invoices': ['invoice', 'bill', 'payment', 'account', 'receipt'],
            'quality_control': ['quality', 'inspection', 'standard', 'defect', 'check'],
            'shipping': ['ship', 'delivery', 'transport', 'cargo', 'freight']
        }
        
        return keyword_map
    
    def categorize_sentence(self, sentence: str, translation: str = None) -> List[str]:
        """
        Categorize a sentence based on keywords.
        Returns list of matching subcategory IDs.
        """
        text = (sentence + ' ' + (translation or '')).lower()
        matches = []
        
        for subcat, keywords in self.keyword_map.items():
            for keyword in keywords:
                if re.search(r'\b' + re.escape(keyword) + r'\b', text):
                    matches.append(subcat)
                    break
        
        return matches
    
    def map_translation_file(self, translation_file: Path) -> Dict:
        """
        Map sentences from a translation file to categories.
        Returns a dictionary with categorized sentences.
        """
        with open(translation_file, 'r', encoding='utf-8') as f:
            translations = json.load(f)
        
        categorized = {}
        unmapped = []
        
        for key, value in translations.items():
            # Skip metadata fields
            if key in ['language', 'code', 'direction']:
                continue
            
            # Try to categorize
            categories = self.categorize_sentence(key, value)
            
            if categories:
                for cat in categories:
                    if cat not in categorized:
                        categorized[cat] = []
                    categorized[cat].append({
                        'key': key,
                        'translation': value,
                        'original': key
                    })
            else:
                unmapped.append({
                    'key': key,
                    'translation': value
                })
        
        return {
            'categorized': categorized,
            'unmapped': unmapped,
            'stats': {
                'total_sentences': len([k for k in translations.keys() 
                                       if k not in ['language', 'code', 'direction']]),
                'categorized': sum(len(v) for v in categorized.values()),
                'unmapped': len(unmapped),
                'categories_found': len(categorized)
            }
        }
    
    def map_all_translations(self, translations_dir: Path) -> Dict:
        """Map all translation files in a directory."""
        results = {}
        
        for json_file in translations_dir.glob('*.json'):
            language = json_file.stem
            print(f"Processing {language}...")
            results[language] = self.map_translation_file(json_file)
        
        return results
    
    def generate_category_templates(self, output_dir: Path):
        """Generate template files for each category with example sentences."""
        output_dir.mkdir(exist_ok=True)
        
        for category in self.categories_data['categories']:
            cat_id = category['id']
            template = {
                'category_id': cat_id,
                'category_name': category['name'],
                'priority': category['priority'],
                'description': category['description'],
                'subcategories': {}
            }
            
            for subcat in category['subcategories']:
                template['subcategories'][subcat] = {
                    'name': subcat.replace('_', ' ').title(),
                    'sentences': [],
                    'keywords': self.keyword_map.get(subcat, [])
                }
            
            output_file = output_dir / f"{cat_id}_template.json"
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(template, f, indent=2, ensure_ascii=False)
            
            print(f"Created template: {output_file}")


def main():
    """Example usage."""
    mapper = SentenceMapper()
    
    # Map all existing translations
    translations_dir = Path(__file__).parent.parent / "translations"
    if translations_dir.exists():
        print("Mapping existing translations...")
        results = mapper.map_all_translations(translations_dir)
        
        # Save results
        output_file = Path(__file__).parent / "mapping_results.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
        
        print(f"\nMapping results saved to {output_file}")
        
        # Print summary
        print("\n=== Mapping Summary ===")
        for language, result in results.items():
            stats = result['stats']
            print(f"\n{language.upper()}:")
            print(f"  Total sentences: {stats['total_sentences']}")
            print(f"  Categorized: {stats['categorized']}")
            print(f"  Unmapped: {stats['unmapped']}")
            print(f"  Categories found: {stats['categories_found']}")
    
    # Generate category templates
    print("\nGenerating category templates...")
    templates_dir = Path(__file__).parent / "category_templates"
    mapper.generate_category_templates(templates_dir)


if __name__ == "__main__":
    main()
