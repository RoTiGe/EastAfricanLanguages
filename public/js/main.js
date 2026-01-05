/**
 * Main JavaScript for TTS functionality
 */

async function speakText() {
    const text = document.getElementById('quickText').value.trim();
    const language = document.getElementById('quickLanguage').value;
    const status = document.getElementById('status');
    const audioPlayer = document.getElementById('audioPlayer');

    if (!text) {
        showStatus('Please enter some text', 'error');
        return;
    }

    try {
        showStatus('Generating speech...', 'loading');

        const response = await fetch('/api/speak', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: text,
                language: language
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

        // Convert response to blob and create audio URL
        const audioBlob = await response.blob();

        // FIX: Revoke old blob URL before creating new one to prevent memory leak
        if (audioPlayer.src && audioPlayer.src.startsWith('blob:')) {
            URL.revokeObjectURL(audioPlayer.src);
        }

        const audioUrl = URL.createObjectURL(audioBlob);

        // Set audio source and play
        audioPlayer.src = audioUrl;
        audioPlayer.style.display = 'block';
        audioPlayer.play();

        // FIX: Revoke blob URL when audio ends to free memory
        audioPlayer.addEventListener('ended', () => {
            URL.revokeObjectURL(audioUrl);
        }, { once: true });

        showStatus('Speech generated successfully!', 'success');

    } catch (error) {
        console.error('Error:', error);
        showStatus('Error: ' + error.message, 'error');
    }
}

function showStatus(message, type) {
    const status = document.getElementById('status');
    status.textContent = message;
    status.className = 'status ' + type;
    status.style.display = 'block';
}

// Allow Enter key to trigger speech (with Shift+Enter for new line)
document.addEventListener('DOMContentLoaded', () => {
    const textarea = document.getElementById('quickText');
    if (textarea) {
        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                speakText();
            }
        });
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

