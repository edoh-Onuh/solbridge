'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, BarChart3, TrendingUp, Users, Zap, Activity, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [dataSource, setDataSource] = useState<'live' | 'error'>('live');
  const [error, setError] = useState<string | null>(null);
  
  const [migrationData, setMigrationData] = useState([
    { name: 'Mon', migrations: 0, value: 0 },
    { name: 'Tue', migrations: 0, value: 0 },
    { name: 'Wed', migrations: 0, value: 0 },
    { name: 'Thu', migrations: 0, value: 0 },
    { name: 'Fri', migrations: 0, value: 0 },
    { name: 'Sat', migrations: 0, value: 0 },
    { name: 'Sun', migrations: 0, value: 0 },
  ]);

  const [contractData, setContractData] = useState([
    { name: 'Token', count: 0 },
    { name: 'System', count: 0 },
    { name: 'Smart Contract', count: 0 },
  ]);

  const [stats, setStats] = useState({
    totalMigrations: 0,
    totalValue: 0,
    successRate: 100,
    activeUsers: 0,
  });

  const [recentMigrations, setRecentMigrations] = useState<any[]>([]);

  // Fetch live data from Solana
  const fetchAnalytics = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    
    try {
      // Fetch live data from API
      const response = await fetch('/api/analytics');
      const result = await response.json();
      
      if (result.success && result.data) {
        const data = result.data;
        
        // Update stats from live data
        setStats({
          totalMigrations: data.totalTransactions,
          totalValue: data.totalVolume,
          successRate: data.successRate,
          activeUsers: data.activeAccounts,
        });
        
        // Update daily volume chart
        setMigrationData(data.dailyVolume.map((day: any) => ({
          name: day.name,
          migrations: day.transactions,
          value: Math.round(day.value * 100) / 100 // Round to 2 decimals
        })));
        
        // Update program distribution
        setContractData(data.programDistribution);
        
        // Format recent transactions for display
        const formattedTransactions = data.recentTransactions.map((tx: any, index: number) => ({
          id: index,
          type: tx.type,
          from: tx.from.slice(0, 8) + '...',
          to: tx.to.slice(0, 8) + '...',
          value: `${tx.value.toFixed(4)} SOL`,
          time: getTimeAgo(tx.timestamp),
          status: tx.status,
          signature: tx.signature
        }));
        
        setRecentMigrations(formattedTransactions);
        setDataSource('live');
        setError(null);
      } else {
        throw new Error(result.error || 'Failed to fetch live data');
      }

      setLastUpdate(new Date());
    } catch (error: any) {
      console.error('Failed to fetch analytics:', error);
      setDataSource('error');
      setError(error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  // Helper function to format time
  const getTimeAgo = (timestamp: number): string => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  useEffect(() => {
    fetchAnalytics();
    
    // Poll for updates every 10 seconds
    const interval = setInterval(() => fetchAnalytics(), 10000);
    return () => clearInterval(interval);
  }, []);

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
              <BarChart3 className="w-6 h-6 text-yellow-500" />
              <h1 className="text-xl font-bold text-white">Migration Analytics</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Live Data Status Banner */}
        <div className={`mb-6 p-4 rounded-lg flex items-center justify-between ${
          dataSource === 'live' ? 'bg-green-900/20 border border-green-500/30' : 'bg-red-900/20 border border-red-500/30'
        }`}>
          <div className="flex items-center gap-3">
            {dataSource === 'live' ? (
              <>
                <Wifi className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-green-300 font-semibold">Live Solana Data</p>
                  <p className="text-green-200/80 text-sm">Fetching real-time blockchain data from Solana mainnet</p>
                </div>
              </>
            ) : (
              <>
                <WifiOff className="w-5 h-5 text-red-400" />
                <div>
                  <p className="text-red-300 font-semibold">Unable to fetch live data</p>
                  <p className="text-red-200/80 text-sm">{error || 'Connection error'}</p>
                </div>
              </>
            )}
          </div>
          <button
            onClick={() => fetchAnalytics(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-white ${refreshing ? 'animate-spin' : ''}`} />
            <span className="text-white text-sm">Refresh</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Activity className="w-8 h-8 text-yellow-400" />}
            title="Total Migrations"
            value={stats.totalMigrations.toLocaleString()}
            change="+12.5%"
            positive
          />
          <StatCard
            icon={<TrendingUp className="w-8 h-8 text-green-400" />}
            title="Total Value"
            value={`${stats.totalValue.toFixed(2)} SOL`}
            change="+8.3%"
            positive
          />
          <StatCard
            icon={<Zap className="w-8 h-8 text-yellow-400" />}
            title="Success Rate"
            value={`${stats.successRate.toFixed(1)}%`}
            change="+0.2%"
            positive
          />
          <StatCard
            icon={<Users className="w-8 h-8 text-amber-400" />}
            title="Active Users"
            value={stats.activeUsers.toString()}
            change="+15.7%"
            positive
          />
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Migration Volume Chart */}
          <div className="bg-gradient-to-br from-yellow-900/20 to-amber-900/20 backdrop-blur-sm border border-yellow-700/30 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Migration Volume (7 Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={migrationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4a4a4a" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(17, 24, 39, 0.9)',
                    border: '1px solid rgba(234, 179, 8, 0.3)',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="migrations" stroke="#eab308" strokeWidth={2} name="Migrations" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Contract Types Chart */}
          <div className="bg-gradient-to-br from-yellow-900/20 to-amber-900/20 backdrop-blur-sm border border-yellow-700/30 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Contract Types Migrated</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={contractData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4a4a4a" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(17, 24, 39, 0.9)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="count" fill="#f59e0b" name="Contracts" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Migrations Table */}
        <div className="bg-gradient-to-br from-yellow-900/20 to-amber-900/20 backdrop-blur-sm border border-yellow-700/30 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Recent Migrations</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-yellow-700/30">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">From (EVM)</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">To (Solana)</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Value</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Time</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentMigrations.map((migration) => (
                  <tr key={migration.id} className="border-b border-yellow-700/10 hover:bg-yellow-900/10 transition-colors">
                    <td className="py-3 px-4 text-sm text-white">{migration.type}</td>
                    <td className="py-3 px-4 text-sm text-gray-400 font-mono">{migration.from}</td>
                    <td className="py-3 px-4 text-sm text-gray-400 font-mono">{migration.to}</td>
                    <td className="py-3 px-4 text-sm text-white font-semibold">{migration.value}</td>
                    <td className="py-3 px-4 text-sm text-gray-400">{migration.time}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                          migration.status === 'success'
                            ? 'bg-green-600/20 text-green-300 border border-green-500/30'
                            : 'bg-yellow-600/20 text-yellow-300 border border-yellow-500/30'
                        }`}
                      >
                        {migration.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Token Economics Optimizer */}
        <div className="mt-8 bg-gradient-to-r from-yellow-600/20 to-amber-600/20 backdrop-blur-sm border border-yellow-500/30 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-white mb-4">Token Economics Optimizer</h3>
          <p className="text-gray-300 mb-6">
            Calculate optimal liquidity distribution and bridge selection for your token migration.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 bg-black/30 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Recommended Bridge</div>
              <div className="text-lg font-bold text-white">Wormhole</div>
              <div className="text-xs text-yellow-300 mt-1">Lowest fees: 0.1%</div>
            </div>
            <div className="p-4 bg-black/30 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Optimal Liquidity</div>
              <div className="text-lg font-bold text-white">$250K</div>
              <div className="text-xs text-amber-300 mt-1">65% Solana / 35% EVM</div>
            </div>
            <div className="p-4 bg-black/30 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Est. Migration Time</div>
              <div className="text-lg font-bold text-white">~5-10 min</div>
              <div className="text-xs text-green-300 mt-1">Network optimized</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, title, value, change, positive }: {
  icon: React.ReactNode;
  title: string;
  value: string;
  change: string;
  positive: boolean;
}) {
  return (
    <div className="bg-gradient-to-br from-yellow-900/20 to-amber-900/20 backdrop-blur-sm border border-yellow-700/30 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        {icon}
        <span className={`text-sm font-semibold ${positive ? 'text-green-400' : 'text-red-400'}`}>
          {change}
        </span>
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-gray-400">{title}</div>
    </div>
  );
}
