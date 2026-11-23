# PowerShell One-Click Runner for InterviewPrep AI
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Starting InterviewPrep AI Full-Stack Platform" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition

if (-not $env:JAVA_HOME -and (Test-Path "C:\Program Files\Java\jdk-21")) {
    $env:JAVA_HOME = "C:\Program Files\Java\jdk-21"
}
if (-not $env:JWT_SECRET) {
    $env:JWT_SECRET = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970"
}

Write-Host "`nReleasing ports 8080, 8000, 5173 if occupied by previous runs..." -ForegroundColor DarkYellow
@(8080, 8000, 5173) | ForEach-Object {
    $p = $_
    $conns = Get-NetTCPConnection -LocalPort $p -State Listen -ErrorAction SilentlyContinue
    if ($conns) {
        $conns | ForEach-Object {
            Write-Host "  Stopping existing process PID $($_.OwningProcess) on port $p..." -ForegroundColor DarkYellow
            Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue
        }
    }
}
Start-Sleep -Milliseconds 600

Write-Host "`n[1/3] Starting Python FastAPI Microservice on Port 8000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$env:PYTHONPATH='.'; cd '$scriptDir\ai-service'; .\venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

Write-Host "[2/3] Starting Java Spring Boot Backend on Port 8080..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$env:JAVA_HOME='$($env:JAVA_HOME)'; `$env:JWT_SECRET='$($env:JWT_SECRET)'; cd '$scriptDir\backend'; .\mvnw.cmd spring-boot:run"

Write-Host "[3/3] Starting React Frontend on Port 5173..." -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$scriptDir\frontend'; npm run dev"

Write-Host "`n==========================================================" -ForegroundColor Cyan
Write-Host "All 3 services are launching in separate windows!" -ForegroundColor Green
Write-Host "  * Frontend UI:     http://localhost:5173" -ForegroundColor White
Write-Host "  * Backend API:     http://localhost:8080/api/health" -ForegroundColor White
Write-Host "  * AI Microservice: http://localhost:8000/docs" -ForegroundColor White
Write-Host "==========================================================" -ForegroundColor Cyan

Start-Sleep -Seconds 5
Start-Process "http://localhost:5173"
