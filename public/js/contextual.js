/**
 * Contextual Phrases Page - Interactive Filtering and TTS
 */

let allPhrases = [];
let currentLanguage = 'english'; // Default language

// Load phrases on page load
document.addEventListener('DOMContentLoaded', async () => {
    await loadPhrases();
    displayPhrases(allPhrases);
});

/**
 * Load contextual phrases from API
 */
async function loadPhrases() {
    try {
        const response = await fetch('/api/contextual/phrases');
        const data = await response.json();
        allPhrases = data.phrases || [];
        console.log(`Loaded ${allPhrases.length} contextual phrases`);
    } catch (error) {
        console.error('Error loading phrases:', error);
        showError('Failed to load contextual phrases. Please refresh the page.');
    }
}

/**
 * Filter phrases based on selected criteria
 */
function filterPhrases() {
    const time = document.getElementById('filterTime').value;
    const relationship = document.getElementById('filterRelationship').value;
    const formality = document.getElementById('filterFormality').value;
    const trust = document.getElementById('filterTrust').value;

    const filtered = allPhrases.filter(phrase => {
        const contexts = phrase.contexts || {};
        
        // Check each filter - if filter is set, context must match
        if (time && contexts.time !== time) return false;
        if (relationship && contexts.relationship !== relationship) return false;
        if (formality && contexts.formality !== formality) return false;
        if (trust && contexts.trust !== trust) return false;
        
        return true;
    });

    console.log(`Filtered to ${filtered.length} phrases`);
    displayPhrases(filtered);
}

/**
 * Display phrases in the UI
 */
function displayPhrases(phrases) {
    const container = document.getElementById('contextual-content');
    
    if (phrases.length === 0) {
        container.innerHTML = `
            <div class="alert alert-warning">
                <i class="bi bi-exclamation-triangle me-2"></i>
                No phrases match the selected filters. Try adjusting your criteria.
            </div>
        `;
        return;
    }

    const html = phrases.map(phrase => createPhraseCard(phrase)).join('');
    container.innerHTML = html;
}

/**
 * Create HTML for a single phrase card
 */
function createPhraseCard(phrase) {
    const contexts = phrase.contexts || {};
    
    return `
        <div class="card mb-3 shadow-sm">
            <div class="card-header bg-primary text-white">
                <div class="d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">${escapeHtml(phrase.base_meaning)}</h5>
                    <div>
                        <span class="badge bg-light text-dark me-1">${contexts.formality || 'N/A'}</span>
                        <span class="badge bg-light text-dark">${contexts.time || 'N/A'}</span>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <div class="row mb-3">
                    <div class="col-md-6">
                        <strong>Category:</strong> ${phrase.category || 'N/A'} / ${phrase.subcategory || 'N/A'}
                    </div>
                    <div class="col-md-6">
                        <strong>Context:</strong> ${contexts.relationship || 'N/A'} (Trust: ${contexts.trust || 'N/A'})
                    </div>
                </div>
                
                <div class="translations-section mb-3">
                    <h6 class="text-muted mb-2">Translations:</h6>
                    ${createTranslationsHTML(phrase.translations)}
                </div>
                
                ${phrase.usage_notes ? `
                    <div class="alert alert-info mb-2">
                        <strong><i class="bi bi-info-circle me-1"></i>Usage:</strong> ${escapeHtml(phrase.usage_notes)}
                    </div>
                ` : ''}
                
                ${phrase.cultural_notes ? `
                    <div class="alert alert-warning mb-0">
                        <strong><i class="bi bi-star me-1"></i>Cultural Note:</strong> ${escapeHtml(phrase.cultural_notes)}
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

/**
 * Create HTML for translations with TTS buttons
 */
function createTranslationsHTML(translations) {
    if (!translations) return '<p class="text-muted">No translations available</p>';
    
    return Object.entries(translations)
        .map(([lang, text]) => `
            <div class="translation-item mb-2 d-flex justify-content-between align-items-center">
                <div>
                    <strong class="text-primary">${capitalizeFirst(lang)}:</strong>
                    <span class="ms-2">${escapeHtml(text)}</span>
                </div>
                <button onclick="speakPhrase('${escapeHtml(text)}', '${lang}')" 
                        class="btn btn-sm btn-outline-primary"
                        title="Speak this phrase">
                    <i class="bi bi-volume-up"></i>
                </button>
            </div>
        `).join('');
}

/**
 * Speak a phrase using TTS
 */
async function speakPhrase(text, language) {
    const button = event.target.closest('button');
    const originalHTML = button.innerHTML;
    
    try {
        // Show loading state
        button.disabled = true;
        button.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';
        
        const response = await fetch('/api/speak', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, language })
        });
        
        if (!response.ok) {
            throw new Error(`TTS failed: ${response.statusText}`);
        }
        
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        audio.play();
        
        // Restore button after audio plays
        audio.onended = () => {
            button.disabled = false;
            button.innerHTML = originalHTML;
        };
        
    } catch (error) {
        console.error('TTS Error:', error);
        button.disabled = false;
        button.innerHTML = originalHTML;
        showError('Failed to generate speech. Please try again.');
    }
}

/**
 * Show error message
 */
function showError(message) {
    const container = document.getElementById('contextual-content');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-danger alert-dismissible fade show';
    errorDiv.innerHTML = `
        <i class="bi bi-exclamation-triangle me-2"></i>${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    container.insertBefore(errorDiv, container.firstChild);
}

/**
 * Utility: Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Utility: Capitalize first letter
 */
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

