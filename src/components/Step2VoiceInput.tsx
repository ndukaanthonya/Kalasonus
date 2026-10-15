import React, { useState, useEffect, useRef } from 'react';
import { AudioAnalysis, ArtStyle } from '../types';
import { Mic, MicOff, Upload, ArrowRight, CheckCircle2, Volume2, Sparkles } from 'lucide-react';

interface Step2VoiceInputProps {
  onAudioCaptured: (analysis: AudioAnalysis) => void;
  onNextStep: () => void;
  currentAnalysis: AudioAnalysis | null;
  selectedStyle: ArtStyle;
  seed: number;
}

export const Step2VoiceInput: React.FC<Step2VoiceInputProps> = ({
  onAudioCaptured,
  onNextStep,
  currentAnalysis,
  selectedStyle,
  seed
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [liveFrequencies, setLiveFrequencies] = useState<number[]>([120, 240, 360, 480, 600]);
  const [audioError, setAudioError] = useState<string | null>(null);

  const timerRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);

  const toggleRecording = async () => {
    if (isRecording) {
      stopRecording();
    } else {
      await startRecording();
    }
  };

  const startRecording = async () => {
    setAudioError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      analyserRef.current = analyser;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const audioChunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);

        const avgEnergy = liveFrequencies.reduce((a, b) => a + b, 0) / (liveFrequencies.length * 255) || 0.78;
        const maxFreqIdx = liveFrequencies.indexOf(Math.max(...liveFrequencies));
        const estimatedPitch = `${Math.round(90 + maxFreqIdx * 110)} Hz`;
        const styleDisplayName = selectedStyle === 'cosmic-nebula' ? 'Cosmic Nebula' : 'Neon Stipple';
        const description = avgEnergy > 0.6 
          ? `${styleDisplayName} - High Energy Spectral Wave (${estimatedPitch})` 
          : `${styleDisplayName} - Soft Resonance (${estimatedPitch})`;

        const analysis: AudioAnalysis = {
          duration: recordingDuration || 3.5,
          pitch: estimatedPitch,
          energy: Math.min(1.0, Math.max(0.3, avgEnergy)),
          voiceDescription: description,
          frequencies: liveFrequencies.length ? liveFrequencies : [110, 220, 330, 440, 550],
          audioUrl
        };

        onAudioCaptured(analysis);
        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);

      timerRef.current = window.setInterval(() => {
        setRecordingDuration((prev) => prev + 0.1);
      }, 100);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateAudioVisuals = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        const arr = Array.from(dataArray.slice(0, 8));
        setLiveFrequencies(arr);
        animFrameRef.current = requestAnimationFrame(updateAudioVisuals);
      };
      updateAudioVisuals();

    } catch (err) {
      console.warn('Microphone error:', err);
      setAudioError('Microphone permission blocked or unavailable. Please enable microphone permissions or upload an audio file below.');
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const audioUrl = URL.createObjectURL(file);
      const styleDisplayName = selectedStyle === 'cosmic-nebula' ? 'Cosmic Nebula' : 'Neon Stipple';
      const analysis: AudioAnalysis = {
        duration: 4.2,
        pitch: 'Uploaded Vocal Track',
        energy: 0.82,
        voiceDescription: `${styleDisplayName} - Audio Track: ${file.name.slice(0, 20)}`,
        frequencies: [150, 300, 450, 600, 750, 900],
        audioUrl
      };
      onAudioCaptured(analysis);
    }
  };

  return (
    <main className="w-full max-w-[620px] flex flex-col items-center mt-6 md:mt-10 mb-16 px-4 z-10 relative mx-auto">
      {/* Title Header */}
      <div className="text-center mb-8">
        <h1 className="font-display-lg text-[32px] md:text-[44px] text-[#e4e1ed] mb-2 font-semibold leading-tight tracking-tight">
          Capture Your Voice
        </h1>
        <p className="font-body-base text-[14px] sm:text-[16px] text-[#c8c5cb]/80">
          Speak, hum, or sing into your microphone to modulate your chosen artwork.
        </p>
      </div>

      {/* Primary Interaction Area: Microphone Button & Dynamic Instructions */}
      <div className="w-full bg-[#16161e]/90 border border-white/10 rounded-2xl p-8 flex flex-col items-center shadow-2xl relative overflow-hidden">
        
        {/* Helper Guidance Text Box (Changes based on recording state) */}
        <div className="mb-6 text-center">
          {isRecording ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#93000a]/30 border border-[#ffb4ab]/40 text-[#ffb4ab] font-label-mono text-xs font-bold animate-pulse shadow-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ffb4ab] animate-ping" />
              Recording in progress... Tap the red button to stop ({recordingDuration.toFixed(1)}s)
            </div>
          ) : currentAnalysis ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#5adace]/15 border border-[#5adace]/40 text-[#5adace] font-label-mono text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-[#5adace]" />
              Voice captured! Tap microphone to re-record or proceed below
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#292932] border border-white/10 text-[#d4bbff] font-label-mono text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#5adace]" />
              Tap the microphone to start recording your voice
            </div>
          )}
        </div>

        {/* Pulsing Microphone Control */}
        <div 
          onClick={toggleRecording}
          className="relative flex justify-center items-center w-52 h-52 sm:w-60 sm:h-60 cursor-pointer group select-none transition-transform active:scale-95 mb-6"
        >
          {/* Outer Pulsing Glow */}
          <div className={`absolute inset-0 rounded-full border transition-all duration-500 ${
            isRecording 
              ? 'border-[#ffb4ab] bg-[#93000a]/20 shadow-[0_0_60px_rgba(255,180,171,0.4)] scale-105' 
              : 'border-white/15 bg-[#5adace]/10 hover:border-[#5adace]/50 hover:shadow-[0_0_40px_rgba(90,218,206,0.2)]'
          }`} />

          {/* Center Button Icon */}
          <div className={`relative z-10 flex flex-col items-center justify-center w-28 h-28 sm:w-32 sm:h-32 rounded-full border transition-all duration-300 ${
            isRecording 
              ? 'bg-[#93000a] border-[#ffb4ab] text-[#ffb4ab] shadow-[0_0_35px_rgba(255,180,171,0.6)]' 
              : 'bg-[#292932] border-white/20 text-[#5adace] hover:bg-[#34343d] hover:text-white'
          }`}>
            <span className="material-symbols-outlined text-4xl mb-1">
              {isRecording ? 'stop' : 'mic'}
            </span>
            <span className="font-label-mono text-[10px] uppercase tracking-wider font-bold">
              {isRecording ? 'STOP' : 'RECORD'}
            </span>
          </div>
        </div>

        {/* Audio Wave Visualizer during recording */}
        {isRecording && (
          <div className="flex gap-2 items-end h-10 mb-4">
            {liveFrequencies.map((f, i) => (
              <div 
                key={i} 
                className="w-2 bg-gradient-to-t from-[#5adace] to-[#b794f4] rounded-full transition-all duration-75"
                style={{ height: `${Math.max(20, (f / 255) * 100)}%` }}
              />
            ))}
          </div>
        )}

        {/* Audio Error Banner */}
        {audioError && (
          <div className="mb-4 p-3 bg-[#93000a]/20 border border-[#ffb4ab]/30 rounded-lg text-xs font-metadata text-[#ffb4ab] text-center max-w-sm">
            {audioError}
          </div>
        )}

        {/* Upload Audio Option */}
        <div className="pt-4 border-t border-white/10 w-full flex justify-center">
          <label className="px-5 py-2.5 rounded-xl border border-white/15 bg-[#1b1b23] hover:bg-[#292932] text-[#e4e1ed] font-label-mono text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-sm">
            <Upload className="w-4 h-4 text-[#5adace]" />
            <span>Upload Audio File Instead</span>
            <input type="file" accept="audio/*" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* Captured Audio Info & Proceed Button */}
      {currentAnalysis && (
        <div className="w-full mt-6 flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className="w-full bg-[#1b1b23]/90 border border-[#5adace]/30 rounded-xl p-4 flex items-center justify-between text-left shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#5adace]/15 border border-[#5adace]/40 flex items-center justify-center text-[#5adace]">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <div className="font-headline-md text-xs font-bold text-white">Audio Analysis Ready</div>
                <div className="font-metadata text-[11px] text-[#c8c5cb]/80 mt-0.5 truncate max-w-[280px] sm:max-w-[360px]">
                  {currentAnalysis.voiceDescription}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={onNextStep}
            className="w-full py-4 bg-[#f7fafc] text-black hover:bg-white transition-all font-label-mono text-[13px] rounded-xl font-bold flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.25)] hover:scale-[1.02] cursor-pointer"
          >
            <span>Generate & Mint NFT (Step 3)</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </button>
        </div>
      )}
    </main>
  );
};
