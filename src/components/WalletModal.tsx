import React, { useState } from 'react';
import { WalletState, Network } from '../types';
import { Wallet, X, Check, Copy, ExternalLink, ShieldCheck, Zap } from 'lucide-react';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: WalletState;
  onConnect: (walletName: string, address?: string) => void;
  onDisconnect: () => void;
  onSwitchNetwork: (network: Network) => void;
}

export const NETWORKS: Network[] = [
  { id: 'eth', name: 'Ethereum Mainnet', symbol: 'ETH', icon: 'Ξ' },
  { id: 'polygon', name: 'Polygon PoS', symbol: 'POL', icon: '💜' },
  { id: 'arbitrum', name: 'Arbitrum One', symbol: 'ETH', icon: '💙' },
  { id: 'base', name: 'Base Mainnet', symbol: 'ETH', icon: '🔵' },
  { id: 'sepolia', name: 'Sepolia Testnet', symbol: 'ETH', icon: '🧪' },
];

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  wallet,
  onConnect,
  onDisconnect,
  onSwitchNetwork
}) => {
  const [copied, setCopied] = useState(false);
  const [customAddress, setCustomAddress] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  if (!isOpen) return null;

  const copyAddress = () => {
    if (wallet.address) {
      navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCustomConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (customAddress.trim().length >= 10) {
      onConnect('Custom Wallet', customAddress.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="glass-panel p-6 sm:p-8 max-w-md w-full rounded-2xl relative border border-white/10 shadow-2xl bg-[#16161e]/90">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#55338d]/40 border border-[#b794f4]/30 flex items-center justify-center text-[#d4bbff]">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-headline-md text-lg font-semibold text-[#e4e1ed]">
                {wallet.connected ? 'Connected Account' : 'Connect Web3 Wallet'}
              </h2>
              <p className="font-metadata text-xs text-[#c8c5cb]/70">
                {wallet.connected ? 'Manage network & connection' : 'Choose your preferred provider'}
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

        {/* Connected State View */}
        {wallet.connected ? (
          <div className="space-y-6">
            <div className="bg-[#1b1b23] border border-white/10 rounded-xl p-4 flex flex-col gap-3">
              <div className="flex justify-between items-center text-xs font-label-mono text-[#c8c5cb]/70">
                <span>Wallet Provider</span>
                <span className="text-[#5adace] font-semibold">{wallet.walletName}</span>
              </div>

              <div className="flex justify-between items-center bg-[#0a0a0f] p-3 rounded-lg border border-white/5">
                <span className="font-label-mono text-sm text-[#e4e1ed] tracking-wider">
                  {wallet.address?.slice(0, 8)}...{wallet.address?.slice(-6)}
                </span>
                <button
                  onClick={copyAddress}
                  className="flex items-center gap-1 text-xs text-[#d4bbff] hover:text-white transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#5adace]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="flex justify-between items-center text-xs font-label-mono text-[#c8c5cb]/70">
                <span>Test Balance</span>
                <span className="text-[#e4e1ed] font-bold">{wallet.balance} {wallet.network.symbol}</span>
              </div>
            </div>

            {/* Network Selector */}
            <div>
              <label className="block text-xs font-label-mono text-[#c8c5cb] uppercase tracking-wider mb-2">
                Active Chain
              </label>
              <div className="grid grid-cols-1 gap-2">
                {NETWORKS.map((net) => (
                  <button
                    key={net.id}
                    onClick={() => onSwitchNetwork(net)}
                    className={`flex items-center justify-between p-3 rounded-lg border text-xs font-label-mono transition-all ${
                      wallet.network.id === net.id
                        ? 'border-[#5adace] bg-[#5adace]/10 text-white'
                        : 'border-white/5 bg-[#1b1b23] text-[#c8c5cb] hover:bg-[#292932]'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{net.icon}</span>
                      <span>{net.name}</span>
                    </span>
                    {wallet.network.id === net.id && <Check className="w-4 h-4 text-[#5adace]" />}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                onDisconnect();
                onClose();
              }}
              className="w-full py-3 bg-[#93000a]/30 border border-[#ffb4ab]/30 text-[#ffb4ab] hover:bg-[#93000a]/50 rounded-lg font-label-mono text-xs uppercase tracking-wider transition-colors"
            >
              Disconnect Wallet
            </button>
          </div>
        ) : (
          /* Disconnected Options */
          <div className="space-y-4">
            <button
              onClick={() => {
                onConnect('MetaMask', '0x71C7656EC7ab88b098defB751B7401B5f6d8976F');
                onClose();
              }}
              className="w-full p-3.5 bg-[#1b1b23] border border-white/10 hover:border-[#b794f4] rounded-xl flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#f97316]/10 flex items-center justify-center text-lg">
                  🦊
                </div>
                <div className="text-left">
                  <div className="font-headline-md text-sm font-semibold text-[#e4e1ed] group-hover:text-white">
                    MetaMask
                  </div>
                  <div className="font-metadata text-xs text-[#c8c5cb]/70">
                    Connect browser extension
                  </div>
                </div>
              </div>
              <span className="text-xs font-label-mono text-[#5adace] group-hover:translate-x-0.5 transition-transform">
                Connect →
              </span>
            </button>

            <button
              onClick={() => {
                onConnect('WalletConnect', '0x3D923E28B0284617B5047895f3A3c2929285091a');
                onClose();
              }}
              className="w-full p-3.5 bg-[#1b1b23] border border-white/10 hover:border-[#b794f4] rounded-xl flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#3b82f6]/10 flex items-center justify-center text-lg">
                  ⚡
                </div>
                <div className="text-left">
                  <div className="font-headline-md text-sm font-semibold text-[#e4e1ed] group-hover:text-white">
                    WalletConnect
                  </div>
                  <div className="font-metadata text-xs text-[#c8c5cb]/70">
                    Scan with Mobile App / QR
                  </div>
                </div>
              </div>
              <span className="text-xs font-label-mono text-[#5adace] group-hover:translate-x-0.5 transition-transform">
                Connect →
              </span>
            </button>

            <button
              onClick={() => {
                onConnect('Phantom', '0x88f21E535C50B1B34821a37c95e5d3D9C311E3A2');
                onClose();
              }}
              className="w-full p-3.5 bg-[#1b1b23] border border-white/10 hover:border-[#b794f4] rounded-xl flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#a855f7]/10 flex items-center justify-center text-lg">
                  👻
                </div>
                <div className="text-left">
                  <div className="font-headline-md text-sm font-semibold text-[#e4e1ed] group-hover:text-white">
                    Phantom / Solana & EVM
                  </div>
                  <div className="font-metadata text-xs text-[#c8c5cb]/70">
                    Multi-chain wallet
                  </div>
                </div>
              </div>
              <span className="text-xs font-label-mono text-[#5adace] group-hover:translate-x-0.5 transition-transform">
                Connect →
              </span>
            </button>

            <button
              onClick={() => {
                const demoAddress = '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
                onConnect('Instant Demo Wallet', demoAddress);
                onClose();
              }}
              className="w-full p-3.5 bg-gradient-to-r from-[#55338d]/40 to-[#00504a]/40 border border-[#5adace]/30 hover:border-[#5adace] rounded-xl flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#5adace]/20 flex items-center justify-center text-[#5adace]">
                  <Zap className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="font-headline-md text-sm font-semibold text-white">
                    Instant Demo Wallet
                  </div>
                  <div className="font-metadata text-xs text-[#5adace]">
                    No extension needed • 1-Click
                  </div>
                </div>
              </div>
              <span className="text-xs font-label-mono text-white bg-[#5adace]/30 px-2 py-1 rounded">
                Fast
              </span>
            </button>

            {/* Custom ENS / Address option */}
            {!showCustomInput ? (
              <button
                onClick={() => setShowCustomInput(true)}
                className="w-full text-center text-xs font-label-mono text-[#c8c5cb]/60 hover:text-[#d4bbff] transition-colors pt-2"
              >
                Or enter custom 0x address / ENS →
              </button>
            ) : (
              <form onSubmit={handleCustomConnect} className="pt-2 flex gap-2">
                <input
                  type="text"
                  placeholder="0x... or name.eth"
                  value={customAddress}
                  onChange={(e) => setCustomAddress(e.target.value)}
                  className="flex-1 bg-[#0a0a0f] border border-white/10 rounded-lg px-3 py-2 text-xs font-label-mono text-white focus:outline-none focus:border-[#5adace]"
                />
                <button
                  type="submit"
                  className="bg-[#f7fafc] text-black font-label-mono text-xs px-3 py-2 rounded-lg font-semibold hover:bg-white"
                >
                  Use
                </button>
              </form>
            )}

            <div className="pt-4 border-t border-white/5 text-center">
              <p className="font-metadata text-[11px] text-[#c8c5cb]/50 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#5adace]" />
                Non-custodial, encrypted signature verification
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
