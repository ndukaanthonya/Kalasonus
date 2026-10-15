import React from 'react';
import { MintedNFT } from '../types';
import { X, ExternalLink, Play, Sparkles, Image as ImageIcon, Copy, Check } from 'lucide-react';

interface GalleryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  mintedNFTs: MintedNFT[];
  onSelectNFT: (nft: MintedNFT) => void;
}

export const GalleryDrawer: React.FC<GalleryDrawerProps> = ({
  isOpen,
  onClose,
  mintedNFTs,
  onSelectNFT
}) => {
  const [copiedTx, setCopiedTx] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const copyTx = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedTx(hash);
    setTimeout(() => setCopiedTx(null), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex justify-end animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-[#13131b] border-l border-white/10 h-full p-6 sm:p-8 flex flex-col justify-between overflow-hidden shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div>
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#55338d]/40 border border-[#b794f4]/30 flex items-center justify-center text-[#d4bbff]">
                <ImageIcon className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-headline-md text-lg font-semibold text-[#e4e1ed]">
                  KalaSonus.art Vault
                </h2>
                <p className="font-metadata text-xs text-[#c8c5cb]/70">
                  {mintedNFTs.length} Minted Voice NFT{mintedNFTs.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-[#c8c5cb] hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* NFT List */}
          {mintedNFTs.length === 0 ? (
            <div className="py-16 text-center text-xs font-label-mono text-[#c8c5cb]/60 flex flex-col items-center gap-3">
              <Sparkles className="w-8 h-8 text-[#5adace] opacity-40 animate-pulse" />
              <p>No NFTs minted in this session yet.</p>
              <p className="text-[11px] text-[#c8c5cb]/40">Complete Step 2 & 3 to mint your first voice artwork!</p>
            </div>
          ) : (
            <div className="overflow-y-auto max-h-[calc(100vh-200px)] space-y-4 pr-1 scrollbar-hide">
              {mintedNFTs.map((nft) => (
                <div
                  key={nft.tokenId}
                  className="bg-[#1b1b23] border border-white/10 hover:border-[#5adace]/50 rounded-xl p-3.5 flex gap-3.5 group transition-all"
                >
                  <img
                    src={nft.imageUrl}
                    alt={nft.name}
                    className="w-20 h-20 rounded-lg object-cover bg-[#0a0a0f] border border-white/5 group-hover:scale-105 transition-transform shrink-0"
                  />

                  <div className="flex-1 flex flex-col justify-between overflow-hidden">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-headline-md text-sm font-semibold text-white truncate">
                          {nft.name}
                        </h4>
                        <span className="font-label-mono text-[10px] text-[#5adace] font-bold">
                          #{nft.tokenId}
                        </span>
                      </div>
                      <p className="font-metadata text-xs text-[#c8c5cb]/80 truncate mt-0.5">
                        {nft.voiceDescription}
                      </p>
                    </div>

                    <div className="flex justify-between items-center text-[10px] font-label-mono pt-2 border-t border-white/5 text-[#c8c5cb]/60">
                      <span>{nft.styleName}</span>
                      <button
                        onClick={() => copyTx(nft.txHash)}
                        className="text-[#d4bbff] hover:text-white flex items-center gap-1"
                      >
                        {copiedTx === nft.txHash ? (
                          <Check className="w-3 h-3 text-[#5adace]" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>{nft.txHash.slice(0, 6)}...</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10">
          <button
            onClick={onClose}
            className="w-full py-3 bg-transparent border border-white/10 text-[#c8c5cb] font-label-mono text-xs rounded-lg hover:text-white hover:border-white transition-colors"
          >
            Close Vault
          </button>
        </div>
      </div>
    </div>
  );
};
