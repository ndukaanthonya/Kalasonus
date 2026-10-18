import React from 'react';
import { Wallet, Mic, QrCode, Home, ArrowRight, Sparkles } from 'lucide-react';

interface HowItWorksPageProps {
  onGetStarted: () => void;
  onBackToHome: () => void;
}

const STEPS = [
  {
    icon: Wallet,
    number: '01',
    title: 'Connect Your Wallet',
    description:
      'Link your digital wallet to the KalaSonus studio. Your wallet is where your finished artwork is minted as a one-of-a-kind NFT, and it keeps a permanent record of your ownership on the Celo blockchain.'
  },
  {
    icon: Mic,
    number: '02',
    title: 'Record Your Voice',
    description:
      'Speak, sing, hum, or record a message for a loved one. The studio analyzes the pitch, energy, and texture of your recording and turns those acoustic fingerprints into the raw material for your artwork.'
  },
  {
    icon: QrCode,
    number: '03',
    title: 'Art is Generated with a QR Code',
    description:
      'The AI paints a unique abstract masterpiece from your voice data. A scannable QR code is baked directly onto the artwork — anyone who scans it is taken to a page where they can listen to the exact voice that made the piece.'
  },
  {
    icon: Home,
    number: '04',
    title: 'Print, Display & Share',
    description:
      'Order a museum-quality physical print of your artwork. Hang it in your home, or place it in a walk-in store for visitors to see. Anyone can scan the QR code on the print and instantly hear the voice that made the art.'
  }
];

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({
  onGetStarted,
  onBackToHome
}) => {
  return (
    <main className="flex-grow flex flex-col items-center px-4 md:px-[64px] ty-12 md:py-16 max-w-[1100px] mx-auto z-10 w-full text-center">
      {/* Decorative Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00504a]/30 border border-[#5adace]/40 text-[#5adace] font-label-mono text-[11px] uppercase tracking-widest mb-6 shadow-lg animate-in fade-in duration-500">
        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
        How It Works
      </div>

      <h1 className="font-display-lg text-[34px] sm:text-[48px] md:text-[56px] text-[#e4e1ed] font-semibold leading-[1.1] tracking-tight max-w-[800px] mb-4">
        From Voice to Wall Art in Four Steps
      </h1>

      <p className="font-body-base text-[16px] sm:text-[18px] text-[#c8c5cb]/85 max-w-[640px] leading-relaxed mb-12">
        Turn a few seconds of your voice into a museum-quality print with a built-in surprise: anyone can scan it and hear you speak.
      </p>

      {/* 4-Step Cards Grid */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5 mb-12 text-left">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={step.number}
              className="relative bg-[#16161e]/90 border border-white/10 rounded-2xl p-6 sm:p-7 flex gap-5 items-start hover:border-[#5adace]/40 transition-colors duration-300 group"
            >
              {/* Number watermark */}
              <span className="absolute top-4 right-5 font-label-mono text-[42px] font-bold text-white/5 leading-none select-none pointer-events-none">
                {step.number}
              </span>

              {/* Icon Badge */}
              <div className="w-12 h-12 rounded-xl bg-[#00504a]/30 border border-[#5adace]/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Icon className="w-6 h-6 text-[#5adace]" />
              </div>

              {/* Text Content */}
              <div className="flex-1">
                <h3 className="font-headline-md text-lg font-semibold text-white mb-2 flex items-center gap-2">
                  <span className="text-[#5adace] font-label-mono text-xs">STEP {idx + 1}</span>
                </h3>
                <p className="font-label-mono text-[13px] font-bold text-[#e4e1ed] mb-2">
                  {step.title}
                </p>
                <p className="font-body-base text-[13px] text-[#c8c5cb]/80 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA Section */}
      <div className="flex flex-col items-center gap-3 mb-4">
        <button
          onClick={onGetStarted}
          className="px-10 py-5 bg-[#f7fafc] text-black hover:bg-white font-label-mono text-[14px] font-bold rounded-xl transition-all flex items-center justify-center gap-3 shadow-[0_0_35px_rgba(255,255,255,0.25)] hover:shadow-[0_0_45px_rgba(255,255,255,0.4)] hover:scale-105 cursor-pointer group"
        >
          <span>Start Creating Now</span>
          <ArrowRight className="w-5 h-5 text-black group-hover:translate-x-1.5 transition-transform" />
        </button>
        <button
          onClick={onBackToHome}
          className="font-label-mono text-xs text-[#c8c5cb]/70 hover:text-white transition-colors cursor-pointer"
        >
          Back to Home
        </button>
      </div>
    </main>
  );
};
