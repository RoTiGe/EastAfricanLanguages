# Batch 2 Testing Guide - UI & Data Consistency

## 🚀 Quick Start

Make sure both services are running:

**Terminal 1:**
```powershell
python tts_service.py
```

**Terminal 2:**
```powershell
npm start
```

---

## 🧪 Test Suite

### Test 1: Field Name Consistency (Issue #3) ✅

**What we're testing:** All translation JSONs now use consistent field names

**Steps:**
1. Go to http://localhost:3000/demo/spanish
2. Enable "Show meaning in another language (visual aid only):"
3. Select "Hadiyaa" from dropdown
4. Select Category: "Basics & Greetings"
5. Look at the phrase dropdown

**Expected Result:**
- ✅ Phrases show both Spanish and Hadiyaa text
- ✅ Example: "Hola — [Hadiyaa translation]"
- ✅ NO "undefined" values

**Repeat for:**
- Wolyitta language
- Any other language combination

**Before the fix:** Would show "undefined" because field names didn't match ❌

---

### Test 2: Improved Translation Label (Issue #7) ✅

**What we're testing:** UI label is now clearer about translation purpose

**Steps:**
1. Go to any demo page (e.g., http://localhost:3000/demo/amharic)
2. Look at the translation checkbox label

**Expected Result:**
- ✅ Label says: "Show meaning in another language (visual aid only):"
- ✅ Makes it clear translation is NOT for changing TTS
- ✅ Emphasizes it's a visual aid for understanding

**Before the fix:** Said "Show translation in:" (ambiguous) ❌

---

### Test 3: Current Language Filtered (Issue #10) ✅

**What we're testing:** Translation dropdown excludes current page language

**Test 3a - Spanish Page:**
1. Go to http://localhost:3000/demo/spanish
2. Enable translation checkbox
3. Click the translation language dropdown
4. Count the options

**Expected Result:**
- ✅ Dropdown has 15 options (not 16)
- ✅ Spanish is NOT in the list
- ✅ All other 15 languages are present

**Test 3b - Amharic Page:**
1. Go to http://localhost:3000/demo/amharic
2. Enable translation checkbox
3. Check dropdown

**Expected Result:**
- ✅ Amharic is NOT in the list
- ✅ Spanish IS in the list (since we're on Amharic page)

**Before the fix:** All 16 languages shown (redundant) ❌

---

### Test 4: Loading States (Issue #9) ✅

**Test 4a - Page Load:**
1. Open DevTools (F12) → Network tab → Throttle to "Slow 3G"
2. Go to http://localhost:3000/demo/french
3. Watch the category dropdown

**Expected Result:**
- ✅ Initially shows: "⏳ Loading categories..."
- ✅ Dropdown is disabled during loading
- ✅ After loading: Shows "-- Choose a category --"
- ✅ Dropdown becomes enabled

**Test 4b - Category Selection:**
1. Stay on the same page (with Slow 3G throttling)
2. Select a category (e.g., "Basics & Greetings")
3. Watch both dropdowns

**Expected Result:**
- ✅ Category dropdown becomes disabled
- ✅ Phrase dropdown shows: "⏳ Loading phrases..."
- ✅ After loading: Phrases appear
- ✅ Category dropdown re-enables

**Test 4c - Speech Generation:**
1. Remove network throttling (set to "No throttling")
2. Type: "Bonjour"
3. Click "Speak" button
4. Watch the button

**Expected Result:**
- ✅ Button shows spinner: "⏳ Generating..."
- ✅ Button is disabled during generation
- ✅ After completion: Button returns to "🔊 Speak"
- ✅ Button becomes enabled again

**Test 4d - Error State:**
1. Stop the Python TTS service (Ctrl+C in Terminal 1)
2. Try to generate speech
3. Watch the status message

**Expected Result:**
- ✅ Shows: "❌ Error: [error message]"
- ✅ Button returns to normal state
- ✅ Clear error indicator

**Before the fix:** No loading feedback, users confused ❌

---

## 🎯 Comprehensive Smoke Test (10 minutes)

Run through all improvements quickly:

1. ✅ **Page Load**
   - Go to http://localhost:3000/demo/spanish
   - See loading spinner for categories
   - Categories load successfully

2. ✅ **Translation Label**
   - Check label says "visual aid only"
   - Clear and unambiguous

3. ✅ **Filtered Dropdown**
   - Enable translation
   - Spanish NOT in dropdown
   - 15 other languages present

4. ✅ **Category Loading**
   - Select "Basics & Greetings"
   - See loading spinner
   - Phrases load

5. ✅ **Field Names Work**
   - Select "Hadiyaa" translation
   - See Hadiyaa text (not "undefined")

6. ✅ **Speech Loading**
   - Type text
   - Click Speak
   - See button spinner
   - Audio plays

7. ✅ **Try Different Language**
   - Go to http://localhost:3000/demo/amharic
   - Repeat steps 1-6
   - Everything works

---

## 🐛 Known Non-Issues

These are expected:
- First category load might be slow (file I/O)
- First TTS generation slow (model loading)
- IDE warnings about unused `req` (normal in Express)

---

## ✅ Success Criteria

All tests pass if:
- [x] No "undefined" in translations
- [x] Translation label is clear
- [x] Current language excluded from dropdown
- [x] Loading spinners appear everywhere
- [x] Buttons disable during operations
- [x] Error states show clearly
- [x] Everything re-enables after completion

---

## 🆘 Troubleshooting

**Problem:** Still seeing "undefined" in translations
**Solution:** Make sure you ran the field name fix (check BATCH_2_FIXES.md)

**Problem:** Loading states don't appear
**Solution:** Clear browser cache (Ctrl+Shift+R)

**Problem:** Dropdown still shows current language
**Solution:** Check that server.js passes `languages` and `languageNames` to template

---

## 📸 Visual Checklist

**Translation Label Should Say:**
```
☑ Show meaning in another language (visual aid only):
```

**Loading States Should Show:**
```
⏳ Loading categories...
⏳ Loading phrases...
⏳ Generating...
```

**Error States Should Show:**
```
❌ Error loading categories
❌ Error loading phrases
❌ Error: [message]
```

---

**Ready to test? Start with Test 1 (field name consistency)!**

