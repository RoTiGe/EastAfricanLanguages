# Contextual Language Learning System

## 🎯 Overview

This is an **advanced contextual language learning framework** that teaches learners not just *what* to say, but *how* to say it appropriately based on:

- ⏰ **Time of Day** (morning, midday, afternoon, evening, night)
- 👥 **Relationship Type** (stranger, friend, family, boss, etc.)
- 📊 **Formality Level** (very formal → very casual)
- 🤝 **Trust Level** (low → very high)
- ⚡ **Urgency** (casual → emergency)

## 🌟 Why This Matters

### The Problem
Traditional language learning teaches phrases in isolation:
- "Good morning" = "እንደምን አደሩ" (Amharic)

But in real life, you wouldn't say the same thing to:
- A stranger on the street
- Your boss at work
- Your best friend
- Your child
- A police officer

### The Solution
Our system teaches **contextual variations**:

| Context | English | Amharic |
|---------|---------|---------|
| **Formal Stranger** | "Good morning, sir/madam" | "እንደምን አደሩ" (əndemin aderu) |
| **Informal Friend** | "Morning! / Hey, morning!" | "እንደምን አደርክ/ሽ!" (əndemin aderk/sh!) |
| **Parent to Child** | "Good morning, sweetheart" | "እንደምን አደርክ ፍቅሬ" (əndemin aderk fiqre) |
| **Romantic Partner** | "Good morning, my love" | "እንደምን አደርክ ፍቅሬ" (əndemin aderk fiqre) |

## 📁 Files in This System

### Core Framework Files
- **`categories_contextual.json`** - Defines all context types (time, relationships, formality)
- **`priority_contextual_phrases.json`** - 50+ critical phrases with full contextual variations
- **`contextual_phrases_examples.json`** - Example variations for common phrases

### Tools & Scripts
- **`contextual_generator.py`** - Generate contextual phrase templates
- **`contextual_visualizer.py`** - Visualize and compare phrase variations
- **`sentence_mapper.py`** - Map existing translations to contextual categories

### Documentation
- **`CONTEXTUAL_EXPANSION_GUIDE.md`** - Detailed guide for expanding the system
- **`CONTEXTUAL_README.md`** - This file

## 🚀 Quick Start

### 1. View Phrase Variations

```bash
python contextual_visualizer.py
```

This will show you:
- How "Good morning" changes across contexts
- How "Can you help me?" varies by relationship
- Formality spectrum for "Thank you"
- Cross-language comparisons

### 2. Generate Templates

```bash
python contextual_generator.py
```

This creates templates for new contextual phrases.

### 3. Explore the Data

```python
import json

# Load contextual phrases
with open('priority_contextual_phrases.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Find all morning greetings
morning_greetings = [
    p for p in data['phrases'] 
    if p['contexts'].get('time') == 'morning'
]

# Find all formal phrases
formal_phrases = [
    p for p in data['phrases']
    if p['contexts'].get('formality') in ['high', 'very_high']
]
```

## 📊 Context Dimensions

### Time of Day (5 contexts)

| ID | Name | Time Range | Use Cases |
|----|------|-----------|-----------|
| `morning` | Morning | 6 AM - 12 PM | Breakfast, starting work, waking up |
| `midday` | Midday/Lunch | 12 PM - 2 PM | Lunch, break time |
| `afternoon` | Afternoon | 2 PM - 6 PM | Continuing work, getting tired |
| `evening` | Evening | 6 PM - 10 PM | Going home, dinner, relaxing |
| `night` | Night | 10 PM - 6 AM | Sleep, emergencies |

### Relationship Types (13 contexts)

| ID | Formality | Trust | Description |
|----|-----------|-------|-------------|
| `formal_stranger` | Very High | Low | First meeting, professional distance |
| `formal_professional` | High | Medium | Boss/employee, workplace |
| `formal_authority` | Very High | Variable | Police, officials |
| `neutral_acquaintance` | Medium | Medium | Neighbors, regular customers |
| `informal_friend` | Low | High | Friends, trusted colleagues |
| `intimate_family` | Very Low | Very High | Close family |
| `intimate_romantic` | Very Low | Very High | Spouse, partner |
| `hierarchical_parent_child` | Low | Very High | Parent → child |
| `hierarchical_child_parent` | Medium | Very High | Child → parent |
| `hierarchical_elder` | High | High | Addressing elders |
| `transactional_service` | Medium | Medium | Shop, restaurant, taxi |
| `cautious_distrust` | High | Low | Suspicious situations |
| `playful_fun` | Very Low | High | Joking with friends |

## 💡 Example Use Cases

### Use Case 1: Tourist Arriving in Ethiopia

**Scenario**: First morning in Addis Ababa, asking hotel staff for help

**Context**: 
- Time: Morning
- Relationship: Transactional Service
- Formality: Medium
- Trust: Medium

**Phrases Needed**:
```
Good morning → "እንደምን አደሩ" (əndemin aderu)
Could you help me? → "እባክዎ ሊረዱኝ ይችላሉ?" (ibakwo lireduñ yichilalu?)
Where is the restaurant? → "ምግብ ቤቱ የት ነው?" (migib betu yet new?)
```

### Use Case 2: Domestic Worker Starting New Job

**Scenario**: First day, meeting employer

**Context**:
- Time: Morning
- Relationship: Formal Professional
- Formality: High
- Trust: Low (building)

**Phrases Needed**:
```
Good morning, sir/madam → "እንደምን አደሩ" (əndemin aderu)
Thank you very much → "በጣም አመሰግናለሁ" (betam ameseginalehu)
I understand → "ገባኝ" (gebañ)
```

### Use Case 3: Parent Teaching Child

**Scenario**: Morning routine with young child

**Context**:
- Time: Morning
- Relationship: Parent → Child
- Formality: Very Low
- Trust: Very High

**Phrases Needed**:
```
Good morning, sweetheart → "እንደምን አደርክ ፍቅሬ" (əndemin aderk fiqre)
Time for breakfast → "ለቁርስ ሰዓት ነው" (lequrs se'at new)
Wash your hands → "እጅህን ታጠብ" (ijihin tateb)
```

## 🎓 Learning Path

### Level 1: Survival Basics (Any Context)
- Help! Emergency!
- Water, please
- Where is...?
- Thank you
- Yes/No

### Level 2: Formal Interactions
- Greetings (formal)
- Polite requests
- Asking for help (formal)
- Basic transactions

### Level 3: Casual Interactions
- Greetings (informal)
- Friend conversations
- Casual requests

### Level 4: Intimate/Family
- Family greetings
- Parent-child communication
- Romantic expressions

### Level 5: Professional
- Workplace communication
- Boss-employee interactions
- Professional meetings

## 📈 Current Status

### ✅ Completed
- [x] Contextual framework defined
- [x] 13 relationship types documented
- [x] 5 time-of-day contexts defined
- [x] 50+ priority phrases with full translations
- [x] Visualization tools created
- [x] Template generator built
- [x] Documentation written

### 🔄 In Progress
- [ ] Expand to 200+ contextual phrases
- [ ] Add audio recordings for each variation
- [ ] Create interactive web interface
- [ ] Integrate with main app

### 📋 Planned
- [ ] Video examples showing context usage
- [ ] Cultural notes for each context
- [ ] Practice exercises
- [ ] Context detection AI
- [ ] Personalized learning paths

## 🛠️ For Developers

### Adding New Contextual Phrases

```python
from contextual_generator import ContextualGenerator

generator = ContextualGenerator()

# Generate template
template = generator.generate_phrase_template(
    base_meaning="How are you?",
    category="basic_communication",
    subcategory="small_talk",
    time_context="evening",
    relationship_context="informal_friend"
)

# Fill in translations
template['translations']['amharic'] = "እንዴት ነህ?"
# ... add other languages

# Save to priority_contextual_phrases.json
```

### Querying Contextual Phrases

```python
import json

with open('priority_contextual_phrases.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Find phrases for specific context
def find_phrases(time=None, relationship=None, category=None):
    results = data['phrases']
    
    if time:
        results = [p for p in results if p['contexts'].get('time') == time]
    if relationship:
        results = [p for p in results if p['contexts'].get('relationship') == relationship]
    if category:
        results = [p for p in results if p['category'] == category]
    
    return results

# Example: Find all morning greetings for strangers
morning_stranger = find_phrases(time='morning', relationship='formal_stranger')
```

## 🌍 Languages Supported

Currently includes translations for:
- English
- Amharic (አማርኛ)
- Tigrinya (ትግርኛ)
- Oromo (Afaan Oromoo)
- Somali (Soomaali)
- Arabic (العربية)
- Swahili (Kiswahili)
- French (Français)
- Spanish (Español)

Plus 7 more East African languages in the main system!

## 📞 Integration with Main App

The contextual system can be integrated into the main Sound Training app:

1. **User Profile**: Let users select their persona and common contexts
2. **Smart Recommendations**: Show phrases relevant to user's current context
3. **Practice Mode**: Practice the same phrase in different contexts
4. **Context Quiz**: Test understanding of when to use which variation
5. **Real-world Scenarios**: Present situations and ask for appropriate phrase

## 🤝 Contributing

To expand this system:

1. Review `CONTEXTUAL_EXPANSION_GUIDE.md`
2. Use `contextual_generator.py` to create templates
3. Fill in translations for all supported languages
4. Add usage notes and cultural notes
5. Test with native speakers
6. Submit additions to `priority_contextual_phrases.json`

## 📚 Resources

- Main network system: `network_builder.py`
- Persona definitions: `categories.json`
- Sentence mapper: `sentence_mapper.py`
- Priority API: `priority_api.py`

---

**Created**: 2026-01-03  
**Version**: 1.0  
**Status**: Active Development 🚀

