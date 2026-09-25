#!/usr/bin/env bash
echo "========================================================"
echo "  Launching CloudSentinel AI SecOps Command Center"
echo "========================================================"

echo "[1/3] Starting FastAPI Backend on port 8000..."
(cd backend && python3 -m uvicorn app.main:app --host 127.0.0.1 --port 8000) &

echo "[2/3] Starting Next.js Web Console on port 3000..."
(cd frontend && npm start || npm run dev) &

echo "[3/3] Opening Browser..."
sleep 3
if which xdg-open > /dev/null; then
  xdg-open http://localhost:3000
elif which open > /dev/null; then
  open http://localhost:3000
fi

echo "========================================================"
echo "  CloudSentinel is live at: http://localhost:3000"
echo "  Judges Demo Mode at:      http://localhost:3000/dashboard/demo"
echo "  Backend API at:           http://127.0.0.1:8000/docs"
echo "========================================================"
wait
