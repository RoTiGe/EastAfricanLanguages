"""
API module for integrating the priority network with the main application.
Provides functions to get personalized sentence recommendations.
"""

import json
from pathlib import Path
from typing import Dict, List, Optional
from network_builder import LanguageLearningNetwork

class PriorityAPI:
    """API for accessing personalized learning priorities."""
    
    def __init__(self):
        """Initialize the API with the network."""
        self.network = LanguageLearningNetwork()
        self.translations_cache = {}
        self._load_translations()
    
    def _load_translations(self):
        """Load all translation files into cache."""
        translations_dir = Path(__file__).parent.parent / "translations"
        if not translations_dir.exists():
            return
        
        for json_file in translations_dir.glob('*.json'):
            language = json_file.stem.replace('_translations', '')
            try:
                with open(json_file, 'r', encoding='utf-8') as f:
                    self.translations_cache[language] = json.load(f)
            except Exception as e:
                print(f"Error loading {json_file}: {e}")
    
    def get_personas(self) -> List[Dict]:
        """Get list of all available personas."""
        return self.network.get_all_personas()
    
    def get_learning_path(self, persona_id: str, limit: int = None) -> List[Dict]:
        """Get personalized learning path for a persona."""
        path = self.network.get_learning_path(persona_id)
        if limit:
            path = path[:limit]
        return path
    
    def get_prioritized_sentences(
        self, 
        persona_id: str, 
        language: str,
        limit: int = 50
    ) -> List[Dict]:
        """
        Get prioritized sentences for a persona in a specific language.
        
        Args:
            persona_id: ID of the learner persona
            language: Target language code
            limit: Maximum number of sentences to return
        
        Returns:
            List of sentence dictionaries with priority scores
        """
        # Get learning path for this persona
        learning_path = self.get_learning_path(persona_id)
        
        # Get translations for the language
        if language not in self.translations_cache:
            return []
        
        translations = self.translations_cache[language]
        
        # For now, return sentences in priority order
        # In a full implementation, this would map sentences to categories
        prioritized = []
        
        for i, item in enumerate(learning_path):
            # Add category information to help with future mapping
            category_info = {
                'category_id': item['category_id'],
                'category_name': item['category_name'],
                'priority': item['priority'],
                'weight': item['weight']
            }
            
            # This is a placeholder - in production, you'd map actual sentences
            # to categories using the SentenceMapper
            for key, value in list(translations.items())[:5]:
                if key not in ['language', 'code', 'direction']:
                    prioritized.append({
                        'english': key,
                        'translation': value,
                        'language': language,
                        'priority_score': item['weight'],
                        'category': category_info
                    })
            
            if len(prioritized) >= limit:
                break
        
        return prioritized[:limit]
    
    def get_category_sentences(
        self,
        category_id: str,
        language: str,
        limit: int = 20
    ) -> List[Dict]:
        """Get sentences for a specific category and language."""
        category_info = self.network.get_category_info(category_id)
        if not category_info:
            return []
        
        if language not in self.translations_cache:
            return []
        
        translations = self.translations_cache[language]
        
        # Placeholder - would use SentenceMapper in production
        sentences = []
        for key, value in list(translations.items())[:limit]:
            if key not in ['language', 'code', 'direction']:
                sentences.append({
                    'english': key,
                    'translation': value,
                    'language': language,
                    'category': category_info['name']
                })
        
        return sentences
    
    def get_recommendation(
        self,
        persona_id: str,
        languages: List[str],
        sentences_per_language: int = 10
    ) -> Dict:
        """
        Get comprehensive learning recommendations.
        
        Args:
            persona_id: ID of the learner persona
            languages: List of target languages
            sentences_per_language: Number of sentences per language
        
        Returns:
            Dictionary with learning recommendations
        """
        persona = next(
            (p for p in self.get_personas() if p['id'] == persona_id),
            None
        )
        
        if not persona:
            return {'error': 'Persona not found'}
        
        learning_path = self.get_learning_path(persona_id, limit=10)
        
        recommendations = {
            'persona': persona,
            'learning_path': learning_path,
            'languages': {}
        }
        
        for language in languages:
            sentences = self.get_prioritized_sentences(
                persona_id,
                language,
                limit=sentences_per_language
            )
            recommendations['languages'][language] = sentences
        
        return recommendations
    
    def export_for_web(self, output_file: str):
        """Export API data for web application use."""
        web_data = {
            'personas': self.get_personas(),
            'categories': [],
            'available_languages': list(self.translations_cache.keys())
        }
        
        # Get all categories with their info
        for cat in self.network.categories_data['categories']:
            cat_info = self.network.get_category_info(cat['id'])
            if cat_info:
                web_data['categories'].append(cat_info)
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(web_data, f, indent=2, ensure_ascii=False)
        
        print(f"Web data exported to {output_file}")


def main():
    """Example usage of the API."""
    api = PriorityAPI()
    
    print("=== Language Learning Priority API ===\n")
    
    # Show available personas
    print("Available Personas:")
    personas = api.get_personas()
    for persona in personas:
        print(f"  - {persona['name']}: {persona['description']}")
    print()
    
    # Get recommendations for an asylum seeker
    print("Recommendations for Asylum Seeker:")
    print("-" * 60)
    
    recommendations = api.get_recommendation(
        persona_id='asylum_seeker',
        languages=['english', 'arabic'],
        sentences_per_language=5
    )
    
    print(f"\nPersona: {recommendations['persona']['name']}")
    print(f"\nTop Learning Categories:")
    for i, cat in enumerate(recommendations['learning_path'][:5], 1):
        print(f"{i}. {cat['category_name']} (Priority: {cat['priority']})")
    
    print(f"\nSample Sentences by Language:")
    for lang, sentences in recommendations['languages'].items():
        print(f"\n{lang.upper()}:")
        for i, sent in enumerate(sentences[:3], 1):
            print(f"  {i}. {sent['english']} → {sent['translation']}")
    
    # Export for web
    output_file = Path(__file__).parent / "web_api_data.json"
    api.export_for_web(str(output_file))


if __name__ == "__main__":
    main()
