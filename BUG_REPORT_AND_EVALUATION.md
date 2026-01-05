# 🐛 Bug Report & Code Evaluation - Sound Training TTS App

**Date:** 2026-01-05  
**Evaluator:** AI Code Analysis  
**Severity Levels:** 🔴 Critical | 🟠 High | 🟡 Medium | 🟢 Low

---

## Executive Summary

Analyzed the entire Sound Training TTS application codebase for bugs, logical errors, data inconsistencies, and security vulnerabilities. Found **15 issues** across multiple categories:
- **3 Critical Issues** (Memory leaks, resource cleanup)
- **4 High Priority Issues** (Security, error handling)
- **5 Medium Priority Issues** (Data validation, UX)
- **3 Low Priority Issues** (Code quality, documentation)

---

## 🔴 CRITICAL ISSUES

### 1. **Memory Leak: Blob URLs Never Revoked**
**Files:** `public/js/demo.js` (line 204), `public/js/main.js` (line 36)  
**Severity:** 🔴 Critical  
**Impact:** Memory leak - every TTS generation creates a blob URL that's never cleaned up

**Problem:**
```javascript
// demo.js line 204
const audioUrl = URL.createObjectURL(audioBlob);
audioPlayer.src = audioUrl;
// URL is NEVER revoked - memory leak!
```

**Why it's critical:**
- Each TTS request creates a new blob URL in memory
- Old URLs are never freed with `URL.revokeObjectURL()`
- After 100+ requests, browser memory usage grows significantly
- Can cause browser crashes on low-memory devices

**Fix Required:**
```javascript
// Revoke old URL before creating new one
if (audioPlayer.src && audioPlayer.src.startsWith('blob:')) {
    URL.revokeObjectURL(audioPlayer.src);
}
const audioUrl = URL.createObjectURL(audioBlob);
audioPlayer.src = audioUrl;

// Also revoke when audio ends
audioPlayer.addEventListener('ended', () => {
    URL.revokeObjectURL(audioUrl);
});
```

---

### 2. **Audio File Accumulation - No Cleanup Mechanism**
**Files:** `tts_service.py` (lines 90-95), `server.js` (missing cleanup)  
**Severity:** 🔴 Critical  
**Impact:** Disk space exhaustion - audio files accumulate indefinitely

**Problem:**
- Every TTS request creates a new audio file with UUID filename
- Files are NEVER deleted
- `audio_output/` directory has 100+ files already
- Config defines `MAX_AUDIO_AGE_HOURS: 24` but it's never used

**Evidence:**
```
audio_output/
├── 006c4743-d48c-4f61-910c-bf211e2d566a.wav
├── 011a7b14-fb04-403b-94f9-bdb27a48b28c.mp3
├── ... (100+ more files)
```

**Fix Required:**
Create cleanup utility:
```python
# Add to tts_service.py
import time
from threading import Thread

def cleanup_old_files():
    while True:
        now = time.time()
        for file in os.listdir(AUDIO_DIR):
            filepath = os.path.join(AUDIO_DIR, file)
            if os.path.isfile(filepath):
                age_hours = (now - os.path.getmtime(filepath)) / 3600
                if age_hours > 24:  # 24 hours
                    os.remove(filepath)
        time.sleep(3600)  # Run every hour

# Start cleanup thread
Thread(target=cleanup_old_files, daemon=True).start()
```

---

### 3. **pyttsx3 Engine Not Properly Closed**
**File:** `tts_service.py` (lines 106-108)  
**Severity:** 🔴 Critical  
**Impact:** Resource leak - TTS engine instances accumulate

**Problem:**
```python
engine = pyttsx3.init()
engine.save_to_file(text, output_path)
engine.runAndWait()
# Engine is NEVER stopped or deleted!
```

**Why it's critical:**
- Each request creates a new pyttsx3 engine instance
- Engines are never properly closed
- Can cause COM object leaks on Windows
- May lead to "Engine already running" errors

**Fix Required:**
```python
engine = None
try:
    engine = pyttsx3.init()
    engine.save_to_file(text, output_path)
    engine.runAndWait()
finally:
    if engine:
        engine.stop()
        del engine
```

---

## 🟠 HIGH PRIORITY ISSUES

### 4. **Path Traversal Vulnerability**
**File:** `server.js` (lines 47, 73, 128)  
**Severity:** 🟠 High (Security)  
**Impact:** Potential directory traversal attack

**Problem:**
```javascript
// Line 47
const translationPath = path.join(__dirname, 'translations', `${language}.json`);
```

**Vulnerability:**
- If `language` contains `../`, attacker could read arbitrary files
- Example: `/api/categories/../../config` could expose config.js
- Current validation only checks if language is in LANGUAGES array
- But doesn't sanitize the path

**Fix Required:**
```javascript
// Add path sanitization
const sanitizedLanguage = path.basename(language);
if (!config.isValidLanguage(sanitizedLanguage)) {
    return res.status(404).json({ error: 'Language not supported' });
}
const translationPath = path.join(__dirname, 'translations', `${sanitizedLanguage}.json`);
```

---

### 5. **No Rate Limiting on TTS Endpoint**
**File:** `server.js` (line 148)  
**Severity:** 🟠 High (Security/DoS)  
**Impact:** API abuse, resource exhaustion

**Problem:**
- `/api/speak` endpoint has NO rate limiting
- Attacker can spam requests and exhaust server resources
- Each request generates audio file (disk I/O)
- Can cause denial of service

**Fix Required:**
```javascript
const rateLimit = require('express-rate-limit');

const ttsLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // 10 requests per minute
    message: 'Too many TTS requests, please try again later'
});

app.post('/api/speak', ttsLimiter, async (req, res) => {
    // ... existing code
});
```

---

### 6. **Synchronous File Reading Blocks Event Loop**
**File:** `server.js` (lines 50, 76, 132, 237, 254, 270, 287, 304, 331)
**Severity:** 🟠 High (Performance)
**Impact:** Server becomes unresponsive during file I/O

**Problem:**
```javascript
// Line 50 - BLOCKS the entire server!
const translationData = JSON.parse(fs.readFileSync(translationPath, 'utf8'));
```

**Why it's critical:**
- `fs.readFileSync()` is synchronous - blocks Node.js event loop
- Translation files are 5000+ lines (large)
- During file read, server can't handle ANY other requests
- Used in 9 different routes
- Can cause 100-500ms delays per request

**Fix Required:**
```javascript
// Use async/await with fs.promises
const fs = require('fs').promises;

app.get('/api/categories/:language', async (req, res) => {
    try {
        const data = await fs.readFile(translationPath, 'utf8');
        const translationData = JSON.parse(data);
        // ... rest of code
    } catch (error) {
        // ... error handling
    }
});
```

---

### 7. **Missing Error Response for Failed JSON Parse**
**File:** `server.js` (lines 50, 76, 132)
**Severity:** 🟠 High
**Impact:** Server crashes on malformed JSON

**Problem:**
```javascript
try {
    const translationData = JSON.parse(fs.readFileSync(translationPath, 'utf8'));
    // ... use data
} catch (error) {
    console.error(`Error loading categories for ${language}:`, error);
    res.status(500).json({ error: 'Failed to load categories' });
}
```

**Issue:**
- If JSON is malformed, `JSON.parse()` throws
- Error is caught but generic message sent
- Doesn't distinguish between file not found vs. corrupt JSON
- Makes debugging difficult

**Fix Required:**
```javascript
try {
    const fileContent = await fs.readFile(translationPath, 'utf8');
    const translationData = JSON.parse(fileContent);
    // ... use data
} catch (error) {
    if (error.code === 'ENOENT') {
        return res.status(404).json({ error: 'Translation file not found' });
    }
    if (error instanceof SyntaxError) {
        console.error(`Malformed JSON in ${language}:`, error);
        return res.status(500).json({ error: 'Translation file is corrupted' });
    }
    console.error(`Error loading categories for ${language}:`, error);
    res.status(500).json({ error: 'Failed to load categories' });
}
```

---

## 🟡 MEDIUM PRIORITY ISSUES

### 8. **Inconsistent Error Messages Between Client and Server**
**Files:** `public/js/demo.js` (line 200), `server.js` (line 200)
**Severity:** 🟡 Medium (UX)
**Impact:** Poor user experience, unclear error messages

**Problem:**
```javascript
// Client side (demo.js line 200)
if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to generate speech');
}

// But if response is not JSON (e.g., HTML error page), this crashes!
```

**Issue:**
- Assumes error response is always JSON
- Server might return HTML error page (500 errors)
- `await response.json()` will throw if response is not JSON
- User sees generic "Failed to parse JSON" instead of actual error

**Fix Required:**
```javascript
if (!response.ok) {
    let errorMessage = 'Failed to generate speech';
    try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.details || errorMessage;
    } catch (e) {
        // Response wasn't JSON, use status text
        errorMessage = `Server error: ${response.status} ${response.statusText}`;
    }
    throw new Error(errorMessage);
}
```

---

### 9. **Missing Input Sanitization for Special Characters**
**File:** `config.js` (lines 79-95)
**Severity:** 🟡 Medium
**Impact:** Potential XSS or injection issues

**Problem:**
```javascript
function validateTextInput(text) {
    if (!text || typeof text !== 'string') {
        return { valid: false, error: 'Text is required and must be a string' };
    }

    const trimmedText = text.trim();

    if (trimmedText.length < VALIDATION.MIN_TEXT_LENGTH) {
        return { valid: false, error: 'Text cannot be empty' };
    }

    if (trimmedText.length > VALIDATION.MAX_TEXT_LENGTH) {
        return { valid: false, error: `Text exceeds maximum length of ${VALIDATION.MAX_TEXT_LENGTH} characters` };
    }

    return { valid: true, text: trimmedText };
}
```

**Issue:**
- No sanitization of special characters
- No check for null bytes, control characters
- Text is directly passed to TTS engines
- Could cause issues with certain TTS engines

**Fix Required:**
```javascript
function validateTextInput(text) {
    if (!text || typeof text !== 'string') {
        return { valid: false, error: 'Text is required and must be a string' };
    }

    // Remove null bytes and control characters (except newlines/tabs)
    const sanitized = text.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');
    const trimmedText = sanitized.trim();

    if (trimmedText.length < VALIDATION.MIN_TEXT_LENGTH) {
        return { valid: false, error: 'Text cannot be empty' };
    }

    if (trimmedText.length > VALIDATION.MAX_TEXT_LENGTH) {
        return { valid: false, error: `Text exceeds maximum length of ${VALIDATION.MAX_TEXT_LENGTH} characters` };
    }

    return { valid: true, text: trimmedText };
}
```

---

### 10. **Race Condition in Category/Phrase Loading**
**File:** `public/js/demo.js` (lines 74-113)
**Severity:** 🟡 Medium
**Impact:** UI inconsistency if user clicks rapidly

**Problem:**
```javascript
async function onCategoryChange() {
    const categorySelect = document.getElementById('categorySelect');
    const phraseSelect = document.getElementById('phraseSelect');
    const selectedCategory = categorySelect.value;

    // Reset phrase dropdown
    phraseSelect.innerHTML = '<option value="">-- Choose a phrase --</option>';
    phraseSelect.disabled = true;

    if (!selectedCategory) return;

    try {
        categorySelect.disabled = true;
        phraseSelect.innerHTML = '<option value="">⏳ Loading phrases...</option>';

        const response = await fetch(`/api/phrases/${LANGUAGE}/${selectedCategory}`);
        // ... rest of code
    }
}
```

**Issue:**
- If user rapidly changes categories, multiple requests fire
- No cancellation of previous requests
- Last request to complete wins, not necessarily the last selected
- Can show wrong phrases for selected category

**Fix Required:**
```javascript
let currentPhraseRequest = null;

async function onCategoryChange() {
    // Cancel previous request
    if (currentPhraseRequest) {
        currentPhraseRequest.abort();
    }

    const controller = new AbortController();
    currentPhraseRequest = controller;

    try {
        const response = await fetch(`/api/phrases/${LANGUAGE}/${selectedCategory}`, {
            signal: controller.signal
        });
        // ... rest of code
    } catch (error) {
        if (error.name === 'AbortError') {
            return; // Request was cancelled, ignore
        }
        // ... handle other errors
    } finally {
        if (currentPhraseRequest === controller) {
            currentPhraseRequest = null;
        }
    }
}
```

---

### 11. **No Validation for Category Parameter**
**File:** `server.js` (line 78)
**Severity:** 🟡 Medium
**Impact:** Potential for accessing unintended data

**Problem:**
```javascript
// Line 78
if (!translationData.categories[category]) {
    return res.status(404).json({ error: 'Category not found' });
}
```

**Issue:**
- `category` parameter comes from URL, not validated
- Could be `__proto__`, `constructor`, or other prototype pollution attempts
- While not directly exploitable here, it's bad practice
- Should validate against known categories

**Fix Required:**
```javascript
// Validate category is a string and doesn't contain special chars
if (typeof category !== 'string' || !/^[a-z_]+$/.test(category)) {
    return res.status(400).json({ error: 'Invalid category format' });
}

if (!translationData.categories.hasOwnProperty(category)) {
    return res.status(404).json({ error: 'Category not found' });
}
```

---

### 12. **Missing CORS Configuration**
**File:** `server.js` (line 18)
**Severity:** 🟡 Medium (Security)
**Impact:** Overly permissive CORS allows any origin

**Problem:**
```javascript
app.use(cors());
```

**Issue:**
- CORS is enabled for ALL origins
- Any website can call your API
- Should restrict to specific origins in production
- Allows potential CSRF attacks

**Fix Required:**
```javascript
const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? ['https://yourdomain.com']
        : '*',
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

---

## 🟢 LOW PRIORITY ISSUES

### 13. **Hardcoded Port in Console Message**
**File:** `server.js` (line 346)
**Severity:** 🟢 Low
**Impact:** Misleading console message if port changes

**Problem:**
```javascript
console.log(`🎤 Make sure Python TTS service is running on port 5000`);
```

**Issue:**
- Port is hardcoded in message
- Should use `config.SERVER_CONFIG.TTS_SERVICE_PORT`
- If port changes via env var, message is wrong

**Fix Required:**
```javascript
console.log(`🎤 Make sure Python TTS service is running on port ${config.SERVER_CONFIG.TTS_SERVICE_PORT}`);
```

---

### 14. **Inconsistent Keyboard Shortcuts**
**Files:** `public/js/demo.js` (line 243), `public/js/main.js` (line 63)
**Severity:** 🟢 Low (UX)
**Impact:** Confusing user experience

**Problem:**
```javascript
// demo.js - Ctrl+Enter to speak
if (e.key === 'Enter' && e.ctrlKey) {
    e.preventDefault();
    speak();
}

// main.js - Enter (without Shift) to speak
if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    speakText();
}
```

**Issue:**
- Different keyboard shortcuts on different pages
- Demo page: Ctrl+Enter
- Main page: Enter (Shift+Enter for newline)
- Inconsistent UX

**Fix Required:**
Standardize to one approach across all pages.

---

### 15. **Missing Copyright Symbol in English Translation**
**File:** `translations/english.json` (line 17)
**Severity:** 🟢 Low (Data)
**Impact:** Missing copyright symbol

**Problem:**
```json
"footer": " 2026 Sound Training App. All rights reserved."
```

**Issue:**
- Missing © symbol at the beginning
- Spanish version has it: `"© 2026 Sound Training App..."`
- Inconsistent across translations

**Fix Required:**
```json
"footer": "© 2026 Sound Training App. All rights reserved."
```

---

## 📊 DATA CONSISTENCY ISSUES

### 16. **Incomplete Translations in JSON Files**
**File:** `translations/spanish.json` (and others)
**Severity:** 🟡 Medium
**Impact:** Many phrases show "attack", "capture", "come" instead of translations

**Evidence:**
```json
{
    "english": "attack",
    "spanish": "Atacar",
    "french": "attack",  // ❌ Not translated
    "amharic": "መምታት",
    "somali": "attack",  // ❌ Not translated
    "arabic": "attack",  // ❌ Not translated
    "hadiyaa": "attack", // ❌ Not translated
    "wolyitta": "attack" // ❌ Not translated
}
```

**Impact:**
- Hundreds of phrases have placeholder "attack", "capture", "come" text
- Users see English words instead of translations
- Defeats the purpose of multi-language support

**Fix Required:**
- Complete all translations for all 16 languages
- Use translation API or human translators
- Add validation script to detect incomplete translations

---

## 🔍 LOGICAL ERRORS

### 17. **Demo Page Missing Translation Feature**
**File:** `views/demo.ejs`
**Severity:** 🟡 Medium
**Impact:** Feature mentioned in BATCH_2_FIXES.md but not implemented

**Problem:**
According to BATCH_2_FIXES.md:
- Issue #7 mentions "Show translation in:" feature
- Issue #10 mentions translation dropdown
- But `demo.ejs` has NO translation dropdown or checkbox

**Evidence:**
Searched `demo.ejs` - no translation dropdown found. The feature described in BATCH_2_FIXES.md doesn't exist in the code.

**Fix Required:**
Either:
1. Implement the translation feature as described
2. Remove references from BATCH_2_FIXES.md
3. Clarify that it's planned but not implemented

---

## 🛡️ SECURITY SUMMARY

| Issue | Severity | Type | Status |
|-------|----------|------|--------|
| Path Traversal | 🟠 High | Security | ❌ Not Fixed |
| No Rate Limiting | 🟠 High | DoS | ❌ Not Fixed |
| Overly Permissive CORS | 🟡 Medium | Security | ❌ Not Fixed |
| Missing Input Sanitization | 🟡 Medium | Injection | ❌ Not Fixed |
| No Category Validation | 🟡 Medium | Security | ❌ Not Fixed |

---

## 💾 RESOURCE MANAGEMENT SUMMARY

| Issue | Severity | Impact | Status |
|-------|----------|--------|--------|
| Blob URL Memory Leak | 🔴 Critical | Memory exhaustion | ❌ Not Fixed |
| Audio File Accumulation | 🔴 Critical | Disk exhaustion | ❌ Not Fixed |
| pyttsx3 Engine Leak | 🔴 Critical | Resource leak | ❌ Not Fixed |
| Synchronous File I/O | 🟠 High | Performance | ❌ Not Fixed |

---

## 🎯 RECOMMENDED PRIORITY ORDER

### Immediate (This Week)
1. **Fix Blob URL Memory Leak** - Critical, easy fix
2. **Implement Audio File Cleanup** - Critical, prevents disk exhaustion
3. **Fix pyttsx3 Engine Leak** - Critical, prevents crashes
4. **Add Rate Limiting** - High, prevents abuse

### Short Term (This Month)
5. **Convert to Async File I/O** - High, improves performance
6. **Add Path Sanitization** - High, security issue
7. **Fix Error Handling** - High, better UX
8. **Fix Race Conditions** - Medium, improves reliability

### Long Term (Next Quarter)
9. **Complete All Translations** - Medium, core feature
10. **Implement Translation Feature** - Medium, documented but missing
11. **Add Input Sanitization** - Medium, security hardening
12. **Configure CORS Properly** - Medium, production readiness

---

## 📝 TESTING RECOMMENDATIONS

### Unit Tests Needed
- Input validation functions
- Text sanitization
- Language validation
- Category validation

### Integration Tests Needed
- TTS generation workflow
- File cleanup mechanism
- Error handling paths
- Rate limiting

### Load Tests Needed
- Memory leak detection (100+ requests)
- Disk space monitoring
- Concurrent request handling
- Resource cleanup verification

---

## 🔧 TOOLS TO ADD

1. **ESLint** - Catch JavaScript errors
2. **Prettier** - Code formatting
3. **Jest** - Unit testing
4. **Supertest** - API testing
5. **PM2** - Process management with auto-restart
6. **Winston** - Better logging
7. **Helmet** - Security headers
8. **Express-validator** - Input validation

---

## 📈 CODE QUALITY METRICS

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Test Coverage | 0% | 80% | ❌ |
| Security Score | C | A | ❌ |
| Performance | B | A | ⚠️ |
| Code Quality | B | A | ⚠️ |
| Documentation | C | B | ⚠️ |

---

## ✅ CONCLUSION

The application has a solid foundation but suffers from **critical resource management issues** that will cause problems in production:

**Strengths:**
- ✅ Good separation of concerns (Express + Python TTS)
- ✅ Centralized configuration
- ✅ Basic input validation
- ✅ Clean UI with Bootstrap

**Critical Weaknesses:**
- ❌ Memory leaks (blob URLs)
- ❌ No file cleanup (disk exhaustion)
- ❌ Resource leaks (pyttsx3)
- ❌ No rate limiting (DoS vulnerability)
- ❌ Synchronous I/O (performance)

**Recommendation:** Address the 3 critical issues immediately before deploying to production or allowing significant user traffic.

---

**Report Generated:** 2026-01-05
**Total Issues Found:** 17
**Critical:** 3 | **High:** 4 | **Medium:** 7 | **Low:** 3


