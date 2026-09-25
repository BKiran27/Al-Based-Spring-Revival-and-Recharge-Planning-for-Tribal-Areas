@echo off
echo ========================================================
echo   Launching CloudSentinel AI SecOps Command Center
echo ========================================================

echo [1/3] Starting FastAPI Backend on port 8000...
start "CloudSentinel Backend (FastAPI)" cmd /k "cd backend && python -m uvicorn app.main:app --host 127.0.0.1 --port 8000"

echo [2/3] Starting Next.js Web Console on port 3000...
start "CloudSentinel Frontend (Next.js)" cmd /k "cd frontend && npm start || npm run dev"

echo [3/3] Opening Browser...
timeout /t 3 >nul
start http://localhost:3000

echo ========================================================
echo   CloudSentinel is live at: http://localhost:3000
echo   Judges Demo Mode at:      http://localhost:3000/dashboard/demo
echo   Backend API at:           http://127.0.0.1:8000/docs
echo ========================================================
pause
