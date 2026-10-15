import React, { useState } from 'react';
import { User, Sparkles, Calendar, Heart, ArrowRight, Lock } from 'lucide-react';
import { ArtistIdentity } from '../types';

interface Step1ArtistFormProps {
  artistIdentity: ArtistIdentity;
  onSubmitIdentity: (identity: ArtistIdentity) => void;
  onNextStep: () => void;
}

export const Step1ArtistForm: React.FC<Step1ArtistFormProps> = ({
  artistIdentity,
  onSubmitIdentity,
  onNextStep
}) => {
  const [fullName, setFullName] = useState(artistIdentity.fullName || '');
  const [occasion, setOccasion] = useState(artistIdentity.occasion || '');
  const [date, setDate] = useState(
    artistIdentity.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  );
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Full name is required to personalize your artwork signature.');
      return;
    }
    setError(null);
    onSubmitIdentity({
      fullName: fullName.trim(),
      occasion: occasion.trim() || undefined,
      date: date.trim()
    });
    onNextStep();
  };

  return (
    <main className="w-full max-w-[560px] flex flex-col items-center mt-6 md:mt-10 mb-16 px-4 z-10 relative mx-auto">
      {/* Title Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00504a]/30 border border-[#5adace]/40 text-[#5adace] font-label-mono text-[11px] uppercase tracking-widest mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Step 1 · Artist Identity
        </div>
        <h1 className="font-display-lg text-[32px] md:text-[42px] text-[#e4e1ed] font-semibold leading-tight tracking-tight mb-2">
          Personalize Your Artwork
        </h1>
        <p className="font-body-base text-[14px] sm:text-[15px] text-[#c8c5cb]/80">
          Your name and occasion will be permanently embedded onto the bottom of your voice art canvas image.
        </p>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="w-full bg-[#16161e]/90 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col gap-6 relative overflow-hidden backdrop-blur-md">
        
        {/* Full Name Input */}
        <div className="flex flex-col gap-2 text-left">
          <label className="font-headline-md text-xs font-bold text-[#e4e1ed] uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-[#5adace]" />
            Full Name <span className="text-[#5adace]">*</span>
          </label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. Maya Lin or Alexander Wright"
            className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/15 focus:border-[#5adace] rounded-xl text-white text-sm focus:outline-none transition-colors"
          />
          <p className="text-[11px] text-[#c8c5cb]/60 font-metadata">
            This name will be painted onto the bottom signature of your final piece.
          </p>
        </div>

        {/* Occasion / Title Input */}
        <div className="flex flex-col gap-2 text-left">
          <label className="font-headline-md text-xs font-bold text-[#e4e1ed] uppercase tracking-wider flex items-center gap-2">
            <Heart className="w-4 h-4 text-[#b794f4]" />
            Occasion or Title <span className="text-[#c8c5cb]/50 font-normal lowercase">(optional)</span>
          </label>
          <input
            type="text"
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
            placeholder='e.g. "Wedding Vows", "My Birthday", "Morning Sound"'
            className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/15 focus:border-[#b794f4] rounded-xl text-white text-sm focus:outline-none transition-colors"
          />
        </div>

        {/* Date Display (Static & Non-Editable) */}
        <div className="flex flex-col gap-2 text-left">
          <div className="flex justify-between items-center">
            <label className="font-headline-md text-xs font-bold text-[#e4e1ed] uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#5adace]" />
              Recording Date
            </label>
            <span className="font-label-mono text-[10px] text-[#5adace] bg-[#00504a]/30 px-2.5 py-0.5 rounded-full border border-[#5adace]/30 flex items-center gap-1">
              <Lock className="w-3 h-3 text-[#5adace]" /> Auto-Stamped
            </span>
          </div>
          <div className="w-full px-4 py-3 bg-[#0a0a0f]/80 border border-white/10 rounded-xl text-[#e4e1ed] text-sm font-label-mono flex items-center justify-between select-none">
            <span>{date}</span>
            <span className="text-xs text-[#c8c5cb]/50 font-metadata italic">Today's Timestamp</span>
          </div>
          <p className="text-[11px] text-[#c8c5cb]/60 font-metadata">
            The recording date is automatically fixed to today's date for cryptographic authenticity.
          </p>
        </div>

        {/* Validation Error Banner */}
        {error && (
          <div className="p-3 rounded-lg bg-[#93000a]/30 border border-[#ffb4ab]/40 text-[#ffb4ab] text-xs text-center font-metadata">
            {error}
          </div>
        )}

        {/* Preview Signature Text */}
        <div className="p-4 rounded-xl bg-[#0a0a0f]/80 border border-white/5 text-left">
          <span className="font-label-mono text-[10px] text-[#5adace] uppercase tracking-widest block mb-1">
            Canvas Embed Signature Preview:
          </span>
          <span className="font-serif italic text-xs text-[#e4e1ed] leading-relaxed block">
            "This art was made by the voice of {fullName.trim() || '[Your Name]'}
            {occasion.trim() ? ` · ${occasion.trim()}` : ''} · {date}"
          </span>
        </div>

        {/* Submit Action */}
        <button
          type="submit"
          className="w-full py-4 bg-[#f7fafc] text-black hover:bg-white transition-all font-label-mono text-[13px] rounded-xl font-bold flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.25)] hover:scale-[1.02] cursor-pointer mt-2"
        >
          <span>Continue to Select Generative Art</span>
          <ArrowRight className="w-4 h-4 text-black" />
        </button>
      </form>
    </main>
  );
};
