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
let showBilingual = false;
let translationLanguage = 'english';

// Load categories when page loads
async function loadCategories() {
    console.log('Loading categories for language:', LANGUAGE);
    try {
        const response = await fetch(`/api/categories/${LANGUAGE}`);
        console.log('Categories response status:', response.status);
        
        if (!response.ok) {
            throw new Error('Failed to load categories');
        }
        
        const data = await response.json();
        console.log('Categories data received:', data);
        
        translationData.language = data.language;
        translationData.nativeLanguageField = data.nativeLanguageField;
        translationData.categoryNames = data.categoryNames || {};
        translationData.categories = data.categories || [];
        
        console.log('Translation data updated:', translationData);
        
        populateCategoryDropdown();
        removeCurrentLanguageOption();
        
    } catch (error) {
        console.error('Error loading categories:', error);
        showDemoStatus('Error loading categories. Please refresh the page.', 'error');
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

// Populate category dropdown
function populateCategoryDropdown() {
    const categorySelect = document.getElementById('categorySelect');
    console.log('Populating category dropdown, element found:', !!categorySelect);
    console.log('Categories to populate:', translationData.categories);
    
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
        console.log('Added category option:', categoryKey, '=', option.textContent);
    });
    
    console.log('Category dropdown populated with', translationData.categories.length, 'categories');
}

// Handle category selection - fetches phrases from API
async function onCategoryChange() {
    const categorySelect = document.getElementById('categorySelect');
    const phraseSelect = document.getElementById('phraseSelect');
    const usePhraseBtn = document.getElementById('usePhraseBtn');
    const selectedCategory = categorySelect.value;
    
    console.log('Category changed to:', selectedCategory);
    
    // Reset phrase dropdown
    phraseSelect.innerHTML = '<option value="">-- Choose a phrase --</option>';
    phraseSelect.disabled = true;
    usePhraseBtn.disabled = true;
    currentPhrases = [];
    
    if (!selectedCategory) return;
    
    try {
        // Show loading state
        phraseSelect.innerHTML = '<option value="">Loading phrases...</option>';
        
        console.log('Fetching phrases for:', LANGUAGE, '/', selectedCategory);
        const response = await fetch(`/api/phrases/${LANGUAGE}/${selectedCategory}`);
        console.log('Phrases response status:', response.status);
        
        if (!response.ok) {
            throw new Error('Failed to load phrases');
        }
        
        const data = await response.json();
        console.log('Phrases data received:', data);
        
        currentCategory = selectedCategory;
        currentPhrases = data.phrases || [];
        
        console.log('Loaded', currentPhrases.length, 'phrases');
        
        populatePhraseDropdown();
        
    } catch (error) {
        console.error('Error loading phrases:', error);
        phraseSelect.innerHTML = '<option value="">Error loading phrases</option>';
        showDemoStatus('Error loading phrases. Please try again.', 'error');
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
        
        const targetLangField = translationData.nativeLanguageField || LANGUAGE;
        const targetText = phraseObj[targetLangField] || phraseObj[LANGUAGE];
        
        option.value = targetText;
        option.setAttribute('data-phrase-index', index);
        option.setAttribute('data-category', currentCategory);
        
        if (showBilingual && phraseObj[translationLanguage]) {
            option.setAttribute('data-translation-text', phraseObj[translationLanguage]);
            option.textContent = `${targetText} — ${phraseObj[translationLanguage]}`;
        } else {
            option.textContent = targetText;
        }
        
        phraseSelect.appendChild(option);
    });
    
    phraseSelect.disabled = false;
    usePhraseBtn.disabled = true;
}

// Handle phrase selection
function onPhraseChange() {
    const phraseSelect = document.getElementById('phraseSelect');
    const usePhraseBtn = document.getElementById('usePhraseBtn');
    
    usePhraseBtn.disabled = !phraseSelect.value;
}

// Use selected phrase
function useSelectedPhrase() {
    const phraseSelect = document.getElementById('phraseSelect');
    const selectedOption = phraseSelect.options[phraseSelect.selectedIndex];
    
    if (selectedOption && selectedOption.value) {
        if (showBilingual) {
            const translationText = selectedOption.getAttribute('data-translation-text');
            document.getElementById('demoText').value = translationText || selectedOption.value;
        } else {
            document.getElementById('demoText').value = selectedOption.value;
        }
        speak();
    }
}

// Handle translation toggle
function onTranslationToggle() {
    const checkbox = document.getElementById('showTranslation');
    const translationSelect = document.getElementById('translationLang');
    
    showBilingual = checkbox.checked;
    translationSelect.disabled = !showBilingual;
    
    if (showBilingual) {
        translationLanguage = translationSelect.value;
    }
    
    // Refresh phrase dropdown if category is selected
    if (currentCategory && currentPhrases.length > 0) {
        populatePhraseDropdown();
    }
}

// Handle translation language change
function onTranslationLanguageChange() {
    const translationSelect = document.getElementById('translationLang');
    translationLanguage = translationSelect.value;
    
    if (showBilingual && currentCategory && currentPhrases.length > 0) {
        populatePhraseDropdown();
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
        
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        
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
        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                e.preventDefault();
                speak();
            }
        });
    }
    
    // Load categories and set up event listeners
    loadCategories();
    
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
