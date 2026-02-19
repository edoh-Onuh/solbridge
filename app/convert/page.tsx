'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Code, Download, Sparkles, Loader2, Check,
  AlertTriangle, Copy, CheckCircle, FileCode2, ArrowRight, ExternalLink
} from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Toast { id: number; message: string; type: 'success' | 'error' | 'info'; }

export default function ConvertPage() {
  const [solidityCode, setSolidityCode] = useState('');
  const [rustCode, setRustCode] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState('');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [copied, setCopied] = useState(false);
  const [conversionStats, setConversionStats] = useState<{
    functions: number; structs: number; events: number; complexity: string;
  } | null>(null);

  const addToast = (message: string, type: Toast['type']) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const copyToClipboard = async () => {
    if (!rustCode) return;
    await navigator.clipboard.writeText(rustCode);
    setCopied(true);
    addToast('Copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConvert = async () => {
    if (!solidityCode.trim()) { addToast('Paste Solidity code first', 'error'); return; }
    setIsConverting(true); setError(''); setRustCode('');
    addToast('Converting…', 'info');

    try {
      const res = await fetch('/api/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ solidityCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Conversion failed');

      setRustCode(data.rustCode);
      setConversionStats(data.stats);
      addToast('Conversion successful! 🎉', 'success');

      const tm = parseInt(localStorage.getItem('totalMigrations') || '0') + 1;
      const sm = parseInt(localStorage.getItem('successfulMigrations') || '0') + 1;
      const cm = parseInt(localStorage.getItem('contractsMigrated') || '0') + 1;
      localStorage.setItem('totalMigrations', tm.toString());
      localStorage.setItem('successfulMigrations', sm.toString());
      localStorage.setItem('contractsMigrated', cm.toString());
    } catch (err: any) {
      const msg = err.message || 'Conversion failed';
      setError(msg);
      addToast(msg, 'error');
      const tm = parseInt(localStorage.getItem('totalMigrations') || '0') + 1;
      localStorage.setItem('totalMigrations', tm.toString());
    } finally { setIsConverting(false); }
  };

  const handleDownload = () => {
    const blob = new Blob([rustCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'contract.rs';
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
    addToast('Downloaded contract.rs', 'success');
  };

  const sampleContract = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleVault {
    mapping(address => uint256) public balances;
    address public owner;

    event Deposit(address indexed user, uint256 amount);
    event Withdrawal(address indexed user, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    function deposit() public payable {
        require(msg.value > 0, "Must deposit something");
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
        emit Withdrawal(msg.sender, amount);
    }

    function getBalance() public view returns (uint256) {
        return balances[msg.sender];
    }
}`;

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      {/* Header */}
      <header className="border-b border-white/5 backdrop-blur-xl bg-black/40 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back</span>
            </Link>
            <div className="flex items-center gap-2">
              <Code className="w-5 h-5 text-yellow-500" />
              <h1 className="text-lg font-bold">AI Converter</h1>
            </div>
            <div className="w-16" /> {/* Spacer */}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 text-xs mb-6">
          <Sparkles className="w-3 h-3" /> GPT-4 powered · Anchor best practices
        </div>

        {/* Editor grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-yellow-500/50" /> Solidity Input
              </h2>
              <button onClick={() => setSolidityCode(sampleContract)}
                className="text-[11px] px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors">
                Load Sample
              </button>
            </div>
            <textarea
              value={solidityCode}
              onChange={e => setSolidityCode(e.target.value)}
              placeholder="Paste your Solidity contract here…"
              spellCheck={false}
              className="w-full h-[420px] sm:h-[520px] p-4 bg-black/40 border border-white/10 rounded-xl text-sm font-mono resize-none text-gray-300 placeholder:text-gray-700 focus:outline-none focus:border-yellow-500/30 transition-colors"
            />
            <button onClick={handleConvert}
              disabled={isConverting || !solidityCode.trim()}
              className="w-full py-3.5 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 disabled:from-gray-800 disabled:to-gray-800 text-black disabled:text-gray-500 font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed">
              {isConverting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Converting…</>
              ) : (
                <><Sparkles className="w-4 h-4" /> Convert to Rust/Anchor</>
              )}
            </button>
          </div>

          {/* Output */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                <Code className="w-4 h-4 text-amber-500/50" /> Rust / Anchor Output
              </h2>
              {rustCode && (
                <div className="flex gap-1.5">
                  <button onClick={copyToClipboard}
                    className="text-[11px] px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors flex items-center gap-1">
                    {copied ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                  <button onClick={handleDownload}
                    className="text-[11px] px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors flex items-center gap-1">
                    <Download className="w-3 h-3" /> .rs
                  </button>
                </div>
              )}
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5" />
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            {rustCode ? (
              <SyntaxHighlighter language="rust" style={vscDarkPlus}
                className="rounded-xl border border-white/10 max-h-[420px] sm:max-h-[520px] overflow-auto"
                customStyle={{ margin: 0, padding: '1rem', fontSize: '0.8rem', background: 'rgba(0,0,0,0.4)' }}>
                {rustCode}
              </SyntaxHighlighter>
            ) : (
              <div className="h-[420px] sm:h-[520px] flex items-center justify-center bg-black/20 border border-white/5 rounded-xl">
                <div className="text-center text-gray-700">
                  <Code className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p className="text-sm">Output appears here</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Conversion stats */}
        {conversionStats && (
          <div className="p-5 rounded-2xl bg-green-500/5 border border-green-500/10 mb-8">
            <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2 mb-4">
              <Check className="w-4 h-4 text-green-400" /> Conversion Summary
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Functions', value: conversionStats.functions, color: 'yellow' },
                { label: 'Structs', value: conversionStats.structs, color: 'amber' },
                { label: 'Events', value: conversionStats.events, color: 'pink' },
                { label: 'Complexity', value: conversionStats.complexity, color: 'green' },
              ].map(s => (
                <div key={s.label} className="p-3 bg-black/30 rounded-xl">
                  <div className={`text-xl font-bold text-${s.color}-400`}>{s.value}</div>
                  <div className="text-[11px] text-gray-500">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { title: 'Best Practices', desc: 'Follows Anchor conventions & Solana security patterns' },
            { title: 'Manual Review', desc: 'Always audit and test before deploying to mainnet' },
            { title: 'Gas → Compute', desc: "Automatic optimization for Solana\u2019s compute model" },
          ].map(t => (
            <div key={t.title} className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="text-xs font-medium text-white mb-1">{t.title}</div>
              <div className="text-[11px] text-gray-500">{t.desc}</div>
            </div>
          ))}
        </div>

        {/* Sunrise Next Steps */}
        <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-orange-500/5 to-yellow-500/5 border border-orange-500/10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🌅</span>
            <div>
              <h3 className="text-sm font-semibold text-orange-300">Next: Bridge & Deploy with Sunrise</h3>
              <p className="text-xs text-gray-500">Your contract is converted! Now bridge your assets to Solana and deploy.</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            <Link href="/bridge" className="p-4 rounded-xl bg-black/30 border border-orange-500/10 hover:border-orange-500/30 transition-colors group">
              <div className="text-lg mb-1">🌉</div>
              <div className="text-xs font-semibold text-white group-hover:text-orange-300 transition-colors">Bridge Assets</div>
              <div className="text-[10px] text-gray-600 mt-0.5">Move tokens via Sunrise</div>
            </Link>
            <Link href="/migrate" className="p-4 rounded-xl bg-black/30 border border-white/5 hover:border-orange-500/30 transition-colors group">
              <div className="text-lg mb-1">🔄</div>
              <div className="text-xs font-semibold text-white group-hover:text-orange-300 transition-colors">Migrate Wallets</div>
              <div className="text-[10px] text-gray-600 mt-0.5">Transfer full wallet state</div>
            </Link>
            <Link href="/sunrise-guide" className="p-4 rounded-xl bg-black/30 border border-white/5 hover:border-orange-500/30 transition-colors group">
              <div className="text-lg mb-1">📚</div>
              <div className="text-xs font-semibold text-white group-hover:text-orange-300 transition-colors">Full Guide</div>
              <div className="text-[10px] text-gray-600 mt-0.5">Step-by-step migration</div>
            </Link>
          </div>
        </div>
      </main>

      {/* Toasts */}
      <div className="fixed bottom-4 right-4 left-4 sm:left-auto z-50 space-y-2">
        {toasts.map(toast => (
          <div key={toast.id}
            className={`px-4 py-3 rounded-xl shadow-2xl backdrop-blur-sm flex items-center gap-2 w-full sm:min-w-[280px] sm:max-w-[360px] sm:ml-auto text-xs font-medium ${
              toast.type === 'success' ? 'bg-green-900/90 border border-green-500/30 text-green-200' :
              toast.type === 'error' ? 'bg-red-900/90 border border-red-500/30 text-red-200' :
              'bg-blue-900/90 border border-blue-500/30 text-blue-200'
            }`}>
            {toast.type === 'success' && <CheckCircle className="w-4 h-4 flex-shrink-0" />}
            {toast.type === 'error' && <AlertTriangle className="w-4 h-4 flex-shrink-0" />}
            {toast.type === 'info' && <Loader2 className="w-4 h-4 flex-shrink-0 animate-spin" />}
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
}
