# Quick Start Script for African Translator

Write-Host ""
Write-Host ("="*60) -ForegroundColor Cyan
Write-Host "  African Translator - Quick Start" -ForegroundColor Yellow
Write-Host ("="*60) -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "[1/4] Checking Node.js..." -ForegroundColor Green
if (Get-Command node -ErrorAction SilentlyContinue) {
    $nodeVersion = node --version
    Write-Host "  [OK] Node.js found: $nodeVersion" -ForegroundColor Gray
} else {
    Write-Host "  [ERROR] Node.js not found! Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Check if npm packages are installed
Write-Host ""
Write-Host "[2/4] Checking npm packages..." -ForegroundColor Green
if (!(Test-Path "node_modules")) {
    Write-Host "  Installing npm packages..." -ForegroundColor Yellow
    npm install
} else {
    Write-Host "  [OK] npm packages already installed" -ForegroundColor Gray
}

# Start Python TTS Service in background
Write-Host ""
Write-Host "[3/4] Starting Python TTS Service..." -ForegroundColor Green
$pythonPath = "c:/Users/Robel/Documents/Projects/Sound_Training/.conda/python.exe"
Write-Host "  Starting on port 5000..." -ForegroundColor Yellow

Start-Process powershell -ArgumentList "-NoExit", "-Command", "$pythonPath tts_service.py" -WindowStyle Normal

Write-Host "  [OK] TTS service starting..." -ForegroundColor Gray
Write-Host "  (This may take 1-2 minutes for first-time model loading)" -ForegroundColor Yellow

# Wait a moment for service to initialize
Start-Sleep -Seconds 3

# Start Express Server
Write-Host ""
Write-Host "[4/4] Starting Express Server..." -ForegroundColor Green
Write-Host "  Starting on port 3000..." -ForegroundColor Yellow
Write-Host ""
Write-Host ("="*60) -ForegroundColor Cyan
Write-Host "  Application Ready!" -ForegroundColor Green
Write-Host "  Open your browser: http://localhost:3000" -ForegroundColor Yellow
Write-Host ("="*60) -ForegroundColor Cyan
Write-Host ""

# Start Express server
npm start
