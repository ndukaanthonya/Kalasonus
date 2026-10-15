import React, { useState, useEffect } from 'react';
import { Step, WalletState, AudioFeatures, ArtStyle, ArtistIdentity, MintRecord, Network } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { BackgroundGlow } from './components/BackgroundGlow';
import { Step0Landing } from './components/Step0Landing';
import { Step1ArtistForm } from './components/Step1ArtistForm';
import { Step1ConnectWallet } from './components/Step1ConnectWallet';
import { Step3VoiceRecorder } from './components/Step3VoiceRecorder';
import { Step4CeloPayment } from './components/Step4CeloPayment';
import { Step5GenerateAndMint } from './components/Step5GenerateAndMint';
import { GalleryPieceView } from './components/GalleryPieceView';
import { WalletModal, NETWORKS } from './components/WalletModal';
import { SuccessModal } from './components/SuccessModal';
import { InfoModals } from './components/InfoModals';
import { GalleryDrawer } from './components/GalleryDrawer';

export default function App() {
  // Navigation & Flow State
  const [currentStep, setCurrentStep] = useState<Step>(0);
  const [activePieceId, setActivePieceId] = useState<string | null>(null);

  // Check URL path for public gallery piece routing e.g. /piece/:id
  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/piece/')) {
      const pieceId = path.split('/piece/')[1];
      if (pieceId) {
        setActivePieceId(pieceId);
      }
    }
  }, []);

  // Artist Identity State
  const [artistIdentity, setArtistIdentity] = useState<ArtistIdentity>({
    fullName: '',
    occasion: '',
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  });

  // Wallet Connection State
  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
    address: null,
    network: NETWORKS[0],
    walletName: null,
    balance: '0.00'
  });

  // Audio Features & Selected Style State
  const [audioFeatures, setAudioFeatures] = useState<AudioFeatures | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<ArtStyle>('cosmic-nebula');
  const [paymentTxHash, setPaymentTxHash] = useState<string>('');
  const [seed, setSeed] = useState<number>(48291);

  // Modals & Drawers State
  const [walletModalOpen, setWalletModalOpen] = useState<boolean>(false);
  const [successModalOpen, setSuccessModalOpen] = useState<boolean>(false);
  const [galleryDrawerOpen, setGalleryDrawerOpen] = useState<boolean>(false);
  const [infoModalType, setInfoModalType] = useState<'privacy' | 'terms' | 'docs' | null>(null);

  // Mints Vault Records list
  const [mintsList, setMintsList] = useState<MintRecord[]>([]);
  const [latestMintRecord, setLatestMintRecord] = useState<MintRecord | null>(null);

  // Connect Wallet Handler
  const handleConnectWallet = (walletName: string, customAddress?: string) => {
    const addr = customAddress || '0x71C7656EC7ab88b098defB751B7401B5f6d8976F';
    setWallet({
      connected: true,
      address: addr,
      network: NETWORKS[0],
      walletName,
      balance: '12.50'
    });
  };

  // Disconnect Wallet Handler
  const handleDisconnectWallet = () => {
    setWallet({
      connected: false,
      address: null,
      network: NETWORKS[0],
      walletName: null,
      balance: '0.00'
    });
  };

  // Switch Network Handler
  const handleSwitchNetwork = (network: Network) => {
    setWallet((prev) => ({ ...prev, network }));
  };

  // Mint Complete Handler
  const handleMintComplete = (mintRecord: MintRecord) => {
    setMintsList((prev) => [mintRecord, ...prev]);
    setLatestMintRecord(mintRecord);
    setSuccessModalOpen(true);
  };

  return (
    <div className="bg-[#13131b] text-[#e4e1ed] min-h-screen flex flex-col font-body-base text-body-base relative z-0 overflow-x-hidden selection:bg-[#b794f4]/30 selection:text-white">
      {/* Background Soft Glow & Blur Particles */}
      <BackgroundGlow step={currentStep === 0 ? 0 : 1} />

      {/* Header Bar */}
      <Header
        currentStep={activePieceId ? 0 : currentStep}
        onStepChange={(s) => {
          setActivePieceId(null);
          setCurrentStep(s);
        }}
        wallet={wallet}
        onOpenWalletModal={() => setWalletModalOpen(true)}
        onOpenGallery={() => setGalleryDrawerOpen(true)}
        mintedCount={mintsList.length}
      />

      {/* VIEW A: Public Gallery Piece View */}
      {activePieceId ? (
        <GalleryPieceView
          uniqueId={activePieceId}
          initialMintRecord={latestMintRecord?.unique_id === activePieceId ? latestMintRecord : null}
          onBackToHome={() => {
            setActivePieceId(null);
            window.history.pushState({}, '', '/');
          }}
        />
      ) : (
        /* VIEW B: Multi-Step Flow */
        <>
          {/* Step 0: Landing Page */}
          {currentStep === 0 && (
            <Step0Landing
              onGetStarted={() => setCurrentStep(1)}
              seed={seed}
            />
          )}

          {/* Step 1: Artist Identity Form */}
          {currentStep === 1 && (
            <Step1ArtistForm
              artistIdentity={artistIdentity}
              onSubmitIdentity={(id) => setArtistIdentity(id)}
              onNextStep={() => setCurrentStep(2)}
            />
          )}

          {/* Step 2: Select Style & Connect Wallet */}
          {currentStep === 2 && (
            <Step1ConnectWallet
              wallet={wallet}
              onOpenWalletModal={() => setWalletModalOpen(true)}
              onNextStep={() => setCurrentStep(3)}
              selectedStyle={selectedStyle}
              onStyleChange={setSelectedStyle}
              seed={seed}
            />
          )}

          {/* Step 3: Voice Capture with Replay & Re-record */}
          {currentStep === 3 && (
            <Step3VoiceRecorder
              onAudioCaptured={(features) => setAudioFeatures(features)}
              onNextStep={() => setCurrentStep(4)}
              currentFeatures={audioFeatures}
              selectedStyle={selectedStyle}
            />
          )}

          {/* Step 4: Celo $1 Payment */}
          {currentStep === 4 && audioFeatures && (
            <Step4CeloPayment
              wallet={wallet}
              artistIdentity={artistIdentity}
              audioFeatures={audioFeatures}
              onOpenWalletModal={() => setWalletModalOpen(true)}
              onPaymentConfirmed={(txHash) => {
                setPaymentTxHash(txHash);
                setCurrentStep(5);
              }}
            />
          )}

          {/* Step 5: Gemini Art Generation & Minting */}
          {currentStep === 5 && audioFeatures && (
            <Step5GenerateAndMint
              artistIdentity={artistIdentity}
              audioFeatures={audioFeatures}
              selectedStyle={selectedStyle}
              paymentTxHash={paymentTxHash}
              wallet={wallet}
              onMintComplete={(mintRecord) => {
                handleMintComplete(mintRecord);
              }}
            />
          )}
        </>
      )}

      {/* Footer Bar */}
      <Footer
        onOpenPrivacy={() => setInfoModalType('privacy')}
        onOpenTerms={() => setInfoModalType('terms')}
        onOpenDocs={() => setInfoModalType('docs')}
      />

      {/* Modals & Slide-over Panels */}
      <WalletModal
        isOpen={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
        wallet={wallet}
        onConnect={handleConnectWallet}
        onDisconnect={handleDisconnectWallet}
        onSwitchNetwork={handleSwitchNetwork}
      />

      {latestMintRecord && (
        <SuccessModal
          isOpen={successModalOpen}
          onClose={() => setSuccessModalOpen(false)}
          nft={{
            tokenId: latestMintRecord.token_id,
            txHash: latestMintRecord.tx_hash,
            name: latestMintRecord.art_title,
            voiceDescription: latestMintRecord.artist_name,
            style: latestMintRecord.style || selectedStyle,
            styleName: latestMintRecord.art_title,
            timestamp: latestMintRecord.created_at,
            imageUrl: latestMintRecord.generated_image_url,
            walletAddress: latestMintRecord.wallet_address,
            networkName: wallet.network.name,
            audioAnalysis: {
              duration: latestMintRecord.audio_features.duration,
              pitch: latestMintRecord.audio_features.pitchText,
              energy: latestMintRecord.audio_features.rms,
              voiceDescription: latestMintRecord.artist_name,
              frequencies: latestMintRecord.audio_features.frequencies
            }
          }}
          onViewNFT={() => {
            setSuccessModalOpen(false);
            if (latestMintRecord) {
              setActivePieceId(latestMintRecord.unique_id);
              window.history.pushState({}, '', `/piece/${latestMintRecord.unique_id}`);
            }
          }}
        />
      )}

      <InfoModals
        type={infoModalType}
        onClose={() => setInfoModalType(null)}
      />

      <GalleryDrawer
        isOpen={galleryDrawerOpen}
        onClose={() => setGalleryDrawerOpen(false)}
        mintedNFTs={mintsList.map((m) => ({
          tokenId: m.token_id,
          txHash: m.tx_hash,
          name: m.art_title,
          voiceDescription: m.artist_name,
          style: m.style || selectedStyle,
          styleName: m.art_title,
          timestamp: m.created_at,
          imageUrl: m.generated_image_url,
          walletAddress: m.wallet_address,
          networkName: wallet.network.name,
          audioAnalysis: {
            duration: m.audio_features.duration,
            pitch: m.audio_features.pitchText,
            energy: m.audio_features.rms,
            voiceDescription: m.artist_name,
            frequencies: m.audio_features.frequencies
          }
        }))}
        onSelectNFT={(nft) => {
          const match = mintsList.find(m => m.token_id === nft.tokenId);
          if (match) {
            setActivePieceId(match.unique_id);
            window.history.pushState({}, '', `/piece/${match.unique_id}`);
            setGalleryDrawerOpen(false);
          }
        }}
      />
    </div>
  );
}
