/**
 * Demo page JavaScript for language-specific TTS
 * API-based architecture - translation data protected on server
 */

// Global variables
let translationData = {
    language: null,
    nativeLanguageField: null,
    categoryNames: {},
    categories: []
};
let currentCategory = null;
let currentPhrases = [];
// FIX: Track current request to prevent race conditions
let currentPhraseRequest = null;

// Load categories when page loads
async function loadCategories() {
    const categorySelect = document.getElementById('categorySelect');

    try {
        // Show loading state
        if (categorySelect) {
            categorySelect.innerHTML = '<option value="">⏳ Loading categories...</option>';
            categorySelect.disabled = true;
        }

        // Load category names from NATIVE language (for UI display)
        const response = await fetch(`/api/categories/${NATIVE_LANGUAGE}`);

        if (!response.ok) {
            throw new Error('Failed to load categories');
        }

        const data = await response.json();

        translationData.language = data.language;
        translationData.nativeLanguageField = data.nativeLanguageField;
        translationData.categoryNames = data.categoryNames || {};
        translationData.categories = data.categories || [];

        populateCategoryDropdown();

    } catch (error) {
        console.error('Error loading categories:', error);
        if (categorySelect) {
            categorySelect.innerHTML = '<option value="">❌ Error loading categories</option>';
        }
        showDemoStatus('Error loading categories. Please refresh the page.', 'error');
    }
}

// Populate category dropdown
function populateCategoryDropdown() {
    const categorySelect = document.getElementById('categorySelect');

    if (!categorySelect || !translationData.categories) {
        console.error('Cannot populate dropdown - missing element or data');
        return;
    }

    categorySelect.innerHTML = '<option value="">-- Choose a category --</option>';

    translationData.categories.forEach(categoryKey => {
        const option = document.createElement('option');
        option.value = categoryKey;
        option.textContent = translationData.categoryNames[categoryKey] || categoryKey;
        categorySelect.appendChild(option);
    });

    // Re-enable the dropdown
    categorySelect.disabled = false;
}

// Handle category selection - fetches phrases from API
async function onCategoryChange() {
    const categorySelect = document.getElementById('categorySelect');
    const phraseSelect = document.getElementById('phraseSelect');
    const usePhraseBtn = document.getElementById('usePhraseBtn');
    const selectedCategory = categorySelect.value;

    // Reset phrase dropdown
    phraseSelect.innerHTML = '<option value="">-- Choose a phrase --</option>';
    phraseSelect.disabled = true;
    usePhraseBtn.disabled = true;
    currentPhrases = [];

    if (!selectedCategory) return;

    // FIX: Cancel previous request to prevent race conditions
    if (currentPhraseRequest) {
        currentPhraseRequest.abort();
    }

    const controller = new AbortController();
    currentPhraseRequest = controller;

    try {
        // Show loading state
        categorySelect.disabled = true;
        phraseSelect.innerHTML = '<option value="">⏳ Loading phrases...</option>';

        const response = await fetch(`/api/phrases/${LANGUAGE}/${selectedCategory}`, {
            signal: controller.signal
        });

        if (!response.ok) {
            throw new Error('Failed to load phrases');
        }

        const data = await response.json();

        currentCategory = selectedCategory;
        currentPhrases = data.phrases || [];

        populatePhraseDropdown();

    } catch (error) {
        // FIX: Ignore aborted requests
        if (error.name === 'AbortError') {
            return;
        }
        console.error('Error loading phrases:', error);
        phraseSelect.innerHTML = '<option value="">❌ Error loading phrases</option>';
        showDemoStatus('Error loading phrases. Please try again.', 'error');
    } finally {
        categorySelect.disabled = false;
        // Clear request tracker if this was the current request
        if (currentPhraseRequest === controller) {
            currentPhraseRequest = null;
        }
    }
}

// Populate phrase dropdown with fetched phrases
function populatePhraseDropdown() {
    const phraseSelect = document.getElementById('phraseSelect');
    const usePhraseBtn = document.getElementById('usePhraseBtn');

    phraseSelect.innerHTML = '<option value="">-- Choose a phrase --</option>';

    if (!currentPhrases || currentPhrases.length === 0) {
        phraseSelect.disabled = true;
        return;
    }

    currentPhrases.forEach((phraseObj, index) => {
        const option = document.createElement('option');

        // Show phrase in NATIVE language in dropdown (so user can understand it)
        const nativeText = phraseObj[NATIVE_LANGUAGE] || phraseObj.english || phraseObj[LANGUAGE];

        // But store the TARGET language text as value (for TTS)
        const targetText = phraseObj[LANGUAGE];

        option.value = targetText;
        option.setAttribute('data-phrase-index', index);
        option.setAttribute('data-category', currentCategory);
        option.textContent = nativeText;  // Display in native language

        phraseSelect.appendChild(option);
    });

    phraseSelect.disabled = false;
    usePhraseBtn.disabled = true;
}

// Handle phrase selection
function onPhraseChange() {
    const phraseSelect = document.getElementById('phraseSelect');
    const usePhraseBtn = document.getElementById('usePhraseBtn');
    const translationDisplay = document.getElementById('translationDisplay');

    if (!phraseSelect.value) {
        usePhraseBtn.disabled = true;
        translationDisplay.style.display = 'none';
        return;
    }

    usePhraseBtn.disabled = false;

    // Get the selected phrase data
    const selectedOption = phraseSelect.options[phraseSelect.selectedIndex];
    const phraseIndex = selectedOption.getAttribute('data-phrase-index');

    if (phraseIndex !== null && currentPhrases[phraseIndex]) {
        displayTranslation(currentPhrases[phraseIndex]);
    }
}

// Display translation for selected phrase
function displayTranslation(phraseObj) {
    const translationDisplay = document.getElementById('translationDisplay');
    const nativePhrase = document.getElementById('nativePhrase');
    const targetPhrase = document.getElementById('targetPhrase');
    const targetPhonetic = document.getElementById('targetPhonetic');
    const targetPhoneticText = document.getElementById('targetPhoneticText');
    const nativeLanguageName = document.getElementById('nativeLanguageName');
    const targetLanguageName = document.getElementById('targetLanguageName');

    // Get language names
    const nativeLangDisplay = NATIVE_LANGUAGE.charAt(0).toUpperCase() + NATIVE_LANGUAGE.slice(1);
    const targetLangDisplay = LANGUAGE.charAt(0).toUpperCase() + LANGUAGE.slice(1);

    nativeLanguageName.textContent = nativeLangDisplay;
    targetLanguageName.textContent = targetLangDisplay;

    // Get phrase text in native language
    const nativeText = phraseObj[NATIVE_LANGUAGE] || phraseObj.english || '-';
    nativePhrase.textContent = nativeText;

    // Get phrase text in target language
    const targetText = phraseObj[LANGUAGE] || '-';
    targetPhrase.textContent = targetText;

    // Get phonetic for target language (if available)
    const phoneticField = `${LANGUAGE}_phonetic`;
    const phoneticText = phraseObj[phoneticField] || phraseObj.phonetic;

    if (phoneticText) {
        targetPhoneticText.textContent = phoneticText;
        targetPhonetic.style.display = 'block';
    } else {
        targetPhonetic.style.display = 'none';
    }

    // Show the translation display
    translationDisplay.style.display = 'block';
}

// Use selected phrase
function useSelectedPhrase() {
    const phraseSelect = document.getElementById('phraseSelect');
    const selectedOption = phraseSelect.options[phraseSelect.selectedIndex];

    if (selectedOption && selectedOption.value) {
        document.getElementById('demoText').value = selectedOption.value;
        speak();
    }
}

async function speak() {
    const text = document.getElementById('demoText').value.trim();
    const audioPlayer = document.getElementById('demoAudioPlayer');
    const speakBtn = document.querySelector('button[onclick="speak()"]');

    if (!text) {
        showDemoStatus('Please enter some text', 'error');
        return;
    }

    // CRITICAL FIX: Always use the page's target language (LANGUAGE) for TTS
    // The translation feature is ONLY for visual understanding, NOT for changing TTS language
    const speechLanguage = LANGUAGE;

    try {
        // Disable button and show loading state
        if (speakBtn) {
            speakBtn.disabled = true;
            speakBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Generating...';
        }

        showDemoStatus(`⏳ Generating ${speechLanguage} speech...`, 'loading');

        const response = await fetch('/api/speak', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: text,
                language: speechLanguage
            })
        });

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

        const audioBlob = await response.blob();

        // FIX: Revoke old blob URL before creating new one to prevent memory leak
        if (audioPlayer.src && audioPlayer.src.startsWith('blob:')) {
            URL.revokeObjectURL(audioPlayer.src);
        }

        const audioUrl = URL.createObjectURL(audioBlob);

        audioPlayer.src = audioUrl;
        audioPlayer.style.display = 'block';
        audioPlayer.play();

        // FIX: Revoke blob URL when audio ends to free memory
        audioPlayer.addEventListener('ended', () => {
            URL.revokeObjectURL(audioUrl);
        }, { once: true });

        showDemoStatus('✓ Speech generated successfully!', 'success');

    } catch (error) {
        console.error('Error:', error);
        showDemoStatus('❌ Error: ' + error.message, 'error');
    } finally {
        // Re-enable button
        if (speakBtn) {
            speakBtn.disabled = false;
            speakBtn.innerHTML = '<i class="bi bi-volume-up-fill me-2"></i>Speak';
        }
    }
}

function clearText() {
    document.getElementById('demoText').value = '';
    document.getElementById('demoStatus').style.display = 'none';
    document.getElementById('demoAudioPlayer').style.display = 'none';
}

function showDemoStatus(message, type) {
    const status = document.getElementById('demoStatus');
    status.textContent = message;
    status.className = 'status ' + type;
    status.style.display = 'block';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    const textarea = document.getElementById('demoText');
    if (textarea) {
        // FIX: Standardize keyboard shortcut - Enter (without Shift) to speak, Shift+Enter for newline
        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                speak();
            }
        });
    }

    // Load categories and set up event listeners
    loadCategories();

    const categorySelect = document.getElementById('categorySelect');
    const phraseSelect = document.getElementById('phraseSelect');

    if (categorySelect) {
        categorySelect.addEventListener('change', onCategoryChange);
    }

    if (phraseSelect) {
        phraseSelect.addEventListener('change', onPhraseChange);
    }
    
    // Load advanced mode state from localStorage
    const advancedMode = localStorage.getItem('advancedMode') === 'true';
    const checkbox = document.getElementById('advancedMode');
    if (checkbox) {
        checkbox.checked = advancedMode;
        toggleAdvancedMode();
    }
});

// Toggle advanced mode
function toggleAdvancedMode() {
    const checkbox = document.getElementById('advancedMode');
    const advancedSection = document.getElementById('advancedSection');
    
    if (checkbox && advancedSection) {
        const isAdvanced = checkbox.checked;
        advancedSection.style.display = isAdvanced ? 'block' : 'none';
        
        // Save state to localStorage
        localStorage.setItem('advancedMode', isAdvanced);
    }
}
