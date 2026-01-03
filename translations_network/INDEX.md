# Translations Network - Complete File Index

## 📚 Documentation Files

### Getting Started
- **`README.md`** - Main overview of the entire system (original + contextual)
- **`CONTEXTUAL_README.md`** - Complete guide to the contextual learning system
- **`QUICK_REFERENCE.md`** - Quick reference for common contextual phrases
- **`INDEX.md`** - This file - complete file index

### Guides & Tutorials
- **`CONTEXTUAL_EXPANSION_GUIDE.md`** - How to expand the contextual system
- **`CONTEXTUAL_SYSTEM_SUMMARY.md`** - High-level summary of what we built

---

## 🗂️ Data Files

### Original Priority System
- **`categories.json`** - Complete taxonomy of 18 learning categories and 6 personas
  - Defines universal priorities (1-18)
  - Persona weights for each category
  - Subcategories for each main category

### Contextual Learning System
- **`categories_contextual.json`** - Contextual framework definitions
  - 5 time-of-day contexts (morning, midday, afternoon, evening, night)
  - 13 relationship types (formal stranger → intimate family)
  - Formality and trust level specifications
  - Language features for each context

- **`priority_contextual_phrases.json`** - Priority phrases with contextual variations
  - 50+ critical phrases
  - 9 languages per phrase (English, Amharic, Tigrinya, Oromo, Somali, Arabic, Swahili, French, Spanish)
  - Context metadata (time, relationship, formality, trust)
  - Usage notes and cultural notes

- **`contextual_phrases_examples.json`** - Example phrase variations
  - Demonstrates how phrases change across contexts
  - Template for creating new variations

---

## 🛠️ Python Tools & Scripts

### Original System Tools
- **`network_builder.py`** - Creates and manages the NetworkX graph
  - Builds persona-category-subcategory network
  - Calculates priority scores
  - Generates learning paths
  - Exports network data

- **`sentence_mapper.py`** - Maps existing translations to categories
  - Keyword-based categorization
  - Processes translation files
  - Generates mapping statistics
  - Creates category templates

- **`priority_api.py`** - API for integrating with main application
  - Get personalized recommendations
  - Retrieve prioritized sentences
  - Filter by persona and language

### Contextual System Tools
- **`contextual_generator.py`** - Generate contextual phrase templates
  - Create templates for new phrases
  - Generate greeting matrices
  - Export templates for translation
  - Batch template generation

- **`contextual_visualizer.py`** - Visualize and compare phrase variations
  - Show phrase matrices (how one phrase varies)
  - Compare across languages
  - Display formality spectrum
  - Export flashcards for study

- **`demo_contextual.py`** - Interactive demonstration
  - 6 interactive demos
  - Shows greeting variations
  - Demonstrates help requests
  - Displays formality spectrum
  - Real-world scenarios

---

## 📖 Study Materials

### Generated Flashcards
Located in `study_materials/` directory:
- **`flashcards_amharic.json`** - Amharic study cards
- **`flashcards_tigrinya.json`** - Tigrinya study cards
- **`flashcards_oromo.json`** - Oromo study cards
- **`flashcards_somali.json`** - Somali study cards

Each flashcard includes:
- Front: English phrase
- Back: Target language translation
- Context metadata
- Usage notes
- Cultural notes
- Category information

---

## 🎯 Quick Start Guide

### For Learners
1. **Start here**: Read `QUICK_REFERENCE.md` for common phrases
2. **Understand contexts**: Read `CONTEXTUAL_README.md`
3. **Practice**: Use flashcards in `study_materials/`
4. **Interactive demo**: Run `python demo_contextual.py`

### For Developers
1. **System overview**: Read `README.md`
2. **Explore data**: Open `priority_contextual_phrases.json`
3. **Generate templates**: Run `python contextual_generator.py`
4. **Visualize data**: Run `python contextual_visualizer.py`
5. **Expand system**: Follow `CONTEXTUAL_EXPANSION_GUIDE.md`

### For Teachers
1. **Review system**: Read `CONTEXTUAL_SYSTEM_SUMMARY.md`
2. **Get flashcards**: Use files in `study_materials/`
3. **Create lessons**: Use `QUICK_REFERENCE.md` as teaching material
4. **Demonstrate**: Run `python demo_contextual.py` in class

---

## 📊 System Statistics

### Content
- **18 Learning Categories** (original system)
- **6 Learner Personas** (tourist, worker, professional, etc.)
- **5 Time Contexts** (morning → night)
- **13 Relationship Types** (stranger → family)
- **50+ Contextual Phrases** (with full translations)
- **9 Languages** supported

### Files
- **12 Documentation files** (README, guides, references)
- **3 Data files** (categories, phrases, examples)
- **6 Python tools** (builders, generators, visualizers)
- **4 Flashcard sets** (study materials)

---

## 🔄 Workflow Examples

### Adding New Contextual Phrases

```bash
# 1. Generate template
python contextual_generator.py

# 2. Edit priority_contextual_phrases.json
# Add translations for all languages

# 3. Regenerate flashcards
python contextual_visualizer.py

# 4. Test with demo
python demo_contextual.py
```

### Mapping Existing Translations

```bash
# 1. Run sentence mapper
python sentence_mapper.py

# 2. Review mapping_results.json
# Check categorization accuracy

# 3. Adjust keyword mappings if needed
# Edit sentence_mapper.py keyword_map

# 4. Re-run mapper
python sentence_mapper.py
```

### Building Network Graph

```bash
# 1. Build network
python network_builder.py

# 2. Check generated files:
# - network_data.json
# - web_api_data.json
# - network_visualization.png

# 3. Use in application
# Import web_api_data.json in your app
```

---

## 🌍 Language Coverage

### East African Languages
1. **Amharic** (አማርኛ) - Ethiopia
2. **Tigrinya** (ትግርኛ) - Ethiopia, Eritrea
3. **Oromo** (Afaan Oromoo) - Ethiopia
4. **Somali** (Soomaali) - Somalia, Ethiopia
5. **Swahili** (Kiswahili) - East Africa

### International Languages
6. **Arabic** (العربية) - Regional lingua franca
7. **English** - International
8. **French** (Français) - International
9. **Spanish** (Español) - International

### Additional Languages (in main system)
- Hadiyaa, Wolyitta, Afar, Gamo, Kinyarwanda, Kirundi, Luo

---

## 📈 Development Roadmap

### ✅ Completed (Phase 1)
- [x] Original priority network system
- [x] 6 personas with weighted priorities
- [x] 18 learning categories
- [x] Contextual framework (13 relationships, 5 times)
- [x] 50+ contextual phrases with translations
- [x] Generator and visualizer tools
- [x] Comprehensive documentation
- [x] Study materials (flashcards)

### 🔄 In Progress (Phase 2)
- [ ] Expand to 200+ contextual phrases
- [ ] Add audio recordings
- [ ] Create web interface
- [ ] Integrate with main app

### 📋 Planned (Phase 3)
- [ ] Video examples
- [ ] Interactive exercises
- [ ] Context detection AI
- [ ] Adaptive learning paths
- [ ] Mobile app integration

---

## 🤝 Contributing

### To Expand Contextual Phrases
1. Review `CONTEXTUAL_EXPANSION_GUIDE.md`
2. Use `contextual_generator.py` to create templates
3. Add translations for all 9 languages
4. Include usage notes and cultural notes
5. Test with native speakers
6. Submit to `priority_contextual_phrases.json`

### To Improve Tools
1. Check existing Python scripts
2. Follow coding style (docstrings, type hints)
3. Test thoroughly
4. Update documentation
5. Submit pull request

---

## 📞 Integration Points

### With Main Sound Training App
- User profile → Persona selection
- Context selection → Time/relationship
- Smart recommendations → Priority + context
- Practice mode → Contextual variations
- Progress tracking → Category + context mastery

### With External Systems
- Export flashcards → Anki, Quizlet
- API integration → Web/mobile apps
- Data export → JSON, CSV formats
- Network visualization → D3.js, Cytoscape

---

## 📚 Related Resources

### In This Repository
- Main translations: `../translations/`
- Audio files: `../audio/`
- Main application: `../main.js`, `../index.html`

### External
- NetworkX documentation: https://networkx.org/
- Language learning research
- Cultural communication guides

---

## 🏆 Key Achievements

✅ **Comprehensive Framework**: Complete contextual learning system  
✅ **Multi-Language**: 9 languages with accurate translations  
✅ **Cultural Awareness**: Usage and cultural notes for every phrase  
✅ **Developer Tools**: Generators, visualizers, mappers  
✅ **Study Materials**: Ready-to-use flashcards  
✅ **Documentation**: Extensive guides and references  
✅ **Scalable**: Easy to expand to 1000+ phrases  

---

**Last Updated**: 2026-01-03  
**Version**: 1.0  
**Status**: Active Development 🚀

For questions or contributions, see the main project README.

