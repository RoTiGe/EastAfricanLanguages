# Updated Language-Aware Conversation Viewer

## 🔧 Enhanced Implementation with Multi-Language Support

This updated viewer supports **any language** dynamically, including:
- ✅ Dynamic language field detection (`english`, `amharic`, `spanish`, etc.)
- ✅ Phonetic pronunciation display (optional)
- ✅ Context notes display (optional)
- ✅ Flexible participant names (any language)
- ✅ TTS integration with correct language

---

## File: `views/conversations/viewer.ejs`

### Key Changes from Original:

1. **Dynamic Language Field**: Uses `exchange[language]` instead of `exchange.english`
2. **Phonetic Support**: Displays romanization if available
3. **Flexible Speaker Detection**: Works with any participant names
4. **Enhanced TTS**: Passes correct language to API

---

## Complete Updated Code:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%= title %></title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css">
    <link rel="stylesheet" href="/css/style.css">
    <style>
        .exchange-card {
            transition: all 0.3s ease;
            border-left: 4px solid transparent;
        }
        .exchange-card.active {
            border-left-color: #0d6efd;
            background-color: #f8f9fa;
        }
        .speaker-customer, .speaker-ደንበኛ { border-left-color: #0dcaf0; }
        .speaker-waiter, .speaker-አገልጋይ { border-left-color: #198754; }
        .stage-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 1rem;
            border-radius: 0.5rem;
            margin-bottom: 1rem;
        }
        .progress-bar-custom {
            height: 8px;
            border-radius: 4px;
        }
        .phonetic-text {
            font-style: italic;
            color: #6c757d;
            font-size: 0.9em;
        }
        .language-badge {
            position: absolute;
            top: 1rem;
            right: 1rem;
        }
    </style>
</head>
<body>
    <div class="container-fluid p-0">
        <header class="text-white py-3 position-relative">
            <div class="container">
                <a href="/conversations" class="btn btn-light btn-sm position-absolute top-0 start-0 m-3">
                    <i class="bi bi-arrow-left me-2"></i>Back
                </a>
                <span class="badge bg-light text-dark language-badge">
                    <i class="bi bi-translate me-1"></i><%= languageName %>
                </span>
                <h1 class="text-center h3 fw-bold mb-1">
                    <%= conversation.conversation_title || title %>
                </h1>
                <p class="text-center mb-0 text-white-50">
                    <i class="bi bi-info-circle me-1"></i><%= conversation.scenario %>
                </p>
            </div>
        </header>

        <main class="container my-4">
            <!-- Mode Selection -->
            <div class="card mb-4">
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-md-6">
                            <label class="form-label fw-bold">Learning Mode:</label>
                            <div class="btn-group w-100" role="group">
                                <input type="radio" class="btn-check" name="mode" id="modeReadAlong" value="read-along" checked>
                                <label class="btn btn-outline-primary" for="modeReadAlong">
                                    <i class="bi bi-book me-1"></i>Read-Along
                                </label>
                                
                                <input type="radio" class="btn-check" name="mode" id="modeRolePlay" value="role-play">
                                <label class="btn btn-outline-primary" for="modeRolePlay">
                                    <i class="bi bi-person-video2 me-1"></i>Role-Play
                                </label>
                            </div>
                        </div>
                        <div class="col-md-6 mt-3 mt-md-0">
                            <label class="form-label fw-bold">Options:</label>
                            <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" id="autoPlay">
                                <label class="form-check-label" for="autoPlay">
                                    Auto-play conversation
                                </label>
                            </div>
                            <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" id="showPhonetic" checked>
                                <label class="form-check-label" for="showPhonetic">
                                    Show phonetic pronunciation
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Progress Bar -->
            <div class="mb-4">
                <div class="d-flex justify-content-between mb-2">
                    <span class="text-muted">Progress</span>
                    <span class="text-muted" id="progressText">Stage 1 of <%= conversation.stages.length %></span>
                </div>
                <div class="progress progress-bar-custom">
                    <div class="progress-bar" id="progressBar" role="progressbar" style="width: 0%"></div>
                </div>
            </div>

            <!-- Stage Navigation -->
            <div class="mb-4">
                <div class="btn-group w-100" role="group">
                    <button class="btn btn-outline-secondary" id="prevStage" disabled>
                        <i class="bi bi-chevron-left"></i> Previous Stage
                    </button>
                    <button class="btn btn-outline-secondary" id="nextStage">
                        Next Stage <i class="bi bi-chevron-right"></i>
                    </button>
                </div>
            </div>

            <!-- Conversation Content -->
            <div id="conversationContent">
                <!-- Will be populated by JavaScript -->
            </div>

            <!-- Navigation Controls -->
            <div class="card mt-4">
                <div class="card-body text-center">
                    <button class="btn btn-lg btn-primary me-2" id="playAll">
                        <i class="bi bi-play-circle me-2"></i>Play All
                    </button>
                    <button class="btn btn-lg btn-outline-secondary" id="resetConversation">
                        <i class="bi bi-arrow-clockwise me-2"></i>Reset
                    </button>
                </div>
            </div>
        </main>

        <footer class="bg-dark text-white text-center py-3 mt-5">
            <div class="container">
                <p class="mb-0">© 2026 Sound Training - Contextual Conversations</p>
            </div>
        </footer>
    </div>

    <script>
        // Conversation data from server
        const conversation = <%- JSON.stringify(conversation) %>;
        const language = '<%= language %>';
        const languageName = '<%= languageName %>';
        
        // Get first participant name (customer/ደንበኛ/etc.)
        const customerName = conversation.participants[0];
        
        // State
        let currentStageIndex = 0;
        let currentMode = 'read-along';
        let isAutoPlay = false;
        let showPhonetic = true;
        let currentAudio = null;
        
        // Initialize
        document.addEventListener('DOMContentLoaded', () => {
            displayStage(0);
            setupEventListeners();
        });

        function setupEventListeners() {
            // Mode selection
            document.querySelectorAll('input[name="mode"]').forEach(radio => {
                radio.addEventListener('change', (e) => {
                    currentMode = e.target.value;
                    displayStage(currentStageIndex);
                });
            });

            // Auto-play toggle
            document.getElementById('autoPlay').addEventListener('change', (e) => {
                isAutoPlay = e.target.checked;
            });

            // Phonetic toggle
            document.getElementById('showPhonetic').addEventListener('change', (e) => {
                showPhonetic = e.target.checked;
                displayStage(currentStageIndex);
            });

            // Stage navigation
            document.getElementById('prevStage').addEventListener('click', () => {
                if (currentStageIndex > 0) {
                    displayStage(currentStageIndex - 1);
                }
            });

            document.getElementById('nextStage').addEventListener('click', () => {
                if (currentStageIndex < conversation.stages.length - 1) {
                    displayStage(currentStageIndex + 1);
                }
            });

            // Play all button
            document.getElementById('playAll').addEventListener('click', playAllExchanges);

            // Reset button
            document.getElementById('resetConversation').addEventListener('click', () => {
                displayStage(0);
            });
        }

        function displayStage(stageIndex) {
            currentStageIndex = stageIndex;
            const stage = conversation.stages[stageIndex];

            // Update progress
            const progress = ((stageIndex + 1) / conversation.stages.length) * 100;
            document.getElementById('progressBar').style.width = progress + '%';
            document.getElementById('progressText').textContent =
                `Stage ${stageIndex + 1} of ${conversation.stages.length}`;

            // Update navigation buttons
            document.getElementById('prevStage').disabled = (stageIndex === 0);
            document.getElementById('nextStage').disabled =
                (stageIndex === conversation.stages.length - 1);

            // Display stage content
            const content = document.getElementById('conversationContent');
            content.innerHTML = `
                <div class="stage-header">
                    <h4 class="mb-0">${stage.stage}</h4>
                </div>
                ${stage.exchanges.map((exchange, idx) => createExchangeCard(exchange, idx)).join('')}
            `;

            // Add click listeners to play buttons
            stage.exchanges.forEach((exchange, idx) => {
                const playBtn = document.getElementById(`play-${idx}`);
                if (playBtn) {
                    playBtn.addEventListener('click', () => playExchange(exchange, idx));
                }
            });
        }

        function createExchangeCard(exchange, index) {
            const speakerClass = exchange.speaker.toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[()]/g, '');

            // Check if this is the customer/first participant
            const isCustomer = exchange.speaker === customerName ||
                              exchange.speaker.includes(customerName) ||
                              exchange.speaker.toLowerCase().includes('customer') ||
                              exchange.speaker.includes('ደንበኛ');

            const isHidden = currentMode === 'role-play' && isCustomer;

            // ✅ DYNAMIC LANGUAGE FIELD ACCESS
            const text = exchange[language] || exchange.english || exchange.amharic || '';

            // ✅ PHONETIC SUPPORT
            const phoneticText = (exchange.phonetic && showPhonetic) ?
                `<div class="phonetic-text mt-2">
                    <i class="bi bi-mic me-1"></i>${exchange.phonetic}
                 </div>` : '';

            // ✅ CONTEXT NOTES (optional)
            const contextNotes = exchange.context ?
                `<small class="text-muted d-block mt-2">
                    <i class="bi bi-info-circle me-1"></i>${exchange.context}
                 </small>` : '';

            // Escape text for reveal button
            const escapedText = text.replace(/'/g, "\\'").replace(/"/g, '&quot;');

            return `
                <div class="card mb-3 exchange-card speaker-${speakerClass}" id="exchange-${index}">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h6 class="mb-0">
                                <i class="bi bi-person-circle me-2"></i>${exchange.speaker}
                            </h6>
                            <button class="btn btn-sm btn-primary" id="play-${index}">
                                <i class="bi bi-volume-up"></i> Play
                            </button>
                        </div>
                        <p class="mb-0 ${isHidden ? 'text-muted fst-italic' : ''}" id="text-${index}">
                            ${isHidden ? '[Your turn - try speaking this part]' : text}
                        </p>
                        ${!isHidden ? phoneticText : ''}
                        ${!isHidden ? contextNotes : `
                            <button class="btn btn-sm btn-outline-secondary mt-2"
                                    onclick="revealText(${index}, '${escapedText}', '${exchange.phonetic || ''}')">
                                <i class="bi bi-eye me-1"></i>Reveal
                            </button>
                        `}
                    </div>
                </div>
            `;
        }

        function revealText(index, text, phonetic) {
            const textElement = document.getElementById(`text-${index}`);
            textElement.innerHTML = text;
            textElement.classList.remove('text-muted', 'fst-italic');

            // Add phonetic if available and enabled
            if (phonetic && showPhonetic) {
                textElement.insertAdjacentHTML('afterend',
                    `<div class="phonetic-text mt-2">
                        <i class="bi bi-mic me-1"></i>${phonetic}
                     </div>`
                );
            }
        }

        async function playExchange(exchange, index) {
            // Highlight current exchange
            document.querySelectorAll('.exchange-card').forEach(card => {
                card.classList.remove('active');
            });
            document.getElementById(`exchange-${index}`).classList.add('active');

            // Stop any currently playing audio
            if (currentAudio) {
                currentAudio.pause();
                currentAudio = null;
            }

            // Get text in the correct language
            const text = exchange[language] || exchange.english || exchange.amharic || '';

            if (!text) {
                console.error('No text found for this exchange');
                return;
            }

            // Call TTS API
            try {
                const response = await fetch('/api/speak', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        text: text,
                        language: language  // ✅ Pass correct language
                    })
                });

                if (!response.ok) {
                    throw new Error(`TTS failed: ${response.statusText}`);
                }

                const data = await response.json();
                currentAudio = new Audio(data.audioUrl);

                await currentAudio.play();

                // Auto-advance if enabled
                if (isAutoPlay) {
                    currentAudio.onended = () => {
                        const stage = conversation.stages[currentStageIndex];
                        if (index < stage.exchanges.length - 1) {
                            setTimeout(() => playExchange(stage.exchanges[index + 1], index + 1), 1000);
                        } else if (currentStageIndex < conversation.stages.length - 1) {
                            // Move to next stage
                            setTimeout(() => {
                                displayStage(currentStageIndex + 1);
                                const nextStage = conversation.stages[currentStageIndex];
                                playExchange(nextStage.exchanges[0], 0);
                            }, 2000);
                        }
                    };
                }
            } catch (error) {
                console.error('Error playing audio:', error);
                alert(`Failed to play audio: ${error.message}. Please try again.`);
            }
        }

        async function playAllExchanges() {
            const stage = conversation.stages[currentStageIndex];
            isAutoPlay = true;
            document.getElementById('autoPlay').checked = true;
            playExchange(stage.exchanges[0], 0);
        }
    </script>
</body>
</html>
```

---

## 🎯 Key Features of Updated Viewer

### 1. **Dynamic Language Support** ✅
```javascript
const text = exchange[language] || exchange.english || exchange.amharic || '';
```
- Works with ANY language field
- Fallback to common languages if field missing
- No hardcoded language assumptions

### 2. **Phonetic Pronunciation** ✅
```javascript
const phoneticText = (exchange.phonetic && showPhonetic) ?
    `<div class="phonetic-text mt-2">
        <i class="bi bi-mic me-1"></i>${exchange.phonetic}
     </div>` : '';
```
- Displays romanization if available
- Toggle on/off with checkbox
- Helps learners pronounce correctly

### 3. **Flexible Participant Detection** ✅
```javascript
const isCustomer = exchange.speaker === customerName ||
                  exchange.speaker.includes(customerName) ||
                  exchange.speaker.toLowerCase().includes('customer') ||
                  exchange.speaker.includes('ደንበኛ');
```
- Works with any participant names
- Supports English, Amharic, and other languages
- Automatically detects customer role for role-play mode

### 4. **Enhanced TTS Integration** ✅
```javascript
body: JSON.stringify({
    text: text,
    language: language  // Passes correct language code
})
```
- Sends correct language to TTS API
- Handles errors gracefully
- Auto-advances through conversation

### 5. **Auto-Advance Across Stages** ✅
- Plays all exchanges in current stage
- Automatically moves to next stage
- Continues until conversation complete

---

## 🧪 Testing Checklist

- [ ] Test with `restaurant_english.json`
- [ ] Test with `restaurant_amharic.json`
- [ ] Verify phonetic display works
- [ ] Verify role-play mode hides customer lines
- [ ] Verify TTS works with both languages
- [ ] Verify auto-play advances correctly
- [ ] Test stage navigation
- [ ] Test on mobile devices

---

## 📝 Next Steps

1. Copy this updated viewer code to `views/conversations/viewer.ejs`
2. Ensure backend API endpoints are added to `server.js`
3. Test with both existing conversation files
4. Create more conversation files to validate scalability


