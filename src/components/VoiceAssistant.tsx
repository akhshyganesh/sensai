'use client'

import { SplineScene } from "@/components/ui/spline";
import { Card } from "@/components/ui/card"
import { Spotlight } from "@/components/ui/spotlight"
import { useVoiceInteraction } from "@/hooks/useVoiceInteraction"
import { sendAudioToServer } from "@/services/voiceAPI"
import { Mic, MicOff, Loader2, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
 
export function VoiceAssistant() {
  const { state, startRecording, stopRecording, error, isSupported } = useVoiceInteraction(
    async (audioBlob) => {
      try {
        // Send audio to server and get response
        const responseAudio = await sendAudioToServer(audioBlob);
        return responseAudio;
      } catch (err) {
        console.error('Failed to process audio:', err);
        throw err;
      }
    }
  );

  const handleMicClick = () => {
    if (state === 'recording') {
      stopRecording();
    } else if (state === 'idle') {
      startRecording();
    }
  };

  const getStatusText = () => {
    switch (state) {
      case 'recording':
        return 'Listening...';
      case 'processing':
        return 'Processing...';
      case 'playing':
        return 'Playing response...';
      default:
        return 'Click microphone to speak';
    }
  };

  const getStatusColor = () => {
    switch (state) {
      case 'recording':
        return 'text-red-500';
      case 'processing':
        return 'text-yellow-500';
      case 'playing':
        return 'text-green-500';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <Card className="w-full h-full bg-black/[0.96] relative overflow-hidden">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      
      <div className="flex h-full relative">
        <SplineScene 
          scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
          className="w-full h-full"
        />

        {/* Voice Controls Overlay */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-4 z-10">
          {/* Status Text */}
          <div className={`text-sm font-medium ${getStatusColor()} transition-colors`}>
            {getStatusText()}
          </div>

          {/* Microphone Button */}
          {isSupported ? (
            <Button
              onClick={handleMicClick}
              disabled={state === 'processing' || state === 'playing'}
              className={`w-16 h-16 rounded-full transition-all ${
                state === 'recording' 
                  ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              size="icon"
            >
              {state === 'recording' && <MicOff className="w-8 h-8" />}
              {state === 'idle' && <Mic className="w-8 h-8" />}
              {state === 'processing' && <Loader2 className="w-8 h-8 animate-spin" />}
              {state === 'playing' && <Volume2 className="w-8 h-8 animate-pulse" />}
            </Button>
          ) : (
            <div className="text-red-500 text-sm">
              Microphone not supported
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="text-red-500 text-xs max-w-xs text-center bg-black/50 p-2 rounded">
              {error}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
