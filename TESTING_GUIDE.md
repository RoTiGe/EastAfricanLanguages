# Testing Guide - Batch 1 Critical Fixes

## 🚀 How to Test the Fixes

### Prerequisites
1. Stop any running servers
2. Make sure you have the latest code

### Step 1: Start the Services

**Terminal 1 - Python TTS Service:**
```powershell
python tts_service.py
```
Expected output:
```
==================================================
TTS Service Ready!
Running on port: 5000
Supported languages: spanish, french, amharic, ...
Max text length: 5000 characters
==================================================
```

**Terminal 2 - Express Server:**
```powershell
npm start
```
Expected output:
```
==================================================
🚀 Express Server running on http://localhost:3000
🎤 Make sure Python TTS service is running on port 5000
==================================================
```

---

## 🧪 Test Cases

### Test 1: Critical Bug Fix - Correct Language TTS ✅

**What we're testing:** Issue #1 - TTS should always use target language, not translation language

**Steps:**
1. Open http://localhost:3000
2. Click on "Español (Spanish)" card
3. Enable "Show translation in:" checkbox
4. Select "English" from the dropdown
5. Select Category: "Basics & Greetings"
6. Select Phrase: "Hola — Hello" (shows both Spanish and English)
7. Click "Use This Phrase"

**Expected Result:**
- ✅ Text box shows: "Hola"
- ✅ Audio plays in SPANISH (not English)
- ✅ You hear "Hola" spoken in Spanish

**Before the fix:** Would incorrectly speak "Hello" in English ❌

---

### Test 2: Content-Type Fix - MP3 Playback ✅

**What we're testing:** Issue #2 - MP3 files should have correct Content-Type

**Steps:**
1. Go to http://localhost:3000/demo/spanish
2. Type: "Hola mundo"
3. Click "Speak"
4. Open browser DevTools (F12) → Network tab
5. Look at the `/api/speak` request

**Expected Result:**
- ✅ Response Header: `Content-Type: audio/mpeg`
- ✅ Audio plays successfully
- ✅ No console errors

---

### Test 3: Content-Type Fix - WAV Playback ✅

**What we're testing:** Issue #2 - WAV files should have correct Content-Type

**Steps:**
1. Go to http://localhost:3000/demo/oromo (uses pyttsx3 → WAV)
2. Type: "Nagaa"
3. Click "Speak"
4. Check Network tab in DevTools

**Expected Result:**
- ✅ Response Header: `Content-Type: audio/wav`
- ✅ Audio plays successfully

---

### Test 4: Input Validation ✅

**What we're testing:** Issue #13 - Text validation

**Test 4a - Empty Text:**
1. Go to any demo page
2. Leave text box empty
3. Click "Speak"

**Expected:** Error message: "Please enter some text"

**Test 4b - Very Long Text:**
1. Paste 6000+ characters
2. Click "Speak"

**Expected:** Error message about exceeding max length

---

### Test 5: Config Centralization ✅

**What we're testing:** Issue #4 - All pages use same language list

**Steps:**
1. Check home page: http://localhost:3000
2. Count language cards (should be 16)
3. Check Quick Test dropdown (should have 16 options)
4. Visit any demo page
5. Check translation dropdown (should have 15 options - current language excluded)

**Expected Result:**
- ✅ All pages show same 16 languages
- ✅ No missing or duplicate languages

---

### Test 6: No Console Spam ✅

**What we're testing:** Issue #11 - Reduced logging

**Steps:**
1. Open DevTools Console (F12)
2. Go to http://localhost:3000/demo/spanish
3. Select a category and phrase
4. Click "Use This Phrase"

**Expected Result:**
- ✅ Console is clean (no excessive logs)
- ✅ Only error logs if something fails
- ✅ No "=== SPEAK FUNCTION ===" or similar debug logs

**Before the fix:** 30+ console.log statements ❌

---

## 🎯 Quick Smoke Test (5 minutes)

Run through these quickly to verify everything works:

1. ✅ Home page loads
2. ✅ Click any language card → demo page loads
3. ✅ Type text → Click Speak → Audio plays
4. ✅ Select category → phrases load
5. ✅ Enable translation → see bilingual phrases
6. ✅ Use phrase → correct language speaks
7. ✅ Try 3 different languages (Spanish, Amharic, Oromo)

---

## 🐛 Known Non-Issues

These are expected and NOT bugs:

- **IDE warnings about unused `req` parameter:** Normal in Express routes
- **Python type hints "partially unknown":** Expected for gtts/pyttsx3 libraries
- **First TTS generation slow:** Model loading (normal)

---

## ✅ Success Criteria

All tests pass if:
- [x] Translation feature doesn't change TTS language
- [x] Both MP3 and WAV files play correctly
- [x] Input validation works
- [x] All 16 languages accessible
- [x] Console is clean
- [x] No errors in browser console
- [x] No errors in server logs

---

## 🆘 Troubleshooting

**Problem:** "TTS service not available"
**Solution:** Make sure Python service is running on port 5000

**Problem:** Audio doesn't play
**Solution:** Check browser console for errors, verify Content-Type header

**Problem:** Phrases don't load
**Solution:** Check translation JSON files exist in `/translations/` folder

---

**Ready to test? Start with Test 1 (the critical bug fix)!**

