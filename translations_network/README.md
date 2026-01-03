# Language Learning Priority Network

This folder contains a NetworkX-based system for prioritizing language learning content based on learner personas and real-world needs.

## 🆕 NEW: Contextual Language Learning System

**A revolutionary addition that teaches not just WHAT to say, but HOW to say it appropriately!**

The new **Contextual System** expands language learning with:
- ⏰ **Time-of-Day Variations** (morning, evening, night greetings)
- 👥 **Relationship Contexts** (stranger, friend, family, boss, romantic partner)
- 📊 **Formality Levels** (very formal → very casual)
- 🤝 **Trust Dynamics** (low → very high)

**Example**: "Good morning" has different expressions for:
- A stranger: "Good morning, sir/madam" (formal)
- A friend: "Morning! / Hey!" (casual)
- Your child: "Good morning, sweetheart" (affectionate)

📚 **See**: `CONTEXTUAL_README.md` for full documentation
🚀 **Try**: `python demo_contextual.py` for interactive demo
📖 **Quick Ref**: `QUICK_REFERENCE.md` for common phrases

---

## Overview

The system models the language learning process as a directed graph that connects:
- **Personas** (tourist, house maid, engineer, day laborer, asylum seeker, trader)
- **Categories** (survival, navigation, work, healthcare, etc.)
- **Subcategories** (specific skill areas within each category)
- **Sentences** (actual translation content)
- **🆕 Contexts** (time of day, relationship type, formality level)

## Architecture

### Core Components

#### Original Priority System
1. **categories.json** - Defines the complete taxonomy of learning categories and personas
2. **network_builder.py** - Creates and manages the NetworkX graph
3. **sentence_mapper.py** - Maps existing translations to categories
4. **priority_api.py** - Provides API for integrating with the main application

#### 🆕 Contextual Learning System
5. **categories_contextual.json** - Defines 13 relationship types and 5 time contexts
6. **priority_contextual_phrases.json** - 50+ phrases with contextual variations in 9 languages
7. **contextual_generator.py** - Tool to generate contextual phrase templates
8. **contextual_visualizer.py** - Visualize and compare phrase variations
9. **demo_contextual.py** - Interactive demonstration of the contextual system
10. **CONTEXTUAL_README.md** - Complete documentation of contextual system
11. **CONTEXTUAL_EXPANSION_GUIDE.md** - Guide for expanding the system
12. **QUICK_REFERENCE.md** - Quick reference for common contextual phrases

### Priority System

Categories are prioritized based on:
- **Universal Priority**: Categories critical for all learners (1-18, lower = higher priority)
- **Persona Weights**: How important each category is for specific personas (0.0-1.0)
- **Combined Score**: Priority × Persona Weight = Final recommendation order

## Personas

### 1. Tourist
**Focus**: Short-term visitor for leisure
**Top Priorities**: 
- Survival & Emergency
- Navigation & Transportation
- Entertainment & Leisure

### 2. House Maid / Domestic Worker
**Focus**: Employed in household services
**Top Priorities**:
- Survival & Emergency
- Household Management
- Basic Work Communication

### 3. Engineer / Professional
**Focus**: Skilled professional worker
**Top Priorities**:
- Survival & Emergency
- Specialized Work Terms
- Documentation & Legal

### 4. Day Laborer / Manual Worker
**Focus**: Casual or construction worker
**Top Priorities**:
- Survival & Emergency
- Basic Work Communication
- Numbers & Money

### 5. Asylum Seeker / Refugee
**Focus**: Person seeking international protection
**Top Priorities**:
- Survival & Emergency
- Documentation & Legal
- Healthcare & Medical

### 6. Trader / Merchant
**Focus**: Buying and selling goods
**Top Priorities**:
- Survival & Emergency
- Business & Trade
- Numbers & Money

## Categories (by Priority)

1. **Survival & Emergency** - Critical phrases for safety
2. **Basic Communication** - Greetings and politeness
3. **Navigation & Transportation** - Getting around
4. **Accommodation & Shelter** - Finding housing
5. **Food & Water** - Basic sustenance
6. **Numbers & Money** - Financial transactions
7. **Basic Work Communication** - Workplace essentials
8. **Healthcare & Medical** - Medical needs
9. **Documentation & Legal** - Official procedures
10. **Shopping & Services** - Retail interactions
11. **Social Interaction** - Building relationships
12. **Specialized Work Terms** - Professional vocabulary
13. **Household Management** - Home and daily tasks
14. **Education & Learning** - School contexts
15. **Cultural & Religious** - Cultural practices
16. **Entertainment & Leisure** - Recreation
17. **Advanced Legal & Rights** - Legal matters
18. **Business & Trade** - Commercial transactions

## Usage

### Basic Usage

```python
from network_builder import LanguageLearningNetwork

# Create network
network = LanguageLearningNetwork()

# Get learning path for a specific persona
path = network.get_learning_path('asylum_seeker')

# Get all personas
personas = network.get_all_personas()

# Get category information
info = network.get_category_info('survival')
```

### API Integration

```python
from priority_api import PriorityAPI

# Initialize API
api = PriorityAPI()

# Get personalized recommendations
recommendations = api.get_recommendation(
    persona_id='house_maid',
    languages=['english', 'arabic'],
    sentences_per_language=20
)

# Get prioritized sentences
sentences = api.get_prioritized_sentences(
    persona_id='day_laborer',
    language='french',
    limit=50
)
```

### Sentence Mapping

```python
from sentence_mapper import SentenceMapper
from pathlib import Path

# Map existing translations
mapper = SentenceMapper()
results = mapper.map_all_translations(Path('translations'))

# Categorize a single sentence
categories = mapper.categorize_sentence("Where is the hospital?")
```

## Files Generated

- **network_data.json** - Complete network structure for web use
- **web_api_data.json** - API data for frontend integration
- **mapping_results.json** - Results of mapping existing translations
- **category_templates/** - Template files for each category
- **network_visualization.png** - Visual representation of the network

## Integration with Main App

The priority system can be integrated into the existing application to:

1. **Personalize Learning Paths**: Show sentences based on user's persona
2. **Smart Recommendations**: Suggest what to learn next
3. **Progress Tracking**: Track mastery by category
4. **Adaptive Testing**: Focus tests on high-priority areas
5. **Content Gaps**: Identify missing translations in critical categories

### Example Integration

```javascript
// In your main.js or server-side code
const priorityData = require('./translations_network/web_api_data.json');

// Let user select their persona
function selectPersona(personaId) {
    const persona = priorityData.personas.find(p => p.id === personaId);
    // Store in user session/profile
    localStorage.setItem('learner_persona', personaId);
}

// Get prioritized content
function getPrioritizedContent(personaId, language) {
    // Call API or use pre-generated data
    // Return sentences sorted by priority for this persona
}
```

## Future Enhancements

1. **Sentence Database**: Complete mapping of all existing translations
2. **Progress Tracking**: Track which categories user has mastered
3. **Adaptive Learning**: Adjust priorities based on user performance
4. **Multi-persona Profiles**: Support users with multiple roles
5. **Dynamic Weighting**: Adjust weights based on user feedback
6. **Spaced Repetition**: Integrate with SRS algorithms
7. **Context Detection**: Automatically suggest relevant categories

## Requirements

```
networkx>=3.0
matplotlib>=3.5  # For visualization
```

Install with:
```bash
pip install networkx matplotlib
```

## Running the Scripts

```bash
# Build network and generate visualizations
python network_builder.py

# Map existing translations to categories
python sentence_mapper.py

# Generate API data
python priority_api.py
```

## License

Part of the East African Languages Sound Training project.
