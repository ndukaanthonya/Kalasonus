export type Step = 0 | 1 | 2 | 3 | 4 | 5;

export type Network = {
  id: string;
  name: string;
  symbol: string;
  icon: string;
};

export type WalletState = {
  connected: boolean;
  address: string | null;
  network: Network;
  walletName: string | null;
  balance: string;
};

export type ArtStyle = 
  | 'neon-stipple' 
  | 'kinetic-swirls' 
  | 'cosmic-nebula' 
  | 'cyber-flow' 
  | 'liquid-chroma';

export type ArtistIdentity = {
  fullName: string;
  occasion?: string;
  date: string;
};

export type AudioFeatures = {
  rms: number;             // RMS loudness (0 to 1)
  dominantPitchHz: number; // Dominant frequency in Hz (e.g. 240)
  pitchText: string;       // e.g. "240 Hz"
  zcr: number;             // Zero-crossing rate (texture roughness 0 to 1)
  duration: number;        // Duration in seconds
  frequencies: number[];   // Array of FFT bin magnitudes
  audioUrl?: string;
  audioBlob?: Blob;
};

export type AudioAnalysis = {
  duration: number;
  pitch: string;
  energy: number;
  voiceDescription: string;
  frequencies: number[];
  audioUrl?: string;
};

export type ArtMetadata = {
  tokenId: string;
  voiceDescription: string;
  style: ArtStyle;
  styleName: string;
  timestamp: string;
  hash: string;
  seed: number;
  gasFee: string;
  contractAddress: string;
  audioAnalysis: AudioAnalysis;
  imageUrl?: string;
};

export type MintedNFT = {
  tokenId: string;
  txHash: string;
  name: string;
  voiceDescription: string;
  style: ArtStyle;
  styleName: string;
  timestamp: string;
  imageUrl: string;
  walletAddress: string;
  networkName: string;
  audioAnalysis: AudioAnalysis;
};

export type MintRecord = {
  unique_id: string;
  artist_name: string;
  occasion?: string;
  prompt_used: string;
  audio_features: AudioFeatures;
  generated_image_url: string;
  art_title: string;
  wallet_address: string;
  token_id: string;
  tx_hash: string;
  payment_tx_hash: string;
  created_at: string;
  color_palette?: string[];
  style?: ArtStyle;
};

export type PrintSize = 
  | 'A4 (8.3" x 11.7")' 
  | 'A3 (11.7" x 16.5")' 
  | 'A2 (16.5" x 23.4")' 
  | 'A1 (23.4" x 33.1")' 
  | '12" x 18"' 
  | '18" x 24"' 
  | '24" x 36"' 
  | '12" x 12"' 
  | '24" x 24"';
export type PrintProductType = 'Poster Print' | 'Canvas Print' | 'Framed Print';

export type ShippingAddress = {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  countryCode: string;
  postalCode: string;
};

export type PrintOrderRequest = {
  printSize: PrintSize;
  productType: PrintProductType;
  shipping: ShippingAddress;
  price: number;
  unique_id: string;
  image_url: string;
};
