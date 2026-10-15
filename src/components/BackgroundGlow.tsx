import React from 'react';
import { HOTLINKED_ART_URL } from './GenerativeCanvas';

interface BackgroundGlowProps {
  step: 1 | 2 | 3;
}

export const BackgroundGlow: React.FC<BackgroundGlowProps> = ({ step }) => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none select-none">
      {/* Background Image Pattern with low opacity */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center opacity-5 md:opacity-[0.07] mix-blend-screen transition-opacity duration-700"
        style={{ backgroundImage: `url('${HOTLINKED_ART_URL}')` }}
      />

      {/* Ambient Radial Soft Blurs */}
      <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-[#55338d] opacity-25 blur-[130px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute top-[20%] -right-[20%] w-[60%] h-[80%] bg-[#5adace] opacity-15 blur-[140px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '10s' }} />
      <div className="absolute -bottom-[20%] left-[20%] w-[50%] h-[50%] bg-[#b794f4] opacity-15 blur-[120px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '12s' }} />
    </div>
  );
};
