/**
 * Demo page JavaScript for language-specific TTS
 */

// Store translation data
let translationData = null;
let showBilingual = false;
let translationLanguage = 'english';

// Load translations when page loads
async function loadTranslations() {
    try {
        const response = await fetch(`/translations/${LANGUAGE}.json`);
        if (!response.ok) {
            throw new Error('Failed to load translations');
        }
        translationData = await response.json();
        populateCategoryDropdown();
        
        // Remove current language from translation options
        removeCurrentLanguageOption();
    } catch (error) {
        console.error('Error loading translations:', error);
    }
}

// Remove the current language from translation language dropdown
function removeCurrentLanguageOption() {
    const translationSelect = document.getElementById('translationLang');
    if (!translationSelect) return;
    
    const options = translationSelect.querySelectorAll('option');
    options.forEach(option => {
        if (option.value === LANGUAGE) {
            option.remove();
        }
    });
}

// Handle translation toggle
function onTranslationToggle() {
    const checkbox = document.getElementById('showTranslation');
    const translationSelect = document.getElementById('translationLang');
    
    showBilingual = checkbox.checked;
    translationSelect.disabled = !showBilingual;
    
    // Repopulate phrase dropdown if a category is selected
    const categorySelect = document.getElementById('categorySelect');
    if (categorySelect.value) {
        onCategoryChange();
    }
}

// Handle translation language change
function onTranslationLanguageChange() {
    const translationSelect = document.getElementById('translationLang');
    translationLanguage = translationSelect.value;
    
    // Repopulate phrase dropdown if a category is selected
    const categorySelect = document.getElementById('categorySelect');
    if (categorySelect.value) {
        onCategoryChange();
    }
}

// Populate category dropdown
function populateCategoryDropdown() {
    const categorySelect = document.getElementById('categorySelect');
    if (!categorySelect || !translationData) return;
    
    // Clear existing options except the first one
    categorySelect.innerHTML = '<option value="">-- Choose a category --</option>';
    
    // Add categories
    Object.keys(translationData.categories).forEach(categoryKey => {
        const category = translationData.categories[categoryKey];
        const option = document.createElement('option');
        option.value = categoryKey;
        // Use translated category name if available, otherwise use key
        option.textContent = translationData.categoryNames ? translationData.categoryNames[categoryKey] : categoryKey;
        categorySelect.appendChild(option);
    });
}

// Handle category selection
function onCategoryChange() {
    const categorySelect = document.getElementById('categorySelect');
    const phraseSelect = document.getElementById('phraseSelect');
    const usePhraseBtn = document.getElementById('usePhraseBtn');
    const selectedCategory = categorySelect.value;
    
    // Reset phrase dropdown
    phraseSelect.innerHTML = '<option value="">-- Choose a phrase --</option>';
    phraseSelect.disabled = true;
    usePhraseBtn.disabled = true;
    
    if (!selectedCategory || !translationData) return;
    
    // Populate phrases for selected category
    const category = translationData.categories[selectedCategory];
    if (category && Array.isArray(category)) {
        category.forEach((phraseObj, index) => {
            const option = document.createElement('option');
            
            // Get the target language text
            const targetLangField = translationData.nativeLanguageField || LANGUAGE;
            const targetText = phraseObj[targetLangField] || phraseObj[LANGUAGE];
            
            // Store the target language text as value
            option.value = targetText;
            option.setAttribute('data-phrase-index', index);
            option.setAttribute('data-category', selectedCategory);
            
            // Store translation text if bilingual mode
            if (showBilingual && phraseObj[translationLanguage]) {
                option.setAttribute('data-translation-text', phraseObj[translationLanguage]);
            }
            
            // Display bilingual or monolingual
            if (showBilingual && phraseObj[translationLanguage]) {
                option.textContent = `${targetText} — ${phraseObj[translationLanguage]}`;
            } else {
                option.textContent = targetText;
            }
            
            phraseSelect.appendChild(option);
        });
        phraseSelect.disabled = false;
    }
}

// Handle phrase selection
function onPhraseChange() {
    const phraseSelect = document.getElementById('phraseSelect');
    const usePhraseBtn = document.getElementById('usePhraseBtn');
    
    if (phraseSelect.value) {
        usePhraseBtn.disabled = false;
    } else {
        usePhraseBtn.disabled = true;
    }
}

// Use selected phrase
function useSelectedPhrase() {
    const phraseSelect = document.getElementById('phraseSelect');
    const selectedOption = phraseSelect.options[phraseSelect.selectedIndex];
    
    if (selectedOption && selectedOption.value) {
        // If bilingual mode is active, use translation text
        if (showBilingual) {
            const translationText = selectedOption.getAttribute('data-translation-text');
            if (translationText) {
                document.getElementById('demoText').value = translationText;
            } else {
                document.getElementById('demoText').value = selectedOption.value;
            }
        } else {
            document.getElementById('demoText').value = selectedOption.value;
        }
        // Optionally auto-play
        speak();
    }
}

async function speak() {
    const text = document.getElementById('demoText').value.trim();
    const status = document.getElementById('demoStatus');
    const audioPlayer = document.getElementById('demoAudioPlayer');
    
    if (!text) {
        showDemoStatus('Please enter some text', 'error');
        return;
    }
    
    // Use translation language if bilingual mode is active
    const speechLanguage = (showBilingual && translationLanguage) ? translationLanguage : LANGUAGE;
    
    try {
        showDemoStatus(`Generating ${speechLanguage} speech...`, 'loading');
        
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
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to generate speech');
        }
        
        // Convert response to blob and create audio URL
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Set audio source and play
        audioPlayer.src = audioUrl;
        audioPlayer.style.display = 'block';
        audioPlayer.play();
        
        showDemoStatus('✓ Speech generated successfully!', 'success');
        
    } catch (error) {
        console.error('Error:', error);
        showDemoStatus('Error: ' + error.message, 'error');
    }
}

function clearText() {
    document.getElementById('demoText').value = '';
    document.getElementById('demoStatus').style.display = 'none';
    document.getElementById('demoAudioPlayer').style.display = 'none';
}

function useExample(text) {
    document.getElementById('demoText').value = text;
    // Optionally auto-play
    speak();
}

function showDemoStatus(message, type) {
    const status = document.getElementById('demoStatus');
    status.textContent = message;
    status.className = 'status ' + type;
    status.style.display = 'block';
}

// Keyboard shortcuts
document.addEventListener('DOMContentLoaded', () => {
    const textarea = document.getElementById('demoText');
    if (textarea) {
        // Ctrl+Enter to speak
        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                e.preventDefault();
                speak();
            }
        });
    }
    
    // Load translations and set up dropdowns
    loadTranslations();
    
    // Add event listeners for dropdowns
    const categorySelect = document.getElementById('categorySelect');
    const phraseSelect = document.getElementById('phraseSelect');
    const translationLangSelect = document.getElementById('translationLang');
    
    if (categorySelect) {
        categorySelect.addEventListener('change', onCategoryChange);
    }
    
    if (phraseSelect) {
        phraseSelect.addEventListener('change', onPhraseChange);
    }
    
    if (translationLangSelect) {
        translationLangSelect.addEventListener('change', onTranslationLanguageChange);
    }
});
