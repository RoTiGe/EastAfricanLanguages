# Render Deployment Guide

This document outlines different strategies for deploying the East African Languages Sound Training App to Render.com.

## Current Architecture Challenges

The application currently has a **dual-runtime architecture**:
- **Node.js/Express** (`server.js`) - Web server and API endpoints
- **Python/Flask** (`tts_service.py`) - Text-to-Speech generation service

Additionally, there are several compatibility issues:
1. **pyttsx3** - Windows SAPI dependency (won't work on Linux)
2. **Ephemeral file system** - Audio files and uploads are temporary
3. **Background cleanup thread** - Assumes persistent storage

---

## Option 1: Single Service (Quick Fix) ⭐ CURRENT

Run both Node.js and Python in a single Render web service.

### Pros
- Simple setup - one service to manage
- No inter-service networking needed
- Lower cost (free tier available)
- Fast deployment

### Cons
- Mixed runtime (less clean separation)
- Shared resources between services
- If one crashes, both go down
- File storage still ephemeral

### Implementation

#### Files Created
- `requirements.txt` - Python dependencies
- `render-build.sh` - Build script
- `start-render.sh` - Startup script (runs both services)

#### Render Configuration

**Service Type:** Web Service

**Build Command:**
```bash
bash render-build.sh
```

**Start Command:**
```bash
bash start-render.sh
```

**Environment Variables:**
```
NODE_ENV=production
TTS_SERVICE_URL=http://localhost:5000
TTS_SERVICE_PORT=5000
PORT=3000
MAX_TEXT_LENGTH=5000
```

**Port:** 3000 (Render will use PORT environment variable)

#### Limitations Addressed
- ❌ **pyttsx3 removed** - Only gTTS works on Linux
- ⚠️ **Audio files** - Stored in `/tmp` (ephemeral, deleted on restart)
- ⚠️ **Uploads** - Lost on restart (use cloud storage for production)
- ✅ **Language support** - All gTTS languages work (Spanish, French, Amharic, Arabic, Swahili, etc.)

#### Languages Affected
These languages will **NOT work** (they relied on pyttsx3):
- Oromo
- Somali
- Hadiyaa
- Wolayitta
- Afar
- Gamo
- Luo

To restore these, you'll need Option 3 (Advanced TTS).

---

## Option 2: Two Separate Services (Recommended for Production)

Deploy as two independent Render services with internal networking.

### Pros
- Clean separation of concerns
- Independent scaling (scale TTS separately if needed)
- If one service crashes, the other stays up
- Better resource management
- Industry best practice

### Cons
- More complex setup
- Higher cost (2 services)
- Requires internal networking configuration
- Need to manage service dependencies

### Implementation

#### Service 1: Web Service (Node.js)

**Service Name:** `eastafrican-languages-web`

**Build Command:**
```bash
npm install
```

**Start Command:**
```bash
node server.js
```

**Environment Variables:**
```
NODE_ENV=production
TTS_SERVICE_URL=https://eastafrican-languages-tts.onrender.com
PORT=3000
ALLOWED_ORIGINS=https://eastafrican-languages-web.onrender.com
```

#### Service 2: TTS Service (Python)

**Service Name:** `eastafrican-languages-tts`

**Build Command:**
```bash
pip install -r requirements.txt
```

**Start Command:**
```bash
gunicorn --bind 0.0.0.0:$PORT tts_service:app
```

**Environment Variables:**
```
TTS_SERVICE_PORT=5000
MAX_TEXT_LENGTH=5000
```

#### Internal Networking
- Use Render's internal URLs: `http://eastafrican-languages-tts:5000`
- Or use public URLs with API keys for security

---

## Option 3: Advanced TTS with Cloud Storage (Future Enhancement)

For full language support including Oromo, Somali, etc., use specialized TTS APIs.

### Recommended TTS Services

#### 1. **ElevenLabs** (Best Quality)
- Multi-language support
- Voice cloning
- API-based (no local dependencies)
- Pricing: ~$0.30 per 1000 characters

#### 2. **Google Cloud Text-to-Speech**
- 220+ voices, 40+ languages
- WaveNet voices (very natural)
- Pricing: $4 per 1 million characters (WaveNet)

#### 3. **Amazon Polly**
- 60+ voices, 30+ languages
- Neural voices available
- Pricing: $4 per 1 million characters (Neural)

#### 4. **Azure Cognitive Services**
- 270+ voices, 110+ languages
- Custom voice creation
- Pricing: $4 per 1 million characters

### Cloud Storage for Audio Files

To solve ephemeral file system issues:

#### Cloudinary (Recommended)
```javascript
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload audio
const result = await cloudinary.uploader.upload(audioPath, {
  resource_type: 'video', // For audio files
  folder: 'tts-audio',
  public_id: `audio_${Date.now()}`
});

return result.secure_url;
```

#### AWS S3
```javascript
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const params = {
  Bucket: process.env.S3_BUCKET,
  Key: `audio/${filename}`,
  Body: audioBuffer,
  ContentType: 'audio/mpeg',
  ACL: 'public-read'
};

await s3.upload(params).promise();
```

---

## Quick Start: Deploying Option 1 Now

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Add Render deployment configuration"
git push origin main
```

### Step 2: Create Render Service
1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name:** `eastafrican-languages`
   - **Environment:** `Node`
   - **Build Command:** `bash render-build.sh`
   - **Start Command:** `bash start-render.sh`
   - **Instance Type:** Free (or Starter for better performance)

### Step 3: Add Environment Variables
In Render dashboard, add:
```
NODE_ENV=production
TTS_SERVICE_URL=http://localhost:5000
TTS_SERVICE_PORT=5000
MAX_TEXT_LENGTH=5000
```

### Step 4: Deploy
Click "Create Web Service" and wait for deployment.

---

## Code Changes Needed for Option 1

### 1. Remove pyttsx3 from `tts_service.py`

The current code tries to use pyttsx3 for certain languages. This needs to be removed or fall back to gTTS.

**Current problematic code:**
```python
PYTTSX3_LANGUAGES = ['oromo', 'somali', 'hadiyaa', 'wolyitta', 'afar', 'gamo', 'luo']
```

**Change needed:**
- Remove pyttsx3 engine initialization
- Use gTTS for all languages (or return error for unsupported)

### 2. Update Audio Storage to Use `/tmp`

```python
# Change from:
AUDIO_DIR = os.path.join(os.path.dirname(__file__), 'audio_output')

# To:
AUDIO_DIR = os.getenv('AUDIO_DIR', '/tmp/audio_output')
```

### 3. Disable Background Cleanup (Optional)

Linux systems auto-clean `/tmp` so the cleanup thread is unnecessary.

### 4. Update Upload Directory

```javascript
// In server.js, change:
const uploadDir = path.join(__dirname, 'uploads');

// To:
const uploadDir = process.env.UPLOAD_DIR || (
  process.env.NODE_ENV === 'production' 
    ? '/tmp/uploads' 
    : path.join(__dirname, 'uploads')
);
```

---

## Migration Path

### Phase 1: Basic Deployment (Now)
- Deploy with Option 1
- Limited to gTTS languages only
- Ephemeral file storage

### Phase 2: Service Separation (1-2 weeks)
- Migrate to Option 2
- Separate web and TTS services
- Better reliability and scaling

### Phase 3: Cloud Enhancement (1-2 months)
- Integrate cloud TTS (ElevenLabs/Google)
- Add cloud storage (Cloudinary/S3)
- Full language support restored
- Persistent file storage

---

## Cost Estimates

### Option 1: Single Service
- **Free Tier:** $0/month (with limitations)
  - 750 hours/month
  - Sleeps after 15 min inactivity
  - 512 MB RAM, 0.1 CPU
- **Starter:** $7/month
  - Always on
  - 512 MB RAM, 0.5 CPU

### Option 2: Two Services
- **Free Tier:** $0/month (both services)
- **Starter:** $14/month (both services)

### Option 3: With Cloud Services
- **Render:** $7-14/month
- **Cloudinary:** Free tier (25 credits/month) or $89/month
- **ElevenLabs:** $5-99/month (based on usage)
- **Google Cloud TTS:** Pay-as-you-go (~$4 per 1M chars)

**Estimated Total (Production):** $20-50/month

---

## Testing Deployment Locally

Before deploying to Render, test the startup script:

```bash
# Make scripts executable
chmod +x render-build.sh start-render.sh

# Run build
bash render-build.sh

# Test startup (Ctrl+C to stop)
bash start-render.sh
```

Visit `http://localhost:3000` to verify both services work.

---

## Troubleshooting

### Both Services Not Starting
- Check logs in Render dashboard
- Verify Python service starts first (needs 5 seconds)
- Check PORT environment variable

### TTS Service Fails
- Verify gTTS is installed: `pip list | grep gTTS`
- Check Python version (3.8+ required)
- Remove pyttsx3 references

### Audio Not Playing
- Check browser console for CORS errors
- Verify TTS_SERVICE_URL is correct
- Test TTS endpoint directly: `curl http://localhost:5000/health`

### Out of Memory
- Upgrade to Starter plan (512 MB → 512 MB+)
- Implement audio file cleanup more aggressively
- Use cloud storage instead of local files

---

## Next Steps

1. ✅ Test Option 1 locally
2. ⬜ Deploy to Render
3. ⬜ Monitor performance and logs
4. ⬜ Plan migration to Option 2 (if needed)
5. ⬜ Evaluate cloud TTS services
6. ⬜ Implement cloud storage

---

## Support

For issues or questions:
- Check Render documentation: https://render.com/docs
- Review logs in Render dashboard
- Test locally first before deploying changes

Last Updated: January 5, 2026
