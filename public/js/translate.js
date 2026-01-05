/**
 * Translation Mode - Bilingual Communication Interface
 */

let currentSourceLanguage = '';
let currentTargetLanguage = '';
let currentCategory = '';
let currentPhrases = [];

// DOM Elements
const sourceLanguageSelect = document.getElementById('sourceLanguage');
const targetLanguageSelect = document.getElementById('targetLanguage');
const categorySelect = document.getElementById('categorySelect');
const phraseSelect = document.getElementById('phraseSelect');
const translateBtn = document.getElementById('translateBtn');
const resultsSection = document.getElementById('resultsSection');
const audioPlayer = document.getElementById('audioPlayer');
const audioStatus = document.getElementById('audioStatus');
const speakBtn = document.getElementById('speakBtn');

// Event Listeners
sourceLanguageSelect.addEventListener('change', onSourceLanguageChange);
targetLanguageSelect.addEventListener('change', onTargetLanguageChange);
categorySelect.addEventListener('change', onCategoryChange);
phraseSelect.addEventListener('change', onPhraseChange);
translateBtn.addEventListener('click', translatePhrase);
speakBtn.addEventListener('click', playTargetAudio);

/**
 * Handle source language selection
 */
async function onSourceLanguageChange() {
    currentSourceLanguage = sourceLanguageSelect.value;
    
    if (!currentSourceLanguage) {
        categorySelect.disabled = true;
        phraseSelect.disabled = true;
        translateBtn.disabled = true;
        categorySelect.innerHTML = '<option value="">-- Choose a category --</option>';
        phraseSelect.innerHTML = '<option value="">-- Choose a phrase --</option>';
        return;
    }

    // Load categories for source language
    try {
        const response = await fetch(`/api/categories/${currentSourceLanguage}`);
        if (!response.ok) throw new Error('Failed to load categories');
        
        const data = await response.json();
        
        // Populate category dropdown
        categorySelect.innerHTML = '<option value="">-- Choose a category --</option>';
        data.categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = data.categoryNames[cat] || cat;
            categorySelect.appendChild(option);
        });
        
        categorySelect.disabled = false;
        checkReadyToTranslate();
    } catch (error) {
        console.error('Error loading categories:', error);
        showStatus('Error loading categories', 'error', audioStatus);
    }
}

/**
 * Handle target language selection
 */
function onTargetLanguageChange() {
    currentTargetLanguage = targetLanguageSelect.value;
    checkReadyToTranslate();
}

/**
 * Handle category selection
 */
async function onCategoryChange() {
    currentCategory = categorySelect.value;
    
    if (!currentCategory) {
        phraseSelect.disabled = true;
        phraseSelect.innerHTML = '<option value="">-- Choose a phrase --</option>';
        translateBtn.disabled = true;
        return;
    }

    // Load phrases for selected category
    try {
        const response = await fetch(`/api/phrases/${currentSourceLanguage}/${currentCategory}`);
        if (!response.ok) throw new Error('Failed to load phrases');
        
        const data = await response.json();
        currentPhrases = data.phrases;
        
        // Populate phrase dropdown with text in source language
        phraseSelect.innerHTML = '<option value="">-- Choose a phrase --</option>';
        data.phrases.forEach((phrase, index) => {
            const option = document.createElement('option');
            option.value = index;
            // Show phrase in source language
            option.textContent = phrase[data.nativeLanguageField] || phrase.english;
            option.dataset.english = phrase.english;
            phraseSelect.appendChild(option);
        });
        
        phraseSelect.disabled = false;
        checkReadyToTranslate();
    } catch (error) {
        console.error('Error loading phrases:', error);
        showStatus('Error loading phrases', 'error', audioStatus);
    }
}

/**
 * Handle phrase selection
 */
function onPhraseChange() {
    checkReadyToTranslate();
}

/**
 * Check if all selections are made
 */
function checkReadyToTranslate() {
    const ready = currentSourceLanguage && 
                  currentTargetLanguage && 
                  currentCategory && 
                  phraseSelect.value;
    
    translateBtn.disabled = !ready;
}

/**
 * Translate the selected phrase
 */
async function translatePhrase() {
    const phraseIndex = phraseSelect.value;
    if (!phraseIndex) return;

    const selectedOption = phraseSelect.options[phraseSelect.selectedIndex];
    const englishPhrase = selectedOption.dataset.english;

    showStatus('Translating...', 'loading', audioStatus);
    resultsSection.style.display = 'none';

    try {
        const response = await fetch(
            `/api/translate/${currentSourceLanguage}/${currentTargetLanguage}/${currentCategory}/${encodeURIComponent(englishPhrase)}`
        );
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Translation failed');
        }

        const data = await response.json();
        displayTranslation(data);
        
        showStatus('Translation complete!', 'success', audioStatus);
    } catch (error) {
        console.error('Translation error:', error);
        showStatus(`Error: ${error.message}`, 'error', audioStatus);
    }
}

/**
 * Display translation results
 */
function displayTranslation(data) {
    // Update source language section
    document.getElementById('sourceLangName').textContent = 
        sourceLanguageSelect.options[sourceLanguageSelect.selectedIndex].text;
    document.getElementById('sourceText').textContent = data.source.text;
    document.getElementById('sourcePhonetic').textContent = data.source.phonetic || 'N/A';
    document.getElementById('sourceEnglish').textContent = data.source.english;

    // Update target language section
    document.getElementById('targetLangName').textContent = 
        targetLanguageSelect.options[targetLanguageSelect.selectedIndex].text;
    document.getElementById('targetText').textContent = data.target.text;
    document.getElementById('targetPhonetic').textContent = data.target.phonetic || 'N/A';

    // Store target text for audio playback
    speakBtn.dataset.text = data.target.text;
    speakBtn.dataset.language = currentTargetLanguage;

    // Show results
    resultsSection.style.display = 'block';
    
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Play audio for target language phrase
 */
async function playTargetAudio() {
    const text = speakBtn.dataset.text;
    const language = speakBtn.dataset.language;

    if (!text || !language) {
        showStatus('No phrase selected', 'error', audioStatus);
        return;
    }

    showStatus('Generating audio...', 'loading', audioStatus);
    audioPlayer.style.display = 'none';

    try {
        const response = await fetch('/api/speak', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, language })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'TTS service not available');
        }

        const data = await response.json();
        
        // Play audio
        audioPlayer.src = data.audioPath;
        audioPlayer.style.display = 'block';
        audioPlayer.play();
        
        showStatus('Playing audio...', 'success', audioStatus);
        
        audioPlayer.onended = () => {
            showStatus('Audio playback complete', 'success', audioStatus);
        };
    } catch (error) {
        console.error('TTS Error:', error);
        showStatus(`Error: ${error.message}`, 'error', audioStatus);
    }
}

/**
 * Show status message
 */
function showStatus(message, type, element) {
    element.textContent = message;
    element.className = 'status';
    
    if (type === 'error') {
        element.classList.add('error');
    } else if (type === 'success') {
        element.classList.add('success');
    } else if (type === 'loading') {
        element.classList.add('loading');
    }
    
    element.style.display = 'block';
}
