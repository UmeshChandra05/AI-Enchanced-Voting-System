Clear-Host

Write-Host "========================================="
Write-Host "   SmartBallot - First Time Setup"
Write-Host "   AI Enhanced Voting System"
Write-Host "========================================="
Write-Host ""

$ROOT = $PSScriptRoot
$BACKEND = "$ROOT\backend"
$FRONTEND = "$ROOT\frontend"
$VENV = "$ROOT\.venv"
$SETUP_MARKER = "$ROOT\.setup_complete"

# ================================
# STEP 1 - PREREQUISITES
# ================================
Write-Host "[STEP 1/6] Checking prerequisites..."

# Python check
$pyVersion = python --version 2>&1
if (!$pyVersion) {
    Write-Host "[ERROR] Python not found" -ForegroundColor Red
    exit
}

$ver = ($pyVersion -split " ")[1]
$parts = $ver.Split(".")
$major = [int]$parts[0]
$minor = [int]$parts[1]

if ($major -lt 3 -or ($major -eq 3 -and $minor -lt 8)) {
    Write-Host "[ERROR] Python 3.8+ required" -ForegroundColor Red
    exit
}

Write-Host "[OK] Python $ver" -ForegroundColor Green

# Node check
$node = node --version
if (!$node) {
    Write-Host "[ERROR] Node.js not installed" -ForegroundColor Red
    exit
}
Write-Host "[OK] Node $node" -ForegroundColor Green

# npm check
npm --version > $null
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] npm missing" -ForegroundColor Red
    exit
}
Write-Host "[OK] npm detected" -ForegroundColor Green

# ================================
# STEP 2 - MongoDB CHECK (FIXED)
# ================================
Write-Host "`n[STEP 2/6] Checking MongoDB..."

# Port check
$mongoRunning = netstat -ano | findstr 27017

if ($mongoRunning) {
    Write-Host "[OK] MongoDB detected on port 27017" -ForegroundColor Green
}
else {
    Write-Host "[WARN] MongoDB not detected on port 27017" -ForegroundColor Yellow
}

# Service check
Write-Host "`nMongoDB Windows Services:"
$mongoServices = Get-Service | Where-Object {$_.Name -like "*mongo*"}

if ($mongoServices) {
    $mongoServices | ForEach-Object {
        Write-Host " - $($_.Name) : $($_.Status)"
    }
} else {
    Write-Host "No MongoDB services found"
}

# ================================
# STEP 3 - VENV
# ================================
Write-Host "`n[STEP 3/6] Virtual environment..."

if (!(Test-Path $VENV)) {
    python -m venv $VENV
    Write-Host "[OK] venv created" -ForegroundColor Green
} else {
    Write-Host "[INFO] Reusing existing venv"
}

# ================================
# STEP 4 - BACKEND
# ================================
Write-Host "`n[STEP 4/6] Installing backend deps..."

Set-Location $BACKEND

& "$VENV\Scripts\python.exe" -m pip install --upgrade pip
& "$VENV\Scripts\pip.exe" install -r requirements.txt

Write-Host "[OK] Backend ready" -ForegroundColor Green

# ================================
# STEP 5 - FRONTEND
# ================================
Write-Host "`n[STEP 5/6] Installing frontend deps..."

Set-Location $FRONTEND

npm install --legacy-peer-deps

if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Frontend install failed" -ForegroundColor Red
    exit
}

Write-Host "Running npm audit fix..."

npm audit fix

Write-Host "[OK] Frontend ready" -ForegroundColor Green

# ================================
# STEP 6 - CONFIG
# ================================
Write-Host "`n[STEP 6/6] Creating config..."

$jwt = -join ((48..57 + 65..90 + 97..122) | Get-Random -Count 32 | % {[char]$_})

@"
MONGO_URL=mongodb://localhost:27017
DB_NAME=smartballot
JWT_SECRET=$jwt
JWT_ALGORITHM=HS256
JWT_EXPIRATION=30
"@ | Out-File "$BACKEND\.env" -Encoding utf8 -Force

"REACT_APP_BACKEND_URL=http://localhost:8000" | Out-File "$FRONTEND\.env" -Encoding utf8 -Force

"Setup completed $(Get-Date)" | Out-File $SETUP_MARKER

Set-Location ..

# ================================
# DONE
# ================================
Write-Host ""
Write-Host "========================================="
Write-Host "        Setup Complete!"
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Default Admin:"
Write-Host "admin@voting.gov.in / admin123"
Write-Host ""
Write-Host "Start app using:"
Write-Host "start.ps1"
Write-Host ""
