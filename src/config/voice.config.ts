// Voice API Configuration
// Update these values to match your API setup

export const VOICE_CONFIG = {
  // Your API endpoint (Node.js server with Gemini integration)
  apiEndpoint: 'http://localhost:3000/api/voice',
  
  // API Key (if required)
  apiKey: '',
  
  // Use JSON format instead of FormData
  useJSON: false,
  
  // Recording options
  recording: {
    mimeType: 'audio/webm;codecs=opus',
    // Alternative formats: 'audio/webm', 'audio/mp4', 'audio/ogg'
  },
  
  // Enable debug logging
  debug: true,
} as const;
