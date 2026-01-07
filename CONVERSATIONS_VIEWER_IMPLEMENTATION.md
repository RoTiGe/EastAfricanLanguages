# Conversation Viewer Implementation

## Interactive Conversation Player

### File: `views/conversations/viewer.ejs`

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
        .speaker-waiter { border-left-color: #198754; }
        .speaker-customer { border-left-color: #0dcaf0; }
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
    </style>
</head>
<body>
    <div class="container-fluid p-0">
        <header class="text-white py-3 position-relative">
            <div class="container">
                <a href="/conversations" class="btn btn-light btn-sm position-absolute top-0 start-0 m-3">
                    <i class="bi bi-arrow-left me-2"></i>Back
                </a>
                <h1 class="text-center h3 fw-bold mb-1"><%= title %></h1>
                <p class="text-center mb-0">
                    <span class="badge bg-light text-dark"><%= languageName %></span>
                </p>
            </div>
        </header>

        <main class="container my-4">
            <!-- Scenario Description -->
            <div class="alert alert-info mb-4">
                <i class="bi bi-info-circle me-2"></i>
                <strong>Scenario:</strong> <%= conversation.scenario %>
            </div>

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
                            <label class="form-label fw-bold">Auto-Play:</label>
                            <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" id="autoPlay">
                                <label class="form-check-label" for="autoPlay">
                                    Play conversation automatically
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
        
        // State
        let currentStageIndex = 0;
        let currentMode = 'read-along';
        let isAutoPlay = false;
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
            const speakerClass = exchange.speaker.toLowerCase().replace(/\s+/g, '-');
            const isHidden = currentMode === 'role-play' && exchange.speaker === 'Customer';
            
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
                        <p class="mb-2 ${isHidden ? 'text-muted fst-italic' : ''}" id="text-${index}">
                            ${isHidden ? '[Your turn - try speaking this part]' : exchange.english}
                        </p>
                        ${!isHidden ? `
                            <small class="text-muted">
                                <i class="bi bi-info-circle me-1"></i>${exchange.context}
                            </small>
                        ` : `
                            <button class="btn btn-sm btn-outline-secondary" 
                                    onclick="revealText(${index}, '${exchange.english.replace(/'/g, "\\'")}')">
                                <i class="bi bi-eye me-1"></i>Reveal
                            </button>
                        `}
                    </div>
                </div>
            `;
        }
        
        function revealText(index, text) {
            document.getElementById(`text-${index}`).innerHTML = text;
            document.getElementById(`text-${index}`).classList.remove('text-muted', 'fst-italic');
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
            
            // Call TTS API
            try {
                const response = await fetch('/api/speak', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        text: exchange.english,
                        language: language
                    })
                });
                
                if (!response.ok) throw new Error('TTS failed');
                
                const data = await response.json();
                currentAudio = new Audio(data.audioUrl);
                currentAudio.play();
                
                // Auto-advance if enabled
                if (isAutoPlay) {
                    currentAudio.onended = () => {
                        const stage = conversation.stages[currentStageIndex];
                        if (index < stage.exchanges.length - 1) {
                            setTimeout(() => playExchange(stage.exchanges[index + 1], index + 1), 1000);
                        }
                    };
                }
            } catch (error) {
                console.error('Error playing audio:', error);
                alert('Failed to play audio. Please try again.');
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

## Key Features Implemented:

1. ✅ **Read-Along Mode**: See and hear full conversation
2. ✅ **Role-Play Mode**: Hide customer lines for practice
3. ✅ **Auto-Play**: Automatically play through conversation
4. ✅ **Stage Navigation**: Move between conversation stages
5. ✅ **Progress Tracking**: Visual progress bar
6. ✅ **TTS Integration**: Click to hear any line
7. ✅ **Visual Feedback**: Highlight active exchange
8. ✅ **Responsive Design**: Works on mobile and desktop

## Next Steps:

1. Create `contextual_conversations/index.json`
2. Add API endpoints to `server.js`
3. Create `views/conversations/` directory
4. Test with existing `restaurant_english.json`
5. Create more conversation files

