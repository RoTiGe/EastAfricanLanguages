"""
Simple demo of the Contextual Language Learning System
Shows how the same phrase changes across different contexts
"""

import json
from pathlib import Path


def load_phrases():
    """Load contextual phrases."""
    phrases_file = Path(__file__).parent / "priority_contextual_phrases.json"
    with open(phrases_file, 'r', encoding='utf-8') as f:
        return json.load(f)


def print_header(text):
    """Print a formatted header."""
    print(f"\n{'='*80}")
    print(f"  {text}")
    print(f"{'='*80}\n")


def demo_greeting_variations():
    """Show how 'Good morning' changes across contexts."""
    data = load_phrases()
    
    print_header("DEMO 1: 'Good Morning' Across Different Relationships")
    
    morning_greetings = [
        p for p in data['phrases']
        if 'morning' in p['phrase_id'] and 'greeting' in p['phrase_id']
    ]
    
    for phrase in morning_greetings:
        relationship = phrase['contexts'].get('relationship', 'unknown')
        formality = phrase['contexts'].get('formality', 'medium')
        
        print(f"Context: {relationship.replace('_', ' ').title()}")
        print(f"Formality: {formality.upper()}")
        print(f"  English:  {phrase['translations']['english']}")
        print(f"  Amharic:  {phrase['translations']['amharic']}")
        print(f"  💡 {phrase['usage_notes']}")
        print()


def demo_help_requests():
    """Show how 'Can you help me?' changes by context."""
    data = load_phrases()
    
    print_header("DEMO 2: 'Can You Help Me?' - Formal vs. Casual vs. Emergency")
    
    help_phrases = [
        p for p in data['phrases']
        if 'help' in p['phrase_id']
    ]
    
    for phrase in help_phrases:
        urgency = phrase['contexts'].get('urgency', 'normal')
        relationship = phrase['contexts'].get('relationship', 'any')
        
        print(f"Situation: {phrase['base_meaning']}")
        print(f"Urgency: {urgency.upper()}")
        if relationship != 'any':
            print(f"Relationship: {relationship.replace('_', ' ').title()}")
        
        print(f"\n  English:  {phrase['translations']['english']}")
        print(f"  Amharic:  {phrase['translations']['amharic']}")
        print(f"  Tigrinya: {phrase['translations']['tigrinya']}")
        print(f"  Oromo:    {phrase['translations']['oromo']}")
        print(f"  Somali:   {phrase['translations']['somali']}")
        
        if phrase.get('cultural_notes'):
            print(f"\n  🌍 Cultural Note: {phrase['cultural_notes']}")
        
        print(f"\n{'-'*80}\n")


def demo_thank_you_spectrum():
    """Show formality spectrum for 'Thank you'."""
    data = load_phrases()
    
    print_header("DEMO 3: 'Thank You' - Formality Spectrum")
    
    thank_phrases = [
        p for p in data['phrases']
        if 'thank' in p['phrase_id']
    ]
    
    # Sort by formality
    formality_order = {'very_high': 5, 'high': 4, 'medium': 3, 'low': 2, 'very_low': 1}
    thank_phrases.sort(
        key=lambda p: formality_order.get(p['contexts'].get('formality', 'medium'), 3),
        reverse=True
    )
    
    print("From MOST FORMAL to LEAST FORMAL:\n")
    
    for phrase in thank_phrases:
        formality = phrase['contexts'].get('formality', 'medium')
        relationship = phrase['contexts'].get('relationship', 'unknown')
        
        # Visual indicator
        if formality in ['very_high', 'high']:
            indicator = "🎩 FORMAL"
        elif formality == 'medium':
            indicator = "👔 NEUTRAL"
        else:
            indicator = "👕 CASUAL"
        
        print(f"{indicator:15} | {relationship.replace('_', ' ').title():25}")
        print(f"                 English:  {phrase['translations']['english']}")
        print(f"                 Amharic:  {phrase['translations']['amharic']}")
        print()


def demo_time_of_day():
    """Show how greetings change throughout the day."""
    data = load_phrases()
    
    print_header("DEMO 4: Greetings Throughout the Day (to a Friend)")
    
    # Find greetings to friends at different times
    friend_greetings = [
        p for p in data['phrases']
        if 'greeting' in p['phrase_id']
        and p['contexts'].get('relationship') in ['informal_friend', 'intimate_romantic']
    ]
    
    time_order = ['morning', 'midday', 'afternoon', 'evening', 'night']
    
    for time in time_order:
        matching = [p for p in friend_greetings if p['contexts'].get('time') == time]
        
        if matching:
            phrase = matching[0]
            print(f"⏰ {time.upper()}")
            print(f"   English:  {phrase['translations']['english']}")
            print(f"   Amharic:  {phrase['translations']['amharic']}")
            print()


def demo_cross_language():
    """Show one phrase across all languages."""
    data = load_phrases()
    
    print_header("DEMO 5: One Phrase Across All Languages")
    
    # Pick a common phrase
    phrase = data['phrases'][0]  # First phrase (formal morning greeting)
    
    print(f"Phrase: {phrase['base_meaning']}")
    print(f"Context: {phrase['contexts'].get('relationship', 'unknown').replace('_', ' ').title()}")
    print(f"\nTranslations:\n")
    
    for lang, translation in sorted(phrase['translations'].items()):
        print(f"  {lang.capitalize():12} → {translation}")


def demo_scenario():
    """Show a real-world scenario."""
    data = load_phrases()
    
    print_header("DEMO 6: Real-World Scenario - Tourist's First Morning")
    
    print("Scenario: You're a tourist in Addis Ababa. It's morning, and you need")
    print("to ask the hotel staff for help finding a restaurant.\n")
    
    print("Step 1: Greet the staff (formal, morning)")
    morning_formal = next(
        p for p in data['phrases']
        if 'morning' in p['phrase_id']
        and p['contexts'].get('formality') == 'very_high'
    )
    print(f"  Say: {morning_formal['translations']['amharic']}")
    print(f"  ({morning_formal['translations']['english']})\n")
    
    print("Step 2: Ask for help (polite)")
    help_formal = next(
        p for p in data['phrases']
        if 'help' in p['phrase_id']
        and p['contexts'].get('formality') == 'high'
    )
    print(f"  Say: {help_formal['translations']['amharic']}")
    print(f"  ({help_formal['translations']['english']})\n")
    
    print("Step 3: Thank them")
    thank_formal = next(
        p for p in data['phrases']
        if 'thank' in p['phrase_id']
        and p['contexts'].get('formality') == 'high'
    )
    print(f"  Say: {thank_formal['translations']['amharic']}")
    print(f"  ({thank_formal['translations']['english']})\n")
    
    print("✅ You've successfully communicated with appropriate formality!")


def main():
    """Run all demos."""
    print("\n" + "="*80)
    print("  🌍 CONTEXTUAL LANGUAGE LEARNING SYSTEM - INTERACTIVE DEMO 🌍")
    print("="*80)
    
    print("\nThis demo shows how the SAME MEANING is expressed DIFFERENTLY")
    print("based on WHO you're talking to, WHEN, and HOW FORMAL the situation is.\n")
    
    input("Press Enter to start Demo 1: Greeting Variations...")
    demo_greeting_variations()
    
    input("\nPress Enter for Demo 2: Help Requests...")
    demo_help_requests()
    
    input("\nPress Enter for Demo 3: Thank You Spectrum...")
    demo_thank_you_spectrum()
    
    input("\nPress Enter for Demo 4: Time of Day...")
    demo_time_of_day()
    
    input("\nPress Enter for Demo 5: Cross-Language Comparison...")
    demo_cross_language()
    
    input("\nPress Enter for Demo 6: Real-World Scenario...")
    demo_scenario()
    
    print("\n" + "="*80)
    print("  ✅ DEMO COMPLETE!")
    print("="*80)
    print("\nKey Takeaways:")
    print("  1. Same meaning → Different expressions based on context")
    print("  2. Formality matters: stranger vs. friend vs. family")
    print("  3. Time of day affects greetings")
    print("  4. Cultural awareness is built into every phrase")
    print("  5. Real-world scenarios guide learning")
    print("\nNext Steps:")
    print("  • Explore: priority_contextual_phrases.json")
    print("  • Read: CONTEXTUAL_README.md")
    print("  • Study: flashcards in study_materials/")
    print("  • Expand: Use contextual_generator.py to add more phrases")
    print("\n🚀 Happy Learning!\n")


if __name__ == "__main__":
    main()

