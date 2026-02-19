'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import {
  ArrowRight, Code, Wallet, BarChart3, Zap, Shield, Sparkles,
  Activity, Globe, Layers, Menu, X, ChevronRight, CheckCircle2,
  GitBranch, ArrowUpRight, Clock, Users, TrendingUp, BookOpen
} from 'lucide-react';

export default function HomePage() {
  const { publicKey, connected } = useWallet();
  const [stats, setStats] = useState({ contractsMigrated: 0, walletsConnected: 0, successRate: 100 });
  const [isMounted, setIsMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [networkStats, setNetworkStats] = useState({ tps: 0, slot: 0, blockTime: 0 });

  useEffect(() => { setIsMounted(true); }, []);

  useEffect(() => {
    const fetchStats = () => {
      const storedContracts = parseInt(localStorage.getItem('contractsMigrated') || '0');
      const connectedWallets = JSON.parse(localStorage.getItem('connectedWallets') || '[]');
      const storedSuccesses = parseInt(localStorage.getItem('successfulMigrations') || '0');
      const storedTotal = parseInt(localStorage.getItem('totalMigrations') || '0');
      const successRate = storedTotal > 0 ? Math.round((storedSuccesses / storedTotal) * 100) : 100;
      setStats({ contractsMigrated: storedContracts, walletsConnected: connectedWallets.length, successRate });
    };
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (connected && publicKey) {
      const addr = publicKey.toString();
      const wallets = JSON.parse(localStorage.getItem('connectedWallets') || '[]');
      if (!wallets.includes(addr)) {
        wallets.push(addr);
        localStorage.setItem('connectedWallets', JSON.stringify(wallets));
        setStats(prev => ({ ...prev, walletsConnected: wallets.length }));
      }
    }
  }, [connected, publicKey]);

  useEffect(() => {
    const fetchNetwork = async () => {
      try {
        const res = await fetch('/api/network-stats');
        const data = await res.json();
        if (data.success) setNetworkStats(data);
      } catch { /* silent */ }
    };
    fetchNetwork();
    const interval = setInterval(fetchNetwork, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white overflow-x-hidden">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-600/5 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-600/5 rounded-full blur-[128px]" />
      </div>

      {/* Navbar */}
      <header className="z-50 border-b border-white/5 backdrop-blur-xl bg-black/40 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center shadow-lg shadow-yellow-500/20 group-hover:shadow-yellow-500/40 transition-shadow">
                <Sparkles className="w-4 h-4 text-black" />
              </div>
              <span className="text-xl font-bold tracking-tight">Sol<span className="text-yellow-400">Bridge</span></span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {[
                { label: 'Bridge', href: '/bridge', icon: Globe },
                { label: 'Convert', href: '/convert', icon: Code },
                { label: 'Migrate', href: '/migrate', icon: GitBranch },
                { label: 'Analytics', href: '/analytics', icon: BarChart3 },
                { label: 'Guide', href: '/sunrise-guide', icon: BookOpen },
              ].map(item => (
                <Link key={item.href} href={item.href}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-all">
                  <item.icon className="w-3.5 h-3.5" />
                  {item.label}
                </Link>
              ))}
              <div className="ml-3 pl-3 border-l border-white/10">
                {isMounted && <WalletMultiButton />}
              </div>
            </nav>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white transition-colors" aria-label="Toggle menu">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/5 bg-black/95 backdrop-blur-xl animate-fade-in">
            <div className="p-4 space-y-1">
              {[
                { label: 'Bridge via Sunrise', href: '/bridge', icon: Globe, desc: 'Cross-chain asset bridging' },
                { label: 'Convert Contracts', href: '/convert', icon: Code, desc: 'AI-powered Solidity → Rust' },
                { label: 'Migrate Wallets', href: '/migrate', icon: GitBranch, desc: 'Cross-chain asset transfer' },
                { label: 'Analytics', href: '/analytics', icon: BarChart3, desc: 'Live blockchain metrics' },
                { label: 'Migration Guide', href: '/sunrise-guide', icon: BookOpen, desc: 'Step-by-step Sunrise guide' },
              ].map(item => (
                <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group">
                  <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white group-hover:text-yellow-300 transition-colors">{item.label}</div>
                    <div className="text-xs text-gray-500">{item.desc}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-600 shrink-0" />
                </Link>
              ))}
              <div className="pt-3 border-t border-white/5">{isMounted && <WalletMultiButton />}</div>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative pt-16 sm:pt-24 pb-16 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-300 text-xs font-medium mb-8 animate-fade-in">
              <span className="text-sm">🌅</span>
              SolBridge × Sunrise — Migrations Track
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 animate-slide-up">
              <span className="text-white">Migrate to </span>
              <span className="bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-600 bg-clip-text text-transparent">Solana</span>
              <br />
              <span className="text-gray-500 text-3xl sm:text-4xl md:text-5xl lg:text-6xl">in minutes, not months</span>
            </h1>

            <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
              AI-powered smart contract conversion, cross-chain asset bridging via Sunrise,
              and real-time analytics — the complete EVM → Solana migration toolkit.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link href="/bridge"
                className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-600 text-black font-bold rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all hover:scale-[1.02] active:scale-[0.98]">
                🌅 Bridge via Sunrise
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link href="/sunrise-guide"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-medium rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]">
                <BookOpen className="w-4 h-4" /> Migration Guide
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mt-10 text-xs text-gray-500 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> Non-custodial</span>
              <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-yellow-500" /> Security-first</span>
              <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-amber-500" /> Powered by GPT-4</span>
              <span className="flex items-center gap-1.5"><span className="text-sm">🌅</span> Powered by Sunrise</span>
            </div>
          </div>
        </div>
      </section>

      {/* Live Network Bar */}
      <section className="relative border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap justify-center gap-6 sm:gap-12 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-gray-500">Solana Mainnet</span>
              <span className="text-white font-mono font-medium">{networkStats.tps > 0 ? `${networkStats.tps.toLocaleString()} TPS` : 'Live'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-gray-500" />
              <span className="text-gray-500">Block Time</span>
              <span className="text-white font-mono font-medium">{networkStats.blockTime > 0 ? `${networkStats.blockTime.toFixed(0)}ms` : '~400ms'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-gray-500" />
              <span className="text-gray-500">Slot</span>
              <span className="text-white font-mono font-medium">{networkStats.slot > 0 ? networkStats.slot.toLocaleString() : '—'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-gray-500" />
              <span className="text-gray-500">Migrations</span>
              <span className="text-white font-mono font-medium">{stats.contractsMigrated}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Everything you need to <span className="text-yellow-400">migrate</span></h2>
            <p className="text-gray-400 max-w-2xl mx-auto">A comprehensive toolkit for moving your EVM projects to Solana&apos;s high-performance blockchain.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Globe, title: 'Sunrise Bridge', desc: 'Bridge assets from 6+ EVM chains to Solana via Sunrise. Earn INX rewards, lowest fees, sub-minute finality.', href: '/bridge', color: 'text-orange-400', bg: 'bg-orange-500/10', tag: 'Sunrise' },
              { icon: Code, title: 'AI Contract Converter', desc: 'GPT-4 powered Solidity → Rust/Anchor conversion with side-by-side diff, complexity analysis, and downloadable output.', href: '/convert', color: 'text-yellow-400', bg: 'bg-yellow-500/10', tag: 'Core' },
              { icon: GitBranch, title: 'Wallet Migration', desc: 'Connect MetaMask and Phantom simultaneously. Transfer tokens and NFTs across chains via Sunrise with fee optimization.', href: '/migrate', color: 'text-amber-400', bg: 'bg-amber-500/10', tag: 'Core' },
              { icon: BarChart3, title: 'Live Analytics', desc: 'Real-time dashboard with live Solana mainnet data. Track transactions, Sunrise metrics, and program activity.', href: '/analytics', color: 'text-green-400', bg: 'bg-green-500/10', tag: 'Dashboard' },
              { icon: BookOpen, title: 'Migration Guide', desc: 'Step-by-step interactive guide for migrating your project to Solana using Sunrise. Complete with checklist.', href: '/sunrise-guide', color: 'text-purple-400', bg: 'bg-purple-500/10', tag: 'Guide' },
              { icon: Shield, title: 'Security Audit', desc: 'Automated security analysis of converted contracts. Detect reentrancy, overflow, and access control vulnerabilities.', href: '/convert', color: 'text-red-400', bg: 'bg-red-500/10', tag: 'Security' },
            ].map((f, i) => (
              <Link key={i} href={f.href} className="group relative">
                <div className="h-full p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-yellow-500/20 hover:bg-white/[0.04] transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl ${f.bg} flex items-center justify-center`}>
                      <f.icon className={`w-5 h-5 ${f.color}`} />
                    </div>
                    <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded-full">{f.tag}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-yellow-300 transition-colors">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                  <div className="mt-4 flex items-center gap-1 text-xs text-yellow-500/70 group-hover:text-yellow-400 transition-colors">
                    <span>Explore</span><ArrowUpRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-20 sm:py-28 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">How it <span className="text-orange-400">works</span></h2>
            <p className="text-gray-400 max-w-xl mx-auto">Four simple steps to migrate your EVM project to Solana using Sunrise.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Bridge via Sunrise', desc: 'Bridge your assets from any EVM chain to Solana using Sunrise\'s cross-chain routes + INX rewards.', icon: Globe },
              { step: '02', title: 'Convert Contracts', desc: 'GPT-4 analyzes your Solidity contract and generates production-ready Rust/Anchor code.', icon: Code },
              { step: '03', title: 'Migrate & Deploy', desc: 'Transfer remaining assets, deploy converted contracts, and list on Sunrise.', icon: Zap },
              { step: '04', title: 'Monitor & Grow', desc: 'Track everything with real-time analytics. Your token is now tradeable via Sunrise ecosystem.', icon: BarChart3 },
            ].map((s, i) => (
              <div key={i} className="relative text-center">
                <div className="text-7xl font-black text-white/[0.03] absolute -top-4 left-1/2 -translate-x-1/2 select-none pointer-events-none">{s.step}</div>
                <div className="relative pt-8">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 flex items-center justify-center mx-auto mb-5">
                    <s.icon className="w-6 h-6 text-yellow-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">{s.desc}</p>
                </div>
                {i < 3 && <div className="hidden md:block absolute top-16 -right-4 w-8 text-yellow-600/20"><ChevronRight className="w-8 h-8" /></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative py-20 sm:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              { value: stats.contractsMigrated.toString(), label: 'Contracts Converted', icon: Code },
              { value: stats.walletsConnected.toString(), label: 'Wallets Connected', icon: Users },
              { value: `${stats.successRate}%`, label: 'Success Rate', icon: TrendingUp },
              { value: networkStats.tps > 0 ? Math.round(networkStats.tps).toLocaleString() : '4,000+', label: 'Solana TPS', icon: Zap },
            ].map((s, i) => (
              <div key={i} className="text-center p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                <s.icon className="w-5 h-5 text-yellow-500/50 mx-auto mb-3" />
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent mb-1">{s.value}</div>
                <div className="text-[11px] sm:text-xs text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
          {connected && (
            <div className="mt-8 text-center animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-300 text-sm font-medium">Connected: {publicKey?.toString().slice(0, 4)}...{publicKey?.toString().slice(-4)}</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Sunrise Partnership */}
      <section className="relative py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-orange-500/5 to-yellow-500/5 border border-orange-500/10">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-300 text-xs font-medium mb-4">
                  <span>🌅</span> Powered by Sunrise
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Cross-Chain Migration with Sunrise</h2>
                <p className="text-sm text-gray-400 mb-6 max-w-lg">Sunrise brings newly listed assets to Solana from wherever they launch. SolBridge integrates Sunrise&apos;s cross-chain infrastructure to give you the smoothest migration experience — with INX token rewards on every bridge.</p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-6">
                  {['Jupiter', 'Phantom', 'Backpack', 'Orca', 'Drift', 'Mayan'].map(p => (
                    <span key={p} className="px-3 py-1 text-[10px] font-medium text-gray-400 bg-white/5 border border-white/5 rounded-full">{p}</span>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                  <Link href="/bridge" className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-black font-bold rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all hover:scale-[1.02] active:scale-[0.98]">
                    🌅 Start Bridging <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                  <a href="https://www.sunrisedefi.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium rounded-xl transition-all">
                    Learn about Sunrise <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 shrink-0">
                {[
                  { value: '6+', label: 'EVM Chains', color: 'orange' },
                  { value: '0.1%', label: 'Bridge Fee', color: 'green' },
                  { value: '<5min', label: 'Bridge Time', color: 'yellow' },
                  { value: 'INX', label: 'Rewards', color: 'amber' },
                ].map((s, i) => (
                  <div key={i} className="text-center p-4 rounded-xl bg-black/30 border border-white/5">
                    <div className={`text-xl font-bold text-${s.color}-400`}>{s.value}</div>
                    <div className="text-[10px] text-gray-500">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 sm:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-yellow-500/5 to-amber-500/5 border border-yellow-500/10">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to bridge to Solana?</h2>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto">Join developers migrating to Solana with Sunrise. Non-custodial, AI-powered, and built for production.</p>
            {publicKey ? (
              <Link href="/bridge"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-600 text-black font-bold rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all hover:scale-[1.02] active:scale-[0.98]">
                🌅 Bridge via Sunrise <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <p className="text-orange-300/70 text-sm">Connect your wallet to get started</p>
                {isMounted && <WalletMultiButton />}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 bg-black/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-black" />
              </div>
              <span className="text-sm text-gray-500">SolBridge © 2026</span>
            </div>
            <div className="flex items-center gap-6 text-xs text-gray-600">
              <Link href="/bridge" className="hover:text-gray-400 transition-colors">Bridge</Link>
              <Link href="/convert" className="hover:text-gray-400 transition-colors">Convert</Link>
              <Link href="/migrate" className="hover:text-gray-400 transition-colors">Migrate</Link>
              <Link href="/analytics" className="hover:text-gray-400 transition-colors">Analytics</Link>
              <Link href="/sunrise-guide" className="hover:text-gray-400 transition-colors">Guide</Link>
              <a href="https://www.sunrisedefi.com/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors">Sunrise</a>
              <a href="https://github.com/edoh-Onuh/solbridge" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors">GitHub</a>
            </div>
            <div className="text-xs text-gray-600">SolBridge × Sunrise — Migrations Track</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
