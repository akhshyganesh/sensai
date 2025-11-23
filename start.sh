#!/bin/bash

# Script to start both frontend and backend simultaneously

echo "🚀 Starting Sensai Voice Interaction System"
echo "==========================================="
echo ""

# Check if .env exists
if [ ! -f "server/.env" ]; then
    echo "❌ Error: server/.env not found"
    echo "Please run ./setup.sh first or create server/.env with your GEMINI_API_KEY"
    exit 1
fi

# Check if GEMINI_API_KEY is set
if ! grep -q "GEMINI_API_KEY=." server/.env; then
    echo "⚠️  Warning: GEMINI_API_KEY not set in server/.env"
    echo "Please add your Gemini API key to server/.env"
    echo ""
    read -p "Press Enter to continue anyway, or Ctrl+C to exit..."
fi

echo "Starting backend server..."
echo ""

# Start backend in background
cd server
npm run dev &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

echo ""
echo "Starting frontend..."
echo ""

# Start frontend in background
npm run dev &
FRONTEND_PID=$!

echo ""
echo "==========================================="
echo "✅ Both servers are starting!"
echo ""
echo "Backend:  http://localhost:3000"
echo "Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers"
echo "==========================================="
echo ""

# Wait for Ctrl+C
trap "echo ''; echo 'Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM

# Keep script running
wait
