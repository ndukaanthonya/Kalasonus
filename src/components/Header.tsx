import React from 'react';
import { Step, WalletState } from '../types';
import { Wallet, Image as ImageIcon, CheckCircle2, ChevronRight, Menu, X, HelpCircle } from 'lucide-react';

interface HeaderProps {
  currentStep: Step;
  onStepChange: (step: Step) => void;
  wallet: WalletState;
  onOpenWalletModal: () => void;
  onOpenGallery: () => void;
  onOpenHowItWorks: () => void;
  mintedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  onStepChange,
  wallet,
  onOpenWalletModal,
  onOpenGallery,
  onOpenHowItWorks,
  mintedCount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="w-full bg-transparent flex justify-between items-center px-4 sm:px-8 md:px-[64px] py-6 sm:py-8 max-w-[1200px] mx-auto z-50 relative">
      {/* Brand Logo */}
      <div 
        onClick={() => onStepChange(0)}
        className="font-headline-md text-[22px] sm:text-[24px] font-semibold text-[#e4e1ed] tracking-tight cursor-pointer hover:opacity-90 transition-opacity flex items-center gap-2"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-[#5adace] animate-pulse"></span>
        KalaSonus.art
      </div>

      {/* Steps Navigation - Desktop (Only shown when step > 0) */}
      {currentStep > 0 && (
        <nav className="hidden md:flex gap-3 lg:gap-4 items-center">
          <button
            onClick={() => onStepChange(1)}
            className={`font-label-mono text-[11px] uppercase tracking-widest transition-all duration-200 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 cursor-pointer ${
              currentStep === 1
                ? 'bg-[#00504a]/40 text-[#5adace] border-2 border-[#5adace] shadow-[0_0_18px_rgba(90,218,206,0.5)] font-bold'
                : 'text-[#c8c5cb] border border-white/10 bg-[#1b1b23]/50 hover:text-[#e4e1ed] hover:border-white/20'
            }`}
          >
            Artist Info
          </button>

          <span className="text-[#47464b] font-label-mono text-[11px]">→</span>

          <button
            onClick={() => onStepChange(2)}
            className={`font-label-mono text-[11px] uppercase tracking-widest transition-all duration-200 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 cursor-pointer ${
              currentStep === 2
                ? 'bg-[#00504a]/40 text-[#5adace] border-2 border-[#5adace] shadow-[0_0_18px_rgba(90,218,206,0.5)] font-bold'
                : 'text-[#c8c5cb] border border-white/10 bg-[#1b1b23]/50 hover:text-[#e4e1ed] hover:border-white/20'
            }`}
          >
            Style & Wallet
          </button>

          <span className="text-[#47464b] font-label-mono text-[11px]">→</span>

          <button
            onClick={() => onStepChange(3)}
            className={`font-label-mono text-[11px] uppercase tracking-widest transition-all duration-200 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 cursor-pointer ${
              currentStep === 3
                ? 'bg-[#00504a]/40 text-[#5adace] border-2 border-[#5adace] shadow-[0_0_18px_rgba(90,218,206,0.5)] font-bold'
                : 'text-[#c8c5cb] border border-white/10 bg-[#1b1b23]/50 hover:text-[#e4e1ed] hover:border-white/20'
            }`}
          >
            Voice Record
          </button>

          <span className="text-[#47464b] font-label-mono text-[11px]">→</span>

          <button
            onClick={() => onStepChange(4)}
            className={`font-label-mono text-[11px] uppercase tracking-widest transition-all duration-200 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 cursor-pointer ${
              currentStep === 4
                ? 'bg-[#00504a]/40 text-[#5adace] border-2 border-[#5adace] shadow-[0_0_18px_rgba(90,218,206,0.5)] font-bold'
                : 'text-[#c8c5cb] border border-white/10 bg-[#1b1b23]/50 hover:text-[#e4e1ed] hover:border-white/20'
            }`}
          >
            Payment
          </button>

          <span className="text-[#47464b] font-label-mono text-[11px]">→</span>

          <button
            onClick={() => onStepChange(5)}
            className={`font-label-mono text-[11px] uppercase tracking-widest transition-all duration-200 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 cursor-pointer ${
              currentStep === 5
                ? 'bg-[#00504a]/40 text-[#5adace] border-2 border-[#5adace] shadow-[0_0_18px_rgba(90,218,206,0.5)] font-bold'
                : 'text-[#c8c5cb] border border-white/10 bg-[#1b1b23]/50 hover:text-[#e4e1ed] hover:border-white/20'
            }`}
          >
            Mint Art
          </button>
        </nav>
      )}

      {/* Right Controls: Wallet & Gallery */}
      <div className="flex items-center gap-3">
        {wallet.connected ? (
          <button
            onClick={onOpenWalletModal}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-[#1b1b23]/80 hover:bg-[#292932] transition-colors font-label-mono text-[11px] text-[#e4e1ed]"
            title="Manage Wallet"
          >
            <span className="w-2 h-2 rounded-full bg-[#5adace]"></span>
            <span>{wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}</span>
            <span className="text-[#929095] hidden sm:inline">({wallet.network.symbol})</span>
          </button>
        ) : (
          <button
            onClick={onOpenWalletModal}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-white/10 bg-[#1b1b23] hover:bg-[#292932] font-label-mono text-[11px] text-[#e4e1ed] transition-colors"
          >
            <Wallet className="w-3.5 h-3.5 text-[#5adace]" />
            Connect
          </button>
        )}

        {/* How it Works Button */}
        <button
          onClick={onOpenHowItWorks}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-white/10 bg-[#1f1f27] hover:bg-[#292932] font-label-mono text-[11px] text-[#e4e1ed] transition-colors cursor-pointer"
          title="How it Works"
        >
          <HelpCircle className="w-3.5 h-3.5 text-[#5adace]" />
          <span className="hidden sm:inline">How it Works</span>
        </button>

        {/* Gallery Drawer Button */}
        <button
          onClick={onOpenGallery}
          className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-white/10 bg-[#1f1f27] hover:bg-[#292932] font-label-mono text-[11px] text-[#e4e1ed] transition-colors"
          title="View Gallery"
        >
          <ImageIcon className="w-3.5 h-3.5 text-[#d4bbff]" />
          <span className="hidden sm:inline">Vault</span>
          {mintedCount > 0 && (
            <span className="ml-0.5 bg-[#55338d] text-[#d4bbff] px-1.5 py-0.2 rounded-full text-[10px] font-bold">
              {mintedCount}
            </span>
          )}
        </button>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-1.5 text-[#e4e1ed] hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Nav Dropdown */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-4 right-4 bg-[#1b1b23]/95 backdrop-blur-xl border border-white/10 rounded-xl p-4 flex flex-col gap-3 md:hidden z-50 mt-2 shadow-2xl">
          <button
            onClick={() => { onStepChange(1); setMobileMenuOpen(false); }}
            className={`text-left font-label-mono text-[13px] p-2 rounded-lg flex items-center justify-between ${currentStep === 1 ? 'bg-[#292932] text-[#5adace]' : 'text-[#c8c5cb]'}`}
          >
            <span>Step 1: Wallet Connection</span>
            {currentStep === 1 && <ChevronRight className="w-4 h-4" />}
          </button>
          <button
            onClick={() => { 
              if (wallet.connected) onStepChange(2); 
              else onOpenWalletModal(); 
              setMobileMenuOpen(false); 
            }}
            className={`text-left font-label-mono text-[13px] p-2 rounded-lg flex items-center justify-between ${currentStep === 2 ? 'bg-[#292932] text-[#5adace]' : 'text-[#c8c5cb]'}`}
          >
            <span>Step 2: Voice Audio Capture</span>
            {currentStep === 2 && <ChevronRight className="w-4 h-4" />}
          </button>
          <button
            onClick={() => { 
              if (wallet.connected) onStepChange(3); 
              else onOpenWalletModal(); 
              setMobileMenuOpen(false); 
            }}
            className={`text-left font-label-mono text-[13px] p-2 rounded-lg flex items-center justify-between ${currentStep === 3 ? 'bg-[#292932] text-[#5adace]' : 'text-[#c8c5cb]'}`}
          >
            <span>Step 3: Mint Generative NFT</span>
            {currentStep === 3 && <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      )}
    </header>
  );
};
