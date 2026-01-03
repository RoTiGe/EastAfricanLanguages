"""
Contextual Phrase Visualizer
Creates visual representations of how phrases change across contexts.
"""

import json
from pathlib import Path
from typing import Dict, List
import sys


class ContextualVisualizer:
    """Visualizes contextual phrase variations."""
    
    def __init__(self, phrases_file: str = None):
        """Initialize with contextual phrases."""
        if phrases_file is None:
            phrases_file = Path(__file__).parent / "priority_contextual_phrases.json"
        
        with open(phrases_file, 'r', encoding='utf-8') as f:
            self.data = json.load(f)
        
        self.phrases = self.data.get('phrases', [])
    
    def print_phrase_matrix(self, base_meaning: str, language: str = 'english'):
        """Print a matrix showing how a phrase varies across contexts."""
        
        # Find all phrases with this base meaning
        matching = [p for p in self.phrases if base_meaning.lower() in p['base_meaning'].lower()]
        
        if not matching:
            print(f"No phrases found for: {base_meaning}")
            return
        
        print(f"\n{'='*80}")
        print(f"PHRASE VARIATIONS: {base_meaning.upper()}")
        print(f"Language: {language.upper()}")
        print(f"{'='*80}\n")
        
        for phrase in matching:
            contexts = phrase.get('contexts', {})
            translation = phrase['translations'].get(language, 'N/A')
            
            # Build context description
            context_parts = []
            if 'time' in contexts:
                context_parts.append(f"Time: {contexts['time']}")
            if 'relationship' in contexts:
                context_parts.append(f"Relationship: {contexts['relationship']}")
            if 'formality' in contexts:
                context_parts.append(f"Formality: {contexts['formality']}")
            if 'urgency' in contexts:
                context_parts.append(f"Urgency: {contexts['urgency']}")
            
            context_str = " | ".join(context_parts) if context_parts else "General"
            
            print(f"Context: {context_str}")
            print(f"  → {translation}")
            
            if phrase.get('usage_notes'):
                print(f"  ℹ️  {phrase['usage_notes']}")
            
            print()
    
    def compare_languages(self, phrase_id: str, languages: List[str] = None):
        """Compare how a specific phrase is expressed across languages."""
        
        if languages is None:
            languages = ['english', 'amharic', 'tigrinya', 'oromo', 'somali', 'arabic', 'swahili']
        
        # Find the phrase
        phrase = next((p for p in self.phrases if p['phrase_id'] == phrase_id), None)
        
        if not phrase:
            print(f"Phrase not found: {phrase_id}")
            return
        
        print(f"\n{'='*80}")
        print(f"CROSS-LANGUAGE COMPARISON")
        print(f"Phrase: {phrase['base_meaning']}")
        print(f"{'='*80}\n")
        
        # Show context
        contexts = phrase.get('contexts', {})
        if contexts:
            print("Context:")
            for key, value in contexts.items():
                print(f"  • {key.capitalize()}: {value}")
            print()
        
        # Show translations
        print("Translations:")
        for lang in languages:
            translation = phrase['translations'].get(lang, 'N/A')
            print(f"  {lang.upper():12} → {translation}")
        
        print()
        
        if phrase.get('cultural_notes'):
            print(f"Cultural Notes: {phrase['cultural_notes']}")
            print()
    
    def show_relationship_spectrum(self, base_meaning: str, language: str = 'english'):
        """Show how a phrase changes across the formality/relationship spectrum."""
        
        matching = [p for p in self.phrases if base_meaning.lower() in p['base_meaning'].lower()]
        
        if not matching:
            print(f"No phrases found for: {base_meaning}")
            return
        
        # Sort by formality
        formality_order = {
            'very_high': 5,
            'high': 4,
            'medium': 3,
            'low': 2,
            'very_low': 1,
            'none': 0
        }
        
        sorted_phrases = sorted(
            matching,
            key=lambda p: formality_order.get(p.get('contexts', {}).get('formality', 'medium'), 3),
            reverse=True
        )
        
        print(f"\n{'='*80}")
        print(f"FORMALITY SPECTRUM: {base_meaning.upper()}")
        print(f"Language: {language.upper()}")
        print(f"{'='*80}\n")
        print("Most Formal → Least Formal\n")
        
        for phrase in sorted_phrases:
            relationship = phrase.get('contexts', {}).get('relationship', 'unknown')
            formality = phrase.get('contexts', {}).get('formality', 'medium')
            translation = phrase['translations'].get(language, 'N/A')
            
            # Visual indicator
            if formality in ['very_high', 'high']:
                indicator = "🎩"
            elif formality == 'medium':
                indicator = "👔"
            else:
                indicator = "👕"
            
            print(f"{indicator} [{formality.upper():12}] {relationship:25} → {translation}")
        
        print()
    
    def export_study_cards(self, output_file: Path, language: str = 'english'):
        """Export phrases as study cards (flashcard format)."""
        
        cards = []
        
        for phrase in self.phrases:
            card = {
                'front': phrase['translations']['english'],
                'back': phrase['translations'].get(language, 'N/A'),
                'context': phrase.get('contexts', {}),
                'usage_notes': phrase.get('usage_notes', ''),
                'cultural_notes': phrase.get('cultural_notes', ''),
                'category': phrase.get('category', ''),
                'subcategory': phrase.get('subcategory', '')
            }
            cards.append(card)
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(cards, f, indent=2, ensure_ascii=False)
        
        print(f"Exported {len(cards)} study cards to {output_file}")


def main():
    """Interactive demo."""
    visualizer = ContextualVisualizer()
    
    print("\n🌍 CONTEXTUAL PHRASE VISUALIZER 🌍\n")
    
    # Show greeting variations
    print("\n1️⃣  GREETING VARIATIONS")
    visualizer.print_phrase_matrix("good morning", "english")
    
    print("\n2️⃣  HELP REQUEST VARIATIONS")
    visualizer.print_phrase_matrix("can you help", "english")
    
    print("\n3️⃣  FORMALITY SPECTRUM - Thank You")
    visualizer.show_relationship_spectrum("thank you", "english")
    
    print("\n4️⃣  CROSS-LANGUAGE COMPARISON")
    visualizer.compare_languages("greeting_morning_formal_stranger")
    
    # Export study cards
    output_dir = Path(__file__).parent / "study_materials"
    output_dir.mkdir(exist_ok=True)
    
    print("\n5️⃣  EXPORTING STUDY CARDS")
    for lang in ['amharic', 'tigrinya', 'oromo', 'somali']:
        output_file = output_dir / f"flashcards_{lang}.json"
        visualizer.export_study_cards(output_file, lang)
    
    print("\n✅ Done! Check the study_materials folder for flashcards.")


if __name__ == "__main__":
    main()

