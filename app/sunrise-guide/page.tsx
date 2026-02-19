'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, ArrowRight, ChevronRight, ExternalLink, BookOpen,
  Code, Wallet, BarChart3, Zap, Shield, Globe, CheckCircle2,
  Sparkles, Download, Copy, CheckCircle, Layers, GitBranch,
  ArrowUpRight
} from 'lucide-react';

const GUIDE_STEPS = [
  {
    id: 'overview',
    title: 'Understanding Sunrise',
    subtitle: 'What is Sunrise DeFi & why migrate?',
    icon: '🌅',
    content: {
      heading: 'What is Sunrise?',
      description: 'Sunrise brings newly listed assets to Solana from wherever they launch. It\'s a cross-chain asset bridging platform integrated across the entire Solana ecosystem — available on Jupiter, Phantom, Backpack, Orca, Drift, Mayan, and more.',
      benefits: [
        { title: 'Cross-Chain Liquidity', desc: 'Access tokens on Solana that launched on other chains, with deep liquidity aggregated from top DEXs' },
        { title: 'INX Token Rewards', desc: 'Earn INX (Sunrise\'s native token) when bridging assets — incentivizing migration to Solana' },
        { title: 'Ecosystem Integration', desc: 'Bridged assets are instantly tradeable on Jupiter, Orca, Phantom, Backpack, and 10+ apps' },
        { title: 'Sub-Minute Finality', desc: 'Solana\'s 400ms block times mean your bridged assets are available almost instantly' },
      ],
      cta: 'Next: Set Up Your Wallets →',
    },
  },
  {
    id: 'wallets',
    title: 'Wallet Setup',
    subtitle: 'Connect source & destination wallets',
    icon: '👛',
    content: {
      heading: 'Set Up Your Wallets',
      description: 'To migrate to Solana via Sunrise, you\'ll need wallets on both your source chain and Solana.',
      steps: [
        {
          title: 'Install a Solana Wallet',
          desc: 'Download Phantom or Solflare — the most popular Solana wallets. They support all SPL tokens and dApps.',
          links: [
            { label: 'Phantom', url: 'https://phantom.app/' },
            { label: 'Solflare', url: 'https://solflare.com/' },
          ],
        },
        {
          title: 'Fund with SOL',
          desc: 'You\'ll need a small amount of SOL (0.01-0.05) for transaction fees. Buy SOL on any exchange or use Sunrise to bridge it.',
          links: [],
        },
        {
          title: 'Connect Source Wallet',
          desc: 'Keep your EVM wallet (MetaMask, Rabby) ready. You\'ll need it to sign the bridge transaction from Ethereum/BSC/Polygon.',
          links: [
            { label: 'MetaMask', url: 'https://metamask.io/' },
          ],
        },
        {
          title: 'Connect to SolBridge',
          desc: 'Click "Connect Wallet" in the top right to link your Solana wallet to SolBridge. This is non-custodial — we never hold your keys.',
          links: [],
        },
      ],
      cta: 'Next: Bridge Your Assets →',
    },
  },
  {
    id: 'bridge',
    title: 'Bridge Assets',
    subtitle: 'Move your tokens to Solana via Sunrise',
    icon: '🌉',
    content: {
      heading: 'Bridge Assets via Sunrise',
      description: 'Use Sunrise\'s cross-chain bridge to move your EVM tokens to Solana. Sunrise aggregates the best routes via Mayan Finance, Wormhole, and direct bridges.',
      steps: [
        {
          title: 'Go to the Bridge Page',
          desc: 'Navigate to SolBridge\'s Bridge page — it\'s powered by Sunrise under the hood.',
          links: [{ label: 'Open Bridge', url: '/bridge' }],
        },
        {
          title: 'Select Source Chain & Token',
          desc: 'Choose Ethereum, BSC, Polygon, Arbitrum, Base, or Avalanche — and the token you want to bridge (USDC, ETH, etc.).',
          links: [],
        },
        {
          title: 'Enter Amount & Review Estimate',
          desc: 'Enter how much you want to bridge. Sunrise will find the optimal route with the lowest fees and show you a real-time estimate.',
          links: [],
        },
        {
          title: 'Approve & Bridge',
          desc: 'Confirm the transaction in your EVM wallet. Sunrise handles the cross-chain relay. Your tokens arrive on Solana in 1-5 minutes.',
          links: [],
        },
        {
          title: 'Earn INX Rewards',
          desc: 'Every bridge transaction via Sunrise earns you INX token bonuses. Trade INX on Jupiter or hold for governance.',
          links: [{ label: 'Trade INX on Jupiter', url: 'https://jup.ag/?buy=inxKXw9V2NDZE7hDijzpJaKKUb97NEPJDTCEEiYg4yY' }],
        },
      ],
      cta: 'Next: Convert Your Contracts →',
    },
  },
  {
    id: 'convert',
    title: 'Convert Contracts',
    subtitle: 'Transform Solidity to Rust/Anchor',
    icon: '⚡',
    content: {
      heading: 'Convert Smart Contracts',
      description: 'If you\'re migrating a project (not just assets), SolBridge\'s AI converter transforms your Solidity contracts to Rust/Anchor — the native Solana smart contract framework.',
      steps: [
        {
          title: 'Paste Your Solidity Code',
          desc: 'Go to the Convert page and paste your EVM contract. SolBridge supports any Solidity ^0.8.x contract.',
          links: [{ label: 'Open Converter', url: '/convert' }],
        },
        {
          title: 'AI Conversion (GPT-4)',
          desc: 'Our GPT-4 powered engine analyzes your contract, maps Solidity patterns to Anchor equivalents, and generates production-ready Rust code.',
          links: [],
        },
        {
          title: 'Review & Download',
          desc: 'Review the converted code side-by-side. Download the .rs file, copy to clipboard, or view the conversion summary (functions, structs, complexity).',
          links: [],
        },
        {
          title: 'Deploy to Solana',
          desc: 'Use Anchor CLI to deploy your converted contract to Solana devnet or mainnet. Test thoroughly before deploying to production.',
          links: [{ label: 'Anchor Docs', url: 'https://www.anchor-lang.com/' }],
        },
      ],
      cta: 'Next: List on Sunrise →',
    },
  },
  {
    id: 'list',
    title: 'List on Sunrise',
    subtitle: 'Make your token tradeable via Sunrise',
    icon: '🚀',
    content: {
      heading: 'List Your Token on Sunrise',
      description: 'Once your project is on Solana, make it discoverable on Sunrise so users from other chains can find and trade it.',
      steps: [
        {
          title: 'Create Liquidity Pool',
          desc: 'Set up a liquidity pool on Orca or Raydium for your SPL token. This provides the initial trading liquidity.',
          links: [
            { label: 'Orca', url: 'https://www.orca.so/' },
            { label: 'Raydium', url: 'https://raydium.io/' },
          ],
        },
        {
          title: 'Register on Jupiter',
          desc: 'Submit your token to the Jupiter Verified Token List. Once listed, it\'s automatically available on Sunrise\'s swap interface.',
          links: [{ label: 'Jupiter Token List', url: 'https://station.jup.ag/docs/token-list/token-list-api' }],
        },
        {
          title: 'Sunrise Auto-Discovery',
          desc: 'Sunrise automatically aggregates new Solana tokens. Once listed on Jupiter, your token becomes bridge-able from other chains via Sunrise.',
          links: [{ label: 'Sunrise Swap', url: 'https://www.sunrisedefi.com/' }],
        },
        {
          title: 'Promote Cross-Chain Access',
          desc: 'Tell your community they can now access your token on Solana via Sunrise — swappable from ETH, BSC, Polygon, and more.',
          links: [],
        },
      ],
      cta: 'Next: Monitor & Analyze →',
    },
  },
  {
    id: 'analytics',
    title: 'Monitor & Analyze',
    subtitle: 'Track your migration with real-time data',
    icon: '📊',
    content: {
      heading: 'Monitor Your Migration',
      description: 'Use SolBridge\'s analytics dashboard to track your migration progress, monitor on-chain activity, and verify everything is running smoothly.',
      steps: [
        {
          title: 'Real-Time Dashboard',
          desc: 'View live transaction data, success rates, program distribution, and volume charts — all from real Solana mainnet data.',
          links: [{ label: 'Open Analytics', url: '/analytics' }],
        },
        {
          title: 'Track Sunrise Activity',
          desc: 'Monitor INX trading volume, bridged asset stats, and cross-chain migration metrics within the analytics dashboard.',
          links: [],
        },
        {
          title: 'Verify Transactions',
          desc: 'Every transaction links directly to Solscan for full transparency. Verify your bridge transactions, contract deployments, and token transfers.',
          links: [{ label: 'Solscan', url: 'https://solscan.io/' }],
        },
        {
          title: 'Ongoing Optimization',
          desc: 'Use the Token Economics Optimizer to find the best bridges, optimal liquidity distribution, and estimated migration times.',
          links: [],
        },
      ],
      cta: 'Complete! Start Your Migration →',
    },
  },
];

export default function SunriseGuidePage() {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [copied, setCopied] = useState(false);

  const currentStep = GUIDE_STEPS[activeStep];
  const progress = ((completedSteps.size) / GUIDE_STEPS.length) * 100;

  const handleNext = () => {
    setCompletedSteps(prev => new Set([...prev, activeStep]));
    if (activeStep < GUIDE_STEPS.length - 1) {
      setActiveStep(activeStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleStepClick = (index: number) => {
    setActiveStep(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const migrationChecklist = `# SolBridge × Sunrise Migration Checklist

## Pre-Migration
- [ ] Install Solana wallet (Phantom/Solflare)
- [ ] Fund wallet with SOL for fees
- [ ] Have EVM wallet ready (MetaMask)

## Asset Migration
- [ ] Bridge assets via Sunrise (SolBridge Bridge page)
- [ ] Verify tokens received on Solana
- [ ] Check INX bonus rewards

## Contract Migration (if applicable)
- [ ] Paste Solidity contract in SolBridge Converter
- [ ] Review AI-converted Rust/Anchor code
- [ ] Test on devnet
- [ ] Deploy to mainnet

## Post-Migration
- [ ] Create liquidity pool (Orca/Raydium)
- [ ] Register token on Jupiter
- [ ] Verify on Solscan
- [ ] Announce to community
`;

  const copyChecklist = async () => {
    await navigator.clipboard.writeText(migrationChecklist);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-600/5 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-yellow-600/5 rounded-full blur-[128px]" />
      </div>

      <header className="border-b border-white/5 backdrop-blur-xl bg-black/40 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back</span>
            </Link>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-orange-500" />
              <h1 className="text-lg font-bold">Migration <span className="text-orange-400">Guide</span></h1>
            </div>
            <div className="w-16" />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-300 text-xs font-medium mb-4">
            <span className="text-sm">🌅</span> SolBridge × Sunrise Migration Guide
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            Migrate to Solana <span className="text-orange-400">Using Sunrise</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
            A complete step-by-step guide for projects migrating from EVM chains to Solana, 
            powered by Sunrise&apos;s cross-chain infrastructure.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span>Migration Progress</span>
            <span>{completedSteps.size} of {GUIDE_STEPS.length} steps</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <nav className="space-y-1">
              {GUIDE_STEPS.map((step, i) => (
                <button
                  key={step.id}
                  onClick={() => handleStepClick(i)}
                  className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all ${
                    activeStep === i
                      ? 'bg-orange-500/10 border border-orange-500/20'
                      : completedSteps.has(i)
                      ? 'bg-green-500/5 border border-green-500/10 hover:bg-green-500/10'
                      : 'bg-white/[0.02] border border-white/5 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 ${
                    completedSteps.has(i)
                      ? 'bg-green-500/20'
                      : activeStep === i
                      ? 'bg-orange-500/20'
                      : 'bg-white/5'
                  }`}>
                    {completedSteps.has(i) ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : step.icon}
                  </div>
                  <div className="min-w-0">
                    <div className={`text-xs font-medium truncate ${
                      activeStep === i ? 'text-orange-300' : completedSteps.has(i) ? 'text-green-300' : 'text-white'
                    }`}>{step.title}</div>
                    <div className="text-[10px] text-gray-600 truncate">{step.subtitle}</div>
                  </div>
                </button>
              ))}
            </nav>

            {/* Checklist Download */}
            <div className="mt-6 p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <h4 className="text-xs font-semibold text-gray-300 mb-2">Migration Checklist</h4>
              <p className="text-[10px] text-gray-600 mb-3">Copy the complete migration checklist</p>
              <button
                onClick={copyChecklist}
                className="w-full py-2 text-xs font-medium bg-orange-500/10 border border-orange-500/20 rounded-lg text-orange-300 hover:bg-orange-500/20 transition-colors flex items-center justify-center gap-1.5"
              >
                {copied ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied!' : 'Copy Checklist'}
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="min-w-0">
            <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">{currentStep.icon}</span>
                <div>
                  <div className="text-[10px] text-orange-400 font-medium uppercase tracking-wider">
                    Step {activeStep + 1} of {GUIDE_STEPS.length}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold">{currentStep.content.heading}</h3>
                </div>
              </div>

              <p className="text-sm text-gray-400 mb-8 leading-relaxed">
                {currentStep.content.description}
              </p>

              {/* Benefits (for overview step) */}
              {'benefits' in currentStep.content && currentStep.content.benefits && (
                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  {currentStep.content.benefits.map((benefit: any, i: number) => (
                    <div key={i} className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/10">
                      <h4 className="text-sm font-semibold text-orange-300 mb-1">{benefit.title}</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">{benefit.desc}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Steps */}
              {'steps' in currentStep.content && currentStep.content.steps && (
                <div className="space-y-4 mb-8">
                  {currentStep.content.steps.map((step: any, i: number) => (
                    <div key={i} className="flex gap-4 p-4 rounded-xl bg-black/20 border border-white/5">
                      <div className="w-7 h-7 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-xs font-bold text-orange-400 shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-white mb-1">{step.title}</h4>
                        <p className="text-xs text-gray-500 leading-relaxed mb-2">{step.desc}</p>
                        {step.links && step.links.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {step.links.map((link: any, j: number) => (
                              link.url.startsWith('/') ? (
                                <Link key={j} href={link.url}
                                  className="inline-flex items-center gap-1 text-[11px] text-orange-400 hover:text-orange-300 transition-colors">
                                  {link.label} <ArrowRight className="w-3 h-3" />
                                </Link>
                              ) : (
                                <a key={j} href={link.url} target="_blank" rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[11px] text-orange-400 hover:text-orange-300 transition-colors">
                                  {link.label} <ExternalLink className="w-3 h-3" />
                                </a>
                              )
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <button
                  onClick={() => activeStep > 0 && setActiveStep(activeStep - 1)}
                  disabled={activeStep === 0}
                  className="px-4 py-2 text-sm text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  ← Previous
                </button>

                {activeStep === GUIDE_STEPS.length - 1 ? (
                  <Link href="/bridge"
                    className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all hover:scale-[1.02] active:scale-[0.98]">
                    Start Migration <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                ) : (
                  <button
                    onClick={handleNext}
                    className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {currentStep.content.cta || 'Next Step'} <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div className="grid sm:grid-cols-3 gap-3 mt-6">
              {[
                { icon: '🌉', title: 'Bridge Assets', desc: 'Sunrise-powered bridging', href: '/bridge' },
                { icon: '⚡', title: 'Convert Code', desc: 'AI Solidity → Rust', href: '/convert' },
                { icon: '📊', title: 'Analytics', desc: 'Live Solana metrics', href: '/analytics' },
              ].map(link => (
                <Link key={link.href} href={link.href}
                  className="group p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-orange-500/20 hover:bg-white/[0.04] transition-all">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{link.icon}</span>
                    <div>
                      <div className="text-xs font-medium text-white group-hover:text-orange-300 transition-colors">{link.title}</div>
                      <div className="text-[10px] text-gray-600">{link.desc}</div>
                    </div>
                    <ArrowUpRight className="w-3 h-3 text-gray-600 ml-auto group-hover:text-orange-400" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
