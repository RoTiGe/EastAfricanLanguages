# Quick Start Guide - Train Oromo TTS in 5 Steps

This is the fastest path to training your Oromo TTS model.

## ⚡ Prerequisites

- Windows PC with NVIDIA GPU (recommended) or CPU
- Python 3.11 installed via Anaconda/Miniconda
- 30-60 minutes of Oromo audio + transcriptions
- 10-50 GB free disk space

## 🚀 5-Step Quick Start

### Step 1: Set Up Environment (10 minutes)

```powershell
# Navigate to this folder
cd coqui_training

# Run setup script
.\setup.ps1

# Or manually:
conda create -n coqui-tts python=3.11 -y
conda activate coqui-tts
pip install TTS==0.22.0
pip install -r requirements.txt
```

### Step 2: Prepare Dataset (30-60 minutes)

**Option A: Use Your Own Recordings**
```powershell
# Put your audio files in a folder
# Then preprocess them:
python scripts/preprocess.py `
    --input_dir "C:\path\to\your\audio" `
    --output_dir datasets/oromo/wavs `
    --sample_rate 22050 `
    --trim_silence `
    --normalize
```

**Option B: Download Common Voice Dataset**
1. Go to https://commonvoice.mozilla.org/om
2. Download Oromo dataset
3. Extract and process

**Create metadata.csv:**
```csv
wavs/audio001.wav|Nagaa! Akkam jirta?
wavs/audio002.wav|Maqaan koo Robel.
wavs/audio003.wav|Baga nagaan dhufte.
```

**Split train/validation:**
```powershell
# 85% for training, 15% for validation
# Copy ~15% of lines to metadata_val.csv
# Keep rest in metadata.csv
```

### Step 3: Fine-tune Pre-trained Model (4-8 hours)

**Recommended: Fine-tune existing multilingual model**

```powershell
conda activate coqui-tts

# This will download pre-trained model and fine-tune
python scripts/fine_tune.py `
    --config_path configs/oromo_vits.json `
    --pretrained_model vits_multilingual `
    --output_path checkpoints/oromo_finetune `
    --learning_rate 0.0001
```

**Alternative: Train from scratch (2-7 days, requires 100+ hours data)**

```powershell
python scripts/train.py `
    --config_path configs/oromo_vits.json `
    --output_path checkpoints/oromo_vits
```

### Step 4: Monitor Training

```powershell
# In another terminal, start TensorBoard
conda activate coqui-tts
tensorboard --logdir checkpoints/oromo_finetune/

# Open browser: http://localhost:6006
# Watch loss curves, attention alignments
```

**What to watch:**
- Training loss should decrease
- Validation loss should decrease (but slower)
- Attention alignment should be diagonal

**When to stop:**
- Validation loss stops decreasing (early stopping)
- Usually 5,000-20,000 steps for fine-tuning
- Usually 100,000+ steps for training from scratch

### Step 5: Test Your Model (5 minutes)

```powershell
# Test the trained model
python scripts/test_model.py `
    --model_path checkpoints/oromo_finetune `
    --text "Nagaa! Maqaan koo Robel. Akkam jirta?" `
    --output test_output.wav

# Listen to test_output.wav
```

**Test multiple sentences:**
```powershell
python scripts/test_model.py --model_path checkpoints/oromo_finetune --text "Galatoomaa!" --output test1.wav
python scripts/test_model.py --model_path checkpoints/oromo_finetune --text "Baga nagaan dhufte." --output test2.wav
python scripts/test_model.py --model_path checkpoints/oromo_finetune --text "Nagaatti." --output test3.wav
```

## 🎯 Expected Results

### Fine-tuning (30-60 min data)
- **Training time**: 4-8 hours on GPU, 2-3 days on CPU
- **Quality**: Good for simple sentences
- **Naturalness**: 6-7/10

### Fine-tuning (1-3 hours data)
- **Training time**: 8-16 hours on GPU
- **Quality**: Good for most sentences
- **Naturalness**: 7-8/10

### From Scratch (100+ hours data)
- **Training time**: 2-7 days on GPU
- **Quality**: Excellent
- **Naturalness**: 8-9/10

## 🔧 Troubleshooting

### Out of Memory
```json
// Edit config file, reduce batch_size:
"batch_size": 16,  // Try 8, 4, or 2
```

### Training Too Slow
- Use GPU instead of CPU
- Reduce `num_loader_workers`
- Use smaller model (Tacotron2 instead of VITS)

### Poor Quality
- Add more training data
- Train longer (more epochs)
- Check dataset quality
- Try different learning rate

### Model Not Learning
- Check metadata.csv format
- Verify audio files are correct
- Check sample rate (should be 22050 Hz)
- Make sure transcriptions are accurate

## 📁 File Structure After Training

```
coqui_training/
├── checkpoints/
│   └── oromo_finetune/
│       ├── best_model.pth       # Best model checkpoint
│       ├── config.json           # Model config
│       ├── checkpoint_*.pth      # Training checkpoints
│       └── events.out.tfevents  # TensorBoard logs
├── datasets/
│   └── oromo/
│       ├── wavs/                 # Your audio files
│       ├── metadata.csv          # Training data
│       └── metadata_val.csv      # Validation data
└── test_output.wav               # Generated test audio
```

## 🎉 Next Steps

1. **Improve Quality**
   - Add more data (30 min → 1 hour → 3 hours)
   - Train longer
   - Experiment with hyperparameters

2. **Deploy Your Model**
   ```python
   # Use in your application
   from TTS.utils.synthesizer import Synthesizer
   
   synth = Synthesizer(
       tts_checkpoint="checkpoints/oromo_finetune/best_model.pth",
       tts_config_path="checkpoints/oromo_finetune/config.json"
   )
   
   wav = synth.tts("Nagaa! Akkam jirta?")
   synth.save_wav(wav, "output.wav")
   ```

3. **Share Your Model**
   - Upload to HuggingFace
   - Share with Oromo language community
   - Contribute to Common Voice

## 📞 Need Help?

- **Coqui Discord**: https://discord.gg/5eXr5seRrv
- **GitHub Issues**: https://github.com/coqui-ai/TTS/issues
- **Documentation**: https://docs.coqui.ai

Happy Training! 🚀🎙️
