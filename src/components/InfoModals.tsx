import React, { useState } from 'react';
import { X, BookOpen, ShieldCheck, FileText, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface InfoModalProps {
  type: 'privacy' | 'terms' | 'docs' | null;
  onClose: () => void;
}

interface FAQItem {
  question: string;
  answer: string;
}

const FREQUENCY_FAQS: FAQItem[] = [
  {
    question: "How does my voice frequency impact the final generative artwork?",
    answer: "Your voice is analyzed in real-time across 64 FFT spectral frequency bins. High frequencies (treble, soprano tones, whistles) accelerate particle velocity and trigger vibrant gold/cyan particle flares. Low frequencies (bass, hums) create dense central gravitational vortices with rich violet and emerald tones."
  },
  {
    question: "What role does audio volume and pitch energy play?",
    answer: "Sound energy and amplitude directly expand the particle orbit radius and particle count. A high-energy vocal dynamic generates expansive particle shockwaves, while soft whispering creates delicate, tightly clustered stipple fields."
  },
  {
    question: "Are two voice-generated NFTs ever identical?",
    answer: "Never. Even subtle variations in fundamental pitch, formant resonance, and speech cadence produce unique mathematical seeds for our curl-noise field algorithms, guaranteeing 100% on-chain uniqueness."
  },
  {
    question: "How do selected style presets interact with frequency data?",
    answer: "Style presets like Cosmic Nebula or Neon Stipple establish the foundational color palette and particle physics. Your voice frequencies then act as a live vector input, driving real-time palette shifts, spin directions, and turbulent flow paths."
  }
];

export const InfoModals: React.FC<InfoModalProps> = ({ type, onClose }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  if (!type) return null;

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="glass-panel p-6 sm:p-8 max-w-2xl w-full rounded-2xl relative border border-white/10 shadow-2xl bg-[#16161e]/95 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#5adace]/20 flex items-center justify-center text-[#5adace]">
              {type === 'privacy' && <ShieldCheck className="w-4 h-4" />}
              {type === 'terms' && <FileText className="w-4 h-4" />}
              {type === 'docs' && <BookOpen className="w-4 h-4" />}
            </div>
            <h2 className="font-headline-md text-lg font-semibold text-[#e4e1ed] capitalize">
              KalaSonus.art — {type}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#c8c5cb] hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto py-6 space-y-4 font-body-base text-xs sm:text-sm text-[#c8c5cb]/90 leading-relaxed pr-2">
          {type === 'privacy' && (
            <>
              <p>
                <strong>Privacy Policy:</strong> KalaSonus.art is a fully client-side and decentralized audio generative platform.
              </p>
              <h3 className="text-white font-semibold pt-2 text-sm">1. Audio Data Handling</h3>
              <p>
                Voice audio captured via your browser microphone is processed strictly in-memory using Web Audio API frequency analyzers. Audio recordings are never uploaded or stored on central servers without explicit consent.
              </p>
              <h3 className="text-white font-semibold pt-2 text-sm">2. On-Chain Metadata</h3>
              <p>
                When minting an NFT, only mathematical spectral hashes (pitch, dominant frequency distribution, energy profile) are published to the blockchain smart contract as immutable metadata.
              </p>
            </>
          )}

          {type === 'terms' && (
            <>
              <p>
                <strong>Terms of Service:</strong> By interacting with the KalaSonus.art smart contracts and web application, you agree to the following terms:
              </p>
              <h3 className="text-white font-semibold pt-2 text-sm">1. Digital Ownership</h3>
              <p>
                Minted NFTs confer full ERC-721 ownership of the generated kinetic artwork, including commercial usage and display rights.
              </p>
              <h3 className="text-white font-semibold pt-2 text-sm">2. Smart Contract Operations</h3>
              <p>
                Blockchain transactions are irreversible once confirmed on-chain. Please verify gas fees and target network parameters prior to signing transactions.
              </p>
            </>
          )}

          {type === 'docs' && (
            <>
              <p className="text-[#5adace] font-label-mono text-xs">
                DOCUMENTATION v2.4 • ERC-721 VOICE SPECTRAL SYNTHESIS
              </p>
              <h3 className="text-white font-semibold text-base">How KalaSonus.art Works</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
                <div className="p-3 bg-[#0a0a0f] border border-white/5 rounded-lg">
                  <div className="text-[#5adace] font-bold text-xs font-label-mono mb-1">01. CAPTURE</div>
                  <p className="text-[11px] text-[#c8c5cb]/80">Audio analyzer breaks voice into 64 FFT spectral frequency bins.</p>
                </div>
                <div className="p-3 bg-[#0a0a0f] border border-white/5 rounded-lg">
                  <div className="text-[#d4bbff] font-bold text-xs font-label-mono mb-1">02. MAP</div>
                  <p className="text-[11px] text-[#c8c5cb]/80">Frequencies drive quantum curl-noise particle dynamics.</p>
                </div>
                <div className="p-3 bg-[#0a0a0f] border border-white/5 rounded-lg">
                  <div className="text-[#38bdf8] font-bold text-xs font-label-mono mb-1">03. MINT</div>
                  <p className="text-[11px] text-[#c8c5cb]/80">Immutable token ID & IPFS metadata deployed to chain.</p>
                </div>
              </div>

              <h4 className="text-white font-semibold text-xs font-label-mono pt-2">Smart Contract Specs:</h4>
              <ul className="space-y-1 text-xs font-mono text-[#c8c5cb] pb-2">
                <li>• Contract Standard: ERC-721A (Gas-optimized)</li>
                <li>• License: Apache-2.0 / Open Source</li>
                <li>• Royalty Fee: 2.5% secondary market enforcement</li>
              </ul>

              {/* FAQ Accordion Section */}
              <div className="pt-4 border-t border-white/10 mt-4">
                <div className="flex items-center gap-2 mb-3">
                  <HelpCircle className="w-4 h-4 text-[#5adace]" />
                  <h4 className="text-[#e4e1ed] font-headline-md font-bold text-sm">
                    Frequently Asked Questions — Voice & Acoustic Frequency
                  </h4>
                </div>

                <div className="space-y-2">
                  {FREQUENCY_FAQS.map((faq, index) => {
                    const isOpen = openFaq === index;
                    return (
                      <div
                        key={index}
                        className="border border-white/10 rounded-xl overflow-hidden bg-[#0a0a0f]/80 transition-all"
                      >
                        <button
                          onClick={() => toggleFaq(index)}
                          className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-white/5 transition-colors cursor-pointer"
                        >
                          <span className="font-headline-md text-xs sm:text-sm font-semibold text-white pr-2">
                            {faq.question}
                          </span>
                          <span className="text-[#5adace] shrink-0">
                            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </span>
                        </button>

                        {isOpen && (
                          <div className="px-4 pb-3.5 pt-1 text-xs text-[#c8c5cb]/90 border-t border-white/5 leading-relaxed bg-[#13131b]/50 animate-in fade-in duration-200">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#f7fafc] text-black font-label-mono text-xs rounded font-bold hover:bg-white transition-colors"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
