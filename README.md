# Multi-language TTS Web Game

A web-based application for Text-to-Speech in multiple languages including Spanish, French, Amharic, Tigrinya, and Oromo.

## Features

- **Multi-language Support**: Spanish, French, Amharic, Tigrinya, Oromo
- **Dual TTS Engines**:
  - Google TTS (gTTS): Spanish, French, Amharic, Tigrinya
  - pyttsx3 (Windows SAPI): Oromo
- **Web Interface**: Built with Express + EJS
- **Real-time Generation**: Generate speech on-demand

## Tech Stack

- **Backend**: Node.js + Express
- **Template Engine**: EJS
- **TTS Engines**: Python + Google TTS (gTTS) + pyttsx3
- **Frontend**: Vanilla JavaScript

## Installation

### 1. Install Node.js Dependencies

```bash
npm install
```

### 2. Python Dependencies (Already Installed)

Python packages are already installed via conda:
- gtts (Google Text-to-Speech)
- pyttsx3 (For Oromo language support)
- flask
- flask-cors
- pywin32 (Required for pyttsx3 on Windows)

## Running the Application

### Step 1: Start the Python TTS Service

In one terminal:

```bash
c:/Users/Robel/Documents/Projects/Sound_Training/.conda/python.exe tts_service.py
```

This will start the TTS service on `http://localhost:5000`

### Step 2: Start the Express Server

In another terminal:

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

This will start the web server on `http://localhost:3000`

### Step 3: Open Your Browser

Navigate to: `http://localhost:3000`

## Usage Examples

### JavaScript Example (Client-side)

```javascript
async function generateSpeech(text, language) {
    const response = await fetch('/api/speak', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text: text,
            language: language  // 'spanish', 'french', 'amharic', 'tigrinya', 'oromo'
        })
    });
    
    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    
    const audio = new Audio(audioUrl);
    audio.play();
}
```

### Express Endpoint Example

```javascript
app.post('/api/speak', async (req, res) => {
    const { text, language } = req.body;
    
    const response = await axios.post('http://localhost:5000/tts', {
        text: text,
        language: language
    }, {
        responseType: 'arraybuffer'
    });
    
    res.set('Content-Type', 'audio/wav');
    res.send(response.data);
});
```

### EJS Template Example

```html
<select id="languageSelect">
    <option value="spanish">Spanish</option>
    <option value="french">French</option>
    <option value="amharic">Amharic</option>
    <option value="tigrinya">Tigrinya</option>
    <option value="oromo">Oromo</option>
</select>

<textarea id="textInput" placeholder="Enter text..."></textarea>
<button onclick="speakText()">Speak</button>

<audio id="audioPlayer" controls></audio>
```

## API Endpoints

### Express Server (Port 3000)

- `GET /` - Home page
- `GET /demo/:language` - Language-specific demo
- `POST /api/speak` - Generate speech
- `GET /api/languages` - Get supported languages
- `GET /health` - Health check

### Python TTS Service (Port 5000)

- `POST /tts` - Generate speech
- `POST /tts/clone` - Generate speech with voice cloning
- `GET /languages` - List supported languages
- `GET /health` - Health check

## Sample Texts

### Spanish
```
"Hola, bienvenido al juego de entrenamiento de sonido."
```

### French
```
"Bonjour, bienvenue au jeu d'entraînement sonore."
```

### Amharic
```
"ሰላም፣ ወደ ድምፅ ስልጠና ጨዋታ እንኳን በደህና መጡ።"
```

### Tigrinya
```
"ሰላም፣ ናብ ድምፂ ስልጠና ጸወታ እንቋዕ ብደሓን መፃእኩም።"
```

### Oromo (via pyttsx3)
```
"Nagaa, gara taphaatiitti baga dhuftan."
```

## TTS Engine Information

- **gTTS (Google TTS)**: Used for Spanish, French, Amharic, and Tigrinya - High quality, cloud-based
- **pyttsx3**: Used for Oromo - Offline, uses Windows SAPI voices

## Project Structure

```
Sound_Training/
├── server.js              # Express server
├── tts_service.py         # Python TTS service
├── package.json           # Node dependencies
├── views/
│   ├── index.ejs         # Home page
│   └── demo.ejs          # Demo page
├── public/
│   ├── css/
│   │   └── style.css     # Styles
│   └── js/
│       ├── main.js       # Main JS
│       └── demo.js       # Demo JS
└── audio_output/         # Generated audio files
```

## Notes

- First TTS generation may take 1-2 minutes as the model loads
- Subsequent requests are faster
- Audio files are generated in WAV format
- For Amharic/Tigrinya, ensure you have UTF-8 encoding support

## Troubleshooting

1. **TTS Service not responding**: Ensure Python service is running on port 5000
2. **Audio not playing**: Check browser console for errors
3. **Model loading slow**: First load downloads model files (normal)
4. **Language not working**: Verify language code matches supported languages

## License

MIT
