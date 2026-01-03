# Coqui TTS Training Folder - Complete Setup

✅ **Both servers restarted and running:**
- Python TTS Service: http://localhost:5000 (with Oromo support via pyttsx3)
- Express Web Server: http://localhost:3000

## 📁 Folder Structure Created

```
coqui_training/
│
├── 📄 README.md                    # Main documentation
├── 📄 QUICKSTART.md                # 5-step quick start guide
├── 📄 requirements.txt             # Python dependencies
├── 📄 setup.sh                     # Linux/Mac setup script
├── 📄 setup.ps1                    # Windows setup script
│
├── 📁 configs/                     # Training configurations
│   ├── oromo_vits.json            # VITS model config (recommended)
│   └── oromo_tacotron2.json       # Tacotron2 config (alternative)
│
├── 📁 scripts/                     # Training scripts
│   ├── train.py                   # Main training script
│   ├── fine_tune.py               # Fine-tune pre-trained model
│   ├── preprocess.py              # Audio preprocessing
│   ├── test_model.py              # Test trained model
│   └── create_metadata.py         # Create metadata.csv helper
│
├── 📁 datasets/                    # Your training data
│   ├── DATASET_GUIDE.md           # Comprehensive dataset guide
│   ├── metadata_example.csv       # Example metadata format
│   └── oromo/                     # (create this folder)
│       ├── wavs/                  # Your audio files go here
│       ├── metadata.csv           # Training data
│       └── metadata_val.csv       # Validation data
│
└── 📁 checkpoints/                 # Saved models (auto-created)
    └── (models will be saved here during training)
```

## 🚀 What You Can Do Now

### 1. Set Up Coqui Environment (Required)

**IMPORTANT:** You need Python 3.11 (NOT 3.14!)

```powershell
# Navigate to training folder
cd coqui_training

# Run setup script
.\setup.ps1

# This will:
# - Create Python 3.11 conda environment
# - Install Coqui TTS
# - Install PyTorch (GPU or CPU)
# - Install all dependencies
```

### 2. Prepare Your Dataset

**Option A: Record Your Own Data**
- Record 30-60 minutes of Oromo speech
- Use the preprocess.py script
- Create transcriptions

**Option B: Download Existing Dataset**
- Mozilla Common Voice Oromo
- Convert to required format

See `datasets/DATASET_GUIDE.md` for details.

### 3. Train Your Model

**Recommended: Fine-tune (30-60 min data)**
```powershell
conda activate coqui-tts

python scripts/fine_tune.py `
    --config_path configs/oromo_vits.json `
    --pretrained_model vits_multilingual `
    --output_path checkpoints/oromo_finetune
```

**Alternative: Train from Scratch (100+ hours data)**
```powershell
python scripts/train.py `
    --config_path configs/oromo_vits.json
```

### 4. Test Your Model

```powershell
python scripts/test_model.py `
    --model_path checkpoints/oromo_finetune `
    --text "Nagaa! Akkam jirta?" `
    --output test.wav
```

## 📚 Documentation Files

1. **README.md** - Complete overview, requirements, troubleshooting
2. **QUICKSTART.md** - Fast 5-step guide to get training
3. **datasets/DATASET_GUIDE.md** - How to prepare high-quality data
4. **metadata_example.csv** - Example format for transcriptions

## 🔑 Key Files Explained

### Configuration Files (configs/)

**oromo_vits.json**
- VITS model (recommended)
- Best quality, natural speech
- Requires good GPU (8GB+ VRAM)
- Settings: sample rate, batch size, learning rate, etc.

**oromo_tacotron2.json**
- Tacotron2 model (alternative)
- Faster training, lower requirements
- Good for getting started

### Training Scripts (scripts/)

**train.py**
- Train model from scratch
- Requires 100+ hours of data
- Takes 2-7 days on GPU

**fine_tune.py**
- Fine-tune pre-trained model (RECOMMENDED)
- Only needs 30-60 minutes of data
- Takes 4-8 hours on GPU
- Downloads pre-trained model automatically

**preprocess.py**
- Convert audio to correct format
- Resample to 22050 Hz
- Trim silence, normalize volume
- Split long files

**test_model.py**
- Test your trained model
- Generate speech from text
- Verify quality

**create_metadata.py**
- Helper to create metadata.csv
- Interactive or batch mode
- Auto train/val split

## ⚡ Quick Commands Reference

### Setup
```powershell
cd coqui_training
.\setup.ps1
conda activate coqui-tts
```

### Preprocess Audio
```powershell
python scripts/preprocess.py `
    --input_dir "path/to/raw/audio" `
    --output_dir datasets/oromo/wavs `
    --trim_silence --normalize
```

### Create Metadata
```powershell
python scripts/create_metadata.py `
    --audio_dir datasets/oromo/wavs `
    --auto_split
```

### Fine-tune Model
```powershell
python scripts/fine_tune.py `
    --config_path configs/oromo_vits.json `
    --pretrained_model vits_multilingual
```

### Monitor Training
```powershell
tensorboard --logdir checkpoints/
# Open: http://localhost:6006
```

### Test Model
```powershell
python scripts/test_model.py `
    --model_path checkpoints/oromo_finetune `
    --text "Nagaa! Akkam jirta?" `
    --output test.wav
```

## 📊 Training Timeline

| Approach | Data Needed | Time (GPU) | Time (CPU) | Quality |
|----------|-------------|------------|------------|---------|
| Fine-tune | 30-60 min | 4-8 hours | 2-3 days | Good |
| Fine-tune | 1-3 hours | 8-16 hours | 4-7 days | Very Good |
| From Scratch | 100+ hours | 2-7 days | Weeks | Excellent |

## 🎯 Recommended Path

1. **Start with 30-60 minutes of data**
2. **Fine-tune a pre-trained model** (NOT train from scratch)
3. **Test the results**
4. **If quality is good → deploy**
5. **If quality needs improvement → add more data**

## ⚠️ Important Notes

### Python Version
- **MUST use Python 3.11 or earlier**
- **Will NOT work with Python 3.12+**
- Create separate conda environment

### GPU vs CPU
- **GPU**: Training takes hours
- **CPU**: Training takes days
- Highly recommend NVIDIA GPU with 8GB+ VRAM

### Disk Space
- Pre-trained models: ~2-5 GB
- Your dataset: depends on size
- Checkpoints: 1-10 GB
- Total: plan for 10-50 GB free

## 🆘 Common Issues

### "TTS module not found"
→ You're using Python 3.12+, need 3.11

### "CUDA out of memory"
→ Reduce batch_size in config file

### "No module named 'torch'"
→ Run setup.ps1 or install PyTorch manually

### Training very slow
→ You're using CPU, need GPU

## 📞 Support Resources

- **Coqui TTS Docs**: https://docs.coqui.ai
- **GitHub**: https://github.com/coqui-ai/TTS
- **Discord**: https://discord.gg/5eXr5seRrv
- **Forum**: https://discourse.mozilla.org/c/tts

## 🎉 You're Ready!

Everything you need to train a custom Oromo TTS model is now set up.

**Next Step:** Read `QUICKSTART.md` and start training! 🚀

---

**Created:** January 2, 2026
**Status:** ✅ Ready to use
**Current Servers:** Running on ports 3000 (Express) and 5000 (Python TTS)
