# Testing Guide - Multi-Language Conversation System

## 🧪 Quick Test Steps

### 1. Start the Server

```bash
npm start
```

Expected output:
```
Server running on http://localhost:3000
TTS Service URL: http://localhost:5000
```

---

### 2. Test Language Selection

1. **Navigate to:**
   ```
   http://localhost:3000/conversations
   ```

2. **You should see:**
   - ✅ Language selection card with two dropdowns
   - ✅ "My Native Language" dropdown
   - ✅ "Language I Want to Learn" dropdown
   - ✅ "Continue to Conversations" button (disabled initially)

3. **Select languages:**
   - Native Language: **English**
   - Learning Language: **Amharic**

4. **Verify:**
   - ✅ Button becomes enabled
   - ✅ Button text: "Continue to Conversations"

5. **Try selecting same language:**
   - Native: English
   - Learning: English
   - ✅ Button should turn red and say "Please select different languages"

6. **Select different languages again and click "Continue"**

---

### 3. Test Conversation List

After clicking "Continue", you should see:

1. **Info Alert:**
   ```
   Learning አማርኛ (Amharic) from English • Practice real-world scenarios...
   [Change Languages] button
   ```

2. **Restaurant Card:**
   - ✅ Icon: 🍽️
   - ✅ Title: "Restaurant"
   - ✅ Description: "Dining out, ordering food, restaurant etiquette"
   - ✅ Badge: "አማርኛ (Amharic) - Available" (green)
   - ✅ Time: "10-15 minutes"
   - ✅ Stages: "3 stages"
   - ✅ Learning objectives listed
   - ✅ "Start Conversation" button (enabled)

3. **Click "Start Conversation"**

---

### 4. Test Conversation Viewer

**URL should be:**
```
http://localhost:3000/conversations/restaurant/english/amharic
```

**Header should show:**
- ✅ Two language badges:
  - Green badge: "🏠 English" (native)
  - Blue badge: "📖 አማርኛ (Amharic)" (learning)
- ✅ Title in Amharic: "ለመጀመሪያ ጊዜ በምግብ ቤት መግባት"
- ✅ Scenario description in Amharic

**Conversation Display:**

Each exchange should show:

```
┌─────────────────────────────────────┐
│ 👤 አገልጋይ (Waiter)            [Play]│
├─────────────────────────────────────┤
│ 📖 አማርኛ (Amharic)                  │
│ መልካም ማታ! እንኳን ወደ ቤላ ቪስታ በደህና መጡ│
│ 🎤 melkam mata! enkwan wede...      │
├─────────────────────────────────────┤
│ 🌍 English                          │
│ Good evening! Welcome to Bella...   │
└─────────────────────────────────────┘
```

**Verify:**
- ✅ Amharic text is **bold and larger**
- ✅ Phonetic pronunciation appears below Amharic
- ✅ English translation appears at bottom (smaller, gray)
- ✅ Play button is present
- ✅ Speaker name is shown

---

### 5. Test Different Language Combinations

**Go back to conversations list** (click "Back" button)

**Click "Change Languages"**

**Try different combinations:**

1. **Native: Amharic, Learning: English**
   - Should show English prominently
   - Amharic as translation

2. **Native: English, Learning: Oromo**
   - Should show Oromo prominently
   - English as translation

3. **Native: Tigrinya, Learning: Amharic**
   - Should show Amharic prominently
   - Tigrinya as translation

---

### 6. Test Role-Play Mode

In the conversation viewer:

1. **Select "Role-Play Mode" radio button**

2. **Verify:**
   - ✅ Customer exchanges are hidden
   - ✅ Shows "[Your turn - try speaking this part]"
   - ✅ "Reveal" button appears
   - ✅ Waiter exchanges still visible

3. **Click "Reveal" button**
   - ✅ Text appears with both languages
   - ✅ Phonetic pronunciation shows
   - ✅ Reveal button disappears

---

## ✅ Success Checklist

- [ ] Language selection works
- [ ] Can't select same language twice
- [ ] Conversation list shows after language selection
- [ ] Restaurant card shows correct info
- [ ] URL includes both languages: `/conversations/restaurant/english/amharic`
- [ ] Header shows both language badges
- [ ] Exchanges show target language prominently (bold, larger)
- [ ] Phonetic pronunciation appears
- [ ] Native language translation appears below
- [ ] Role-play mode hides customer text
- [ ] Reveal button works
- [ ] Stage navigation works
- [ ] Progress bar updates
- [ ] Phonetic toggle works
- [ ] Same language doesn't duplicate text

---

## 🎉 Ready to Test!

Start your server and follow the steps above. Report any issues you find!

