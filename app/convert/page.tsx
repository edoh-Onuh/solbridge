'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Code, Download, Sparkles, Loader2, Check, AlertTriangle } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function ConvertPage() {
  const [solidityCode, setSolidityCode] = useState('');
  const [rustCode, setRustCode] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState('');
  const [conversionStats, setConversionStats] = useState<{
    functions: number;
    structs: number;
    events: number;
    complexity: string;
  } | null>(null);

  const handleConvert = async () => {
    if (!solidityCode.trim()) {
      setError('Please enter Solidity code to convert');
      return;
    }

    setIsConverting(true);
    setError('');
    setRustCode('');

    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ solidityCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Conversion failed');
      }

      setRustCode(data.rustCode);
      setConversionStats(data.stats);
      
      // Track successful conversion in localStorage
      const totalMigrations = parseInt(localStorage.getItem('totalMigrations') || '0') + 1;
      const successfulMigrations = parseInt(localStorage.getItem('successfulMigrations') || '0') + 1;
      const contractsMigrated = parseInt(localStorage.getItem('contractsMigrated') || '0') + 1;
      
      localStorage.setItem('totalMigrations', totalMigrations.toString());
      localStorage.setItem('successfulMigrations', successfulMigrations.toString());
      localStorage.setItem('contractsMigrated', contractsMigrated.toString());
      
    } catch (err: any) {
      setError(err.message || 'Failed to convert contract. Please try again.');
      
      // Track failed conversion
      const totalMigrations = parseInt(localStorage.getItem('totalMigrations') || '0') + 1;
      localStorage.setItem('totalMigrations', totalMigrations.toString());
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([rustCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contract.rs';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Header */}
      <header className="border-b border-yellow-600/30 backdrop-blur-sm bg-black/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
            <div className="flex items-center space-x-2">
              <Code className="w-6 h-6 text-yellow-500" />
              <h1 className="text-xl font-bold text-white">Smart Contract Converter</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Info Banner */}
        <div className="mb-8 p-4 bg-yellow-600/20 border border-yellow-500/30 rounded-lg flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-yellow-400 mt-0.5" />
          <div>
            <h3 className="font-semibold text-white mb-1">AI-Powered Conversion</h3>
            <p className="text-sm text-gray-300">
              Our GPT-4 engine analyzes your Solidity contract and generates equivalent Rust/Anchor code with security best practices.
            </p>
          </div>
        </div>

        {/* Conversion Interface */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Input Side */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Code className="w-6 h-6 text-yellow-400" />
                Solidity Contract
              </h2>
              <button
                onClick={() => setSolidityCode(sampleContract)}
                className="text-sm px-4 py-2 bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-500/30 text-yellow-300 rounded-lg transition-all"
              >
                Load Sample
              </button>
            </div>
            <textarea
              value={solidityCode}
              onChange={(e) => setSolidityCode(e.target.value)}
              placeholder="Paste your Solidity contract here..."
              className="w-full h-[600px] p-4 bg-gray-900/50 border border-yellow-700/30 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-yellow-500/50 resize-none"
              spellCheck={false}
            />
            <button
              onClick={handleConvert}
              disabled={isConverting || !solidityCode.trim()}
              className="w-full py-4 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed"
            >
              {isConverting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Converting...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Convert to Rust/Anchor
                </>
              )}
            </button>
          </div>

          {/* Output Side */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Code className="w-6 h-6 text-amber-400" />
                Rust/Anchor Output
              </h2>
              {rustCode && (
                <button
                  onClick={handleDownload}
                  className="text-sm px-4 py-2 bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/30 text-amber-300 rounded-lg transition-all flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              )}
            </div>

            {error && (
              <div className="p-4 bg-red-600/20 border border-red-500/30 rounded-lg flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-300 mb-1">Conversion Error</h4>
                  <p className="text-sm text-red-200">{error}</p>
                </div>
              </div>
            )}

            {rustCode ? (
              <div className="relative">
                <SyntaxHighlighter
                  language="rust"
                  style={vscDarkPlus}
                  className="rounded-lg border border-yellow-700/30 max-h-[600px] overflow-auto"
                  customStyle={{
                    margin: 0,
                    padding: '1rem',
                    fontSize: '0.875rem',
                    background: 'rgba(17, 24, 39, 0.5)',
                  }}
                >
                  {rustCode}
                </SyntaxHighlighter>
              </div>
            ) : (
              <div className="h-[600px] flex items-center justify-center bg-gray-900/50 border border-yellow-700/30 rounded-lg">
                <div className="text-center text-gray-500">
                  <Code className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>Converted Rust/Anchor code will appear here</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Conversion Stats */}
        {conversionStats && (
          <div className="bg-gradient-to-r from-yellow-900/30 to-amber-900/30 backdrop-blur-sm border border-yellow-700/30 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Check className="w-5 h-5 text-green-400" />
              Conversion Complete
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-2xl font-bold text-yellow-400">{conversionStats.functions}</div>
                <div className="text-sm text-gray-400">Functions Converted</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-400">{conversionStats.structs}</div>
                <div className="text-sm text-gray-400">Structs/Accounts</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-pink-400">{conversionStats.events}</div>
                <div className="text-sm text-gray-400">Events</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">{conversionStats.complexity}</div>
                <div className="text-sm text-gray-400">Complexity</div>
              </div>
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <TipCard
            title="Best Practices"
            description="Our AI follows Anchor framework conventions and Solana security patterns."
          />
          <TipCard
            title="Manual Review"
            description="Always review and test converted code before deploying to production."
          />
          <TipCard
            title="Optimization"
            description="Converted code includes gas-to-compute optimizations for Solana's architecture."
          />
        </div>
      </main>
    </div>
  );
}

function TipCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-4 bg-yellow-900/20 backdrop-blur-sm border border-yellow-700/30 rounded-lg">
      <h4 className="font-semibold text-white mb-2">{title}</h4>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
}
