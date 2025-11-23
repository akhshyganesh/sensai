import { GoogleGenAI, Modality } from '@google/genai';
import { pcmToBase64, base64ToPCM } from '../utils/audioConverter.js';

const MODEL = 'gemini-2.0-flash-exp';

interface GeminiConfig {
  apiKey: string;
  systemInstruction?: string;
}

interface AudioResponse {
  audioBuffer: Buffer;
  text?: string;
}

/**
 * Process audio through Gemini Live API using official SDK
 */
export async function processAudioWithGemini(
  pcmAudioBuffer: Buffer,
  config: GeminiConfig
): Promise<AudioResponse> {
  const { apiKey, systemInstruction } = config;

  const ai = new GoogleGenAI({ apiKey });

  const sessionConfig = {
    responseModalities: [Modality.AUDIO],
    systemInstruction: systemInstruction || 'You are a helpful AI assistant. Respond in a friendly and conversational tone. Keep responses brief and natural.',
  };

  try {
    console.log('Connecting to Gemini Live API...');
    
    const responseQueue: Array<{ data?: string; serverContent?: { turnComplete?: boolean } }> = [];

    async function waitMessage() {
      let done = false;
      let message = undefined;
      while (!done) {
        message = responseQueue.shift();
        if (message) {
          done = true;
        } else {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }
      return message;
    }

    async function handleTurn() {
      const turns = [];
      let done = false;
      while (!done) {
        const message = await waitMessage();
        turns.push(message);
        if (message && message.serverContent && message.serverContent.turnComplete) {
          done = true;
        }
      }
      return turns;
    }

    const session = await ai.live.connect({
      model: MODEL,
      callbacks: {
        onopen: function () {
          console.log('✓ Connected to Gemini Live API');
        },
        onmessage: function (message: { data?: string; serverContent?: { turnComplete?: boolean } }) {
          responseQueue.push(message);
          console.log('← Received message type:', message.data ? 'audio data' : message.serverContent ? 'server content' : 'other');
        },
        onerror: function (e: { message: string }) {
          console.error('Gemini API error:', e.message);
        },
        onclose: function (e: { reason: string }) {
          console.log('Connection closed:', e.reason);
        },
      },
      config: sessionConfig,
    });

    console.log('Sending audio to Gemini...');
    
    // Convert PCM buffer to base64
    const base64Audio = pcmToBase64(pcmAudioBuffer);

    // Send audio to Gemini
    await session.sendRealtimeInput({
      audio: {
        data: base64Audio,
        mimeType: 'audio/pcm;rate=16000',
      },
    });

    console.log('→ Audio sent, waiting for response...');

    // Wait for complete response
    const turns = await handleTurn();

    // Combine audio data from response
    const audioChunks: number[] = [];
    for (const turn of turns) {
      if (turn && turn.data) {
        const buffer = Buffer.from(turn.data, 'base64');
        const intArray = new Int16Array(
          buffer.buffer,
          buffer.byteOffset,
          buffer.byteLength / Int16Array.BYTES_PER_ELEMENT
        );
        audioChunks.push(...Array.from(intArray));
      }
    }

    session.close();

    if (audioChunks.length === 0) {
      throw new Error('No audio received from Gemini');
    }

    // Convert Int16Array back to Buffer
    const audioBuffer = new Int16Array(audioChunks);
    const resultBuffer = Buffer.from(audioBuffer.buffer);

    console.log(`✓ Received ${audioChunks.length} audio samples (${resultBuffer.length} bytes)`);

    return {
      audioBuffer: resultBuffer,
    };
  } catch (error) {
    console.error('Error processing with Gemini:', error);
    throw error;
  }
}
