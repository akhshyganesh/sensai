# Sensai Voice Server

Node.js/Express TypeScript server that integrates with Google's Gemini Live API for real-time voice interactions.

## Features

- ✅ Accepts WebM audio from frontend
- ✅ Converts to PCM 16kHz format for Gemini
- ✅ Processes through Gemini Live API
- ✅ Returns WAV audio response
- ✅ Full TypeScript support
- ✅ CORS configured for frontend

## Architecture

```
Frontend (WebM) → Server → Convert to PCM → Gemini Live API
                                              ↓
Frontend ← WAV Audio ← Convert from PCM ← Gemini Response
```

## Quick Start

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Install FFmpeg (Required for audio conversion)

**macOS:**
```bash
brew install ffmpeg
```

**Ubuntu/Debian:**
```bash
sudo apt-get install ffmpeg
```

**Windows:**
Download from [ffmpeg.org](https://ffmpeg.org/download.html)

### 3. Configure Environment

Create a `.env` file in the server directory:

```bash
cp .env.example .env
```

Edit `.env` and add your Gemini API key:

```env
GEMINI_API_KEY=your_actual_api_key_here
PORT=3000
FRONTEND_URL=http://localhost:5173
```

**Get your Gemini API key:** [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)

### 4. Run the Server

**Development mode (with hot reload):**
```bash
npm run dev
```

**Production build:**
```bash
npm run build
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Health Check
```
GET /health
```
Returns server status.

### Voice Processing
```
POST /api/voice
Content-Type: multipart/form-data
```

**Request:**
- `audio`: Audio file (WebM format from frontend)

**Response:**
- Audio file (WAV format, 24kHz)

**Example with curl:**
```bash
curl -X POST http://localhost:3000/api/voice \
  -F "audio=@recording.webm" \
  --output response.wav
```

## Project Structure

```
server/
├── src/
│   ├── index.ts              # Main Express server
│   ├── services/
│   │   └── gemini.ts         # Gemini Live API integration
│   └── utils/
│       └── audioConverter.ts # Audio format conversion utilities
├── package.json
├── tsconfig.json
└── .env
```

## How It Works

1. **Receive Audio**: Frontend sends WebM audio via POST request
2. **Convert Format**: WebM → PCM 16kHz mono (Gemini requirement)
3. **Process with Gemini**: Send to Gemini Live API via WebSocket
4. **Receive Response**: Get PCM 24kHz audio from Gemini
5. **Convert to WAV**: PCM → WAV format for browser playback
6. **Return to Client**: Send WAV audio back to frontend

## Configuration

### Change System Instruction

Edit `src/index.ts`:

```typescript
const geminiResponse = await processAudioWithGemini(pcmBuffer, {
  apiKey: GEMINI_API_KEY,
  systemInstruction: 'Your custom instruction here',
});
```

### Change Gemini Model

Edit `src/services/gemini.ts`:

```typescript
const MODEL = 'gemini-2.5-flash-native-audio-preview-09-2025';
```

### Adjust CORS Settings

Edit `src/index.ts`:

```typescript
app.use(cors({
  origin: FRONTEND_URL, // or ['http://localhost:5173', 'https://yourdomain.com']
  credentials: true,
}));
```

## Troubleshooting

### "FFmpeg not found"
- Install FFmpeg (see step 2 above)
- Verify: `ffmpeg -version`

### "GEMINI_API_KEY is not set"
- Create `.env` file with your API key
- Restart the server

### CORS errors
- Verify `FRONTEND_URL` in `.env` matches your frontend URL
- Check browser console for specific CORS error

### "Cannot find module '@google/genai'"
- Run `npm install` in the server directory
- Delete `node_modules` and reinstall if needed

### Audio conversion errors
- Ensure FFmpeg is installed and in PATH
- Check input audio format (should be WebM from frontend)

## Development

### Watch mode with auto-reload
```bash
npm run dev
```

### Build TypeScript
```bash
npm run build
```

### Run production build
```bash
npm start
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GEMINI_API_KEY` | Google Gemini API key | Required |
| `PORT` | Server port | 3000 |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:5173 |
| `NODE_ENV` | Environment mode | development |

## Dependencies

- **express**: Web server framework
- **@google/genai**: Gemini API client
- **multer**: Handle multipart/form-data
- **fluent-ffmpeg**: Audio format conversion
- **wavefile**: WAV file creation
- **cors**: CORS middleware
- **dotenv**: Environment variables

## Testing

Test the endpoint with a WebM audio file:

```bash
# Record audio in browser and save as recording.webm
curl -X POST http://localhost:3000/api/voice \
  -F "audio=@recording.webm" \
  --output response.wav

# Play the response
afplay response.wav  # macOS
aplay response.wav   # Linux
```

## Integration with Frontend

Update frontend configuration in `/src/config/voice.config.ts`:

```typescript
export const VOICE_CONFIG = {
  apiEndpoint: 'http://localhost:3000/api/voice',
  // ... other config
};
```

## Performance

- Average processing time: 2-5 seconds
- Depends on audio length and Gemini API response time
- Uses streaming where possible for lower latency

## Security Notes

- Never commit `.env` file to version control
- Use environment variables for API keys
- Consider rate limiting for production
- Implement authentication if needed

## Next Steps

1. ✅ Server is ready to use
2. Update frontend `voice.config.ts` with server URL
3. Start both frontend and backend
4. Test voice interaction

## Support

- Gemini API Docs: https://ai.google.dev/gemini-api/docs
- Live API Guide: https://ai.google.dev/gemini-api/docs/live-guide
