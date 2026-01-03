# Dataset Preparation Guide for Oromo TTS

This guide will help you prepare a high-quality dataset for training Oromo TTS.

## 📊 Dataset Requirements

### Minimum for Fine-tuning
- **30-60 minutes** of clean audio
- **100-200 sentences**
- Single speaker, consistent quality

### Recommended for Fine-tuning
- **1-3 hours** of audio
- **500-1000 sentences**
- Diverse sentence structures

### For Training from Scratch
- **100+ hours** of audio
- **10,000+ sentences**
- Multiple speakers (optional)

## 🎤 Recording Guidelines

### Equipment
- **Microphone**: USB condenser mic (e.g., Blue Yeti, Audio-Technica AT2020)
- **Environment**: Quiet room with minimal echo
- **Software**: Audacity (free) or Adobe Audition

### Recording Settings
- **Format**: WAV
- **Sample Rate**: 44100 Hz or 48000 Hz (will be resampled to 22050 Hz)
- **Bit Depth**: 16-bit or 24-bit
- **Channels**: Mono (1 channel)

### Recording Tips
1. **Consistency**: Same speaker, mic, and room throughout
2. **Distance**: Keep 6-8 inches from microphone
3. **Volume**: Speak at normal conversational volume
4. **Pace**: Natural pace, not too fast or slow
5. **Clarity**: Pronounce words clearly
6. **Breaks**: Take breaks between sentences (at least 0.5 seconds)

### What to Record

#### Sentence Types to Include:
1. **Greetings**: "Nagaa! Akkam jirta?"
2. **Questions**: "Maal hojjetta?"
3. **Statements**: "Barnoota barachaa jira."
4. **Commands**: "Kottu asitti."
5. **Common phrases**: "Galatoomaa!", "Dhiifama!"

#### Content Sources:
- News articles in Oromo
- Books and literature
- Common conversations
- Proverbs and sayings
- Educational materials

## 📁 Dataset Structure

Your dataset should be organized like this:

```
datasets/oromo/
├── wavs/                    # Audio files
│   ├── oromo_001.wav
│   ├── oromo_002.wav
│   └── ...
├── metadata.csv             # Training data
├── metadata_val.csv         # Validation data (10-15% of total)
└── phoneme_cache/           # Auto-generated
```

## 📝 Creating metadata.csv

Format: `filename|transcription` (no header, pipe-separated)

Example:
```csv
wavs/oromo_001.wav|Nagaa! Akkam jirta?
wavs/oromo_002.wav|Maqaan koo Robel.
wavs/oromo_003.wav|Baga nagaan dhufte.
```

### Transcription Guidelines
1. **Accurate**: Match audio exactly
2. **Normalized**: Use consistent spelling
3. **Punctuation**: Include natural punctuation
4. **Case**: Use standard capitalization
5. **Numbers**: Spell out numbers ("lama" not "2")

## 🔄 Using Existing Datasets

### Mozilla Common Voice (Recommended)
1. Visit: https://commonvoice.mozilla.org/om
2. Download Oromo dataset (requires account)
3. Convert to required format:

```bash
python scripts/convert_common_voice.py \
    --input cv-corpus-om/clips \
    --metadata cv-corpus-om/validated.tsv \
    --output datasets/oromo
```

### Other Sources
- **AI4D Africa**: African language datasets
- **ALFFA**: African Languages in the Field - Speech Fundamentals
- **OpenSLR**: Open Speech and Language Resources

## ⚙️ Preprocessing Steps

### 1. Convert Audio Format
```bash
python scripts/preprocess.py \
    --input_dir raw_audio/ \
    --output_dir datasets/oromo/wavs \
    --sample_rate 22050 \
    --trim_silence \
    --normalize
```

### 2. Split Long Audio
If you have long recordings:
```bash
python scripts/preprocess.py \
    --input_dir raw_audio/ \
    --output_dir datasets/oromo/wavs \
    --split_long \
    --max_duration 10
```

### 3. Create Train/Val Split

```python
import pandas as pd
from sklearn.model_selection import train_test_split

# Read metadata
with open('datasets/oromo/metadata_all.csv', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Split 85% train, 15% validation
train, val = train_test_split(lines, test_size=0.15, random_state=42)

# Save splits
with open('datasets/oromo/metadata.csv', 'w', encoding='utf-8') as f:
    f.writelines(train)

with open('datasets/oromo/metadata_val.csv', 'w', encoding='utf-8') as f:
    f.writelines(val)

print(f"Training samples: {len(train)}")
print(f"Validation samples: {len(val)}")
```

## ✅ Quality Checks

Before training, verify:

1. **Audio Quality**
   - No background noise
   - No clipping (volume too high)
   - Consistent volume across files
   - No silence at beginning/end

2. **Transcriptions**
   - Accurate spelling
   - Matches audio exactly
   - Consistent formatting
   - No typos

3. **File Naming**
   - Sequential numbering
   - No special characters
   - Match metadata.csv exactly

4. **Coverage**
   - Diverse vocabulary
   - Various sentence lengths
   - Different sentence types
   - Natural prosody variation

## 🔧 Validation Script

```bash
# Check audio files
python scripts/validate_dataset.py \
    --dataset_path datasets/oromo \
    --check_audio \
    --check_metadata \
    --sample_rate 22050
```

## 📈 Dataset Statistics

Calculate your dataset stats:

```python
import librosa
import os

wavs_dir = 'datasets/oromo/wavs'
total_duration = 0
file_count = 0

for filename in os.listdir(wavs_dir):
    if filename.endswith('.wav'):
        filepath = os.path.join(wavs_dir, filename)
        duration = librosa.get_duration(path=filepath)
        total_duration += duration
        file_count += 1

print(f"Total files: {file_count}")
print(f"Total duration: {total_duration/60:.2f} minutes")
print(f"Average duration: {total_duration/file_count:.2f} seconds")
```

## 🎯 Quick Start Checklist

- [ ] Set up recording equipment
- [ ] Prepare text corpus (500+ sentences)
- [ ] Record audio (30+ minutes)
- [ ] Save as WAV files
- [ ] Create transcriptions
- [ ] Preprocess audio (resample, normalize)
- [ ] Create metadata.csv
- [ ] Split train/validation sets
- [ ] Validate dataset quality
- [ ] Ready to train! 🚀

## 📚 Resources

- **Oromo Language Resources**: http://www.oromiaabc.com/
- **Common Voice**: https://commonvoice.mozilla.org/om
- **Audacity Tutorial**: https://manual.audacityteam.org/
- **Dataset Best Practices**: https://docs.coqui.ai/en/latest/tutorial_for_nervous_beginners.html

Good luck preparing your dataset! 🎉
