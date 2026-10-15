import React, { useState } from 'react';
import { ArtStyle, AudioAnalysis, ArtMetadata } from '../types';
import { GenerativeCanvas, HOTLINKED_ART_URL } from './GenerativeCanvas';
import { RefreshCw, Sparkles, Maximize2, ShieldCheck, Zap, Layers } from 'lucide-react';

interface Step3MintArtProps {
  audioAnalysis: AudioAnalysis | null;
  selectedStyle: ArtStyle;
  onStyleChange: (style: ArtStyle) => void;
  seed: number;
  onMintClick: () => void;
  onOpenFullRes: () => void;
  isMinting: boolean;
}

const QR_CODE_URL = "https://lh3.googleusercontent.com/aida-public/AB6AXuAZ-poFDP5JWfMnMlqgZ-w2_YapN8_16epjY8sVPeCy6KZmxJdBBRKiO9O8iVUaj87xyT_yA7sLSMbw58CHgfnu5d6VxucR3J5X6XAk0G5Qpnn1i_ZeLeui_WFW6p_53iQ2kX7Wzz0w2Qchh8cDZINzoJ2MySk1eAhiH4tjrylNAtJhAeZ6Q0eKeJt51vCnHme0wRTtbyaVhNrbrJ8bNZpj0v-TxRhxkPlSjONKi4JNgGFr2hq0x-74AQ";

const STYLES: { id: ArtStyle; name: string }[] = [
  { id: 'neon-stipple', name: 'Neon Stipple' },
  { id: 'kinetic-swirls', name: 'Kinetic Swirls' },
  { id: 'cosmic-nebula', name: 'Cosmic Nebula' },
  { id: 'cyber-flow', name: 'Cyber Flow' },
  { id: 'liquid-chroma', name: 'Liquid Chroma' },
];

export const Step3MintArt: React.FC<Step3MintArtProps> = ({
  audioAnalysis,
  selectedStyle,
  onStyleChange,
  seed,
  onMintClick,
  onOpenFullRes,
  isMinting
}) => {
  const styleName = selectedStyle === 'cosmic-nebula' ? 'Cosmic Nebula' : 'Neon Stipple';
  const voiceDesc = audioAnalysis?.voiceDescription || 'Kinetic Swirls';
  const dateStr = '2024-05-20 14:32Z';

  return (
    <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-[64px] py-8 md:py-16 w-full max-w-[1200px] mx-auto z-10">
      {/* Minting Flow Container */}
      <div className="w-full max-w-[600px] flex flex-col gap-6">
        
        {/* Art Preview Card */}
        <div className="w-full glass-panel rounded-xl overflow-hidden relative group art-glow border border-white/10 bg-[#16161e]/40 shadow-2xl">
          {/* Main Artwork Container */}
          <div className="aspect-square md:aspect-[4/5] w-full relative bg-[#0a0a0f] overflow-hidden">
            <GenerativeCanvas
              stylePreset={selectedStyle}
              seed={seed}
              audioAnalysis={audioAnalysis}
              width={600}
              height={750}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* QR Code Overlay (High Contrast & Sharp Scan) */}
            <div className="absolute bottom-4 left-4 bg-white p-1.5 rounded-lg shadow-2xl border border-black/20 flex flex-col items-center gap-0.5 z-10 pointer-events-auto">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://sonus.art/verify-voice"
                alt="Voice Verification QR"
                className="w-12 h-12 object-contain"
              />
              <span className="font-mono text-[8px] text-black font-extrabold uppercase tracking-tight">VERIFIED AUDIO</span>
            </div>

            {/* Glassmorphic Hover Action */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={onOpenFullRes}
                className="bg-[#292932]/80 text-[#e4e1ed] border border-white/20 px-6 py-3 rounded-full font-label-mono text-[12px] flex items-center gap-2 hover:bg-[#34343d] transition-colors shadow-xl cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">fullscreen</span>
                View Full Res
              </button>
            </div>
          </div>

          {/* Metadata Strip (Matching Exact Design in Screenshot) */}
          <div className="w-full px-6 py-4 border-t border-white/10 flex justify-between items-center bg-[#13131b]/90 backdrop-blur-md">
            <div className="font-label-mono text-[11px] sm:text-[12px] text-[#c8c5cb] flex items-center gap-3 overflow-x-auto whitespace-nowrap scrollbar-hide">
              <span>Voice Description: {voiceDesc}</span>
              <span className="text-[#47464b]">|</span>
              <span>Style: {styleName}</span>
            </div>
            <div className="font-label-mono text-[11px] text-[#c8c5cb]/60 ml-4 shrink-0 font-mono">
              {dateStr}
            </div>
          </div>
        </div>

        {/* Mint Action Button (Regenerate Removed) */}
        <div className="flex flex-col items-center justify-center gap-4 w-full pt-2">
          <button
            onClick={onMintClick}
            disabled={isMinting}
            className="w-full max-w-[360px] py-4 bg-[#f7fafc] text-black hover:bg-white transition-all font-label-mono text-[13px] rounded font-bold flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.2)] disabled:opacity-50 cursor-pointer"
          >
            {isMinting ? 'Minting on-chain...' : 'Mint as NFT'}
            <span className="material-symbols-outlined text-lg">
              generating_tokens
            </span>
          </button>
        </div>

      </div>
    </main>
  );
};
