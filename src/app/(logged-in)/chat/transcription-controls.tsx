'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { MicIcon, MicOffIcon } from 'lucide-react';
import {
  useRealtimeTranscription,
  useRealtimeEventListener,
} from '@speechmatics/real-time-client-react';
import { PCMRecorder } from '@speechmatics/browser-audio-input';
import { getTranscriptionJWT } from '@/app/actions/transcribe';

// AudioWorklet script for off-thread PCM capture (copied from @speechmatics/browser-audio-input)
const WORKLET_SCRIPT_URL = '/js/pcm-audio-worklet.min.js';
// 16kHz is optimal for speech; higher rates are downsampled server-side
const SAMPLE_RATE = 16_000;

interface TranscriptionControlsProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

export default function TranscriptionControls({
  onTranscript,
  disabled,
}: TranscriptionControlsProps) {
  const [isStarting, setIsStarting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const recorderRef = useRef<PCMRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  // Tracks the active audio handler so we can detach it on stop
  const audioHandlerRef = useRef<((evt: Event) => void) | null>(null);
  // Ref avoids stale closure over sendAudio inside the audio event handler
  const sendAudioRef = useRef<((data: Float32Array) => void) | null>(null);

  const { startTranscription, stopTranscription, sendAudio } =
    useRealtimeTranscription();

  // Keep ref in sync with latest sendAudio on every render
  sendAudioRef.current = sendAudio;

  // Create the PCMRecorder once and track recording state via its events
  useEffect(() => {
    const recorder = new PCMRecorder(WORKLET_SCRIPT_URL);
    recorderRef.current = recorder;

    const onStarted = () => setIsRecording(true);
    const onStopped = () => setIsRecording(false);

    recorder.addEventListener('recordingStarted', onStarted);
    recorder.addEventListener('recordingStopped', onStopped);

    return () => {
      recorder.removeEventListener('recordingStarted', onStarted);
      recorder.removeEventListener('recordingStopped', onStopped);
      recorder.stopRecording();
    };
  }, []);

  // Extract final transcript words and forward to parent via onTranscript
  useRealtimeEventListener('receiveMessage', ({ data }) => {
    if (data.message === 'AddTranscript') {
      const text = data.results
        .map(
          (r: { alternatives?: { content: string }[] }) =>
            r.alternatives?.[0]?.content,
        )
        .filter(Boolean)
        .join(' ');

      if (text.trim()) {
        onTranscript(text);
      }
    }
  });

  const toggleRecording = useCallback(async () => {
    const recorder = recorderRef.current;
    if (!recorder) return;

    // --- Stop path: detach audio handler, stop mic, close WebSocket session ---
    if (isRecording) {
      if (audioHandlerRef.current) {
        recorder.removeEventListener('audio', audioHandlerRef.current);
        audioHandlerRef.current = null;
      }
      recorder.stopRecording();
      await stopTranscription();
      return;
    }

    // --- Start path ---
    setIsStarting(true);
    try {
      // Lazily create AudioContext on first user gesture (browser policy)
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext({ sampleRate: SAMPLE_RATE });
      }

      // Fetch a short-lived JWT from server action (keeps API key server-side)
      const jwt = await getTranscriptionJWT();

      // Open WebSocket to Speechmatics with transcription + audio format config
      await startTranscription(jwt, {
        transcription_config: {
          language: 'fr',
          operating_point: 'enhanced',
          max_delay: 1.0,
          transcript_filtering_config: {
            remove_disfluencies: true,
          },
        },
        audio_format: {
          type: 'raw',
          encoding: 'pcm_f32le',
          sample_rate: SAMPLE_RATE,
        },
      });

      // Attach audio handler AFTER socket is ready to avoid "socket not ready" errors
      const onAudio = (evt: Event) => {
        const audioEvt = evt as Event & { data: Float32Array };
        sendAudioRef.current?.(audioEvt.data);
      };
      audioHandlerRef.current = onAudio;
      recorder.addEventListener('audio', onAudio);

      // Start capturing mic PCM via AudioWorklet
      await recorder.startRecording({
        audioContext: audioContextRef.current,
      });
    } catch (error) {
      console.error('Failed to start transcription:', error);
    } finally {
      setIsStarting(false);
    }
  }, [isRecording, stopTranscription, startTranscription]);

  return (
    <button
      type='button'
      onClick={toggleRecording}
      disabled={disabled || isStarting}
      className='flex items-center justify-center size-9 rounded-md transition-colors hover:bg-accent disabled:opacity-50 disabled:pointer-events-none'
      aria-label={isRecording ? 'Stop recording' : 'Start recording'}
    >
      {isRecording ? (
        <MicOffIcon className='size-4 text-destructive' />
      ) : (
        <MicIcon className='size-4' />
      )}
    </button>
  );
}
