# Coqui TTS Training for Oromo Language

This folder contains everything you need to train a custom TTS model for Oromo (or any other language) using Coqui TTS.

## 📋 Requirements

### Python Version
- **Python 3.9, 3.10, or 3.11** (Coqui TTS does NOT work with Python 3.12+)
- Create a separate environment: `conda create -n coqui-env python=3.11`

### Dependencies
```bash
pip install TTS torch torchaudio
pip install pydub librosa soundfile
pip install numpy scipy matplotlib
```

## 📁 Folder Structure

```
coqui_training/
├── datasets/              # Your audio + text data
│   └── oromo/
│       ├── wavs/         # Audio files (.wav, 16kHz, mono)
│       └── metadata.csv  # Text transcriptions
├── configs/              # Training configurations
│   ├── oromo_vits.json  # VITS model config
│   └── oromo_tacotron2.json  # Tacotron2 config
├── scripts/              # Training & preprocessing scripts
│   ├── train.py         # Main training script
│   ├── preprocess.py    # Audio preprocessing
│   ├── test_model.py    # Test trained model
│   └── fine_tune.py     # Fine-tune existing model
├── checkpoints/          # Saved models (auto-created)
└── README.md            # This file
```

## 🎯 Quick Start Guide

### Step 1: Prepare Your Dataset

#### Option A: Record Your Own Data
1. Record 30-60 minutes of Oromo speech (more is better)
2. Save as WAV files (16kHz, mono, 16-bit)
3. Create transcriptions in `metadata.csv`

#### Option B: Use Existing Dataset
- Download Oromo speech dataset (e.g., from Common Voice, Mozilla)
- Convert to required format using `preprocess.py`

### Step 2: Format Your Dataset

Your `metadata.csv` should look like this:
```csv
wavs/audio001.wav|Nagaa! Akkam jirta?
wavs/audio002.wav|Maqaan koo Robel.
wavs/audio003.wav|Baga nagaan dhufte.
```

Format: `filename|transcription` (no header row)

### Step 3: Set Up Python Environment

```bash
# Create Python 3.11 environment
conda create -n coqui-env python=3.11 -y
conda activate coqui-env

# Install Coqui TTS
pip install TTS

# Install additional dependencies
pip install -r requirements.txt
```

### Step 4: Preprocess Audio Files

```bash
python scripts/preprocess.py \
    --input_dir datasets/oromo/wavs \
    --output_dir datasets/oromo/wavs_processed
```

### Step 5: Train the Model

#### Option A: Train from Scratch (Requires 100+ hours of data)
```bash
python scripts/train.py \
    --config_path configs/oromo_vits.json \
    --output_path checkpoints/oromo_vits
```

#### Option B: Fine-tune Existing Model (Recommended - Works with 30-60 min)
```bash
python scripts/fine_tune.py \
    --config_path configs/oromo_vits.json \
    --checkpoint_path pretrained/vits_multilingual.pth \
    --output_path checkpoints/oromo_vits_finetune
```

### Step 6: Test Your Model

```bash
python scripts/test_model.py \
    --checkpoint checkpoints/oromo_vits/best_model.pth \
    --text "Nagaa! Maqaan koo Robel."
```

## 📊 Data Requirements

### Minimum Requirements
- **30 minutes** of clean audio (for fine-tuning)
- **100+ hours** of audio (for training from scratch)
- Clear pronunciation, minimal background noise
- Native speaker recordings

### Recommended
- **1-3 hours** for fine-tuning (better quality)
- **500+ hours** for production-quality from-scratch training
- Multiple speakers for diversity
- Professional recording quality

## 🎤 Recording Guidelines

1. **Environment**: Quiet room with minimal echo
2. **Microphone**: USB mic or better (not laptop built-in)
3. **Format**: WAV, 44.1kHz or 48kHz (will be resampled to 16kHz)
4. **Duration**: 3-10 seconds per clip (ideal: 5-7 seconds)
5. **Content**: Natural sentences in Oromo
6. **Consistency**: Same speaker, same mic, same room

## 🔧 Troubleshooting

### Out of Memory Error
- Reduce `batch_size` in config file
- Use shorter audio clips
- Use GPU with more VRAM

### Training Loss Not Decreasing
- Check dataset quality
- Increase learning rate
- Use pre-trained model for fine-tuning

### Poor Audio Quality
- Check sample rate (should be 16kHz)
- Ensure mono audio, not stereo
- Remove background noise using `preprocess.py`

## 📚 Model Architectures

### VITS (Recommended)
- **Best for**: High-quality, natural speech
- **Training time**: Medium
- **Quality**: Excellent
- **Requirements**: Good GPU (8GB+ VRAM)

### Tacotron2 + WaveGlow
- **Best for**: Clear, intelligible speech
- **Training time**: Faster
- **Quality**: Good
- **Requirements**: Moderate GPU (4GB+ VRAM)

### FastSpeech2
- **Best for**: Fast inference
- **Training time**: Fast
- **Quality**: Good
- **Requirements**: Lower GPU requirements

## 🌐 Pre-trained Models for Fine-tuning

Download these models to fine-tune for Oromo:

1. **XTTS v2** (Multilingual)
   - Supports 17+ languages
   - Best for voice cloning
   - Download: `tts --model_name tts_models/multilingual/multi-dataset/xtts_v2`

2. **VITS Multilingual**
   - Good starting point for African languages
   - Faster fine-tuning
   - Download from Coqui TTS model zoo

3. **Tacotron2 English**
   - Transfer learning from English
   - Easier to train
   - Good for phonetically similar languages

## 📈 Training Timeline

### Fine-tuning (30-60 min data)
- **Setup**: 1-2 hours
- **Training**: 4-8 hours (GPU)
- **Testing**: 1 hour
- **Total**: ~1 day

### From Scratch (100+ hours data)
- **Data collection**: 1-4 weeks
- **Preprocessing**: 2-4 hours
- **Training**: 2-7 days (GPU)
- **Fine-tuning**: 1-2 days
- **Total**: 3-6 weeks

## 🚀 Next Steps

1. ✅ Read this README thoroughly
2. 📝 Prepare your dataset or download existing one
3. 🔧 Set up Python 3.11 environment
4. 📦 Install dependencies
5. 🎵 Preprocess audio files
6. 🏋️ Start training/fine-tuning
7. 🧪 Test and iterate

## 📞 Support & Resources

- **Coqui TTS Docs**: https://docs.coqui.ai
- **GitHub**: https://github.com/coqui-ai/TTS
- **Discord**: https://discord.gg/5eXr5seRrv
- **Papers**: VITS, Tacotron2, XTTS papers on arXiv

## ⚠️ Important Notes

1. **Python Version**: MUST use Python ≤ 3.11
2. **GPU Required**: CPU training is extremely slow
3. **Disk Space**: Need 10-50GB for models + data
4. **Time Investment**: Training takes days, not hours
5. **Data Quality**: Garbage in = garbage out

Good luck with your Oromo TTS training! 🎉
