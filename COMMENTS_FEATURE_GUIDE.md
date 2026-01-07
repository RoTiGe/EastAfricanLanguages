# Comments & Suggestions Feature - User Guide

## 📍 Where to Find It

The comments section appears **at the bottom** of every conversation page, after the conversation content and navigation controls.

**Location:**
```
┌─────────────────────────────────────┐
│ Conversation Header                 │
├─────────────────────────────────────┤
│ Mode Selection (Listen/Role-Play)   │
├─────────────────────────────────────┤
│ Stage Navigation                    │
├─────────────────────────────────────┤
│ Conversation Exchanges              │
│ (Dialogue content)                  │
├─────────────────────────────────────┤
│ Play All / Reset Buttons            │
├─────────────────────────────────────┤
│ 💬 Comments & Suggestions Section   │ ← HERE!
│ (Facebook-style commenting)         │
└─────────────────────────────────────┘
```

---

## 🎯 Purpose

Help improve conversations by:
- ✅ Suggesting better translations
- ✅ Sharing pronunciation tips
- ✅ Providing cultural insights
- ✅ Reporting errors or improvements

---

## 🚀 How to Use

### Step 1: First Time Setup

When you first visit a conversation page, you'll see a modal:

```
┌─────────────────────────────────────┐
│ 👤 Welcome! What's your name?       │
├─────────────────────────────────────┤
│ Your Name                           │
│ ┌─────────────────────────────────┐ │
│ │ John Doe                        │ │ ← Click here to type
│ └─────────────────────────────────┘ │
│ ℹ️ This will be used to identify    │
│   your comments and suggestions.    │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │         Continue                │ │ ← Enabled when you type
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

**Actions:**
1. Click on the input field
2. Type your name
3. Click "Continue" or press Enter

**Note:** Your name is saved locally and you won't be asked again!

---

### Step 2: Scroll to Comments Section

After the conversation content, you'll see:

```
┌─────────────────────────────────────────────────┐
│ 💬 Comments & Suggestions            [0]        │
│                                                 │
│ Help improve this conversation! Share better    │
│ translations, pronunciation tips, or cultural   │
│ insights.                                       │
│                                                 │
│ ┌─────────────────────────────────────────────┐ │
│ │ J  Write a comment or suggest a better...  │ │
│ │                                         [→] │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
│ 💭 No comments yet. Be the first to share      │
│    your thoughts!                               │
└─────────────────────────────────────────────────┘
```

---

### Step 3: Write a Comment

**Click in the comment box** and type your suggestion:

```
┌─────────────────────────────────────────────────┐
│ J  The pronunciation for 'melkam mata'...    [→]│
└─────────────────────────────────────────────────┘
```

**Examples of good comments:**
- "The pronunciation for 'melkam mata' should emphasize the first syllable"
- "In Amharic culture, it's more common to say 'ሰላም' (selam) in casual settings"
- "Better translation: 'እባክዎ' (ebakwo) is more polite than 'እባክህ' (ebakh)"
- "The phonetic should be 'mel-KAM ma-ta' not 'mel-kam MA-ta'"

---

### Step 4: Post Your Comment

**Two ways to post:**
1. Click the **send button** (→)
2. Press **Enter** key

The send button is only enabled when you've typed something!

---

### Step 5: View Comments

After posting, your comment appears:

```
┌─────────────────────────────────────────────────┐
│ 💬 Comments & Suggestions            [1]        │
│                                                 │
│ ┌─────────────────────────────────────────────┐ │
│ │ J  Write a comment...                    [→]│ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
│ ┌─────────────────────────────────────────────┐ │
│ │ J  John Doe  [📖 አማርኛ (Amharic)]           │ │
│ │                                             │ │
│ │ The pronunciation for 'melkam mata'         │ │
│ │ should emphasize the first syllable         │ │
│ │                                             │ │
│ │ 👍 Like  •  Just now                        │ │
│ └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

**Comment includes:**
- ✅ Your avatar (first letter of your name)
- ✅ Your name
- ✅ Language badge (shows which language you're learning)
- ✅ Your comment text
- ✅ Like button
- ✅ Timestamp (e.g., "Just now", "2 hours ago", "Yesterday")

---

## 👍 Liking Comments

Click the **"Like"** button on any comment:

```
│ 👍 Like  •  2 hours ago                        │
```

After liking:
```
│ 👍 Like (1)  •  2 hours ago                    │
```

**Note:** Currently, you can like multiple times (will be improved later!)

---

## 💾 Data Storage

### Where Comments Are Saved

Comments are saved in your browser's **localStorage** with the key:
```
comments_{context}_{nativeLanguage}_{targetLanguage}
```

**Example:**
```
comments_restaurant_english_amharic
```

### What Gets Saved

Each comment includes:
```json
{
  "id": 1704567890123,
  "author": "John Doe",
  "text": "Great pronunciation guide!",
  "timestamp": "2024-01-06T12:34:50.123Z",
  "nativeLanguage": "english",
  "targetLanguage": "amharic",
  "nativeLanguageName": "English",
  "targetLanguageName": "አማርኛ (Amharic)",
  "context": "restaurant",
  "likes": 5
}
```

### Viewing Your Data

Open browser console (F12) and type:
```javascript
localStorage.getItem('comments_restaurant_english_amharic')
```

---

## 🎨 Facebook-Style Features

### ✅ Implemented:
- Real-time comment posting
- User avatars (first letter of name)
- Like functionality
- Timestamp formatting ("Just now", "2 hours ago", etc.)
- Comment count badge
- Language context badges
- Smooth animations

### 🔮 Future Enhancements:
- Reply to comments
- Edit/delete your own comments
- User profiles
- Comment reactions (not just likes)
- Sort by newest/most liked
- Filter by language
- Share comments across users (requires backend)

---

## 🔧 Troubleshooting

### "I can't click on the name input"
**Solution:** 
- Try clicking directly on the input field
- If still not working, press Tab to focus it
- Make sure JavaScript is enabled

### "Continue button is disabled"
**Solution:** 
- Type your name first
- Button only enables when you've entered text

### "My comments disappeared"
**Solution:** 
- Comments are saved per browser
- Clearing browser data will delete comments
- Different browsers = different comments
- Incognito mode won't save comments

### "I don't see the comments section"
**Solution:** 
- Scroll down to the bottom of the page
- It's below the "Play All" and "Reset" buttons

---

## 📱 Mobile Experience

The comments section is fully responsive:

**Mobile View:**
```
┌─────────────────────┐
│ 💬 Comments [1]     │
│                     │
│ ┌─────────────────┐ │
│ │ J  Write...  [→]│ │
│ └─────────────────┘ │
│                     │
│ ┌─────────────────┐ │
│ │ J  John Doe     │ │
│ │ [📖 Amharic]    │ │
│ │                 │ │
│ │ Great guide!    │ │
│ │                 │ │
│ │ 👍 Like         │ │
│ │ 2 hours ago     │ │
│ └─────────────────┘ │
└─────────────────────┘
```

---

## 🎉 Tips for Great Comments

### ✅ DO:
- Be specific about what needs improvement
- Provide alternative translations
- Share cultural context
- Explain pronunciation nuances
- Be respectful and constructive

### ❌ DON'T:
- Post spam or irrelevant content
- Use offensive language
- Post duplicate comments
- Share personal information

---

## 🌟 Example Comments

**Good Examples:**

1. **Pronunciation Tip:**
   > "The 'ጥ' sound in 'ጥያቄ' (question) is a unique ejective consonant. Try saying 't' while holding your breath briefly."

2. **Cultural Context:**
   > "In Ethiopian restaurants, it's customary to wash hands before eating. The waiter will bring a pitcher and basin to your table."

3. **Better Translation:**
   > "Instead of 'እባክህ' (ebakh), use 'እባክዎ' (ebakwo) when speaking to someone older or in formal settings."

4. **Grammar Note:**
   > "The word order in Amharic is Subject-Object-Verb, unlike English which is Subject-Verb-Object."

---

## 📊 Your Impact

Every comment helps:
- ✅ Improve translation accuracy
- ✅ Help other learners
- ✅ Build a community knowledge base
- ✅ Make the app better for everyone

**Thank you for contributing!** 🙏

