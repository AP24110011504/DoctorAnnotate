#!/usr/bin/env powershell
# Quick Start - Frontend Server

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "🚀 Starting Medical Annotation Frontend" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$frontendPath = "c:\Users\chiti\OneDrive\Desktop\Innovate_x"

if (-not (Test-Path $frontendPath)) {
    Write-Host "❌ Frontend folder not found at: $frontendPath" -ForegroundColor Red
    exit 1
}

Write-Host "📁 Frontend path: $frontendPath" -ForegroundColor Green
Write-Host "📋 Checking prerequisites..." -ForegroundColor Yellow
Write-Host ""

# Check if Node.js is installed
$nodeVersion = node --version
Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green

# Check if npm is installed
$npmVersion = npm --version
Write-Host "✅ npm version: $npmVersion" -ForegroundColor Green

# Change to frontend directory
cd $frontendPath

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "`n📥 Installing npm dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host "✅ Dependencies installed" -ForegroundColor Green
}

Write-Host "`n🔄 Starting frontend server on http://localhost:3000..." -ForegroundColor Cyan
Write-Host "💡 Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host "`n========================================`n" -ForegroundColor Cyan

# Start the frontend server
npm run dev
