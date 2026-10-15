import React, { useState, useEffect, useRef } from 'react';
import { MintRecord } from '../types';
import { Sparkles, Play, Pause, ExternalLink, Copy, Check, ShoppingBag, Eye, Award, Share2, ArrowLeft, Disc } from 'lucide-react';
import { PrintfulOrderModal } from './PrintfulOrderModal';
import { ARViewModal } from './ARViewModal';

interface GalleryPieceViewProps {
  uniqueId: string;
  initialMintRecord?: MintRecord | null;
  onBackToHome: () => void;
}

export const GalleryPieceView: React.FC<GalleryPieceViewProps> = ({
  uniqueId,
  initialMintRecord,
  onBackToHome
}) => {
  const [mintRecord, setMintRecord] = useState<MintRecord | null>(initialMintRecord || null);
  const [loading, setLoading] = useState<boolean>(!initialMintRecord);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copiedTxHash, setCopiedTxHash] = useState<string | null>(null);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showARModal, setShowARModal] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!initialMintRecord && uniqueId) {
      async function fetchMint() {
        try {
          const res = await fetch(`/api/mints/${uniqueId}`);
          if (res.ok) {
            const data = await res.json();
            setMintRecord(data);
          }
        } catch (err) {
          console.warn("Fetch mint error:", err);
        } finally {
          setLoading(false);
        }
      }
      fetchMint();
    }
  }, [uniqueId, initialMintRecord]);

  const toggleAudio = () => {
    if (!mintRecord?.audio_features.audioUrl) return;

    if (isPlayingAudio && audioRef.current) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      if (!audioRef.current) {
        audioRef.current = new Audio(mintRecord.audio_features.audioUrl);
        audioRef.current.onended = () => setIsPlayingAudio(false);
      } else {
        audioRef.current.src = mintRecord.audio_features.audioUrl;
      }
      audioRef.current.play();
      setIsPlayingAudio(true);
    }
  };

  const handleCopyHash = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTxHash(type);
    setTimeout(() => setCopiedTxHash(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <Disc className="w-10 h-10 text-[#5adace] animate-spin mb-4" />
        <span className="font-label-mono text-sm text-[#c8c5cb]">Loading Voice DNA Gallery Certificate...</span>
      </div>
    );
  }

  if (!mintRecord) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center min-h-[60vh] text-center p-6 max-w-md mx-auto">
        <h2 className="font-display-lg text-2xl font-bold text-white mb-2">Artwork Not Found</h2>
        <p className="font-body-base text-sm text-[#c8c5cb] mb-6">
          The specified piece ID does not exist in the KalaSonus gallery store.
        </p>
        <button
          onClick={onBackToHome}
          className="py-3 px-6 bg-[#f7fafc] text-black font-label-mono text-xs font-bold rounded-xl hover:bg-white"
        >
          Return to KalaSonus Studio
        </button>
      </div>
    );
  }

  const { audio_features } = mintRecord;

  return (
    <main className="w-full max-w-[1100px] mx-auto px-4 md:px-8 py-8 md:py-12 z-10 relative flex flex-col gap-10">
      
      {/* Top Navigation */}
      <div className="flex justify-between items-center w-full">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#292932] hover:bg-[#34343d] border border-white/15 text-white font-label-mono text-xs font-semibold transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to KalaSonus Studio</span>
        </button>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#5adace]/15 border border-[#5adace]/30 text-[#5adace] font-label-mono text-[11px] font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          Public Gallery Piece
        </div>
      </div>

      {/* Main Grid Layout: Artwork Left, Actions & Meta Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: High-Res Canvas Artwork Display */}
        <div className="lg:col-span-7 flex flex-col items-center gap-4">
          <div className="w-full aspect-square bg-[#0a0a0f] border border-white/15 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] relative group">
            <img
              src={mintRecord.generated_image_url}
              alt={mintRecord.art_title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Audio Waveform Replay Player */}
          {audio_features.audioUrl && (
            <div className="w-full bg-[#16161e] border border-white/10 rounded-2xl p-4 flex items-center justify-between shadow-xl">
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleAudio}
                  className="w-12 h-12 rounded-full bg-[#5adace] text-black hover:bg-white flex items-center justify-center transition-transform active:scale-95 cursor-pointer shadow-lg"
                >
                  {isPlayingAudio ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </button>
                <div className="text-left">
                  <span className="font-headline-md text-xs font-bold text-white block">
                    Original Acoustic Recording
                  </span>
                  <span className="font-metadata text-[11px] text-[#c8c5cb]">
                    {audio_features.duration.toFixed(1)}s • {audio_features.pitchText} pitch
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0a0a0f] border border-white/10 text-[10px] font-label-mono text-[#5adace]">
                <Disc className={`w-3.5 h-3.5 ${isPlayingAudio ? 'animate-spin' : ''}`} />
                <span>{isPlayingAudio ? 'Playing Sound' : 'Tap to Play'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Title, Quick Actions & Print/AR Buttons */}
        <div className="lg:col-span-5 flex flex-col gap-6 text-left">
          
          <div>
            <span className="font-label-mono text-xs text-[#5adace] uppercase tracking-widest font-bold block mb-1">
              Token ID #{mintRecord.token_id} · Celo NFT
            </span>
            <h1 className="font-display-lg text-3xl md:text-4xl font-bold text-white leading-tight mb-2">
              {mintRecord.art_title}
            </h1>
            <p className="font-body-base text-sm text-[#c8c5cb]">
              Made by the voice of <strong className="text-white">{mintRecord.artist_name}</strong>
              {mintRecord.occasion ? ` for ${mintRecord.occasion}` : ''}
            </p>
          </div>

          {/* Action Buttons: Order Print & View in AR */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setShowPrintModal(true)}
              className="py-4 px-4 bg-[#f7fafc] text-black hover:bg-white transition-all font-label-mono text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-black" />
              <span>Order Physical Print</span>
            </button>

            <button
              onClick={() => setShowARModal(true)}
              className="py-4 px-4 bg-[#292932] hover:bg-[#34343d] border border-white/15 text-white font-label-mono text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Eye className="w-4 h-4 text-[#5adace]" />
              <span>View in WebAR</span>
            </button>
          </div>

          {/* Color Palette Circular Swatches */}
          {mintRecord.color_palette && (
            <div className="p-4 rounded-xl bg-[#16161e] border border-white/10 flex items-center justify-between">
              <span className="font-label-mono text-xs text-[#c8c5cb] font-semibold">
                Color Palette Spectrum:
              </span>
              <div className="flex items-center gap-2">
                {mintRecord.color_palette.map((color, idx) => (
                  <div
                    key={idx}
                    className="w-6 h-6 rounded-full border border-white/20 shadow-md"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Share Link Box */}
          <div className="p-4 rounded-xl bg-[#16161e] border border-white/10 flex items-center justify-between">
            <div className="text-left font-metadata text-xs text-[#c8c5cb] truncate mr-2">
              <span className="font-label-mono text-[10px] text-[#5adace] block">GALLERY LINK</span>
              {window.location.origin}/piece/{mintRecord.unique_id}
            </div>
            <button
              onClick={() => handleCopyHash(`${window.location.origin}/piece/${mintRecord.unique_id}`, 'link')}
              className="px-3 py-1.5 bg-[#292932] hover:bg-[#34343d] text-white border border-white/15 rounded-lg font-label-mono text-[11px] whitespace-nowrap cursor-pointer flex items-center gap-1.5"
            >
              {copiedTxHash === 'link' ? <Check className="w-3.5 h-3.5 text-[#5adace]" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedTxHash === 'link' ? 'Copied' : 'Share'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* FEATURE 6: VOICE DNA CERTIFICATE SECTION */}
      <section className="w-full bg-[#0d0d12] border-2 border-[#d4af37]/40 rounded-2xl p-6 sm:p-10 shadow-[0_0_60px_rgba(212,175,55,0.1)] relative overflow-hidden text-left mt-6">
        
        {/* Certificate Gold Trim Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#d4af37]/30 pb-6 mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-[#d4af37] font-label-mono text-xs uppercase tracking-widest font-bold mb-1">
              <Award className="w-4 h-4" />
              Certificate of Authenticity
            </div>
            <h2 className="font-display-lg text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Voice DNA & Acoustic Spectrum Analysis
            </h2>
          </div>

          <div className="text-right font-label-mono text-xs text-[#d4af37] border border-[#d4af37]/30 px-3 py-1.5 rounded-lg bg-[#d4af37]/10">
            Verified Celo NFT Proof
          </div>
        </div>

        {/* Certificate Grid Data */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          
          {/* Pitch metric */}
          <div className="p-4 bg-[#16161e] border border-white/10 rounded-xl font-mono text-xs">
            <span className="text-[10px] text-[#5adace] uppercase tracking-wider block mb-1">
              Dominant Pitch (Hz)
            </span>
            <span className="text-xl font-bold text-white">{audio_features.pitchText}</span>
          </div>

          {/* RMS Energy metric */}
          <div className="p-4 bg-[#16161e] border border-white/10 rounded-xl font-mono text-xs">
            <span className="text-[10px] text-[#5adace] uppercase tracking-wider block mb-1">
              RMS Energy Level
            </span>
            <span className="text-xl font-bold text-white">{(audio_features.rms * 100).toFixed(1)}%</span>
          </div>

          {/* ZCR Texture metric */}
          <div className="p-4 bg-[#16161e] border border-white/10 rounded-xl font-mono text-xs">
            <span className="text-[10px] text-[#5adace] uppercase tracking-wider block mb-1">
              Zero-Crossing Rate
            </span>
            <span className="text-xl font-bold text-white">{(audio_features.zcr * 100).toFixed(1)}%</span>
          </div>

          {/* Duration metric */}
          <div className="p-4 bg-[#16161e] border border-white/10 rounded-xl font-mono text-xs">
            <span className="text-[10px] text-[#5adace] uppercase tracking-wider block mb-1">
              Audio Duration
            </span>
            <span className="text-xl font-bold text-white">{audio_features.duration.toFixed(2)}s</span>
          </div>
        </div>

        {/* Blockchain Transaction Verification Proofs */}
        <div className="space-y-3 font-mono text-xs border-t border-[#d4af37]/20 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-[#16161e] border border-white/10 gap-2">
            <div>
              <span className="text-[#5adace] text-[10px] block">NFT MINT TRANSACTION HASH</span>
              <span className="text-white text-xs truncate font-mono">{mintRecord.tx_hash}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopyHash(mintRecord.tx_hash, 'mint')}
                className="p-2 bg-[#292932] hover:bg-[#34343d] rounded-lg text-white text-[11px] flex items-center gap-1"
              >
                {copiedTxHash === 'mint' ? <Check className="w-3.5 h-3.5 text-[#5adace]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <a
                href={`https://celoscan.io/tx/${mintRecord.tx_hash}`}
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-[#5adace]/15 text-[#5adace] hover:bg-[#5adace]/25 rounded-lg text-[11px] flex items-center gap-1"
              >
                <span>Celoscan</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-[#16161e] border border-white/10 gap-2">
            <div>
              <span className="text-[#5adace] text-[10px] block">CUSD $1 PAYMENT TRANSACTION HASH</span>
              <span className="text-white text-xs truncate font-mono">{mintRecord.payment_tx_hash}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopyHash(mintRecord.payment_tx_hash, 'payment')}
                className="p-2 bg-[#292932] hover:bg-[#34343d] rounded-lg text-white text-[11px] flex items-center gap-1"
              >
                {copiedTxHash === 'payment' ? <Check className="w-3.5 h-3.5 text-[#5adace]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <a
                href={`https://celoscan.io/tx/${mintRecord.payment_tx_hash}`}
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-[#5adace]/15 text-[#5adace] hover:bg-[#5adace]/25 rounded-lg text-[11px] flex items-center gap-1"
              >
                <span>Celoscan</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      {showPrintModal && (
        <PrintfulOrderModal
          mintRecord={mintRecord}
          onClose={() => setShowPrintModal(false)}
        />
      )}

      {showARModal && (
        <ARViewModal
          mintRecord={mintRecord}
          onClose={() => setShowARModal(false)}
        />
      )}
    </main>
  );
};
