#!/usr/bin/env powershell
# Combined Server Start Script
# This script starts both backend and frontend servers in separate terminals

Write-Host "`n╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║       Medical Annotation Platform - Complete Startup           ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

$rootPath = "c:\Users\chiti\OneDrive\Desktop\Innovate_x"
$backendPath = "$rootPath\backend"

# Check if MongoDB is running first
Write-Host "🔍 Checking MongoDB status..." -ForegroundColor Yellow
try {
    # Try to connect to MongoDB
    $mongoTest = "db.adminCommand('ping')" | mongo --eval 2>&1
    Write-Host "✅ MongoDB is running" -ForegroundColor Green
} catch {
    Write-Host "⚠️  MongoDB might not be running. Make sure:" -ForegroundColor Yellow
    Write-Host "   1. MongoDB service is started: Get-Service MongoDB | Start-Service" -ForegroundColor Gray
    Write-Host "   2. OR mongod is running in another terminal" -ForegroundColor Gray
    Write-Host "   3. Proceeding anyway - you'll get DB errors if MongoDB is down" -ForegroundColor Gray
    Write-Host ""
}

Write-Host "📋 Prerequisite check..." -ForegroundColor Yellow
Write-Host "   ✅ Node.js: $(node --version)" -ForegroundColor Green
Write-Host "   ✅ npm: $(npm --version)" -ForegroundColor Green
Write-Host ""

# Start Backend in new terminal
Write-Host "🚀 Starting Backend Server..." -ForegroundColor Cyan
$backendScript = $PSScriptRoot + "\run-backend.ps1"
Start-Process powershell -ArgumentList "-NoExit -ExecutionPolicy Bypass -File `"$backendScript`"" -Name "Backend"
Start-Sleep -Seconds 3

# Start Frontend in new terminal
Write-Host "🚀 Starting Frontend Server..." -ForegroundColor Cyan
$frontendScript = $PSScriptRoot + "\run-frontend.ps1"
Start-Process powershell -ArgumentList "-NoExit -ExecutionPolicy Bypass -File `"$frontendScript`"" -Name "Frontend"

Write-Host "`n╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                   ✅ SERVERS STARTING                          ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════════╝`n" -ForegroundColor Green

Write-Host "⏳ Waiting for servers to initialize (5-10 seconds)..." -ForegroundColor Yellow
Write-Host ""

Start-Sleep -Seconds 5

# Test endpoints
Write-Host "🔍 Testing endpoints..." -ForegroundColor Yellow

$backendHealthy = $false
$attempts = 0
$maxAttempts = 10

while (-not $backendHealthy -and $attempts -lt $maxAttempts) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -TimeoutSec 2 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ Backend is healthy (http://localhost:5000/api/health)" -ForegroundColor Green
            $backendHealthy = $true
        }
    } catch {
        $attempts++
        if ($attempts -lt $maxAttempts) {
            Write-Host "   Backend not ready yet, checking again..." -ForegroundColor Gray
            Start-Sleep -Seconds 1
        }
    }
}

if (-not $backendHealthy) {
    Write-Host "⚠️  Backend is not responding. Check the backend terminal for errors." -ForegroundColor Yellow
}

Write-Host "`n╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                    🎉 READY TO TEST                            ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════════╝`n" -ForegroundColor Green

Write-Host "🌐 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔗 Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host "📚 API Docs: http://localhost:5000/api/health" -ForegroundColor Cyan
Write-Host ""

Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Open http://localhost:3000 in your browser" -ForegroundColor Gray
Write-Host "   2. Click 'Create Account'" -ForegroundColor Gray
Write-Host "   3. Fill in form and click 'Create Account'" -ForegroundColor Gray
Write-Host "   4. Check browser console (F12) for detailed logs" -ForegroundColor Gray
Write-Host ""

Write-Host "💡 Tips:" -ForegroundColor Yellow
Write-Host "   - Check both terminal windows for errors" -ForegroundColor Gray
Write-Host "   - Use Ctrl+C in either terminal to stop that server" -ForegroundColor Gray
Write-Host "   - See SIGNUP_DEBUG_GUIDE.md for detailed troubleshooting" -ForegroundColor Gray
Write-Host ""

Write-Host "This window will close. Check the Backend and Frontend terminals for activity." -ForegroundColor Gray
Start-Sleep -Seconds 3
