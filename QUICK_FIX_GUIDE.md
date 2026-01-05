# 🚀 Quick Fix Guide - Critical Issues

**Priority:** Fix these 3 critical issues IMMEDIATELY before production deployment.

---

## 🔴 CRITICAL FIX #1: Memory Leak - Blob URLs

**File:** `public/js/demo.js` and `public/js/main.js`  
**Time to Fix:** 5 minutes  
**Impact:** Prevents browser memory exhaustion

### Current Code (BROKEN):
```javascript
// demo.js line 203-204
const audioBlob = await response.blob();
const audioUrl = URL.createObjectURL(audioBlob);
audioPlayer.src = audioUrl;
// ❌ URL is never revoked - MEMORY LEAK!
```

### Fixed Code:
```javascript
// Revoke old URL before creating new one
if (audioPlayer.src && audioPlayer.src.startsWith('blob:')) {
    URL.revokeObjectURL(audioPlayer.src);
}

const audioBlob = await response.blob();
const audioUrl = URL.createObjectURL(audioBlob);
audioPlayer.src = audioUrl;

// Also revoke when audio ends
audioPlayer.addEventListener('ended', () => {
    URL.revokeObjectURL(audioUrl);
}, { once: true });
```

### Apply to Both Files:
1. `public/js/demo.js` - Update `speak()` function around line 203
2. `public/js/main.js` - Update `speakText()` function around line 35

---

## 🔴 CRITICAL FIX #2: Audio File Cleanup

**File:** `tts_service.py`  
**Time to Fix:** 10 minutes  
**Impact:** Prevents disk space exhaustion

### Add This Code:
```python
# Add at top of file after imports
import time
from threading import Thread

# Add this function before the routes
def cleanup_old_files():
    """Delete audio files older than 24 hours"""
    while True:
        try:
            now = time.time()
            for filename in os.listdir(AUDIO_DIR):
                filepath = os.path.join(AUDIO_DIR, filename)
                if os.path.isfile(filepath):
                    # Check file age
                    age_hours = (now - os.path.getmtime(filepath)) / 3600
                    if age_hours > 24:
                        os.remove(filepath)
                        print(f"Cleaned up old file: {filename}")
        except Exception as e:
            print(f"Cleanup error: {e}")
        
        # Run every hour
        time.sleep(3600)

# Add before app.run() at the bottom
if __name__ == '__main__':
    # Start cleanup thread
    cleanup_thread = Thread(target=cleanup_old_files, daemon=True)
    cleanup_thread.start()
    print("✓ Audio cleanup thread started (24-hour retention)")
    
    # ... existing app.run() code
```

---

## 🔴 CRITICAL FIX #3: pyttsx3 Engine Leak

**File:** `tts_service.py`  
**Time to Fix:** 5 minutes  
**Impact:** Prevents resource leaks and crashes

### Current Code (BROKEN):
```python
# Line 106-108
engine = pyttsx3.init()
engine.save_to_file(text, output_path)
engine.runAndWait()
# ❌ Engine is never stopped or deleted!
```

### Fixed Code:
```python
# Replace lines 103-113 with:
if language in PYTTSX3_LANGUAGES:
    engine = None
    try:
        engine = pyttsx3.init()
        engine.save_to_file(text, output_path)
        engine.runAndWait()
        print(f"Speech generated successfully with pyttsx3: {filename}")
        mimetype = 'audio/wav'
    except Exception as e:
        print(f"pyttsx3 error: {str(e)}")
        raise
    finally:
        if engine:
            try:
                engine.stop()
                del engine
            except:
                pass
```

---

## 🟠 HIGH PRIORITY FIX: Rate Limiting

**File:** `server.js`  
**Time to Fix:** 10 minutes  
**Impact:** Prevents DoS attacks

### Install Package:
```bash
npm install express-rate-limit
```

### Add to server.js:
```javascript
// Add at top with other requires
const rateLimit = require('express-rate-limit');

// Add before routes
const ttsLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // 10 requests per minute per IP
    message: { error: 'Too many TTS requests, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Apply to TTS endpoint (line 148)
app.post('/api/speak', ttsLimiter, async (req, res) => {
    // ... existing code
});
```

---

## 🟠 HIGH PRIORITY FIX: Async File I/O

**File:** `server.js`  
**Time to Fix:** 15 minutes  
**Impact:** Improves performance, prevents blocking

### Change at Top:
```javascript
// Replace: const fs = require('fs');
// With:
const fs = require('fs').promises;
const fsSync = require('fs'); // Keep for exists checks if needed
```

### Update All Routes:
```javascript
// Example: /api/categories/:language (line 40)
app.get('/api/categories/:language', async (req, res) => {
    const language = req.params.language;

    if (!config.isValidLanguage(language)) {
        return res.status(404).json({ error: 'Language not supported' });
    }

    const translationPath = path.join(__dirname, 'translations', `${language}.json`);
    
    try {
        const data = await fs.readFile(translationPath, 'utf8');
        const translationData = JSON.parse(data);
        
        res.json({
            language: translationData.language,
            nativeLanguageField: translationData.nativeLanguageField,
            categoryNames: translationData.categoryNames,
            categories: Object.keys(translationData.categories)
        });
    } catch (error) {
        console.error(`Error loading categories for ${language}:`, error);
        res.status(500).json({ error: 'Failed to load categories' });
    }
});
```

**Apply to all routes that use `fs.readFileSync()`:**
- Line 50: `/api/categories/:language`
- Line 76: `/api/phrases/:language/:category`
- Line 132: `/demo/:language`
- Line 237, 254, 270, 287, 304, 331: Advanced routes

---

## ✅ Testing After Fixes

### Test Memory Leak Fix:
1. Open browser DevTools → Performance
2. Click "Speak" 50 times
3. Check memory usage - should stay stable
4. Old: Memory grows continuously
5. New: Memory stays constant

### Test File Cleanup:
1. Generate 10 audio files
2. Change file timestamps to 25 hours ago (for testing)
3. Wait 1 hour or restart service
4. Files should be deleted

### Test Engine Leak:
1. Generate 100 TTS requests with pyttsx3 languages
2. Check Task Manager → Python process memory
3. Memory should stay stable

---

## 📋 Checklist

- [ ] Fix blob URL memory leak in `demo.js`
- [ ] Fix blob URL memory leak in `main.js`
- [ ] Add audio file cleanup to `tts_service.py`
- [ ] Fix pyttsx3 engine leak in `tts_service.py`
- [ ] Install express-rate-limit
- [ ] Add rate limiting to `/api/speak`
- [ ] Convert fs.readFileSync to async in all routes
- [ ] Test all fixes
- [ ] Monitor memory usage
- [ ] Monitor disk usage

---

**Estimated Total Time:** 45-60 minutes  
**Impact:** Prevents production crashes and resource exhaustion

