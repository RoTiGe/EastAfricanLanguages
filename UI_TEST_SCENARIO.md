# UI Test Scenario: English User Wants to Learn "Hello" in Other Languages

## Test Steps:
1. Navigate to http://localhost:3000
2. Click on "English" language card
3. In the demo page, enable "Show translation in:" checkbox
4. Select "Spanish" from the translation language dropdown
5. Select "Basics & Greetings" category
6. Look for "hello" in the phrase dropdown
7. Observe what is displayed

## Expected Behavior:
User should see: **"hello — Hola"** (English word with Spanish translation)

## Current Issues Identified:

### Issue 1: **Phrase Display Logic Problem**
**Location**: `demo.js` lines 151-165

The code currently shows:
```javascript
const targetLangField = translationData.nativeLanguageField || LANGUAGE;
const targetText = phraseObj[targetLangField] || phraseObj[LANGUAGE];
```

For English language page:
- `nativeLanguageField` = "english"
- `targetText` = phraseObj["english"] = "hello" ✓ (CORRECT)

When bilingual mode is enabled with Spanish selected:
- Shows: "hello — Hola" ✓ (CORRECT)

**BUT THE ACTUAL PROBLEM IS:**

### Issue 2: **When User Clicks "Use This Phrase"**
**Location**: `demo.js` lines 186-206

When bilingual mode is ON:
```javascript
if (showBilingual) {
    const translationText = selectedOption.getAttribute('data-translation-text');
    document.getElementById('demoText').value = translationText || selectedOption.value;
}
```

**This puts the TRANSLATION (e.g., "Hola") in the text box, not the target language!**

So when an English learner wants to hear "hello" pronounced:
1. They select "hello — Hola" (showing Spanish translation)
2. Click "Use This Phrase"
3. The text box gets filled with "Hola" (the Spanish translation)
4. When they click "Speak", it speaks SPANISH, not ENGLISH!

This is backwards! The user is on the ENGLISH learning page, they should hear ENGLISH pronunciation, not the translation!

### Issue 3: **Confusing UX Flow**
The translation feature is meant to help users understand what the word means in their native language, but:
- It should NOT change which language is being spoken
- The TTS should always speak the target learning language (English in this case)
- The translation is just a visual aid for understanding

## Recommended Fixes:

### Fix 1: Always speak the target language, not the translation
```javascript
function useSelectedPhrase() {
    const phraseSelect = document.getElementById('phraseSelect');
    const selectedOption = phraseSelect.options[phraseSelect.selectedIndex];
    
    if (selectedOption && selectedOption.value) {
        // ALWAYS use the original value (target language), never the translation
        document.getElementById('demoText').value = selectedOption.value;
        speak();
    }
}
```

### Fix 2: Clarify the UI
The checkbox should say something like:
- "Show translations for understanding" 
- or "Show meaning in your language"

This makes it clear that translations are just for comprehension, not for changing what gets spoken.

### Fix 3: Consider adding a separate "Listen to translation" button
If users want to hear both languages, add a second button:
- "Speak [Target Language]" - always speaks the learning language
- "Speak Translation" - speaks the translation (optional feature)

## Test Data:
**Phrase object for "hello" in basics category:**
```json
{
  "english": "hello",
  "spanish": "Hola",
  "french": "Bonjour",
  "amharic": "ሀሎ",
  "tigrinya": "ሰላም",
  "oromo": "Akkam",
  "somali": "hello",
  "arabic": "hello",
  "hadiya": "hello",
  "wolayita": "hello",
  "afar": "hello",
  "gamo": "hello",
  "swahili": "Habari",
  "kinyarwanda": "Muraho",
  "kirundi": "Amahoro",
  "luo": "Misawa"
}
```

When on `/demo/english` with Spanish translation enabled:
- Dropdown should show: "hello — Hola"
- Text box should be filled with: "hello"
- TTS should speak: "hello" in English
- The "Hola" is just a visual aid for Spanish speakers to understand the meaning
