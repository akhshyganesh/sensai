import { useState, useRef, useCallback } from 'react';

export type RecordingState = 'idle' | 'recording' | 'processing' | 'playing';

export interface UseVoiceInteractionReturn {
  state: RecordingState;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  error: string | null;
  isSupported: boolean;
}

export function useVoiceInteraction(
  onAudioReady?: (audioBlob: Blob) => Promise<Blob | void>
): UseVoiceInteractionReturn {
  const [state, setState] = useState<RecordingState>('idle');
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<HTMLAudioElement | null>(null);

  const isSupported = typeof navigator !== 'undefined' && 
    'mediaDevices' in navigator && 
    'getUserMedia' in navigator.mediaDevices;

  const playAudio = useCallback(async (audioBlob: Blob): Promise<void> => {
    return new Promise((resolve, reject) => {
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audioContextRef.current = audio;

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        audioContextRef.current = null;
        resolve();
      };

      audio.onerror = () => {
        URL.revokeObjectURL(audioUrl);
        audioContextRef.current = null;
        reject(new Error('Failed to play audio'));
      };

      audio.play().catch(reject);
    });
  }, []);

  const startRecording = useCallback(async () => {
    if (!isSupported) {
      setError('Audio recording is not supported in this browser');
      return;
    }

    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm;codecs=opus' });
        
        stream.getTracks().forEach(track => track.stop());

        if (onAudioReady) {
          setState('processing');
          try {
            const responseAudio = await onAudioReady(audioBlob);
            
            if (responseAudio && responseAudio instanceof Blob) {
              setState('playing');
              await playAudio(responseAudio);
              setState('idle');
            } else {
              setState('idle');
            }
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to process audio');
            setState('idle');
          }
        } else {
          setState('idle');
        }
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setState('recording');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start recording');
      setState('idle');
    }
  }, [isSupported, onAudioReady, playAudio]);

  const stopRecording = useCallback(async () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  }, []);

  return {
    state,
    startRecording,
    stopRecording,
    error,
    isSupported,
  };
}
