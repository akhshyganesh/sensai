#!/bin/bash

# Sensai Voice Setup Script
echo "🎤 Sensai Voice Interaction Setup"
echo "=================================="
echo ""

# Check Node.js
echo "📦 Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18 or higher."
    exit 1
fi
echo "✓ Node.js $(node -v) installed"

# Check FFmpeg
echo ""
echo "🎵 Checking FFmpeg..."
if ! command -v ffmpeg &> /dev/null; then
    echo "❌ FFmpeg is not installed."
    echo ""
    echo "Please install FFmpeg:"
    echo "  macOS:    brew install ffmpeg"
    echo "  Ubuntu:   sudo apt-get install ffmpeg"
    echo "  Windows:  Download from ffmpeg.org"
    exit 1
fi
echo "✓ FFmpeg $(ffmpeg -version | head -n 1 | cut -d' ' -f3) installed"

# Setup backend
echo ""
echo "🔧 Setting up backend server..."
cd server

if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please edit server/.env and add your GEMINI_API_KEY"
fi

if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
else
    echo "✓ Backend dependencies already installed"
fi

cd ..

# Setup frontend
echo ""
echo "🎨 Setting up frontend..."
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
else
    echo "✓ Frontend dependencies already installed"
fi

echo ""
echo "=================================="
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit server/.env and add your GEMINI_API_KEY"
echo "   Get it from: https://makersuite.google.com/app/apikey"
echo ""
echo "2. Start the backend server:"
echo "   cd server && npm run dev"
echo ""
echo "3. In a new terminal, start the frontend:"
echo "   npm run dev"
echo ""
echo "4. Open http://localhost:5173 and click the microphone!"
echo ""
echo "📚 Read SETUP_GUIDE.md for detailed instructions"
echo "=================================="
