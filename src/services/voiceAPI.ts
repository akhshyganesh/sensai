/**
 * API Service for voice interactions
 * Configure your API endpoint and authentication here
 */

import { VOICE_CONFIG } from '@/config/voice.config';

export interface VoiceAPIConfig {
  endpoint: string;
  apiKey?: string;
}

const DEFAULT_CONFIG: VoiceAPIConfig = {
  endpoint: VOICE_CONFIG.apiEndpoint,
  apiKey: VOICE_CONFIG.apiKey,
};

/**
 * Send audio to server and receive audio response
 * @param audioBlob - The recorded audio blob
 * @param config - Optional API configuration
 * @returns Promise<Blob> - The audio response from server
 */
export async function sendAudioToServer(
  audioBlob: Blob,
  config: Partial<VoiceAPIConfig> = {}
): Promise<Blob> {
  const { endpoint, apiKey } = { ...DEFAULT_CONFIG, ...config };

  try {
    if (VOICE_CONFIG.debug) {
      console.log('Sending audio to server:', {
        endpoint,
        audioSize: audioBlob.size,
        audioType: audioBlob.type,
      });
    }

    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');

    const headers: HeadersInit = {};
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    // Assuming the server returns audio data
    const audioData = await response.blob();
    
    if (VOICE_CONFIG.debug) {
      console.log('Received audio response:', {
        size: audioData.size,
        type: audioData.type,
      });
    }
    
    return audioData;
  } catch (error) {
    console.error('Error sending audio to server:', error);
    throw error;
  }
}

/**
 * Alternative: Send audio with JSON (base64 encoded)
 * Use this if your API expects JSON instead of FormData
 */
export async function sendAudioAsJSON(
  audioBlob: Blob,
  config: Partial<VoiceAPIConfig> = {}
): Promise<Blob> {
  const { endpoint, apiKey } = { ...DEFAULT_CONFIG, ...config };

  try {
    // Convert blob to base64
    const base64Audio = await blobToBase64(audioBlob);

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        audio: base64Audio,
        mimeType: audioBlob.type,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Assuming server returns base64 encoded audio in response
    if (data.audio) {
      return base64ToBlob(data.audio, data.mimeType || 'audio/mp3');
    }

    throw new Error('No audio data in response');
  } catch (error) {
    console.error('Error sending audio to server:', error);
    throw error;
  }
}

/**
 * Helper: Convert Blob to base64
 */
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      // Remove the data URL prefix (e.g., "data:audio/webm;base64,")
      const base64Data = base64.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Helper: Convert base64 to Blob
 */
function base64ToBlob(base64: string, mimeType: string): Blob {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}
