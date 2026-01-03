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
            throw new Error('Failed to generate speech');
        }
        
        // Convert response to blob and create audio URL
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Set audio source and play
        audioPlayer.src = audioUrl;
        audioPlayer.style.display = 'block';
        audioPlayer.play();
        
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
});
