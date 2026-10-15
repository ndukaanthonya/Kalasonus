import React from 'react';
import { Sparkles, ArrowRight, Disc, ShieldCheck, Cpu } from 'lucide-react';
import { GenerativeCanvas } from './GenerativeCanvas';

interface Step0LandingProps {
  onGetStarted: () => void;
  seed: number;
}

export const Step0Landing: React.FC<Step0LandingProps> = ({
  onGetStarted,
  seed
}) => {
  return (
    <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-[64px] py-12 md:py-20 max-w-[1200px] mx-auto z-10 w-full text-center">
      {/* Decorative Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#55338d]/30 border border-[#b794f4]/40 text-[#d4bbff] font-label-mono text-[11px] uppercase tracking-widest mb-6 shadow-lg animate-in fade-in duration-500">
        <Sparkles className="w-3.5 h-3.5 text-[#5adace] animate-pulse" />
        Generative Acoustic Art Studio
      </div>

      {/* Main Copyright & Headline */}
      <h1 className="font-display-lg text-[36px] sm:text-[54px] md:text-[64px] text-[#e4e1ed] font-semibold leading-[1.1] tracking-tight max-w-[850px] mb-6">
        Convert Your Voice Into Unique Generative Art
      </h1>

      {/* Subtitle Brief Text */}
      <p className="font-body-base text-[16px] sm:text-[18px] md:text-[20px] text-[#c8c5cb]/85 max-w-[660px] leading-relaxed mb-10">
        KalaSonus.art captures the acoustic resonance and pitch dynamics of your voice, mapping sound waves into living, particle-driven digital artwork minted directly to the blockchain.
      </p>

      {/* Hero Canvas Visual Teaser */}
      <div className="relative w-full max-w-[340px] sm:max-w-[400px] aspect-square rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_60px_rgba(90,218,206,0.15)] mb-10 group bg-[#0a0a0f]">
        <GenerativeCanvas
          stylePreset="cosmic-nebula"
          seed={seed}
          audioAnalysis={null}
          width={400}
          height={400}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-4 left-4 right-4 text-left flex justify-between items-center font-label-mono text-[11px] text-[#c8c5cb]">
          <span className="flex items-center gap-1.5 text-[#5adace]">
            <Disc className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '8s' }} />
            Real-Time Acoustic Engine
          </span>
          <span className="text-[#d4bbff]">ERC-721 Ready</span>
        </div>
      </div>

      {/* Center Primary Action Button: "Get Started" */}
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={onGetStarted}
          className="px-10 py-5 bg-[#f7fafc] text-black hover:bg-white font-label-mono text-[14px] font-bold rounded-xl transition-all flex items-center justify-center gap-3 shadow-[0_0_35px_rgba(255,255,255,0.25)] hover:shadow-[0_0_45px_rgba(255,255,255,0.4)] hover:scale-105 cursor-pointer group"
        >
          <span>Get Started</span>
          <ArrowRight className="w-5 h-5 text-black group-hover:translate-x-1.5 transition-transform" />
        </button>

        <p className="font-metadata text-xs text-[#c8c5cb]/60 mt-2">
          No sign-up required • Free to preview & record
        </p>
      </div>
    </main>
  );
};
