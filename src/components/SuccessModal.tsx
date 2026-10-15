import React, { useState } from 'react';
import { MintedNFT } from '../types';
import { Check, X, Share2, Copy, Twitter, ExternalLink, Link as LinkIcon, Sparkles } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  nft: MintedNFT | null;
  onViewNFT: (nft: MintedNFT) => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  nft,
  onViewNFT
}) => {
  const [copiedTx, setCopiedTx] = useState(false);
  const [copiedShareLink, setCopiedShareLink] = useState(false);
  const [sharedLens, setSharedLens] = useState(false);
  const [showShareDetails, setShowShareDetails] = useState(false);

  if (!isOpen || !nft) return null;

  const shareableUrl = `https://kalasonus.art/nft/#${nft.tokenId}`;
  const tweetText = encodeURIComponent(
    `I just minted my voice as a generative kinetic NFT on @KalaSonusArt! 🎨🔊 Token #${nft.tokenId} (${nft.voiceDescription})\n\nView my art: ${shareableUrl}`
  );

  const copyTxHash = () => {
    navigator.clipboard.writeText(nft.txHash);
    setCopiedTx(true);
    setTimeout(() => setCopiedTx(false), 2000);
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopiedShareLink(true);
    setTimeout(() => setCopiedShareLink(false), 2000);
  };

  const handleShareLens = () => {
    setSharedLens(true);
    setTimeout(() => setSharedLens(false), 3000);
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[100] flex flex-col items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="glass-panel p-6 sm:p-8 max-w-md w-full text-center flex flex-col items-center gap-4 relative overflow-hidden rounded-2xl border border-white/10 bg-[#16161e]/95 shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-hide">
        {/* Decorative Blur */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#5adace] rounded-full mix-blend-screen filter blur-[80px] opacity-20 pointer-events-none"></div>

        {/* Success Icon Badge */}
        <div className="w-14 h-14 rounded-full border-2 border-[#5adace] flex items-center justify-center text-[#5adace] shadow-[0_0_20px_rgba(90,218,206,0.35)] bg-[#00504a]/20 shrink-0">
          <span className="material-symbols-outlined text-2xl">check</span>
        </div>

        {/* Heading */}
        <div>
          <h2 className="font-headline-md text-xl sm:text-2xl text-[#e4e1ed] font-semibold tracking-tight">
            Your Voice Art is On-Chain!
          </h2>
          <p className="font-body-base text-xs text-[#c8c5cb] mt-1">
            Successfully minted to your connected wallet address.
          </p>
        </div>

        {/* NFT Image Preview Card */}
        <div className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl p-3 flex items-center gap-3 text-left">
          <img
            src={nft.imageUrl}
            alt={nft.name}
            className="w-16 h-16 rounded-lg object-cover border border-white/10 shrink-0 bg-[#13131b]"
          />
          <div className="flex-1 overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="font-headline-md text-sm font-bold text-white truncate">{nft.name}</span>
              <span className="font-label-mono text-[10px] text-[#5adace] font-bold">#{nft.tokenId}</span>
            </div>
            <p className="font-metadata text-xs text-[#c8c5cb]/70 truncate mt-0.5">{nft.voiceDescription}</p>
            <p className="font-label-mono text-[10px] text-[#d4bbff] mt-1">{nft.styleName} Algorithm</p>
          </div>
        </div>

        {/* Mint Details Card */}
        <div className="w-full bg-[#0a0a0f] border border-white/5 rounded-lg p-3 text-left text-xs font-label-mono space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-[#c8c5cb]/60">Tx Hash:</span>
            <button
              onClick={copyTxHash}
              className="text-[#d4bbff] hover:text-white flex items-center gap-1 font-mono cursor-pointer"
            >
              <span>{nft.txHash.slice(0, 8)}...{nft.txHash.slice(-4)}</span>
              {copiedTx ? <Check className="w-3 h-3 text-[#5adace]" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#c8c5cb]/60">Network:</span>
            <span className="text-[#e4e1ed]">{nft.networkName}</span>
          </div>
        </div>

        {/* Social Share Section */}
        <div className="w-full bg-[#1b1b23] border border-white/10 rounded-xl p-3.5 text-left space-y-2.5">
          <div className="flex justify-between items-center">
            <span className="font-label-mono text-[11px] text-[#5adace] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5" />
              Social Share Link
            </span>
            <span className="font-metadata text-[10px] text-[#c8c5cb]/60">Live Preview</span>
          </div>

          {/* Shareable Link Input Box */}
          <div className="flex items-center gap-2 bg-[#0a0a0f] border border-white/10 rounded-lg p-1.5 pl-3">
            <LinkIcon className="w-3.5 h-3.5 text-[#c8c5cb]/60 shrink-0" />
            <input
              type="text"
              readOnly
              value={shareableUrl}
              className="bg-transparent text-xs font-mono text-[#c8c5cb] w-full focus:outline-none select-all truncate"
            />
            <button
              onClick={copyShareLink}
              className="px-3 py-1.5 bg-[#5adace]/20 hover:bg-[#5adace]/30 text-[#5adace] rounded font-label-mono text-[11px] font-bold transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
            >
              {copiedShareLink ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copiedShareLink ? 'Copied!' : 'Copy'}
            </button>
          </div>

          {/* Social Share Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <a
              href={`https://twitter.com/intent/tweet?text=${tweetText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 bg-[#1d9bf0]/15 hover:bg-[#1d9bf0]/25 text-[#1d9bf0] border border-[#1d9bf0]/30 rounded-lg font-label-mono text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Twitter className="w-3.5 h-3.5" />
              Share on X
            </a>

            <button
              onClick={handleShareLens}
              className="py-2.5 px-3 bg-[#00504a]/30 hover:bg-[#00504a]/50 text-[#5adace] border border-[#5adace]/30 rounded-lg font-label-mono text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {sharedLens ? 'Shared! 🎉' : 'Share to Lens'}
            </button>
          </div>
        </div>

        {/* Primary View NFT Button */}
        <div className="flex flex-col w-full gap-2 mt-1">
          <button
            onClick={() => {
              onViewNFT(nft);
              onClose();
            }}
            className="w-full py-3.5 bg-[#f7fafc] text-black rounded-lg font-label-mono text-xs font-bold hover:bg-white transition-colors cursor-pointer shadow-lg flex items-center justify-center gap-2"
          >
            <span>View NFT in Vault</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#c8c5cb] hover:text-white p-1 rounded-md hover:bg-white/5 transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
    </div>
  );
};
