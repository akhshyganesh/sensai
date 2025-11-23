@echo off
REM Sensai Voice Setup Script for Windows

echo 🎤 Sensai Voice Interaction Setup
echo ==================================
echo.

REM Check Node.js
echo 📦 Checking Node.js...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js v18 or higher.
    exit /b 1
)
node -v
echo ✓ Node.js installed
echo.

REM Check FFmpeg
echo 🎵 Checking FFmpeg...
where ffmpeg >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ FFmpeg is not installed.
    echo.
    echo Please install FFmpeg from: https://ffmpeg.org/download.html
    exit /b 1
)
ffmpeg -version | findstr /C:"ffmpeg version"
echo ✓ FFmpeg installed
echo.

REM Setup backend
echo 🔧 Setting up backend server...
cd server

if not exist ".env" (
    echo 📝 Creating .env file...
    copy .env.example .env
    echo ⚠️  Please edit server\.env and add your GEMINI_API_KEY
)

if not exist "node_modules" (
    echo 📦 Installing backend dependencies...
    call npm install
) else (
    echo ✓ Backend dependencies already installed
)

cd ..

REM Setup frontend
echo.
echo 🎨 Setting up frontend...
if not exist "node_modules" (
    echo 📦 Installing frontend dependencies...
    call npm install
) else (
    echo ✓ Frontend dependencies already installed
)

echo.
echo ==================================
echo ✅ Setup complete!
echo.
echo Next steps:
echo 1. Edit server\.env and add your GEMINI_API_KEY
echo    Get it from: https://makersuite.google.com/app/apikey
echo.
echo 2. Start the backend server:
echo    cd server ^&^& npm run dev
echo.
echo 3. In a new terminal, start the frontend:
echo    npm run dev
echo.
echo 4. Open http://localhost:5173 and click the microphone!
echo.
echo 📚 Read SETUP_GUIDE.md for detailed instructions
echo ==================================
pause
