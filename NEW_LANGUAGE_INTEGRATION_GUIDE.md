# New Language Integration Checklist

This checklist outlines all steps needed when adding a new `*_translations.js` file to the Language Bridge platform.

## Automated Method (Recommended)

Use the PowerShell automation script:

```powershell
.\integrate_new_language.ps1 -LanguageFile "translations/chinese_translations.js" -NativeName "中文 (Chinese)"
```

The script will automatically handle steps 1-4 below and provide guidance for manual steps.

---

## Manual Method (Step-by-Step)

### 1. Add Language to config.js

**File:** `config.js`

**Actions:**
- [ ] Add language code to `LANGUAGES` array (e.g., `'chinese'`)
- [ ] Add native name to `LANGUAGE_NAMES` object (e.g., `'chinese': '中文 (Chinese)'`)

**Example:**
```javascript
const LANGUAGES = [
    'english',
    'spanish',
    // ... other languages ...
    'chinese',  // ← Add here
    'luo'
];

const LANGUAGE_NAMES = {
    'english': 'English',
    // ... other languages ...
    'chinese': '中文 (Chinese)',  // ← Add here
    'luo': 'Dholuo (Luo)'
};
```

---

### 2. Add Category Name Translations

**File:** `build_comprehensive_json.py`

**Actions:**
- [ ] Add category name translations for the new language in the `category_names` dictionary
- [ ] Include translations for all categories: basics, family, people, body, clothing, colors, numbers, emotions, school, toys, house, food, animals, nature, time, seasons, transport, places

**Example:**
```python
'basics': {
    'spanish': 'Básicos & Saludos',
    'french': 'Bases & Salutations',
    # ... other languages ...
    'chinese': '基础 & 问候',  # ← Add here
},
'family': {
    'spanish': 'Familia',
    # ... other languages ...
    'chinese': '家庭',  # ← Add here
},
# ... repeat for all categories ...
```

---

### 3. Run Conversion Scripts

**Actions:**
- [ ] Run `python build_comprehensive_json.py` to generate the `.json` file
- [ ] Run `node merge_translations.js` (optional, for verification)
- [ ] Verify `translations/<language>.json` was created successfully

**Commands:**
```powershell
python build_comprehensive_json.py
node merge_translations.js
```

**Expected Output:**
```
✓ Created ./translations/chinese.json with 34 categories, 286 phrases
```

---

### 4. Add to Geographic Language Map

**File:** `views/index.ejs`

**Actions:**
- [ ] Add a button with appropriate positioning based on geographic location
- [ ] Choose color scheme based on region (blue=Europe, green=Arabic, yellow=Horn of Africa, cyan=Southern Ethiopia, red=East Africa)
- [ ] Select an appropriate Bootstrap icon

**Geographic Guidelines:**
- **European languages** → North: `top: 5-10%`, `left: 10-50%`, color: `btn-primary` (blue)
- **Middle Eastern/Asian** → East-Center: `top: 25-30%`, `left: 65-75%`, color: `btn-success` (green)
- **Horn of Africa** → Center-East: `top: 30-45%`, `left: 50-70%`, color: `btn-warning` (yellow)
- **Southern Ethiopian** → Center-South: `top: 55-65%`, `left: 45-60%`, color: `btn-info` (cyan)
- **East African** → South: `top: 68-80%`, `left: 28-50%`, color: `btn-danger` (red)

**Example:**
```html
<!-- For Chinese (Asian language, East position) -->
<div class="position-absolute" style="top: 20%; left: 78%;">
    <a href="/demo/chinese" class="btn btn-success btn-lg shadow-sm mb-2">
        <i class="bi bi-yin-yang me-2"></i>中文
    </a>
</div>
```

---

### 5. Verify TTS Support

**File:** `tts_service.py`

**Actions:**
- [ ] Check if gTTS supports the language code
- [ ] Test TTS generation: `http://localhost:3000/demo/<language>`
- [ ] If not supported by gTTS, add custom handling (like pyttsx3 for Oromo)

**Test:**
1. Start services: `.\start.ps1`
2. Navigate to `http://localhost:3000/demo/<language>`
3. Try playing audio for a few phrases
4. Verify pronunciation sounds correct

---

### 6. Update Documentation

**Files to Update:**
- [ ] `README.md` - Update language count (e.g., "17+ languages" → "18+ languages")
- [ ] `views/index.ejs` - Update "Languages positioned by geographic region" subtitle if needed
- [ ] `views/about.ejs` - Update language count in "What We Offer" section
- [ ] `views/donate.ejs` - Update impact metrics

**Example:**
```markdown
# README.md
- 18+ languages including English, Spanish, French, Italian, **Chinese**, Amharic, ...
```

---

### 7. Test Integration

**Testing Checklist:**
- [ ] Language appears in dropdown on homepage
- [ ] Language appears in Translation Mode
- [ ] Audio playback works
- [ ] Category names display correctly in native language
- [ ] All phrases are accessible
- [ ] Geographic map button works and navigates correctly

**Test URLs:**
```
http://localhost:3000/                    # Check dropdown
http://localhost:3000/translate           # Check Translation Mode
http://localhost:3000/demo/<language>     # Check learning mode
```

---

### 8. Git Commit

**Actions:**
- [ ] Review all changed files
- [ ] Commit with descriptive message
- [ ] Push to repository

**Example:**
```powershell
git add config.js build_comprehensive_json.py views/index.ejs translations/<language>*
git commit -m "Add <Language> language support with TTS integration"
git push origin main
```

---

## Translation File Format Reference

Your `*_translations.js` file should follow this structure:

```javascript
const translations = {
  "english_phrase": { 
    "language_field": "translation", 
    "phonetic": "pronunciation", 
    "category": "category_name" 
  },
  // ... more phrases ...
};

// UI translations (required for JSON generation)
const ui = {
  "pageTitle": "Language Name Learning",
  "selectCategory": "Select Category",
  // ... other UI strings ...
};

module.exports = { translations, ui };
```

---

## Troubleshooting

### Issue: JSON file not generated
**Cause:** Missing UI translations in `*_translations.js`  
**Solution:** Add the `ui` object with required strings (see reference above)

### Issue: 0 entries loaded
**Cause:** Translation pattern doesn't match the regex in `build_comprehensive_json.py`  
**Solution:** Ensure each translation entry follows the exact format with `"phonetic"` and `"category"` fields

### Issue: Language not appearing in dropdown
**Cause:** Server not restarted after `config.js` changes  
**Solution:** Restart with `.\start.ps1` or manually restart Node.js

### Issue: Audio not playing
**Cause:** Language code not supported by gTTS  
**Solution:** Add custom TTS handling in `tts_service.py` (see Oromo example)

---

## Quick Reference: All Files Modified

1. ✅ `translations/<language>_translations.js` (provided by contributor)
2. ✅ `config.js` (add language code and name)
3. ✅ `build_comprehensive_json.py` (add category translations)
4. ✅ `views/index.ejs` (add to geographic map)
5. 📄 `README.md` (update language count)
6. 📄 `views/about.ejs` (update metrics)
7. 📄 `views/donate.ejs` (update impact stats)
8. 🔧 `tts_service.py` (if TTS customization needed)

---

## Automation Tools

- **PowerShell Script:** `integrate_new_language.ps1` - Automates steps 1-4
- **Python Script:** `build_comprehensive_json.py` - Auto-discovers all `*_translations.js` files
- **Node Script:** `merge_translations.js` - Alternative conversion method

**Note:** Auto-discovery means you only need to drop a `*_translations.js` file in the `translations/` folder and run the scripts - they will automatically detect it!
