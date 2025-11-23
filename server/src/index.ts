import express, { Request, Response } from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import { webmToPCM, pcmToWav } from './utils/audioConverter.js';
import { processAudioWithGemini } from './services/gemini.js';

// Load environment variables
dotenv.config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// Configuration
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('ERROR: GEMINI_API_KEY is not set in environment variables');
  process.exit(1);
}

// Middleware
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));

app.use(express.json());

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Main voice API endpoint
app.post('/api/voice', upload.single('audio'), async (req: Request, res: Response) => {
  console.log('\n=== New voice request ===');
  
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    console.log('Received audio:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });

    // Step 1: Convert WebM to PCM 16kHz
    console.log('Converting WebM to PCM 16kHz...');
    const pcmBuffer = await webmToPCM(req.file.buffer);
    console.log(`Converted to PCM: ${pcmBuffer.length} bytes`);

    // Step 2: Process with Gemini Live API
    console.log('Sending to Gemini Live API...');
    const geminiResponse = await processAudioWithGemini(pcmBuffer, {
      apiKey: GEMINI_API_KEY,
      systemInstruction: 'You are a helpful AI assistant. Respond in a friendly and conversational tone.',
    });

    console.log(`Received response from Gemini: ${geminiResponse.audioBuffer.length} bytes`);

    // Step 3: Convert PCM response to WAV
    console.log('Converting PCM to WAV...');
    const wavBuffer = pcmToWav(geminiResponse.audioBuffer, 24000);
    console.log(`WAV file created: ${wavBuffer.length} bytes`);

    // Step 4: Send WAV audio back to client
    res.setHeader('Content-Type', 'audio/wav');
    res.setHeader('Content-Length', wavBuffer.length.toString());
    res.send(wavBuffer);

    console.log('✓ Response sent successfully');
  } catch (error) {
    console.error('Error processing audio:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ 
      error: 'Failed to process audio',
      details: errorMessage 
    });
  }
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    details: err.message 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Sensai Voice Server`);
  console.log(`================================`);
  console.log(`Server running on: http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Voice endpoint: POST http://localhost:${PORT}/api/voice`);
  console.log(`Frontend URL: ${FRONTEND_URL}`);
  console.log(`Gemini API: ${GEMINI_API_KEY ? '✓ Configured' : '✗ Not configured'}`);
  console.log(`================================\n`);
});
