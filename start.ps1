# Quick Start Script for East African Languages Sound Training App

Write-Host ""
Write-Host ("="*60) -ForegroundColor Cyan
Write-Host "  East African Languages - Quick Start" -ForegroundColor Yellow
Write-Host ("="*60) -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "[1/4] Checking Node.js..." -ForegroundColor Green
if (Get-Command node -ErrorAction SilentlyContinue) {
    $nodeVersion = node --version
    Write-Host "  ✓ Node.js found: $nodeVersion" -ForegroundColor Gray
} else {
    Write-Host "  ✗ ERROR: Node.js not found! Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Check if npm packages are installed
Write-Host ""
Write-Host "[2/4] Checking npm packages..." -ForegroundColor Green
if (!(Test-Path "node_modules")) {
    Write-Host "  Installing npm packages..." -ForegroundColor Yellow
    npm install
} else {
    Write-Host "  ✓ npm packages installed" -ForegroundColor Gray
}

# Start Python TTS Service in background
Write-Host ""
Write-Host "[3/4] Starting Python TTS Service..." -ForegroundColor Green
$pythonPath = "$PSScriptRoot\.conda\python.exe"
Write-Host "  Starting on port 5000..." -ForegroundColor Yellow

# Start in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; & '$pythonPath' tts_service.py" -WindowStyle Normal

Write-Host "  ✓ TTS service starting in new window..." -ForegroundColor Gray
Write-Host "  Supported: 16 languages including Italian" -ForegroundColor Yellow

# Wait for service to initialize
Write-Host "  Waiting for TTS service to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Start Express Server
Write-Host ""
Write-Host "[4/4] Starting Express Server..." -ForegroundColor Green
Write-Host "  Starting on port 3000..." -ForegroundColor Yellow
Write-Host ""
Write-Host ("="*60) -ForegroundColor Cyan
Write-Host "  🚀 Application Ready!" -ForegroundColor Green
Write-Host "  📱 Open: http://localhost:3000" -ForegroundColor Yellow
Write-Host "  🎤 TTS: Running on port 5000" -ForegroundColor Yellow
Write-Host ("="*60) -ForegroundColor Cyan
Write-Host ""

# Start Express server (this will block until you stop it)
node server.js
