# Setup script for Coqui TTS training environment (Windows PowerShell)
# This creates a Python 3.11 environment with all dependencies

Write-Host "==========================================" -ForegroundColor Green
Write-Host "Coqui TTS Training Environment Setup" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green

# Check if conda is available
if (!(Get-Command conda -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: conda not found!" -ForegroundColor Red
    Write-Host "Please install Anaconda or Miniconda first."
    exit 1
}

# Create Python 3.11 environment
Write-Host ""
Write-Host "Creating Python 3.11 environment..." -ForegroundColor Yellow
conda create -n coqui-tts python=3.11 -y

# Activate environment
Write-Host ""
Write-Host "Activating environment..." -ForegroundColor Yellow
conda activate coqui-tts

# Install PyTorch
Write-Host ""
Write-Host "Installing PyTorch..." -ForegroundColor Yellow

# Detect if NVIDIA GPU is available
$hasNvidiaGPU = $false
try {
    $gpu = Get-WmiObject Win32_VideoController | Where-Object {$_.Name -like "*NVIDIA*"}
    if ($gpu) {
        $hasNvidiaGPU = $true
        Write-Host "NVIDIA GPU detected: $($gpu.Name)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "Could not detect GPU, installing CPU version" -ForegroundColor Yellow
}

if ($hasNvidiaGPU) {
    # Install GPU version (CUDA 11.8)
    Write-Host "Installing PyTorch with CUDA 11.8 support..." -ForegroundColor Cyan
    pip install torch==2.1.0 torchaudio==2.1.0 --index-url https://download.pytorch.org/whl/cu118
} else {
    # Install CPU version
    Write-Host "Installing PyTorch CPU version..." -ForegroundColor Cyan
    pip install torch==2.1.0 torchaudio==2.1.0
}

# Install Coqui TTS
Write-Host ""
Write-Host "Installing Coqui TTS..." -ForegroundColor Yellow
pip install TTS==0.22.0

# Install additional requirements
Write-Host ""
Write-Host "Installing additional dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt

# Verify installation
Write-Host ""
Write-Host "Verifying installation..." -ForegroundColor Yellow
python -c "import TTS; print(f'TTS version: {TTS.__version__}')"
python -c "import torch; print(f'PyTorch version: {torch.__version__}')"
python -c "import torch; print(f'CUDA available: {torch.cuda.is_available()}')"

if (Test-Path "datasets") {
    Write-Host ""
    Write-Host "Datasets folder found: datasets/" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "Creating datasets folder..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path "datasets/oromo/wavs" -Force | Out-Null
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "Setup complete!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""
Write-Host "To use this environment:" -ForegroundColor Cyan
Write-Host "  conda activate coqui-tts" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Prepare your dataset in datasets/oromo/" -ForegroundColor White
Write-Host "  2. Run: python scripts/preprocess.py --input_dir <your_audio> --output_dir datasets/oromo/wavs" -ForegroundColor White
Write-Host "  3. Create metadata.csv with transcriptions" -ForegroundColor White
Write-Host "  4. Run: python scripts/train.py --config_path configs/oromo_vits.json" -ForegroundColor White
Write-Host ""
Write-Host "For fine-tuning (recommended):" -ForegroundColor Cyan
Write-Host "  python scripts/fine_tune.py --config_path configs/oromo_vits.json --pretrained_model vits_multilingual" -ForegroundColor White
Write-Host ""
