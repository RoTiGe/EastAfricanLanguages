"""
Contextual Phrase Generator
Generates language variations based on time of day and relationship context.
"""

import json
from pathlib import Path
from typing import Dict, List, Optional
from dataclasses import dataclass


@dataclass
class ContextualPhrase:
    """Represents a phrase with contextual variations."""
    phrase_id: str
    base_meaning: str
    category: str
    subcategory: str
    time_context: Optional[str] = None
    relationship_context: Optional[str] = None
    formality_level: Optional[str] = None
    trust_level: Optional[str] = None
    variations: Dict[str, str] = None
    usage_notes: str = ""
    cultural_notes: str = ""


class ContextualGenerator:
    """Generates contextual phrase variations."""
    
    def __init__(self, contextual_file: str = None):
        """Initialize with contextual definitions."""
        if contextual_file is None:
            contextual_file = Path(__file__).parent / "categories_contextual.json"
        
        with open(contextual_file, 'r', encoding='utf-8') as f:
            self.contextual_data = json.load(f)
        
        self.time_contexts = {tc['id']: tc for tc in self.contextual_data['contexts']['time_of_day']}
        self.relationships = {r['id']: r for r in self.contextual_data['contexts']['relationships']}
    
    def get_time_contexts(self) -> List[str]:
        """Get all time of day contexts."""
        return list(self.time_contexts.keys())
    
    def get_relationships(self) -> List[str]:
        """Get all relationship contexts."""
        return list(self.relationships.keys())
    
    def get_relationship_info(self, relationship_id: str) -> Dict:
        """Get detailed information about a relationship context."""
        return self.relationships.get(relationship_id, {})
    
    def generate_greeting_matrix(self) -> Dict:
        """
        Generate a complete matrix of greetings across all contexts.
        Returns a nested dictionary: time -> relationship -> phrase
        """
        matrix = {}
        
        # Load example phrases
        examples_file = Path(__file__).parent / "contextual_phrases_examples.json"
        if examples_file.exists():
            with open(examples_file, 'r', encoding='utf-8') as f:
                examples = json.load(f)
            
            # Find greeting variations
            for phrase_var in examples.get('phrase_variations', []):
                if phrase_var['base_meaning'] == 'greeting':
                    time_vars = phrase_var['variations'].get('time_of_day', {})
                    for time_id, rel_vars in time_vars.items():
                        if time_id not in matrix:
                            matrix[time_id] = {}
                        matrix[time_id].update(rel_vars)
        
        return matrix
    
    def generate_phrase_template(
        self,
        base_meaning: str,
        category: str,
        subcategory: str,
        time_context: Optional[str] = None,
        relationship_context: Optional[str] = None
    ) -> Dict:
        """Generate a template for a contextual phrase."""
        
        phrase_id = f"{category}_{subcategory}_{base_meaning.replace(' ', '_').lower()}"
        if time_context:
            phrase_id += f"_{time_context}"
        if relationship_context:
            phrase_id += f"_{relationship_context}"
        
        template = {
            "phrase_id": phrase_id,
            "base_meaning": base_meaning,
            "category": category,
            "subcategory": subcategory,
            "contexts": {},
            "translations": {
                "english": f"[English: {base_meaning}]",
                "spanish": f"[Spanish: {base_meaning}]",
                "french": f"[French: {base_meaning}]",
                "amharic": f"[Amharic: {base_meaning}]",
                "tigrinya": f"[Tigrinya: {base_meaning}]",
                "oromo": f"[Oromo: {base_meaning}]",
                "somali": f"[Somali: {base_meaning}]",
                "arabic": f"[Arabic: {base_meaning}]",
                "hadiyaa": f"[Hadiyaa: {base_meaning}]",
                "wolyitta": f"[Wolyitta: {base_meaning}]",
                "afar": f"[Afar: {base_meaning}]",
                "gamo": f"[Gamo: {base_meaning}]",
                "swahili": f"[Swahili: {base_meaning}]",
                "kinyarwanda": f"[Kinyarwanda: {base_meaning}]",
                "kirundi": f"[Kirundi: {base_meaning}]",
                "luo": f"[Luo: {base_meaning}]"
            },
            "usage_notes": "",
            "cultural_notes": ""
        }
        
        if time_context:
            template["contexts"]["time"] = time_context
            template["time_description"] = self.time_contexts[time_context]['description']
        
        if relationship_context:
            template["contexts"]["relationship"] = relationship_context
            rel_info = self.relationships[relationship_context]
            template["formality_level"] = rel_info['formality']
            template["trust_level"] = rel_info['trust_level']
            template["relationship_description"] = rel_info['description']
        
        return template
    
    def export_contextual_templates(self, output_dir: Path, category: str = "greetings"):
        """Export templates for a specific category with all contextual variations."""
        output_dir.mkdir(exist_ok=True)
        
        templates = []
        
        # Generate templates for each time/relationship combination
        for time_id in self.time_contexts.keys():
            for rel_id in self.relationships.keys():
                template = self.generate_phrase_template(
                    base_meaning=f"{category}_{time_id}",
                    category="basic_communication",
                    subcategory=category,
                    time_context=time_id,
                    relationship_context=rel_id
                )
                templates.append(template)
        
        # Save to file
        output_file = output_dir / f"{category}_contextual_templates.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(templates, f, indent=2, ensure_ascii=False)
        
        print(f"Generated {len(templates)} templates for {category}")
        print(f"Saved to: {output_file}")
        
        return templates


def main():
    """Example usage."""
    generator = ContextualGenerator()
    
    print("=== Contextual Phrase Generator ===\n")
    
    # Show available contexts
    print("Time Contexts:")
    for time_id in generator.get_time_contexts():
        info = generator.time_contexts[time_id]
        print(f"  - {time_id}: {info['name']}")
    
    print("\nRelationship Contexts:")
    for rel_id in generator.get_relationships():
        info = generator.relationships[rel_id]
        print(f"  - {rel_id}: {info['name']} (Formality: {info['formality']}, Trust: {info['trust_level']})")
    
    # Generate greeting matrix
    print("\n=== Generating Greeting Matrix ===")
    matrix = generator.generate_greeting_matrix()
    print(f"Generated greetings for {len(matrix)} time contexts")
    
    # Export templates
    print("\n=== Exporting Templates ===")
    output_dir = Path(__file__).parent / "contextual_templates"
    generator.export_contextual_templates(output_dir, "greetings")
    
    print("\n✅ Done!")


if __name__ == "__main__":
    main()

