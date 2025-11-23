/**
 * Example API Server for Voice Interaction
 * This is a simple Node.js/Express example
 * 
 * Install dependencies:
 * npm install express multer cors
 * 
 * Run:
 * node server-example.js
 */

const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Enable CORS for your frontend
app.use(cors({
  origin: 'http://localhost:5173', // Update with your Vite dev server URL
  credentials: true,
}));

app.use(express.json());

/**
 * Voice API Endpoint
 * Receives audio, processes it, and returns audio response
 */
app.post('/api/voice', upload.single('audio'), async (req, res) => {
  try {
    console.log('Received audio:', req.file);

    // TODO: Process the audio
    // 1. Convert audio to text (speech-to-text)
    // 2. Send text to AI/LLM for response
    // 3. Convert response text to speech (text-to-speech)
    
    // For now, send back a sample audio file
    // Replace this with your actual audio processing logic
    
    // Example: Return a sample MP3 file
    const sampleAudioPath = path.join(__dirname, 'sample-response.mp3');
    
    // Check if sample exists, otherwise create a simple response
    if (fs.existsSync(sampleAudioPath)) {
      res.setHeader('Content-Type', 'audio/mpeg');
      fs.createReadStream(sampleAudioPath).pipe(res);
    } else {
      // If no sample file, return the original audio for testing
      res.setHeader('Content-Type', 'audio/webm');
      fs.createReadStream(req.file.path).pipe(res);
    }

    // Clean up uploaded file after sending response
    res.on('finish', () => {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
    });

  } catch (error) {
    console.error('Error processing audio:', error);
    res.status(500).json({ error: 'Failed to process audio' });
  }
});

/**
 * Alternative: JSON-based endpoint
 * Receives base64 audio and returns base64 audio
 */
app.post('/api/voice/json', async (req, res) => {
  try {
    const { audio, mimeType } = req.body;

    console.log('Received audio (JSON):', {
      audioLength: audio?.length,
      mimeType,
    });

    // TODO: Decode base64, process audio, encode response

    // Example: Echo back the same audio
    res.json({
      audio: audio,
      mimeType: mimeType || 'audio/webm',
    });

  } catch (error) {
    console.error('Error processing audio:', error);
    res.status(500).json({ error: 'Failed to process audio' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Voice API server running on http://localhost:${PORT}`);
  console.log('Endpoints:');
  console.log('  POST /api/voice - FormData audio upload');
  console.log('  POST /api/voice/json - JSON base64 audio');
});
