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
    
    console.log('Populating phrases - showBilingual:', showBilingual, 'translationLanguage:', translationLanguage);
    
    phraseSelect.innerHTML = '<option value="">-- Choose a phrase --</option>';
    
    if (!currentPhrases || currentPhrases.length === 0) {
        phraseSelect.disabled = true;
        return;
    }
    
    currentPhrases.forEach((phraseObj, index) => {
        const option = document.createElement('option');
        
        const targetLangField = translationData.nativeLanguageField || LANGUAGE;
        const targetText = phraseObj[targetLangField] || phraseObj[LANGUAGE];
        
        console.log('Phrase', index, '- targetLangField:', targetLangField, 'targetText:', targetText);
        
        option.value = targetText;
        option.setAttribute('data-phrase-index', index);
        option.setAttribute('data-category', currentCategory);
        
        if (showBilingual && phraseObj[translationLanguage]) {
            const translationText = phraseObj[translationLanguage];
            console.log('  Translation in', translationLanguage, ':', translationText);
            option.setAttribute('data-translation-text', translationText);
            option.textContent = `${targetText} — ${translationText}`;
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
    
    console.log('=== USE SELECTED PHRASE ===');
    console.log('showBilingual:', showBilingual);
    console.log('translationLanguage:', translationLanguage);
    
    if (selectedOption && selectedOption.value) {
        if (showBilingual) {
            const translationText = selectedOption.getAttribute('data-translation-text');
            console.log('Bilingual mode - using translation:', translationText);
            console.log('Original value:', selectedOption.value);
            document.getElementById('demoText').value = translationText || selectedOption.value;
        } else {
            console.log('Monolingual mode - using original:', selectedOption.value);
            document.getElementById('demoText').value = selectedOption.value;
        }
        console.log('Text box value set to:', document.getElementById('demoText').value);
        console.log('Calling speak()...');
        speak();
    }
    console.log('=== END USE SELECTED PHRASE ===\n');
}

// Handle translation toggle
function onTranslationToggle() {
    const checkbox = document.getElementById('showTranslation');
    const translationSelect = document.getElementById('translationLang');
    
    console.log('=== TRANSLATION TOGGLE ===');
    console.log('Checkbox checked:', checkbox.checked);
    console.log('Previous showBilingual:', showBilingual);
    
    showBilingual = checkbox.checked;
    translationSelect.disabled = !showBilingual;
    
    console.log('New showBilingual:', showBilingual);
    console.log('Translation select disabled:', translationSelect.disabled);
    
    if (showBilingual) {
        translationLanguage = translationSelect.value;
        console.log('Translation language set to:', translationLanguage);
    }
    
    // Refresh phrase dropdown if category is selected
    if (currentCategory && currentPhrases.length > 0) {
        console.log('Refreshing phrase dropdown for category:', currentCategory);
        populatePhraseDropdown();
    } else {
        console.log('No category selected, skipping dropdown refresh');
    }
    console.log('=== END TRANSLATION TOGGLE ===\n');
}

// Handle translation language change
function onTranslationLanguageChange() {
    const translationSelect = document.getElementById('translationLang');
    const oldLang = translationLanguage;
    translationLanguage = translationSelect.value;
    
    console.log('=== TRANSLATION LANGUAGE CHANGE ===');
    console.log('Changed from:', oldLang, 'to:', translationLanguage);
    console.log('showBilingual:', showBilingual);
    console.log('currentCategory:', currentCategory);
    console.log('currentPhrases count:', currentPhrases.length);
    
    if (showBilingual && currentCategory && currentPhrases.length > 0) {
        console.log('Refreshing phrase dropdown with new translation language');
        populatePhraseDropdown();
    }
    console.log('=== END TRANSLATION LANGUAGE CHANGE ===\n');
}

async function speak() {
    const text = document.getElementById('demoText').value.trim();
    const status = document.getElementById('demoStatus');
    const audioPlayer = document.getElementById('demoAudioPlayer');
    
    console.log('=== SPEAK FUNCTION ===');
    console.log('Text to speak:', text);
    console.log('showBilingual:', showBilingual);
    console.log('translationLanguage:', translationLanguage);
    console.log('LANGUAGE (page language):', LANGUAGE);
    
    if (!text) {
        showDemoStatus('Please enter some text', 'error');
        return;
    }
    
    const speechLanguage = (showBilingual && translationLanguage) ? translationLanguage : LANGUAGE;
    console.log('Speech will be generated in:', speechLanguage);
    console.log('Calculation: showBilingual =', showBilingual, ', translationLanguage =', translationLanguage);
    
    try {
        showDemoStatus(`Generating ${speechLanguage} speech...`, 'loading');
        
        console.log('Sending request to /api/speak with:', { text, language: speechLanguage });
        
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
        
        console.log('Response status:', response.status);
        
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
        console.log('Speech generated successfully');
        
    } catch (error) {
        console.error('Error:', error);
        showDemoStatus('Error: ' + error.message, 'error');
    }
    console.log('=== END SPEAK FUNCTION ===\n');
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
    console.log('=== PAGE LOADED ===');
    console.log('LANGUAGE:', LANGUAGE);
    console.log('Initial showBilingual:', showBilingual);
    console.log('Initial translationLanguage:', translationLanguage);
    
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
    const showTranslationCheckbox = document.getElementById('showTranslation');
    
    console.log('Setting up event listeners...');
    console.log('  categorySelect:', !!categorySelect);
    console.log('  phraseSelect:', !!phraseSelect);
    console.log('  translationLangSelect:', !!translationLangSelect);
    console.log('  showTranslationCheckbox:', !!showTranslationCheckbox);
    
    if (categorySelect) {
        categorySelect.addEventListener('change', onCategoryChange);
        console.log('  ✓ Category change listener attached');
    }
    
    if (phraseSelect) {
        phraseSelect.addEventListener('change', onPhraseChange);
        console.log('  ✓ Phrase change listener attached');
    }
    
    if (translationLangSelect) {
        translationLangSelect.addEventListener('change', onTranslationLanguageChange);
        console.log('  ✓ Translation language change listener attached');
    }
    
    if (showTranslationCheckbox) {
        showTranslationCheckbox.addEventListener('change', onTranslationToggle);
        console.log('  ✓ Translation toggle listener attached');
    }
    
    console.log('=== INITIALIZATION COMPLETE ===\n');
});
