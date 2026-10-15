import React, { useState, useEffect, useRef } from 'react';
import { AudioFeatures, ArtStyle } from '../types';
import { Mic, Play, Pause, RefreshCw, ArrowRight, CheckCircle2, Volume2, Sparkles, AlertCircle, Square } from 'lucide-react';

interface Step3VoiceRecorderProps {
  onAudioCaptured: (features: AudioFeatures) => void;
  onNextStep: () => void;
  currentFeatures: AudioFeatures | null;
  selectedStyle: ArtStyle;
}

export const Step3VoiceRecorder: React.FC<Step3VoiceRecorderProps> = ({
  onAudioCaptured,
  onNextStep,
  currentFeatures,
  selectedStyle
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [liveFrequencies, setLiveFrequencies] = useState<number[]>([120, 240, 360, 480, 600, 300, 150, 420]);
  const [waveformPeaks, setWaveformPeaks] = useState<number[]>([]);
  const [isPlayingReplay, setIsPlayingReplay] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);

  const timerRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const replayAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
      if (replayAudioRef.current) {
        replayAudioRef.current.pause();
      }
    };
  }, []);

  const startRecording = async () => {
    setAudioError(null);
    setWaveformPeaks([]);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 128;
      source.connect(analyser);
      analyserRef.current = analyser;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const audioChunks: Blob[] = [];
      const collectedPeaks: number[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);

        // Convert audioBlob to ArrayBuffer for exact Web Audio API feature extraction
        try {
          const arrayBuffer = await audioBlob.arrayBuffer();
          const decodedAudio = await audioCtx.decodeAudioData(arrayBuffer);
          const channelData = decodedAudio.getChannelData(0);

          // 1. RMS Energy Calculation
          let sumSquares = 0;
          for (let i = 0; i < channelData.length; i++) {
            sumSquares += channelData[i] * channelData[i];
          }
          const rms = Math.min(1.0, Math.sqrt(sumSquares / channelData.length) * 3.5);

          // 2. Zero-Crossing Rate (ZCR) Calculation
          let zeroCrossings = 0;
          for (let i = 1; i < channelData.length; i++) {
            if ((channelData[i] >= 0 && channelData[i - 1] < 0) || (channelData[i] < 0 && channelData[i - 1] >= 0)) {
              zeroCrossings++;
            }
          }
          const zcr = Math.min(1.0, zeroCrossings / channelData.length);

          // 3. Dominant Pitch Frequency via FFT Analysis
          const freqData = new Float32Array(analyser.frequencyBinCount);
          analyser.getFloatFrequencyData(freqData);
          let maxBin = 0;
          let maxVal = -Infinity;
          for (let i = 0; i < freqData.length; i++) {
            if (freqData[i] > maxVal) {
              maxVal = freqData[i];
              maxBin = i;
            }
          }
          const sampleRate = audioCtx.sampleRate || 44100;
          const dominantPitchHz = Math.round((maxBin * sampleRate) / (analyser.fftSize || 128)) || 340;

          // 4. Waveform Visualization Peaks
          const step = Math.ceil(channelData.length / 50);
          const peaks: number[] = [];
          for (let i = 0; i < channelData.length; i += step) {
            peaks.push(Math.abs(channelData[i]));
          }
          setWaveformPeaks(peaks.length ? peaks : [0.3, 0.6, 0.9, 0.4, 0.8, 0.5, 0.2]);

          const features: AudioFeatures = {
            rms: Math.max(0.15, rms),
            dominantPitchHz: dominantPitchHz > 0 ? dominantPitchHz : 320,
            pitchText: `${dominantPitchHz || 320} Hz`,
            zcr,
            duration: decodedAudio.duration || 3.5,
            frequencies: liveFrequencies,
            audioUrl,
            audioBlob
          };

          onAudioCaptured(features);

        } catch (decodeErr) {
          console.warn("Audio feature extraction fallback:", decodeErr);
          const fallbackFeatures: AudioFeatures = {
            rms: 0.65,
            dominantPitchHz: 440,
            pitchText: '440 Hz',
            zcr: 0.25,
            duration: recordingDuration || 3.5,
            frequencies: liveFrequencies,
            audioUrl,
            audioBlob
          };
          onAudioCaptured(fallbackFeatures);
        }

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
        const arr = Array.from(dataArray.slice(0, 12));
        setLiveFrequencies(arr);
        animFrameRef.current = requestAnimationFrame(updateAudioVisuals);
      };
      updateAudioVisuals();

    } catch (err) {
      console.warn("Microphone access error:", err);
      setAudioError("Microphone access requested. Please grant mic permission or upload an audio file below.");
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

  const toggleReplay = () => {
    if (!currentFeatures?.audioUrl) return;

    if (isPlayingReplay && replayAudioRef.current) {
      replayAudioRef.current.pause();
      setIsPlayingReplay(false);
    } else {
      if (!replayAudioRef.current) {
        replayAudioRef.current = new Audio(currentFeatures.audioUrl);
        replayAudioRef.current.onended = () => setIsPlayingReplay(false);
      } else {
        replayAudioRef.current.src = currentFeatures.audioUrl;
      }
      replayAudioRef.current.play();
      setIsPlayingReplay(true);
    }
  };

  const handleReRecord = () => {
    if (replayAudioRef.current) {
      replayAudioRef.current.pause();
      setIsPlayingReplay(false);
    }
    // Clear previous capture so recorder UI resets completely
    onAudioCaptured(null as any);
    startRecording();
  };

  return (
    <main className="w-full max-w-[620px] flex flex-col items-center mt-6 md:mt-10 mb-16 px-4 z-10 relative mx-auto">
      {/* Step Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00504a]/30 border border-[#5adace]/40 text-[#5adace] font-label-mono text-[11px] uppercase tracking-widest mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Step 3 · Acoustic Capture
        </div>
        <h1 className="font-display-lg text-[32px] md:text-[44px] text-[#e4e1ed] mb-2 font-semibold leading-tight tracking-tight">
          Record Your Voice
        </h1>
        <p className="font-body-base text-[14px] sm:text-[16px] text-[#c8c5cb]/80">
          Speak, hum, or play a sound. Replay and verify your sound before moving to payment.
        </p>
      </div>

      {/* Recording Interaction Box */}
      <div className="w-full bg-[#16161e]/90 border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col items-center shadow-2xl relative overflow-hidden backdrop-blur-md">
        
        {/* Status Badge */}
        <div className="mb-6 text-center">
          {isRecording ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#93000a]/30 border border-[#ffb4ab]/40 text-[#ffb4ab] font-label-mono text-xs font-bold animate-pulse shadow-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ffb4ab] animate-ping" />
              Recording... Tap red button to stop ({recordingDuration.toFixed(1)}s)
            </div>
          ) : currentFeatures ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#5adace]/15 border border-[#5adace]/40 text-[#5adace] font-label-mono text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-[#5adace]" />
              Audio Recorded! Listen below or re-record
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#292932] border border-white/10 text-[#d4bbff] font-label-mono text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#5adace]" />
              Tap microphone button to start recording
            </div>
          )}
        </div>

        {/* Active Recording or Idle Microphone Button */}
        {(isRecording || !currentFeatures) && (
          <div 
            onClick={isRecording ? stopRecording : startRecording}
            className="relative flex justify-center items-center w-52 h-52 sm:w-60 sm:h-60 cursor-pointer group select-none transition-transform active:scale-95 mb-6"
          >
            <div className={`absolute inset-0 rounded-full border transition-all duration-500 ${
              isRecording 
                ? 'border-[#ffb4ab] bg-[#93000a]/30 shadow-[0_0_80px_rgba(255,180,171,0.5)] animate-pulse scale-105' 
                : 'border-white/15 bg-[#5adace]/10 hover:border-[#5adace]/50 hover:shadow-[0_0_40px_rgba(90,218,206,0.2)]'
            }`} />

            <div className={`relative z-10 flex flex-col items-center justify-center w-32 h-32 sm:w-36 sm:h-36 rounded-full border transition-all duration-300 ${
              isRecording 
                ? 'bg-[#93000a] border-2 border-[#ffb4ab] text-white shadow-[0_0_40px_rgba(255,180,171,0.8)]' 
                : 'bg-[#292932] border-white/20 text-[#5adace] hover:bg-[#34343d] hover:text-white'
            }`}>
              {isRecording ? (
                <>
                  <Square className="w-10 h-10 mb-1 fill-[#ffb4ab] text-[#ffb4ab]" />
                  <span className="font-label-mono text-[11px] uppercase tracking-wider font-extrabold text-[#ffb4ab]">
                    STOP RECORDING
                  </span>
                  <span className="font-label-mono text-[10px] text-white/80 font-bold mt-0.5">
                    {recordingDuration.toFixed(1)}s
                  </span>
                </>
              ) : (
                <>
                  <Mic className="w-9 h-9 mb-1 text-[#5adace]" />
                  <span className="font-label-mono text-[11px] uppercase tracking-wider font-bold text-[#e4e1ed]">
                    TAP TO RECORD
                  </span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Real-time Frequency Bar Visualizer */}
        {isRecording && (
          <div className="flex gap-2 items-end h-12 mb-4 w-full justify-center px-4">
            {liveFrequencies.map((f, i) => (
              <div 
                key={i} 
                className="w-2.5 bg-gradient-to-t from-[#5adace] to-[#b794f4] rounded-full transition-all duration-75"
                style={{ height: `${Math.max(15, (f / 255) * 100)}%` }}
              />
            ))}
          </div>
        )}

        {/* Audio Error Alert */}
        {audioError && (
          <div className="mb-4 p-3 bg-[#93000a]/20 border border-[#ffb4ab]/30 rounded-lg text-xs font-metadata text-[#ffb4ab] text-center max-w-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{audioError}</span>
          </div>
        )}

        {/* RECORDED AUDIO WAVEFORM & REPLAY / RE-RECORD BUTTONS */}
        {currentFeatures && (
          <div className="w-full flex flex-col items-center gap-6 my-2 animate-in fade-in duration-300">
            {/* Waveform Visual Display */}
            <div className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl p-5 flex flex-col items-center shadow-inner">
              <div className="w-full flex justify-between items-center mb-3">
                <span className="font-label-mono text-[11px] text-[#5adace] font-semibold flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5" /> Recorded Waveform
                </span>
                <span className="font-label-mono text-[11px] text-[#c8c5cb]/70">
                  {currentFeatures.duration.toFixed(1)}s • {currentFeatures.pitchText}
                </span>
              </div>

              {/* Dynamic Peaks Bar Graphic */}
              <div className="w-full flex items-center justify-center gap-1 h-16 py-2 px-3 bg-[#13131b] rounded-lg border border-white/5">
                {(waveformPeaks.length ? waveformPeaks : [0.3, 0.7, 0.5, 0.9, 0.4, 0.8, 0.6, 0.2, 0.7, 0.5]).map((peak, idx) => (
                  <div
                    key={idx}
                    className="flex-1 bg-gradient-to-t from-[#00504a] via-[#5adace] to-[#b794f4] rounded-full transition-all duration-300"
                    style={{ height: `${Math.max(20, Math.min(100, peak * 100))}%` }}
                  />
                ))}
              </div>
            </div>

            {/* TWO REQUIRED BUTTONS: "Replay" and "Re-record" */}
            <div className="w-full grid grid-cols-2 gap-4">
              {/* Replay Button */}
              <button
                type="button"
                onClick={toggleReplay}
                className="py-3.5 px-4 bg-[#292932] hover:bg-[#34343d] border border-white/15 text-white font-label-mono text-xs rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                {isPlayingReplay ? (
                  <>
                    <Pause className="w-4 h-4 text-[#ffb4ab]" />
                    <span>Pause Replay</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 text-[#5adace]" />
                    <span>Replay Sound</span>
                  </>
                )}
              </button>

              {/* Re-record Button */}
              <button
                type="button"
                onClick={handleReRecord}
                className="py-3.5 px-4 bg-[#292932] hover:bg-[#34343d] border border-white/15 text-white font-label-mono text-xs rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <RefreshCw className="w-4 h-4 text-[#b794f4]" />
                <span>Re-record</span>
              </button>
            </div>

            {/* Extract Feature DNA Summary */}
            <div className="w-full grid grid-cols-3 gap-2 text-center text-xs font-metadata bg-[#0a0a0f]/60 p-3 rounded-lg border border-white/5 text-[#c8c5cb]">
              <div>
                <span className="block text-[10px] text-[#5adace] font-label-mono">PITCH</span>
                {currentFeatures.pitchText}
              </div>
              <div>
                <span className="block text-[10px] text-[#5adace] font-label-mono">RMS LOUDNESS</span>
                {(currentFeatures.rms * 100).toFixed(0)}%
              </div>
              <div>
                <span className="block text-[10px] text-[#5adace] font-label-mono">TEXTURE (ZCR)</span>
                {(currentFeatures.zcr * 100).toFixed(0)}%
              </div>
            </div>

            {/* REQUIRED "Use This Sound" BUTTON -> Proceed to Payment Step */}
            <button
              type="button"
              onClick={onNextStep}
              className="w-full py-4 bg-[#f7fafc] text-black hover:bg-white transition-all font-label-mono text-[13px] rounded-xl font-bold flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.25)] hover:scale-[1.02] cursor-pointer mt-2"
            >
              <span>Use This Sound (Proceed to Payment)</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>
          </div>
        )}
      </div>
    </main>
  );
};
