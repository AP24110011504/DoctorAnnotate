#!/usr/bin/env powershell
# Quick Start - Backend Server

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "🚀 Starting Medical Annotation Backend" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$backendPath = "c:\Users\chiti\OneDrive\Desktop\Innovate_x\backend"

if (-not (Test-Path $backendPath)) {
    Write-Host "❌ Backend folder not found at: $backendPath" -ForegroundColor Red
    exit 1
}

Write-Host "📁 Backend path: $backendPath" -ForegroundColor Green
Write-Host "📋 Checking prerequisites..." -ForegroundColor Yellow
Write-Host ""

# Check if Node.js is installed
$nodeVersion = node --version
Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green

# Check if npm is installed
$npmVersion = npm --version
Write-Host "✅ npm version: $npmVersion" -ForegroundColor Green

# Change to backend directory
cd $backendPath

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "`n📥 Installing npm dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host "✅ Dependencies installed" -ForegroundColor Green
}

Write-Host "`n🔄 Starting backend server on http://localhost:5000..." -ForegroundColor Cyan
Write-Host "💡 Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host "`n========================================`n" -ForegroundColor Cyan

# Start the backend server
npm run dev

# If npm run dev is not available, try direct node
if ($LASTEXITCODE -ne 0) {
    Write-Host "Trying with 'npm start'..." -ForegroundColor Yellow
    npm start
}
