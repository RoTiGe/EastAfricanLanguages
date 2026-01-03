#!/bin/bash

# Setup script for Coqui TTS training environment
# This creates a Python 3.11 environment with all dependencies

echo "=========================================="
echo "Coqui TTS Training Environment Setup"
echo "=========================================="

# Check if conda is available
if ! command -v conda &> /dev/null; then
    echo "ERROR: conda not found!"
    echo "Please install Anaconda or Miniconda first."
    exit 1
fi

# Create Python 3.11 environment
echo ""
echo "Creating Python 3.11 environment..."
conda create -n coqui-tts python=3.11 -y

# Activate environment
echo ""
echo "Activating environment..."
source activate coqui-tts || conda activate coqui-tts

# Install PyTorch (CPU version - change for GPU)
echo ""
echo "Installing PyTorch..."
# For CPU:
pip install torch==2.1.0 torchaudio==2.1.0

# For GPU (CUDA 11.8):
# pip install torch==2.1.0 torchaudio==2.1.0 --index-url https://download.pytorch.org/whl/cu118

# For GPU (CUDA 12.1):
# pip install torch==2.1.0 torchaudio==2.1.0 --index-url https://download.pytorch.org/whl/cu121

# Install Coqui TTS
echo ""
echo "Installing Coqui TTS..."
pip install TTS==0.22.0

# Install additional requirements
echo ""
echo "Installing additional dependencies..."
pip install -r requirements.txt

# Verify installation
echo ""
echo "Verifying installation..."
python -c "import TTS; print(f'TTS version: {TTS.__version__}')"
python -c "import torch; print(f'PyTorch version: {torch.__version__}')"
python -c "import torch; print(f'CUDA available: {torch.cuda.is_available()}')"

echo ""
echo "=========================================="
echo "Setup complete!"
echo "=========================================="
echo ""
echo "To use this environment:"
echo "  conda activate coqui-tts"
echo ""
echo "Next steps:"
echo "  1. Prepare your dataset in datasets/oromo/"
echo "  2. Run: python scripts/preprocess.py"
echo "  3. Run: python scripts/train.py --config_path configs/oromo_vits.json"
echo ""
