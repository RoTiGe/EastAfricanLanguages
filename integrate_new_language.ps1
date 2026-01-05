<#
.SYNOPSIS
Automated script to integrate a new *_translations.js file into the Language Bridge platform

.DESCRIPTION
This script automates all steps needed when a new language translation file is added:
1. Detects the new language from the filename
2. Adds language to config.js (LANGUAGES and LANGUAGE_NAMES arrays)
3. Prompts for category name translations (or uses defaults)
4. Runs conversion scripts to generate .json file
5. Adds language to the geographic map on index.ejs
6. Validates the integration

.PARAMETER LanguageFile
Path to the new *_translations.js file (e.g., "translations/chinese_translations.js")

.PARAMETER NativeName
Native name of the language (e.g., "中文 (Chinese)")

.PARAMETER Skip
Skip interactive prompts and use defaults

.EXAMPLE
.\integrate_new_language.ps1 -LanguageFile "translations/chinese_translations.js" -NativeName "中文 (Chinese)"

.EXAMPLE
.\integrate_new_language.ps1 -LanguageFile "translations/swahili_translations.js" -NativeName "Kiswahili (Swahili)" -Skip
#>

param(
    [Parameter(Mandatory=$true)]
    [string]$LanguageFile,
    
    [Parameter(Mandatory=$true)]
    [string]$NativeName,
    
    [switch]$Skip
)

# Color-coded output functions
function Write-Success { param($Message) Write-Host "✓ $Message" -ForegroundColor Green }
function Write-Info { param($Message) Write-Host "→ $Message" -ForegroundColor Cyan }
function Write-Warning { param($Message) Write-Host "⚠ $Message" -ForegroundColor Yellow }
function Write-Fail { param($Message) Write-Host "✗ $Message" -ForegroundColor Red }

Write-Host "`n============================================================" -ForegroundColor Cyan
Write-Host "  Language Integration Automation Script" -ForegroundColor Cyan
Write-Host "============================================================`n" -ForegroundColor Cyan

# Step 1: Validate input file exists
Write-Info "Step 1/6: Validating input file..."
if (!(Test-Path $LanguageFile)) {
    Write-Fail "File not found: $LanguageFile"
    exit 1
}
Write-Success "Found translation file: $LanguageFile"

# Extract language code from filename
$LanguageCode = (Get-Item $LanguageFile).BaseName -replace '_translations$', ''
Write-Info "Detected language code: $LanguageCode"

# Step 2: Check if already in config.js
Write-Info "`nStep 2/6: Checking config.js..."
$configPath = ".\config.js"
$configContent = Get-Content $configPath -Raw

if ($configContent -match "'$LanguageCode'") {
    Write-Warning "Language '$LanguageCode' already exists in config.js"
} else {
    Write-Info "Adding $LanguageCode to config.js..."
    
    # Add to LANGUAGES array (before the closing bracket)
    $configContent = $configContent -replace "(\s+'luo'\s*\n\];)", "`n    '$LanguageCode'`$1"
    
    # Add to LANGUAGE_NAMES object
    $configContent = $configContent -replace "(\s+'luo': 'Dholuo \(Luo\)'\s*\n\};)", "`n    '$LanguageCode': '$NativeName'`$1"
    
    Set-Content $configPath -Value $configContent -Encoding UTF8
    Write-Success "Added $LanguageCode to config.js"
}

# Step 3: Add category name translations
Write-Info "`nStep 3/6: Updating category names in build_comprehensive_json.py..."
$buildScriptPath = ".\build_comprehensive_json.py"
$buildContent = Get-Content $buildScriptPath -Raw

# Check if already exists
if ($buildContent -match "'$LanguageCode':\s*'") {
    Write-Warning "Category names for '$LanguageCode' already exist"
} else {
    if ($Skip) {
        Write-Info "Skipping category name translations (use -Skip to add manually later)"
    } else {
        Write-Host "`nCategory translations needed. Press Enter to use English defaults, or provide translations:" -ForegroundColor Yellow
        Write-Host "Examples: 基础 & 问候 (Basics), 家庭 (Family), 身体部位 (Body Parts)" -ForegroundColor Gray
        Write-Host "You can edit build_comprehensive_json.py later to add proper translations.`n" -ForegroundColor Gray
    }
    
    # Add placeholder entries for each category (using English as default)
    $categories = @(
        'basics', 'family', 'people', 'body', 'clothing', 'colors', 
        'numbers', 'emotions', 'school', 'toys', 'house', 'food', 
        'animals', 'nature', 'time', 'seasons', 'transport', 'places'
    )
    
    foreach ($category in $categories) {
        # Find the category block and add language entry
        $pattern = "('$category':\s*\{[^}]+)'italian':\s*'[^']*'"
        if ($buildContent -match $pattern) {
            $buildContent = $buildContent -replace $pattern, "`$1'italian': '$($Matches[0] -replace ".*'italian':\s*'([^']*)'.*", '$1')',`n        '$LanguageCode': '$(if ($Skip) { $category.ToUpper() } else { $category })'"
        }
    }
    
    Set-Content $buildScriptPath -Value $buildContent -Encoding UTF8
    Write-Success "Added placeholder category names (edit build_comprehensive_json.py for proper translations)"
}

# Step 4: Run conversion scripts
Write-Info "`nStep 4/6: Running conversion scripts..."
Write-Host "  → Running build_comprehensive_json.py..." -ForegroundColor Gray
try {
    python build_comprehensive_json.py
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Successfully generated $LanguageCode.json"
    } else {
        Write-Fail "Python script failed with exit code $LASTEXITCODE"
    }
} catch {
    Write-Fail "Error running Python script: $_"
}

Write-Host "`n  → Running merge_translations.js..." -ForegroundColor Gray
try {
    node merge_translations.js
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Successfully ran Node.js merge script"
    } else {
        Write-Fail "Node.js script failed with exit code $LASTEXITCODE"
    }
} catch {
    Write-Fail "Error running Node.js script: $_"
}

# Step 5: Add to geographic map on index.ejs
Write-Info "`nStep 5/6: Adding to geographic language map..."
Write-Warning "Manual step required: Add $LanguageCode button to views/index.ejs"
Write-Host "  Suggested location based on geography:" -ForegroundColor Gray
Write-Host "    - European languages: North (top: 5-10%, left: 10-50%)" -ForegroundColor Gray
Write-Host "    - Middle Eastern/Asian: East (top: 25%, left: 70%)" -ForegroundColor Gray
Write-Host "    - African languages: Center-South (top: 35-80%, left: 30-60%)" -ForegroundColor Gray
Write-Host "`n  Example button code:" -ForegroundColor Yellow
Write-Host @"
<div class="position-absolute" style="top: 25%; left: 75%;">
    <a href="/demo/$LanguageCode" class="btn btn-success btn-lg shadow-sm mb-2">
        <i class="bi bi-star me-2"></i>$NativeName
    </a>
</div>
"@ -ForegroundColor Gray

# Step 6: Validation
Write-Info "`nStep 6/6: Validation checks..."
$jsonPath = ".\translations\$LanguageCode.json"
if (Test-Path $jsonPath) {
    Write-Success "JSON file created: $jsonPath"
    $jsonContent = Get-Content $jsonPath -Raw | ConvertFrom-Json
    Write-Success "  - Language: $($jsonContent.language)"
    Write-Success "  - Categories: $($jsonContent.categories.PSObject.Properties.Count)"
    $totalPhrases = 0
    $jsonContent.categories.PSObject.Properties | ForEach-Object { $totalPhrases += $_.Value.Count }
    Write-Success "  - Total phrases: $totalPhrases"
} else {
    Write-Fail "JSON file not found: $jsonPath"
}

# Final summary
Write-Host "`n============================================================" -ForegroundColor Cyan
Write-Host "  Integration Summary" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Language Code:     $LanguageCode" -ForegroundColor White
Write-Host "Native Name:       $NativeName" -ForegroundColor White
Write-Host "Translation File:  $LanguageFile" -ForegroundColor White
Write-Host "JSON Output:       $jsonPath" -ForegroundColor White
Write-Host "`nNext Steps:" -ForegroundColor Yellow
Write-Host "  1. Edit build_comprehensive_json.py to add proper category translations" -ForegroundColor Gray
Write-Host "  2. Add language button to views/index.ejs geographic map" -ForegroundColor Gray
Write-Host "  3. Test at http://localhost:3000/demo/$LanguageCode" -ForegroundColor Gray
Write-Host "  4. Verify TTS works for the language" -ForegroundColor Gray
Write-Host "  5. Update README.md language count if needed" -ForegroundColor Gray
Write-Host "`n✓ Integration automation complete!`n" -ForegroundColor Green
