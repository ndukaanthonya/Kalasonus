import React, { useState, useEffect, useRef } from 'react';
import { MintRecord } from '../types';
import { X, Camera, Sparkles, Volume2, VolumeX, RefreshCw, Play, RotateCcw } from 'lucide-react';

interface ARViewModalProps {
  mintRecord: MintRecord;
  onClose: () => void;
}

interface ARParticle {
  x: number;
  y: number;
  baseRadius: number;
  radius: number;
  color: string;
  vx: number;
  vy: number;
  angle: number;
  orbitRadius: number;
  orbitSpeed: number;
  alpha: number;
  pulseSpeed: number;
}

const PARTICLE_COLORS = [
  '#5adace', '#ffb4ab', '#b794f4', '#e06d53', 
  '#ffe066', '#4bc7bb', '#f06292', '#ba68c8', 
  '#64ffda', '#ff80ab', '#ffd54f', '#4dd0e1'
];

export const ARViewModal: React.FC<ARViewModalProps> = ({
  mintRecord,
  onClose
}) => {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(true);
  const [isTargetDetected, setIsTargetDetected] = useState(true);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Initialize camera
  useEffect(() => {
    let stream: MediaStream | null = null;

    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setHasCameraPermission(true);
      } catch (err) {
        console.warn("Camera permission fallback:", err);
        setHasCameraPermission(false);
      }
    }

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  // Animated Mobile Stardust Particles Canvas System in AR Viewport
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Create 450 mobile abstract particles matching the user sample artwork
    const particles: ARParticle[] = Array.from({ length: 450 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const orbitRadius = Math.random() * (Math.min(width, height) * 0.45);
      const baseRadius = Math.random() * 3.5 + 1.2;
      return {
        x: width / 2 + Math.cos(angle) * orbitRadius,
        y: height / 2 + Math.sin(angle) * orbitRadius,
        baseRadius,
        radius: baseRadius,
        color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        angle,
        orbitRadius,
        orbitSpeed: (Math.random() - 0.5) * 0.008,
        alpha: Math.random() * 0.8 + 0.2,
        pulseSpeed: Math.random() * 0.05 + 0.02
      };
    });

    let frame = 0;
    const pitchHz = mintRecord.audio_features.dominantPitchHz || 300;
    const energy = Math.max(0.4, mintRecord.audio_features.rms || 0.5);

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Render floating mobile particles
      particles.forEach((p) => {
        // Orbit update around central artwork reticle
        p.angle += p.orbitSpeed * (isPlayingAudio ? 1.5 : 0.5);
        
        // Wobble radius driven by simulated voice pitch oscillation
        const pitchWave = Math.sin(frame * p.pulseSpeed + p.angle) * 2 * energy;
        p.radius = Math.max(0.8, p.baseRadius + pitchWave);

        // Position drift with boundary bounce
        p.x = centerX + Math.cos(p.angle) * p.orbitRadius + (Math.sin(frame * 0.02) * 15);
        p.y = centerY + Math.sin(p.angle) * p.orbitRadius + (Math.cos(frame * 0.02) * 15);

        // Draw particle dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = isPlayingAudio ? 8 : 3;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isPlayingAudio, mintRecord]);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play();
      setIsPlayingAudio(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-lg animate-in fade-in duration-300">
      <div className="relative w-full max-w-[850px] aspect-[3/4] sm:aspect-[16/9] bg-[#0a0a0f] border border-white/20 rounded-2xl overflow-hidden shadow-2xl flex flex-col items-center justify-center text-center">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-40 bg-black/70 hover:bg-black text-white p-2.5 rounded-full border border-white/20 transition-all cursor-pointer shadow-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* WebAR Camera Feed or Video Stream */}
        {hasCameraPermission && (
          <video
            ref={videoRef}
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
        )}

        {/* Live Mobile 3D Particle Canvas Overlay */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full z-10 pointer-events-none"
        />

        {/* WebAR Interface Layer */}
        <div className="absolute inset-0 z-20 pointer-events-none flex flex-col items-center justify-between p-4 sm:p-6 bg-gradient-to-t from-black/85 via-transparent to-black/60">
          
          {/* Top Instruction Banner */}
          <div className="bg-black/80 border border-[#5adace]/50 text-[#5adace] px-5 py-2.5 rounded-full font-label-mono text-xs shadow-xl backdrop-blur-md flex items-center gap-2 mt-2 pointer-events-auto">
            <Sparkles className="w-4 h-4 animate-pulse text-[#5adace]" />
            <span>AR Lens Active: Floating Acoustic Particles Mobile & Syncing with Voice</span>
          </div>

          {/* Target Reticle Frame */}
          <div className="relative w-60 h-60 sm:w-72 sm:h-72 border-2 border-dashed border-[#5adace]/70 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(90,218,206,0.2)]">
            <div className="absolute -top-1 -left-1 w-5 h-5 border-t-4 border-l-4 border-[#5adace] rounded-tl" />
            <div className="absolute -top-1 -right-1 w-5 h-5 border-t-4 border-r-4 border-[#5adace] rounded-tr" />
            <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-4 border-l-4 border-[#5adace] rounded-bl" />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-4 border-r-4 border-[#5adace] rounded-br" />

            {/* Artwork hologram overlay inside reticle */}
            <div className="relative w-44 h-44 rounded-xl overflow-hidden shadow-2xl border border-white/20">
              <img
                src={mintRecord.generated_image_url}
                alt="AR Overlay"
                className="w-full h-full object-cover opacity-90 shadow-[0_0_50px_rgba(90,218,206,0.6)] transition-all"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-2">
                <span className="font-label-mono text-[10px] text-[#5adace] font-bold">
                  {mintRecord.art_title}
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Controls Bar */}
          <div className="w-full max-w-md bg-black/80 border border-white/15 rounded-2xl p-4 flex items-center justify-between pointer-events-auto backdrop-blur-md shadow-2xl">
            <div className="text-left font-metadata text-xs">
              <span className="font-label-mono text-[#5adace] block font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#5adace] animate-ping" />
                Mobile Particles Live
              </span>
              <span className="text-[#c8c5cb] text-[11px]">
                {mintRecord.artist_name} · {mintRecord.audio_features.pitchText}
              </span>
            </div>

            {mintRecord.audio_features.audioUrl && (
              <button
                onClick={toggleAudio}
                className="p-3 bg-[#292932] hover:bg-[#34343d] border border-white/15 rounded-xl text-white transition-colors cursor-pointer flex items-center gap-2 font-label-mono text-xs"
              >
                {isPlayingAudio ? (
                  <>
                    <Volume2 className="w-4 h-4 text-[#5adace]" />
                    <span className="text-[#5adace]">Mute Voice</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-4 h-4 text-[#ffb4ab]" />
                    <span className="text-[#ffb4ab]">Play Voice</span>
                  </>
                )}
              </button>
            )}
          </div>

          {mintRecord.audio_features.audioUrl && (
            <audio
              ref={audioRef}
              src={mintRecord.audio_features.audioUrl}
              autoPlay
              loop
            />
          )}
        </div>
      </div>
    </div>
  );
};

