# Contextual Conversations - Implementation Example

## Step-by-Step Implementation Guide

### Step 1: Create Metadata Index File

**File: `contextual_conversations/index.json`**

```json
{
  "version": "1.0",
  "last_updated": "2026-01-06",
  "total_conversations": 1,
  "contexts": [
    {
      "context_id": "restaurant",
      "context_name": "Restaurant",
      "icon": "🍽️",
      "description": "Dining out, ordering food, restaurant etiquette",
      "priority": "high",
      "use_cases": ["tourism", "daily_life"]
    }
  ],
  "conversations": [
    {
      "conversation_id": "restaurant_english_001",
      "context": "restaurant",
      "language": "english",
      "title": "First Time at a Restaurant",
      "difficulty": "intermediate",
      "stages": 7,
      "estimated_time": "10 minutes",
      "file": "restaurant_english.json"
    }
  ]
}
```

### Step 2: Add Backend API Endpoints

**Add to `server.js` (after line 197):**

```javascript
// ============================================================================
// CONTEXTUAL CONVERSATIONS API ENDPOINTS
// ============================================================================

// Get list of all available conversations
app.get('/api/conversations', async (req, res) => {
    try {
        const indexPath = path.join(__dirname, 'contextual_conversations', 'index.json');
        const fileContent = await fs.readFile(indexPath, 'utf8');
        const indexData = JSON.parse(fileContent);
        res.json(indexData);
    } catch (error) {
        console.error('Error loading conversations index:', error);
        res.status(500).json({ error: 'Failed to load conversations index' });
    }
});

// Get specific conversation
app.get('/api/conversations/:context/:language', async (req, res) => {
    const context = path.basename(req.params.context);
    const language = path.basename(req.params.language);
    
    // Validate inputs
    if (!/^[a-z_]+$/.test(context) || !/^[a-z_]+$/.test(language)) {
        return res.status(400).json({ error: 'Invalid context or language format' });
    }
    
    try {
        const conversationPath = path.join(
            __dirname, 
            'contextual_conversations', 
            `${context}_${language}.json`
        );
        const fileContent = await fs.readFile(conversationPath, 'utf8');
        const conversationData = JSON.parse(fileContent);
        res.json(conversationData);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return res.status(404).json({ error: 'Conversation not found' });
        }
        console.error('Error loading conversation:', error);
        res.status(500).json({ error: 'Failed to load conversation' });
    }
});

// Get all conversations for a specific context (all languages)
app.get('/api/conversations/context/:context', async (req, res) => {
    const context = path.basename(req.params.context);
    
    if (!/^[a-z_]+$/.test(context)) {
        return res.status(400).json({ error: 'Invalid context format' });
    }
    
    try {
        const indexPath = path.join(__dirname, 'contextual_conversations', 'index.json');
        const fileContent = await fs.readFile(indexPath, 'utf8');
        const indexData = JSON.parse(fileContent);
        
        const filtered = indexData.conversations.filter(c => c.context === context);
        res.json({ conversations: filtered });
    } catch (error) {
        console.error('Error loading conversations by context:', error);
        res.status(500).json({ error: 'Failed to load conversations' });
    }
});

// Get all conversations for a specific language (all contexts)
app.get('/api/conversations/language/:language', async (req, res) => {
    const language = path.basename(req.params.language);
    
    if (!config.isValidLanguage(language)) {
        return res.status(404).json({ error: 'Language not supported' });
    }
    
    try {
        const indexPath = path.join(__dirname, 'contextual_conversations', 'index.json');
        const fileContent = await fs.readFile(indexPath, 'utf8');
        const indexData = JSON.parse(fileContent);
        
        const filtered = indexData.conversations.filter(c => c.language === language);
        res.json({ conversations: filtered });
    } catch (error) {
        console.error('Error loading conversations by language:', error);
        res.status(500).json({ error: 'Failed to load conversations' });
    }
});
```

### Step 3: Add Frontend Routes

**Add to `server.js` (after line 611):**

```javascript
// ============================================================================
// CONTEXTUAL CONVERSATIONS PAGES
// ============================================================================

// Conversations index page
app.get('/conversations', async (req, res) => {
    try {
        const indexPath = path.join(__dirname, 'contextual_conversations', 'index.json');
        const fileContent = await fs.readFile(indexPath, 'utf8');
        const indexData = JSON.parse(fileContent);
        
        res.render('conversations/index', {
            title: 'Contextual Conversations',
            indexData: indexData,
            languages: config.LANGUAGES,
            languageNames: config.LANGUAGE_NAMES
        });
    } catch (error) {
        console.error('Error loading conversations index:', error);
        res.status(500).send('Failed to load conversations');
    }
});

// Specific conversation viewer
app.get('/conversations/:context/:language', async (req, res) => {
    const context = path.basename(req.params.context);
    const language = path.basename(req.params.language);
    
    if (!/^[a-z_]+$/.test(context) || !config.isValidLanguage(language)) {
        return res.status(404).send('Conversation not found');
    }
    
    try {
        const conversationPath = path.join(
            __dirname,
            'contextual_conversations',
            `${context}_${language}.json`
        );
        const fileContent = await fs.readFile(conversationPath, 'utf8');
        const conversationData = JSON.parse(fileContent);
        
        res.render('conversations/viewer', {
            title: conversationData.conversation_title || 'Conversation',
            conversation: conversationData,
            context: context,
            language: language,
            languageName: config.LANGUAGE_NAMES[language]
        });
    } catch (error) {
        if (error.code === 'ENOENT') {
            return res.status(404).send('Conversation not found');
        }
        console.error('Error loading conversation:', error);
        res.status(500).send('Failed to load conversation');
    }
});
```

### Step 4: Create Conversations Index View

**File: `views/conversations/index.ejs`**

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
</head>
<body>
    <div class="container-fluid p-0">
        <header class="text-white py-4 position-relative">
            <div class="container">
                <a href="/" class="btn btn-light position-absolute top-0 start-0 m-3">
                    <i class="bi bi-arrow-left me-2"></i>Back to Home
                </a>
                <h1 class="text-center display-5 fw-bold">
                    <i class="bi bi-chat-dots me-2"></i><%= title %>
                </h1>
                <p class="text-center lead">Learn through real-world dialogues</p>
            </div>
        </header>

        <main class="container my-5">
            <!-- Info Alert -->
            <div class="alert alert-info mb-4">
                <i class="bi bi-info-circle me-2"></i>
                <strong>Interactive Conversations:</strong> Practice real-world scenarios with 
                native pronunciation. Click any conversation to start learning!
            </div>

            <!-- Filters -->
            <div class="card mb-4">
                <div class="card-body">
                    <div class="row g-3">
                        <div class="col-md-4">
                            <label class="form-label">Context</label>
                            <select class="form-select" id="filterContext">
                                <option value="">All Contexts</option>
                                <% indexData.contexts.forEach(ctx => { %>
                                    <option value="<%= ctx.context_id %>">
                                        <%= ctx.icon %> <%= ctx.context_name %>
                                    </option>
                                <% }); %>
                            </select>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">Language</label>
                            <select class="form-select" id="filterLanguage">
                                <option value="">All Languages</option>
                                <% languages.forEach(lang => { %>
                                    <option value="<%= lang %>"><%= languageNames[lang] %></option>
                                <% }); %>
                            </select>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">Difficulty</label>
                            <select class="form-select" id="filterDifficulty">
                                <option value="">All Levels</option>
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Conversations Grid -->
            <div id="conversationsGrid" class="row g-4">
                <!-- Will be populated by JavaScript -->
            </div>
        </main>

        <footer class="bg-dark text-white text-center py-4 mt-5">
            <div class="container">
                <p class="mb-0">© 2026 Sound Training - Contextual Conversations</p>
            </div>
        </footer>
    </div>

    <script>
        const allConversations = <%- JSON.stringify(indexData.conversations) %>;
        const contexts = <%- JSON.stringify(indexData.contexts) %>;
        const languageNames = <%- JSON.stringify(languageNames) %>;
        
        // Display conversations on page load
        displayConversations(allConversations);
        
        // Filter event listeners
        document.getElementById('filterContext').addEventListener('change', filterConversations);
        document.getElementById('filterLanguage').addEventListener('change', filterConversations);
        document.getElementById('filterDifficulty').addEventListener('change', filterConversations);
        
        function filterConversations() {
            const contextFilter = document.getElementById('filterContext').value;
            const languageFilter = document.getElementById('filterLanguage').value;
            const difficultyFilter = document.getElementById('filterDifficulty').value;
            
            const filtered = allConversations.filter(conv => {
                if (contextFilter && conv.context !== contextFilter) return false;
                if (languageFilter && conv.language !== languageFilter) return false;
                if (difficultyFilter && conv.difficulty !== difficultyFilter) return false;
                return true;
            });
            
            displayConversations(filtered);
        }
        
        function displayConversations(conversations) {
            const grid = document.getElementById('conversationsGrid');
            
            if (conversations.length === 0) {
                grid.innerHTML = `
                    <div class="col-12">
                        <div class="alert alert-warning">
                            <i class="bi bi-exclamation-triangle me-2"></i>
                            No conversations match your filters. Try adjusting your selection.
                        </div>
                    </div>
                `;
                return;
            }
            
            grid.innerHTML = conversations.map(conv => {
                const ctx = contexts.find(c => c.context_id === conv.context);
                const icon = ctx ? ctx.icon : '💬';
                const difficultyBadge = getDifficultyBadge(conv.difficulty);
                
                return `
                    <div class="col-md-6 col-lg-4">
                        <div class="card h-100 shadow-sm hover-shadow">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-start mb-3">
                                    <h3 class="h1 mb-0">${icon}</h3>
                                    ${difficultyBadge}
                                </div>
                                <h5 class="card-title">${conv.title}</h5>
                                <p class="text-muted mb-2">
                                    <i class="bi bi-translate me-1"></i>${languageNames[conv.language]}
                                </p>
                                <p class="text-muted mb-3">
                                    <i class="bi bi-clock me-1"></i>${conv.estimated_time} • 
                                    <i class="bi bi-list-ol me-1"></i>${conv.stages} stages
                                </p>
                                <a href="/conversations/${conv.context}/${conv.language}" 
                                   class="btn btn-primary w-100">
                                    <i class="bi bi-play-circle me-2"></i>Start Conversation
                                </a>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }
        
        function getDifficultyBadge(difficulty) {
            const badges = {
                'beginner': '<span class="badge bg-success">⭐ Beginner</span>',
                'intermediate': '<span class="badge bg-warning">⭐⭐ Intermediate</span>',
                'advanced': '<span class="badge bg-danger">⭐⭐⭐ Advanced</span>'
            };
            return badges[difficulty] || '<span class="badge bg-secondary">N/A</span>';
        }
    </script>
</body>
</html>
```

---

## Next: Create Conversation Viewer

See `CONVERSATIONS_VIEWER_IMPLEMENTATION.md` for the interactive viewer component.

