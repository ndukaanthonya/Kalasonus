import React from 'react';

interface FooterProps {
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenDocs: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPrivacy,
  onOpenTerms,
  onOpenDocs
}) => {
  return (
    <footer className="w-full bg-transparent flex justify-between items-center px-4 sm:px-8 md:px-[64px] py-8 sm:py-12 max-w-[1200px] mx-auto z-10 text-center">
      <div className="font-label-mono text-[12px] text-[#c8c5cb]/70 uppercase tracking-widest">
        © 2024 KalaSonus.art
      </div>
      <nav className="flex gap-4 sm:gap-6">
        <button
          onClick={onOpenPrivacy}
          className="font-label-mono text-[12px] text-[#c8c5cb] hover:text-[#e4e1ed] transition-colors uppercase tracking-widest cursor-pointer"
        >
          Privacy
        </button>
        <button
          onClick={onOpenTerms}
          className="font-label-mono text-[12px] text-[#c8c5cb] hover:text-[#e4e1ed] transition-colors uppercase tracking-widest cursor-pointer"
        >
          Terms
        </button>
        <button
          onClick={onOpenDocs}
          className="font-label-mono text-[12px] text-[#c8c5cb] hover:text-[#e4e1ed] transition-colors uppercase tracking-widest cursor-pointer"
        >
          Docs
        </button>
      </nav>
    </footer>
  );
};
