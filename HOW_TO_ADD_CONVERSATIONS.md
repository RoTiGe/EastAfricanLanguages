# How to Add New Conversations

This guide shows you how to add new conversations to the Sound Training application **without modifying any code**.

---

## 📝 Quick Start

### Adding a New Conversation (3 Steps):

1. **Create the conversation JSON file**
2. **Update the index.json file**
3. **Restart the server**

That's it! No code changes needed.

---

## 🎯 Step-by-Step Guide

### Step 1: Create Conversation File

**Location:** `contextual_conversations/`

**Naming Convention:** `{context}_{language}.json`

**Examples:**
- `hotel_english.json`
- `hotel_amharic.json`
- `market_spanish.json`
- `taxi_french.json`

**Template:**

```json
{
  "conversation_id": "hotel_english",
  "context": "hotel",
  "language": "english",
  "conversation_title": "Checking into a Hotel",
  "scenario": "A guest arrives at a hotel and checks in at the reception desk.",
  "participants": ["Guest", "Receptionist"],
  "stages": [
    {
      "stage": "Arrival and Greeting",
      "exchanges": [
        {
          "speaker": "Receptionist",
          "english": "Good afternoon! Welcome to our hotel.",
          "amharic": "እንደምን ዋሉ! ወደ ሆቴላችን እንኳን በደህና መጡ።",
          "phonetic": "indemin walu! wede hotelachin inkuan bedehna metu.",
          "context": "Formal greeting at hotel reception"
        },
        {
          "speaker": "Guest",
          "english": "Thank you! I have a reservation.",
          "amharic": "አመሰግናለሁ! ቦታ ያዝኩ።",
          "phonetic": "amesegnalehu! bota yazku.",
          "context": "Polite response"
        }
      ]
    },
    {
      "stage": "Providing Information",
      "exchanges": [
        {
          "speaker": "Receptionist",
          "english": "May I have your name, please?",
          "amharic": "ስምዎን ልጠይቅ እችላለሁ?",
          "phonetic": "simwon liteyek ichilalehu?",
          "context": "Polite request for information"
        }
      ]
    }
  ]
}
```

---

### Step 2: Update Index File

**Location:** `contextual_conversations/index.json`

#### A. Add Context (if new):

```json
{
  "contexts": [
    {
      "context_id": "restaurant",
      "context_name": "Restaurant",
      "icon": "🍽️",
      "description": "Dining and ordering food"
    },
    {
      "context_id": "hotel",
      "context_name": "Hotel",
      "icon": "🏨",
      "description": "Hotel check-in and services"
    }
  ]
}
```

#### B. Add Conversation Entry:

```json
{
  "conversations": [
    {
      "context": "hotel",
      "language": "english",
      "title": "Hotel (English)",
      "difficulty": "beginner",
      "estimated_time": "10 min",
      "stages": 5
    }
  ]
}
```

---

### Step 3: Restart Server

```bash
# Stop the server (Ctrl+C)
# Start it again
npm start
```

**Done!** Your new conversation is now available.

---

## 🌍 Supported Languages

You can create conversations in any of these languages:

- **English** (`english`)
- **Amharic** (`amharic`)
- **Spanish** (`spanish`)
- **French** (`french`)
- **German** (`german`)
- **Italian** (`italian`)
- **Portuguese** (`portuguese`)
- **Russian** (`russian`)
- **Chinese** (`chinese`)
- **Japanese** (`japanese`)
- **Korean** (`korean`)
- **Arabic** (`arabic`)
- **Hindi** (`hindi`)
- **Swahili** (`swahili`)
- **Tigrinya** (`tigrinya`)
- **Oromo** (`oromo`)

---

## 🎭 Suggested Contexts

Here are 15 contexts you can create:

1. **Restaurant** 🍽️ - Dining and ordering food
2. **Hotel** 🏨 - Check-in, room service, checkout
3. **Market** 🛒 - Shopping for groceries
4. **Taxi** 🚕 - Getting a ride, giving directions
5. **Airport** ✈️ - Check-in, security, boarding
6. **Hospital** 🏥 - Medical emergencies, appointments
7. **Bank** 🏦 - Opening accounts, transactions
8. **Post Office** 📮 - Sending mail, packages
9. **Pharmacy** 💊 - Buying medicine, prescriptions
10. **Public Transport** 🚌 - Buses, trains, tickets
11. **Shopping Mall** 🛍️ - Buying clothes, asking for help
12. **Coffee Shop** ☕ - Ordering drinks, casual chat
13. **Gym** 💪 - Membership, equipment, classes
14. **School** 📚 - Enrollment, classes, questions
15. **Office** 💼 - Job interviews, meetings, emails

---

## 📋 Field Reference

### Required Fields:

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `conversation_id` | string | Unique identifier | `"hotel_english"` |
| `context` | string | Context category | `"hotel"` |
| `language` | string | Language code | `"english"` |
| `conversation_title` | string | Display title | `"Checking into a Hotel"` |
| `scenario` | string | Brief description | `"A guest arrives..."` |
| `participants` | array | Speaker names | `["Guest", "Receptionist"]` |
| `stages` | array | Conversation stages | See below |

### Stage Structure:

```json
{
  "stage": "Stage name",
  "exchanges": [...]
}
```

### Exchange Structure:

```json
{
  "speaker": "Speaker name",
  "english": "English text",
  "amharic": "Amharic text (optional)",
  "spanish": "Spanish text (optional)",
  "phonetic": "Romanization (optional)",
  "context": "Cultural note (optional)"
}
```

---

## 💡 Best Practices

### 1. Language Fields
- **Always include** the primary language field (e.g., `english`, `amharic`)
- **Optionally include** other languages for multilingual support
- Use lowercase language codes

### 2. Phonetic Text
- Add `phonetic` field for non-Latin scripts (Amharic, Arabic, Chinese, etc.)
- Use simple romanization that English speakers can read
- Example: `"ሰላም"` → `"selam"`

### 3. Context Notes
- Add `context` field to explain cultural nuances
- Explain formality levels (formal, casual, polite)
- Note when phrases are situation-specific

### 4. Participant Names
- Use role-based names: "Customer", "Waiter", "Guest", "Receptionist"
- For non-English conversations, use target language names
- Example: English uses "Customer", Amharic uses "ደንበኛ"

### 5. Stage Organization
- Break conversations into logical stages (5-10 exchanges per stage)
- Name stages clearly: "Greeting", "Ordering", "Payment", etc.
- Keep total stages between 4-10 for optimal learning

### 6. Difficulty Levels
- **Beginner**: Simple phrases, common situations
- **Intermediate**: Longer exchanges, some complexity
- **Advanced**: Complex grammar, cultural nuances

---

## ✅ Validation Checklist

Before adding a conversation, verify:

- [ ] File named correctly: `{context}_{language}.json`
- [ ] All required fields present
- [ ] JSON is valid (use JSONLint.com)
- [ ] Language field matches filename
- [ ] Context exists in index.json
- [ ] Participant names consistent throughout
- [ ] Phonetic text added for non-Latin scripts
- [ ] Estimated time is realistic
- [ ] Stage count matches actual stages

---

## 🧪 Testing New Conversations

After adding a conversation:

1. **Restart server**: `npm start`
2. **Open browser**: `http://localhost:3000/conversations`
3. **Check index page**: New conversation appears
4. **Test filters**: Context and language filters work
5. **Open viewer**: Conversation loads correctly
6. **Test modes**: Read-Along and Role-Play work
7. **Test TTS**: Audio plays correctly

---

## 🚀 Scaling to 240+ Conversations

### Recommended Approach:

1. **Start with 1 context** (e.g., Restaurant)
2. **Create 2-3 languages** for that context
3. **Test thoroughly**
4. **Add more contexts** one at a time
5. **Translate to more languages**

### Example Roadmap:

**Phase 1: Core Contexts (5)**
- Restaurant, Hotel, Market, Taxi, Airport

**Phase 2: Essential Services (5)**
- Hospital, Bank, Post Office, Pharmacy, Public Transport

**Phase 3: Daily Life (5)**
- Shopping Mall, Coffee Shop, Gym, School, Office

**Phase 4: Language Expansion**
- Translate all 15 contexts to 16 languages = 240 conversations

---

## 📞 Need Help?

If you encounter issues:

1. **Validate JSON**: Use [JSONLint](https://jsonlint.com/)
2. **Check file naming**: Must be `{context}_{language}.json`
3. **Verify index.json**: Context must exist
4. **Check browser console**: Look for errors
5. **Test API directly**: `http://localhost:3000/api/conversations/{context}/{language}`

---

## 🎉 You're Ready!

You now know how to:
- ✅ Create new conversation files
- ✅ Update the index
- ✅ Add new contexts
- ✅ Support multiple languages
- ✅ Add phonetic text
- ✅ Test your conversations

**Start creating and scale to 240+ conversations!** 🚀

