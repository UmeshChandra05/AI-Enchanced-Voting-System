# =========================================
# SmartBallot - Startup Script (PowerShell)
# =========================================

param(
    [string]$command = "start"
)

Clear-Host

Write-Host ""
Write-Host "========================================="
Write-Host "   SmartBallot - Startup Script"
Write-Host "========================================="
Write-Host ""

$ROOT = $PSScriptRoot
$BACKEND_PATH = "$ROOT\backend"
$FRONTEND_PATH = "$ROOT\frontend"
$VENV_PYTHON = "$ROOT\.venv\Scripts\python.exe"
$SETUP_COMPLETE = "$ROOT\.setup_complete"

# ================================
# Setup Check
# ================================
if (!(Test-Path $SETUP_COMPLETE)) {
    Write-Host "[ERROR] Setup not completed." -ForegroundColor Red
    $ans = Read-Host "Run setup now? (Y/N)"
    if ($ans -eq "Y") {
        & "$ROOT\setup.ps1"
        if ($LASTEXITCODE -ne 0) { exit }
    } else { exit }
}

# ================================
# FUNCTIONS
# ================================

function Check-Mongo {

    Write-Host "`n[MONGODB] Checking MongoDB..."

    $mongoRunning = netstat -ano | findstr 27017

    if ($mongoRunning) {
        Write-Host "[OK] MongoDB detected on port 27017" -ForegroundColor Green
    }
    else {
        Write-Host "[WARN] MongoDB not detected on port 27017" -ForegroundColor Yellow
    }

    Write-Host "`nMongoDB Services:"
    $mongoServices = Get-Service | Where-Object {$_.Name -like "*mongo*"}

    if ($mongoServices) {
        $mongoServices | ForEach-Object {
            Write-Host " - $($_.Name) : $($_.Status)"
        }
    } else {
        Write-Host "No MongoDB services found"
    }

    Write-Host ""
}

function Start-Backend {

    Write-Host "[BACKEND] Starting API..."

    if (!(Test-Path $VENV_PYTHON)) {
        Write-Host "[ERROR] Virtual environment missing." -ForegroundColor Red
        return
    }

    try {
        Invoke-WebRequest http://localhost:8000/docs -UseBasicParsing -TimeoutSec 2 | Out-Null
        Write-Host "[OK] Backend already running"
        return
    } catch {}

    Write-Host "[INFO] Launching backend (30-60s first time)..."

    Start-Process powershell `
        -ArgumentList "cd '$BACKEND_PATH'; & '$VENV_PYTHON' -m uvicorn server:app --host 0.0.0.0 --port 8000"
}

function Start-Frontend {

    Write-Host "[FRONTEND] Starting UI..."

    if (!(Test-Path "$FRONTEND_PATH\node_modules")) {
        Write-Host "[ERROR] node_modules missing." -ForegroundColor Red
        return
    }

    try {
        Invoke-WebRequest http://localhost:3000 -UseBasicParsing -TimeoutSec 2 | Out-Null
        Write-Host "[OK] Frontend already running"
        return
    } catch {}

    Write-Host "[INFO] Launching frontend..."

    Start-Process powershell `
        -ArgumentList "cd '$FRONTEND_PATH'; npm start"
}

function Show-Access {

    Write-Host ""
    Write-Host "========================================="
    Write-Host "Access URLs"
    Write-Host "========================================="
    Write-Host "Frontend: http://localhost:3000"
    Write-Host "Backend : http://localhost:8000"
    Write-Host "Docs    : http://localhost:8000/docs"
    Write-Host ""
    Write-Host "Admin Login:"
    Write-Host "admin@voting.gov.in / admin123"
    Write-Host "========================================="

    Start-Process "http://localhost:3000"
}

function Show-Status {

    Write-Host "`n========== STATUS =========="

    try {
        Invoke-WebRequest http://localhost:8000/docs -UseBasicParsing -TimeoutSec 2 | Out-Null
        Write-Host "Backend  : RUNNING"
    } catch {
        Write-Host "Backend  : NOT RUNNING"
    }

    try {
        Invoke-WebRequest http://localhost:3000 -UseBasicParsing -TimeoutSec 2 | Out-Null
        Write-Host "Frontend : RUNNING"
    } catch {
        Write-Host "Frontend : NOT RUNNING"
    }

    $mongoRunning = netstat -ano | findstr 27017
    if ($mongoRunning) {
        Write-Host "MongoDB  : RUNNING"
    } else {
        Write-Host "MongoDB  : NOT RUNNING"
    }

    Write-Host "============================"
}

function Stop-Services {

    Write-Host "Stopping services..."

    Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue |
        ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }

    Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue |
        ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }

    Write-Host "[OK] Backend & Frontend stopped."
}

function Start-All {
    Check-Mongo
    Start-Backend
    Start-Frontend
    Show-Access
    Start-Sleep 3
    Show-Status
}

# ================================
# COMMAND ROUTING
# ================================
switch ($command.ToLower()) {
    "status"   { Show-Status }
    "stop"     { Stop-Services }
    "backend"  { Check-Mongo; Start-Backend; Show-Access }
    "frontend" { Start-Frontend; Show-Access }
    default    { Start-All }
}

Pause
