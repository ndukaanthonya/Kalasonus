import React from 'react';
import { ArtStyle, AudioAnalysis } from '../types';
import { GenerativeCanvas } from './GenerativeCanvas';
import { X, Download, Play, Shield, ExternalLink, Sparkles } from 'lucide-react';

interface FullResModalProps {
  isOpen: boolean;
  onClose: () => void;
  stylePreset: ArtStyle;
  seed: number;
  audioAnalysis: AudioAnalysis | null;
}

export const FullResModal: React.FC<FullResModalProps> = ({
  isOpen,
  onClose,
  stylePreset,
  seed,
  audioAnalysis
}) => {
  if (!isOpen) return null;

  const downloadArt = () => {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    if (canvas) {
      const link = document.createElement('a');
      link.download = `KalaSonus-Art-${seed}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100] flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-300">
      <div className="relative max-w-4xl w-full bg-[#13131b] border border-white/10 rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-black/60 text-[#c8c5cb] hover:text-white p-2 rounded-full border border-white/10 backdrop-blur-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Artwork Canvas Left */}
        <div className="w-full md:w-3/5 aspect-square bg-[#0a0a0f] relative overflow-hidden flex items-center justify-center">
          <GenerativeCanvas
            stylePreset={stylePreset}
            seed={seed}
            audioAnalysis={audioAnalysis}
            width={800}
            height={800}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info Right Panel */}
        <div className="w-full md:w-2/5 p-6 sm:p-8 flex flex-col justify-between bg-[#1b1b23]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#55338d]/40 border border-[#b794f4]/30 text-[#d4bbff] font-label-mono text-[11px] mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              High-Res Render Engine
            </div>

            <h3 className="font-headline-md text-xl font-bold text-[#e4e1ed] mb-2">
              KalaSonus.art Generative Canvas
            </h3>

            <p className="font-metadata text-xs text-[#c8c5cb]/80 mb-6">
              Created from real voice audio frequency modulations, mapped to quantum swirl curl noise particle physics.
            </p>

            <div className="space-y-3 font-label-mono text-xs border-t border-b border-white/10 py-4 mb-6">
              <div className="flex justify-between">
                <span className="text-[#c8c5cb]/60">Style Algorithm:</span>
                <span className="text-[#5adace] font-semibold">{stylePreset}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#c8c5cb]/60">Voice Description:</span>
                <span className="text-white truncate max-w-[160px]">{audioAnalysis?.voiceDescription || 'Kinetic Swirls'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#c8c5cb]/60">Dominant Pitch:</span>
                <span className="text-[#d4bbff]">{audioAnalysis?.pitch || '277 Hz (C#4)'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#c8c5cb]/60">Random Seed:</span>
                <span className="text-white font-mono">#{seed}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={downloadArt}
              className="w-full py-3.5 bg-[#f7fafc] text-black font-label-mono text-xs font-bold rounded-lg hover:bg-white transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <Download className="w-4 h-4" />
              Save High-Res PNG (800x800)
            </button>

            <button
              onClick={onClose}
              className="w-full py-3 bg-transparent border border-white/10 text-[#c8c5cb] font-label-mono text-xs rounded-lg hover:text-white hover:border-white transition-colors"
            >
              Close Viewer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
