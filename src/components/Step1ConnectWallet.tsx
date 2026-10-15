import React, { useState } from 'react';
import { WalletState, ArtStyle } from '../types';
import { Wallet, ArrowRight, Shield, Sparkles, Check, Eye } from 'lucide-react';
import { GenerativeCanvas } from './GenerativeCanvas';

interface Step1ConnectWalletProps {
  wallet: WalletState;
  onOpenWalletModal: () => void;
  onNextStep: () => void;
  selectedStyle: ArtStyle;
  onStyleChange: (style: ArtStyle) => void;
  seed: number;
}

const STYLES: { id: ArtStyle; name: string; description: string; color: string }[] = [
  { id: 'cosmic-nebula', name: 'Cosmic Nebula', description: 'Deep space particle dust with glowing stardust & celestial waves', color: '#38bdf8' },
  { id: 'neon-stipple', name: 'Neon Stipple', description: 'Quantum stipple points with neon particle velocity & vibrant hues', color: '#5adace' },
];

export const Step1ConnectWallet: React.FC<Step1ConnectWalletProps> = ({
  wallet,
  onOpenWalletModal,
  onNextStep,
  selectedStyle,
  onStyleChange,
  seed
}) => {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(true);

  const handleStyleSelect = (styleId: ArtStyle) => {
    onStyleChange(styleId);
    setPreviewVisible(true);
  };

  const handleConfirmAndProceed = () => {
    if (!wallet.connected) {
      onOpenWalletModal();
      return;
    }

    // Trigger slow fade out animation before proceeding to step 2 (toggle voice or mic)
    setIsFadingOut(true);
    setTimeout(() => {
      onNextStep();
    }, 700);
  };

  const activeStyleObj = STYLES.find(s => s.id === selectedStyle) || STYLES[0];

  return (
    <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-[64px] py-[40px] md:py-[60px] max-w-[1200px] mx-auto z-10 w-full">
      {/* Intro Header */}
      <div className="text-center max-w-[680px] mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#55338d]/30 border border-[#b794f4]/30 text-[#d4bbff] font-label-mono text-[11px] uppercase tracking-wider mb-4 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#5adace]" />
          Step 1 • Choose Art Style & Connect
        </div>
        <h1 className="font-display-lg text-[32px] md:text-[48px] text-[#e4e1ed] font-semibold leading-tight tracking-tight mb-3">
          Select Your Generative Art Style
        </h1>
        <p className="font-body-base text-[14px] sm:text-[16px] text-[#c8c5cb]/80">
          Pick your preferred visual algorithm. Your voice will modulate particles uniquely in Step 2.
        </p>
      </div>

      {/* Main Grid: Style Selection Left, Live Preview Right */}
      <div 
        className={`w-full max-w-[1000px] grid grid-cols-1 md:grid-cols-12 gap-8 items-start transition-all duration-700 ease-out ${
          isFadingOut ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
        }`}
      >
        {/* Left Column: Style Selection Cards (7 cols) */}
        <div className="md:col-span-7 flex flex-col gap-3">
          <div className="flex justify-between items-center mb-1">
            <span className="font-label-mono text-[11px] text-[#c8c5cb]/70 uppercase tracking-widest font-semibold">
              Available Visual Algorithms
            </span>
            <span className="font-label-mono text-[11px] text-[#5adace]">
              2 Presets Ready
            </span>
          </div>

          {STYLES.map((st) => {
            const isSelected = selectedStyle === st.id;
            return (
              <button
                key={st.id}
                onClick={() => handleStyleSelect(st.id)}
                className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between group ${
                  isSelected
                    ? 'bg-[#1e1a2b] border-[#b794f4] shadow-[0_0_20px_rgba(183,148,244,0.2)]'
                    : 'bg-[#16161e]/80 border-white/10 hover:bg-[#1b1b23] hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  {/* Style Indicator Tag */}
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border border-white/10"
                    style={{ backgroundColor: `${st.color}15`, color: st.color }}
                  >
                    <Sparkles className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="font-headline-md text-sm font-semibold text-[#e4e1ed] group-hover:text-white flex items-center gap-2">
                      {st.name}
                      {isSelected && (
                        <span className="text-[10px] font-label-mono bg-[#5adace]/20 text-[#5adace] px-2 py-0.5 rounded font-bold">
                          Selected
                        </span>
                      )}
                    </div>
                    <div className="font-metadata text-xs text-[#c8c5cb]/70 mt-0.5">
                      {st.description}
                    </div>
                  </div>
                </div>

                <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                  isSelected ? 'border-[#5adace] bg-[#5adace] text-black' : 'border-white/20 text-transparent'
                }`}>
                  <Check className="w-3.5 h-3.5 font-bold" />
                </div>
              </button>
            );
          })}

          {/* Wallet Connection Status / Button */}
          <div className="mt-4 p-5 rounded-xl border border-white/10 bg-[#16161e] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#5adace]/10 border border-[#5adace]/30 flex items-center justify-center text-[#5adace]">
                <Wallet className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-headline-md text-xs font-semibold text-white">
                  {wallet.connected ? 'Wallet Connected' : 'Wallet Not Connected'}
                </div>
                <div className="font-metadata text-[11px] text-[#c8c5cb]/70">
                  {wallet.connected 
                    ? `${wallet.address?.slice(0, 6)}...${wallet.address?.slice(-4)} (${wallet.network.name})`
                    : 'Connect wallet to mint NFT on-chain'}
                </div>
              </div>
            </div>

            <button
              onClick={onOpenWalletModal}
              className="px-4 py-2 bg-[#292932] hover:bg-[#34343d] text-white border border-white/15 rounded-lg font-label-mono text-xs whitespace-nowrap transition-colors cursor-pointer"
            >
              {wallet.connected ? 'Manage' : 'Connect'}
            </button>
          </div>
        </div>

        {/* Right Column: Dynamic Live Preview Canvas (5 cols) */}
        <div className="md:col-span-5 flex flex-col items-center">
          <div className="w-full glass-panel rounded-xl border border-white/10 bg-[#16161e]/90 p-5 flex flex-col items-center shadow-2xl relative overflow-hidden">
            
            {/* Header Badge */}
            <div className="w-full flex justify-between items-center mb-3">
              <span className="font-label-mono text-[11px] text-[#5adace] uppercase tracking-wider font-semibold flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 animate-pulse" />
                Live Style Preview
              </span>
              <span className="font-label-mono text-[10px] text-[#c8c5cb]/60 bg-white/5 px-2 py-0.5 rounded">
                {activeStyleObj.name}
              </span>
            </div>

            {/* Generative Canvas Showcase */}
            <div className="w-full aspect-square bg-[#0a0a0f] rounded-lg overflow-hidden border border-white/5 relative group shadow-inner">
              <GenerativeCanvas
                stylePreset={selectedStyle}
                seed={seed}
                audioAnalysis={null}
                width={400}
                height={400}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-3 left-3 right-3 text-left">
                <div className="font-label-mono text-xs text-white font-semibold flex items-center justify-between">
                  <span>{activeStyleObj.name}</span>
                  <span className="text-[10px] text-[#d4bbff]">Particle Flow</span>
                </div>
                <div className="font-metadata text-[11px] text-[#c8c5cb]/70 truncate mt-0.5">
                  {activeStyleObj.description}
                </div>
              </div>
            </div>

            {/* Confirmation & Proceed Action */}
            <button
              onClick={handleConfirmAndProceed}
              className="w-full mt-5 py-4 bg-[#f7fafc] text-black hover:bg-white font-label-mono text-[13px] font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(255,255,255,0.2)] cursor-pointer group"
            >
              <span>{wallet.connected ? 'Proceed to Voice Capture' : 'Connect Wallet & Proceed'}</span>
              <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
            </button>

            <p className="font-metadata text-[11px] text-[#c8c5cb]/60 mt-3 text-center">
              Next: Speak or hum into your microphone to generate custom art
            </p>
          </div>
        </div>
      </div>

      {/* Toast status during slow fade transition */}
      {isFadingOut && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-[#1b1b23] border border-[#5adace] text-[#5adace] px-6 py-3 rounded-full font-label-mono text-xs flex items-center gap-2 shadow-2xl animate-pulse z-50">
          <Sparkles className="w-4 h-4 text-[#5adace]" />
          Finalizing {activeStyleObj.name} style... Transitioning to Voice Capture...
        </div>
      )}
    </main>
  );
};
