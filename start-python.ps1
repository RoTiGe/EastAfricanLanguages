# Start Python TTS Service

Write-Host ""
Write-Host ("="*60) -ForegroundColor Cyan
Write-Host "  Starting Python TTS Service" -ForegroundColor Yellow
Write-Host ("="*60) -ForegroundColor Cyan
Write-Host ""

$pythonPath = "c:/Users/Robel/Documents/Projects/Sound_Training/.conda/python.exe"

Write-Host "Python path: $pythonPath" -ForegroundColor Gray
Write-Host "Starting TTS service on port 5000..." -ForegroundColor Green
Write-Host "Note: First run will download model files (~2GB)" -ForegroundColor Yellow
Write-Host ""

& $pythonPath tts_service.py
