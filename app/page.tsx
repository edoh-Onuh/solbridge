'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { ArrowRight, Code, Wallet, Database, BarChart3, Zap, Shield, Sparkles, Activity } from 'lucide-react';

export default function HomePage() {
  const { publicKey, connected } = useWallet();
  const [stats, setStats] = useState({
    contractsMigrated: 0,
    walletsConnected: 0,
    successRate: 0,
    totalValue: 0,
  });
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatch by only rendering wallet button on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Admin: Reset stats with Ctrl+Shift+R
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'R') {
        e.preventDefault();
        if (confirm('Reset all statistics? This will clear conversion history.')) {
          localStorage.removeItem('contractsMigrated');
          localStorage.removeItem('walletsConnected');
          localStorage.removeItem('successfulMigrations');
          localStorage.removeItem('totalMigrations');
          localStorage.removeItem('connectedWallets');
          setStats({
            contractsMigrated: 0,
            walletsConnected: 0,
            successRate: 100,
            totalValue: 0,
          });
          alert('✅ Statistics reset successfully!');
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Fetch live stats from localStorage and simulate real-time data
  useEffect(() => {
    const fetchStats = () => {
      // Get stored stats from localStorage
      const storedContracts = parseInt(localStorage.getItem('contractsMigrated') || '0');
      const storedWallets = parseInt(localStorage.getItem('walletsConnected') || '0');
      const storedSuccesses = parseInt(localStorage.getItem('successfulMigrations') || '0');
      const storedTotal = parseInt(localStorage.getItem('totalMigrations') || '0');
      
      // Calculate success rate
      const successRate = storedTotal > 0 
        ? Math.round((storedSuccesses / storedTotal) * 100) 
        : 100;

      setStats({
        contractsMigrated: storedContracts,
        walletsConnected: storedWallets,
        successRate,
        totalValue: storedTotal * 12450, // Average $12,450 per migration
      });
      setIsLoading(false);
    };

    fetchStats();
    
    // Update stats every 5 seconds to show real-time changes
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  // Track wallet connection
  useEffect(() => {
    if (connected && publicKey) {
      const walletAddress = publicKey.toString();
      const connectedWallets = JSON.parse(localStorage.getItem('connectedWallets') || '[]');
      
      // Only count unique wallets
      if (!connectedWallets.includes(walletAddress)) {
        connectedWallets.push(walletAddress);
        localStorage.setItem('connectedWallets', JSON.stringify(connectedWallets));
        localStorage.setItem('walletsConnected', connectedWallets.length.toString());
        
        // Update stats immediately
        setStats(prev => ({
          ...prev,
          walletsConnected: connectedWallets.length,
        }));
      }
    }
  }, [connected, publicKey]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Header */}
      <header className="border-b border-yellow-600/30 backdrop-blur-sm bg-black/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-8 h-8 text-yellow-500" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
                SolBridge
              </h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/convert" className="text-gray-300 hover:text-white transition-colors">
                Convert
              </Link>
              <Link href="/migrate" className="text-gray-300 hover:text-white transition-colors">
                Migrate
              </Link>
              <Link href="/analytics" className="text-gray-300 hover:text-white transition-colors">
                Analytics
              </Link>
              {isMounted && <WalletMultiButton />}
            </nav>
            <div className="md:hidden">
              {isMounted && <WalletMultiButton />}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-20">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 rounded-full bg-yellow-600/20 border border-yellow-500/30 text-yellow-300 text-sm font-medium">
              🚀 Built for Solana Graveyard Hackathon 2026
            </span>
          </div>
          <h2 className="text-5xl sm:text-6xl font-extrabold text-white mb-6 leading-tight">
            Universal <span className="bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-600 bg-clip-text text-transparent">EVM→Solana</span><br />
            Migration Suite
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            AI-powered smart contract conversion, automated state migration, and seamless wallet transfer. 
            Migrate your entire EVM ecosystem to Solana in minutes, not months.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/convert"
              className="px-8 py-4 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-black font-bold rounded-lg transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg shadow-yellow-500/50"
            >
              Start Converting <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/analytics"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-lg transition-all backdrop-blur-sm flex items-center gap-2"
            >
              View Analytics <BarChart3 className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          <FeatureCard
            icon={<Code className="w-10 h-10 text-yellow-400" />}
            title="AI Smart Contract Converter"
            description="Convert Solidity contracts to Rust/Anchor with GPT-4 powered analysis. Side-by-side diff view and automated testing."
            link="/convert"
          />
          <FeatureCard
            icon={<Wallet className="w-10 h-10 text-amber-400" />}
            title="One-Click Wallet Migration"
            description="Transfer assets from EVM wallets (MetaMask) to Solana wallets (Phantom) with bridge integration and fee optimization."
            link="/migrate"
          />
          <FeatureCard
            icon={<Database className="w-10 h-10 text-pink-400" />}
            title="Automated State Migration"
            description="Transform and migrate contract state with schema mapping, data validation, and rollback protection."
            link="/migrate"
          />
          <FeatureCard
            icon={<BarChart3 className="w-10 h-10 text-green-400" />}
            title="Live Migration Analytics"
            description="Real-time dashboard tracking migrations, success rates, gas optimization, and cross-chain activity."
            link="/analytics"
          />
          <FeatureCard
            icon={<Zap className="w-10 h-10 text-yellow-400" />}
            title="Token Economics Optimizer"
            description="Calculate optimal liquidity distribution, bridge selection, and fee structures for your token migration."
            link="/analytics"
          />
          <FeatureCard
            icon={<Shield className="w-10 h-10 text-red-400" />}
            title="Security-First Architecture"
            description="Comprehensive security checks, audit logging, and transaction verification for every migration step."
            link="/convert"
          />
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-sm border border-yellow-600/30 rounded-2xl p-6 sm:p-10 mb-12 sm:mb-20">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Activity className={`w-5 h-5 ${isLoading ? 'text-gray-400' : 'text-yellow-400 animate-pulse'}`} />
            <span className="text-sm text-gray-400">
              {isLoading ? 'Loading stats...' : 'Live Statistics'}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-center">
            <StatCard 
              number={stats.contractsMigrated.toString()} 
              label="Contracts Migrated" 
              isLive={!isLoading}
            />
            <StatCard 
              number={connected ? stats.walletsConnected.toString() : '0'} 
              label="Wallets Connected" 
              highlight={connected}
              isLive={!isLoading}
            />
            <StatCard 
              number={`${stats.successRate}%`} 
              label="Success Rate" 
              isLive={!isLoading}
            />
          </div>
          {connected && (
            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-600/20 border border-green-500/30 rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-green-200 text-sm">
                  Your wallet is counted: {publicKey?.toString().slice(0, 4)}...{publicKey?.toString().slice(-4)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-yellow-600/20 to-amber-600/20 backdrop-blur-sm border border-yellow-500/30 rounded-2xl p-12">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Migrate to Solana?
          </h3>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join the next generation of blockchain with lightning-fast transactions, 
            minimal fees, and unparalleled scalability.
          </p>
          {publicKey ? (
            <Link 
              href="/convert"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-white font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-yellow-500/50"
            >
              Start Your Migration <ArrowRight className="w-5 h-5" />
            </Link>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <p className="text-yellow-300 text-sm">Connect your wallet to get started</p>
              <WalletMultiButton />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-yellow-800/30 mt-20 py-8 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-6 h-6 text-yellow-500" />
              <span className="text-gray-400">SolBridge © 2026</span>
            </div>
            <div className="text-gray-400 text-sm">
              Built for Solana Graveyard Hackathon | Migrations Track
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, link }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  link: string;
}) {
  return (
    <Link href={link} className="group">
      <div className="h-full p-6 bg-gradient-to-br from-yellow-900/20 to-amber-900/20 backdrop-blur-sm border border-yellow-700/30 rounded-xl hover:border-yellow-500/50 transition-all hover:scale-105 hover:shadow-xl hover:shadow-yellow-500/20">
        <div className="mb-4">{icon}</div>
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-300 transition-colors">
          {title}
        </h3>
        <p className="text-gray-400 leading-relaxed">{description}</p>
      </div>
    </Link>
  );
}

function StatCard({ number, label, highlight, isLive }: { 
  number: string; 
  label: string; 
  highlight?: boolean;
  isLive?: boolean;
}) {
  return (
    <div className={`transition-all duration-300 ${highlight ? 'scale-110' : ''}`}>
      <div className={`text-3xl sm:text-4xl font-bold bg-gradient-to-r ${
        highlight 
          ? 'from-yellow-400 to-amber-400' 
          : 'from-yellow-400 to-amber-500'
      } bg-clip-text text-transparent mb-2 ${isLive ? 'animate-pulse-glow' : ''}`}>
        {number}
      </div>
      <div className={`text-sm sm:text-base ${highlight ? 'text-green-300 font-semibold' : 'text-gray-400'}`}>
        {label}
      </div>
    </div>
  );
}
