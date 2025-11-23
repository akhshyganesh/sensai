import ffmpeg from 'fluent-ffmpeg';
import { Readable, PassThrough } from 'stream';
import pkg from 'wavefile';
const { WaveFile } = pkg;

/**
 * Convert WebM audio to PCM 16kHz mono format required by Gemini
 */
export async function webmToPCM(webmBuffer: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    const inputStream = new Readable();
    inputStream.push(webmBuffer);
    inputStream.push(null);

    const outputStream = new PassThrough();

    outputStream.on('data', (chunk) => {
      chunks.push(chunk);
    });

    outputStream.on('end', () => {
      resolve(Buffer.concat(chunks));
    });

    ffmpeg(inputStream)
      .inputFormat('webm')
      .audioCodec('pcm_s16le')
      .audioChannels(1)
      .audioFrequency(16000)
      .format('s16le')
      .on('error', (err) => {
        console.error('FFmpeg conversion error:', err);
        reject(err);
      })
      .pipe(outputStream);
  });
}

/**
 * Convert PCM 24kHz data from Gemini to WAV format
 */
export function pcmToWav(pcmData: Buffer, sampleRate: number = 24000): Buffer {
  const wav = new WaveFile();
  
  // Convert buffer to Int16Array
  const int16Array = new Int16Array(
    pcmData.buffer,
    pcmData.byteOffset,
    pcmData.byteLength / Int16Array.BYTES_PER_ELEMENT
  );
  
  // Create WAV from PCM data
  wav.fromScratch(1, sampleRate, '16', Array.from(int16Array));
  
  return Buffer.from(wav.toBuffer());
}

/**
 * Convert PCM data to base64 string for Gemini API
 */
export function pcmToBase64(pcmBuffer: Buffer): string {
  return pcmBuffer.toString('base64');
}

/**
 * Convert base64 audio from Gemini to Buffer
 */
export function base64ToPCM(base64Audio: string): Buffer {
  return Buffer.from(base64Audio, 'base64');
}

/**
 * Combine multiple PCM audio chunks into one buffer
 */
export function combineAudioChunks(chunks: Buffer[]): Buffer {
  return Buffer.concat(chunks);
}
