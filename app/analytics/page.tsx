'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, BarChart3, TrendingUp, Users, Zap, Activity, RefreshCw } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  
  const [migrationData, setMigrationData] = useState([
    { name: 'Mon', migrations: 12, value: 45000 },
    { name: 'Tue', migrations: 19, value: 72000 },
    { name: 'Wed', migrations: 15, value: 58000 },
    { name: 'Thu', migrations: 28, value: 95000 },
    { name: 'Fri', migrations: 22, value: 81000 },
    { name: 'Sat', migrations: 31, value: 112000 },
    { name: 'Sun', migrations: 25, value: 89000 },
  ]);

  const [contractData, setContractData] = useState([
    { name: 'Vault', count: 15 },
    { name: 'Token', count: 23 },
    { name: 'NFT', count: 12 },
    { name: 'DEX', count: 8 },
    { name: 'Staking', count: 17 },
  ]);

  const [stats, setStats] = useState({
    totalMigrations: 152,
    totalValue: 552000,
    successRate: 98.7,
    activeUsers: 89,
  });

  const [recentMigrations, setRecentMigrations] = useState([
    { id: 1, type: 'Vault Contract', from: '0x7a2...4b5c', to: '8Kx9...mP3L', value: '$12,450', time: '2 min ago', status: 'success' },
    { id: 2, type: 'Token Migration', from: '0x3b1...9c7d', to: '5Mx2...qR8N', value: '$8,730', time: '5 min ago', status: 'success' },
    { id: 3, type: 'NFT Collection', from: '0x9c4...2e1f', to: '3Nz7...wT4M', value: '$25,100', time: '12 min ago', status: 'success' },
    { id: 4, type: 'Staking Contract', from: '0x5e7...8d3a', to: '7Pw5...kL9Q', value: '$45,890', time: '18 min ago', status: 'pending' },
    { id: 5, type: 'DEX Contract', from: '0x1f2...6b9e', to: '2Qx8...vY3H', value: '$67,250', time: '24 min ago', status: 'success' },
  ]);

  // Simulate real-time data updates
  const fetchAnalytics = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    
    try {
      // Simulate API call - add random variance to simulate live data
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update stats with random variations
      setStats(prev => ({
        totalMigrations: prev.totalMigrations + Math.floor(Math.random() * 3),
        totalValue: prev.totalValue + Math.floor(Math.random() * 50000),
        successRate: Math.min(99.9, prev.successRate + (Math.random() * 0.2 - 0.1)),
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 5 - 2),
      }));

      // Add new migration if random
      if (Math.random() > 0.7) {
        const newMigration = {
          id: Date.now(),
          type: ['Vault Contract', 'Token Migration', 'NFT Collection', 'Staking Contract', 'DEX Contract'][Math.floor(Math.random() * 5)],
          from: `0x${Math.random().toString(36).substring(2, 5)}...${Math.random().toString(36).substring(2, 6)}`,
          to: `${Math.floor(Math.random() * 9) + 1}${Math.random().toString(36).substring(2, 4).toUpperCase()}...${Math.random().toString(36).substring(2, 6)}`,
          value: `$${(Math.random() * 50000 + 5000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`,
          time: 'just now',
          status: Math.random() > 0.1 ? 'success' : 'pending',
        };
        setRecentMigrations(prev => [newMigration, ...prev.slice(0, 9)]);
      }

      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
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
            value={`$${(stats.totalValue / 1000).toFixed(0)}K`}
            change="+8.3%"
            positive
          />
          <StatCard
            icon={<Zap className="w-8 h-8 text-yellow-400" />}
            title="Success Rate"
            value={`${stats.successRate}%`}
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
