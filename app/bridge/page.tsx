'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import {
  ArrowLeft, ArrowDown, Loader2, Check, ExternalLink,
  Shield, Zap, Activity, RefreshCw, ChevronDown, Info,
  Sparkles, ArrowUpRight, Globe, Wallet
} from 'lucide-react';

const SUPPORTED_CHAINS = [
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', icon: '⟠', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { id: 'bsc', name: 'BNB Chain', symbol: 'BNB', icon: '⬡', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  { id: 'polygon', name: 'Polygon', symbol: 'MATIC', icon: '⬢', color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { id: 'avalanche', name: 'Avalanche', symbol: 'AVAX', icon: '△', color: 'text-red-400', bg: 'bg-red-500/10' },
  { id: 'arbitrum', name: 'Arbitrum', symbol: 'ARB', icon: '◇', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  { id: 'base', name: 'Base', symbol: 'ETH', icon: '◆', color: 'text-blue-300', bg: 'bg-blue-400/10' },
];

const BRIDGE_TOKENS = [
  { symbol: 'USDC', name: 'USD Coin', decimals: 6, icon: '💲' },
  { symbol: 'USDT', name: 'Tether', decimals: 6, icon: '💵' },
  { symbol: 'ETH', name: 'Ethereum', decimals: 18, icon: '⟠' },
  { symbol: 'WBTC', name: 'Wrapped Bitcoin', decimals: 8, icon: '₿' },
];

interface BridgeEstimate {
  estimatedOutput: string;
  fee: string;
  route: string;
  estimatedTime: string;
  sunriseBonus: string;
}

export default function BridgePage() {
  const { publicKey } = useWallet();
  const [mounted, setMounted] = useState(false);
  const [selectedChain, setSelectedChain] = useState(SUPPORTED_CHAINS[0]);
  const [selectedToken, setSelectedToken] = useState(BRIDGE_TOKENS[0]);
  const [amount, setAmount] = useState('');
  const [showChainDropdown, setShowChainDropdown] = useState(false);
  const [showTokenDropdown, setShowTokenDropdown] = useState(false);
  const [isBridging, setIsBridging] = useState(false);
  const [bridgeComplete, setBridgeComplete] = useState(false);
  const [estimate, setEstimate] = useState<BridgeEstimate | null>(null);
  const [estimating, setEstimating] = useState(false);
  const [bridgeResult, setBridgeResult] = useState<{
    txHash: string;
    amountReceived: string;
    token: string;
  } | null>(null);

  useEffect(() => { setMounted(true); }, []);

  // Simulate getting a bridge estimate when amount changes
  useEffect(() => {
    if (!amount || parseFloat(amount) <= 0) {
      setEstimate(null);
      return;
    }

    const timer = setTimeout(() => {
      setEstimating(true);
      // Simulate API call to Sunrise/Mayan bridge aggregator
      setTimeout(() => {
        const numAmount = parseFloat(amount);
        const feePercent = 0.1;
        const fee = numAmount * (feePercent / 100);
        const sunriseBonus = numAmount * 0.005; // 0.5% INX bonus for using Sunrise
        
        setEstimate({
          estimatedOutput: (numAmount - fee).toFixed(4),
          fee: `${fee.toFixed(4)} ${selectedToken.symbol} (${feePercent}%)`,
          route: `${selectedChain.name} → Sunrise → Solana`,
          estimatedTime: selectedChain.id === 'ethereum' ? '~2-5 min' : '~1-3 min',
          sunriseBonus: `+${sunriseBonus.toFixed(2)} INX`,
        });
        setEstimating(false);
      }, 800);
    }, 500);

    return () => clearTimeout(timer);
  }, [amount, selectedChain, selectedToken]);

  const handleBridge = async () => {
    if (!publicKey || !amount || parseFloat(amount) <= 0) return;

    setIsBridging(true);
    setBridgeComplete(false);

    try {
      // Simulate bridge transaction via Sunrise
      await new Promise(r => setTimeout(r, 3000));

      const numAmount = parseFloat(amount);
      const fee = numAmount * 0.001;
      const txHash = `${Math.random().toString(36).substring(2, 10).toUpperCase()}…${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

      setBridgeResult({
        txHash,
        amountReceived: (numAmount - fee).toFixed(4),
        token: selectedToken.symbol,
      });
      setBridgeComplete(true);

      // Track migration
      const tm = parseInt(localStorage.getItem('totalMigrations') || '0') + 1;
      const sm = parseInt(localStorage.getItem('successfulMigrations') || '0') + 1;
      localStorage.setItem('totalMigrations', tm.toString());
      localStorage.setItem('successfulMigrations', sm.toString());
    } catch {
      // Error handling
    } finally {
      setIsBridging(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      {/* Sunrise-themed ambient glow */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-orange-600/5 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-600/5 rounded-full blur-[128px]" />
      </div>

      <header className="border-b border-white/5 backdrop-blur-xl bg-black/40 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back</span>
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-xl">🌅</span>
              <h1 className="text-lg font-bold">Bridge <span className="text-orange-400">via Sunrise</span></h1>
            </div>
            {mounted && <WalletMultiButton />}
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 sm:px-6 py-8">
        {/* Sunrise Partnership Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-500/20">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌅</span>
            <div className="flex-1">
              <div className="text-sm font-semibold text-orange-300">Powered by Sunrise</div>
              <div className="text-xs text-gray-400">Bridge assets to Solana with the lowest fees + INX rewards</div>
            </div>
            <a href="https://www.sunrisedefi.com/" target="_blank" rel="noopener noreferrer"
              className="text-orange-400 hover:text-orange-300 transition-colors">
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Bridge Card */}
        <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-6 sm:p-8">
          <h2 className="text-xl font-bold mb-6">Bridge Assets to Solana</h2>

          {/* Source Chain */}
          <div className="mb-5">
            <label className="text-xs text-gray-500 mb-1.5 block">From Chain</label>
            <div className="relative">
              <button
                onClick={() => setShowChainDropdown(!showChainDropdown)}
                className="w-full p-4 bg-black/40 border border-white/10 rounded-xl flex items-center justify-between hover:border-white/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg ${selectedChain.bg} flex items-center justify-center text-lg`}>
                    {selectedChain.icon}
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-white">{selectedChain.name}</div>
                    <div className="text-xs text-gray-500">{selectedChain.symbol}</div>
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showChainDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showChainDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a24] border border-white/10 rounded-xl shadow-2xl z-10 overflow-hidden">
                  {SUPPORTED_CHAINS.map(chain => (
                    <button
                      key={chain.id}
                      onClick={() => { setSelectedChain(chain); setShowChainDropdown(false); }}
                      className={`w-full p-3 flex items-center gap-3 hover:bg-white/5 transition-colors ${
                        selectedChain.id === chain.id ? 'bg-white/5' : ''
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-md ${chain.bg} flex items-center justify-center text-sm`}>
                        {chain.icon}
                      </span>
                      <span className="text-sm text-white">{chain.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center my-3">
            <div className="p-2.5 bg-orange-500/10 border border-orange-500/20 rounded-full">
              <ArrowDown className="w-4 h-4 text-orange-400" />
            </div>
          </div>

          {/* Destination: Solana */}
          <div className="mb-5">
            <label className="text-xs text-gray-500 mb-1.5 block">To Chain</label>
            <div className="p-4 bg-black/40 border border-white/10 rounded-xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-green-500/20 flex items-center justify-center">
                <span className="text-lg">◎</span>
              </div>
              <div>
                <div className="text-sm font-medium text-white">Solana</div>
                <div className="text-xs text-gray-500 font-mono truncate max-w-[280px]">
                  {publicKey ? publicKey.toString() : 'Connect wallet →'}
                </div>
              </div>
            </div>
          </div>

          {/* Token & Amount */}
          <div className="mb-5">
            <label className="text-xs text-gray-500 mb-1.5 block">Token & Amount</label>
            <div className="flex gap-2">
              <div className="relative">
                <button
                  onClick={() => setShowTokenDropdown(!showTokenDropdown)}
                  className="h-full px-4 bg-black/40 border border-white/10 rounded-xl flex items-center gap-2 hover:border-white/20 transition-colors min-w-[120px]"
                >
                  <span>{selectedToken.icon}</span>
                  <span className="text-sm font-medium">{selectedToken.symbol}</span>
                  <ChevronDown className={`w-3 h-3 text-gray-400 ${showTokenDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showTokenDropdown && (
                  <div className="absolute top-full left-0 mt-1 bg-[#1a1a24] border border-white/10 rounded-xl shadow-2xl z-10 overflow-hidden min-w-[160px]">
                    {BRIDGE_TOKENS.map(token => (
                      <button
                        key={token.symbol}
                        onClick={() => { setSelectedToken(token); setShowTokenDropdown(false); }}
                        className={`w-full p-3 flex items-center gap-2 hover:bg-white/5 transition-colors ${
                          selectedToken.symbol === token.symbol ? 'bg-white/5' : ''
                        }`}
                      >
                        <span>{token.icon}</span>
                        <span className="text-sm text-white">{token.symbol}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="flex-1 p-4 bg-black/40 border border-white/10 rounded-xl text-white font-mono text-sm placeholder:text-gray-700 focus:outline-none focus:border-orange-500/50 transition-colors"
              />
            </div>
          </div>

          {/* Estimate */}
          {estimating && (
            <div className="mb-5 p-4 bg-white/[0.02] border border-white/5 rounded-xl flex items-center gap-3">
              <Loader2 className="w-4 h-4 text-orange-400 animate-spin" />
              <span className="text-sm text-gray-400">Fetching best route via Sunrise...</span>
            </div>
          )}

          {estimate && !estimating && (
            <div className="mb-5 p-4 bg-orange-500/5 border border-orange-500/10 rounded-xl space-y-2.5">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-orange-400" />
                <span className="text-xs font-semibold text-orange-300">Sunrise Bridge Estimate</span>
              </div>
              {[
                { label: 'You receive', value: `${estimate.estimatedOutput} ${selectedToken.symbol}`, highlight: true },
                { label: 'Route', value: estimate.route },
                { label: 'Fee', value: estimate.fee },
                { label: 'Est. time', value: estimate.estimatedTime },
                { label: 'INX Bonus', value: estimate.sunriseBonus, highlight: true },
              ].map(item => (
                <div key={item.label} className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">{item.label}</span>
                  <span className={item.highlight ? 'text-orange-300 font-medium' : 'text-gray-300'}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Bridge Success */}
          {bridgeComplete && bridgeResult && (
            <div className="mb-5 p-5 bg-green-500/10 border border-green-500/20 rounded-xl">
              <div className="flex items-center gap-2 mb-4">
                <Check className="w-5 h-5 text-green-400" />
                <h4 className="font-semibold text-green-300">Bridge Successful!</h4>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-black/30 rounded-lg flex justify-between text-xs">
                  <span className="text-gray-500">Received</span>
                  <span className="text-white font-medium">{bridgeResult.amountReceived} {bridgeResult.token}</span>
                </div>
                <div className="p-3 bg-black/30 rounded-lg flex justify-between text-xs">
                  <span className="text-gray-500">Tx Hash</span>
                  <a href={`https://solscan.io/tx/${bridgeResult.txHash}`} target="_blank" rel="noopener noreferrer"
                    className="text-yellow-400 hover:text-yellow-300 flex items-center gap-1">
                    {bridgeResult.txHash} <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg flex justify-between text-xs">
                  <span className="text-orange-300">🌅 INX Bonus Earned</span>
                  <span className="text-orange-300 font-medium">{estimate?.sunriseBonus}</span>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Link href="/convert"
                  className="flex-1 py-2.5 text-center text-xs font-medium bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-300 hover:bg-yellow-500/20 transition-colors">
                  Convert Contracts →
                </Link>
                <Link href="/analytics"
                  className="flex-1 py-2.5 text-center text-xs font-medium bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:bg-white/10 transition-colors">
                  View Analytics →
                </Link>
              </div>
            </div>
          )}

          {/* Bridge Button */}
          <button
            onClick={handleBridge}
            disabled={isBridging || !publicKey || !amount || parseFloat(amount) <= 0}
            className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:from-gray-800 disabled:to-gray-800 text-black disabled:text-gray-500 font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed"
          >
            {isBridging ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Bridging via Sunrise…</>
            ) : (
              <><span className="text-lg">🌅</span> Bridge via Sunrise</>
            )}
          </button>
        </div>

        {/* How Sunrise Bridge Works */}
        <div className="mt-8 rounded-2xl bg-white/[0.02] border border-white/5 p-6">
          <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
            <Info className="w-4 h-4 text-orange-400" />
            How Sunrise Bridge Works
          </h3>
          <div className="space-y-4">
            {[
              { step: '1', title: 'Select source chain', desc: 'Choose the EVM chain where your assets currently live' },
              { step: '2', title: 'Sunrise routes your assets', desc: 'Sunrise finds the optimal cross-chain path via Mayan, Wormhole, or direct routes' },
              { step: '3', title: 'Assets arrive on Solana', desc: 'Receive your tokens on Solana + bonus INX rewards from Sunrise' },
            ].map(item => (
              <div key={item.step} className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-xs font-bold text-orange-400 shrink-0">
                  {item.step}
                </div>
                <div>
                  <div className="text-xs font-medium text-white">{item.title}</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          {[
            { icon: Shield, label: 'Non-custodial', sub: 'Your keys always' },
            { icon: Zap, label: 'INX Rewards', sub: 'Earn while bridging' },
            { icon: Activity, label: 'Multi-chain', sub: '6+ EVM chains' },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center">
              <Icon className="w-4 h-4 text-orange-500/60 mx-auto mb-2" />
              <div className="text-xs font-medium text-white">{label}</div>
              <div className="text-[10px] text-gray-600 mt-0.5">{sub}</div>
            </div>
          ))}
        </div>

        {/* Sunrise Ecosystem Partners */}
        <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-orange-500/5 to-yellow-500/5 border border-orange-500/10">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">Sunrise Ecosystem</h3>
          <p className="text-xs text-gray-500 mb-4">Assets bridged via Sunrise are instantly tradeable across the Solana ecosystem</p>
          <div className="flex flex-wrap gap-2">
            {['Jupiter', 'Phantom', 'Backpack', 'Orca', 'Drift', 'Mayan', 'Axiom'].map(partner => (
              <span key={partner} className="px-3 py-1.5 text-[10px] font-medium text-gray-400 bg-white/5 border border-white/5 rounded-full">
                {partner}
              </span>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
