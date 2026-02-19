'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, BarChart3, TrendingUp, Users, Zap, Activity,
  RefreshCw, Wifi, WifiOff, ExternalLink, Sparkles, Clock, Globe
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const PIE_COLORS = ['#eab308', '#f59e0b', '#d97706', '#b45309', '#92400e', '#78350f'];

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [dataSource, setDataSource] = useState<'live' | 'cache' | 'error'>('live');
  const [error, setError] = useState<string | null>(null);

  const [dailyData, setDailyData] = useState<{ name: string; transactions: number; value: number }[]>([]);
  const [programData, setProgramData] = useState<{ name: string; count: number }[]>([]);
  const [stats, setStats] = useState({ total: 0, volume: 0, successRate: 100, accounts: 0 });
  const [recentTxs, setRecentTxs] = useState<any[]>([]);

  const fetchAnalytics = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const res = await fetch('/api/analytics');
      const json = await res.json();

      if (json.success && json.data) {
        const d = json.data;
        setStats({
          total: d.totalTransactions,
          volume: d.totalVolume,
          successRate: d.successRate,
          accounts: d.activeAccounts,
        });
        setDailyData(d.dailyVolume);
        setProgramData(d.programDistribution);
        setRecentTxs(
          d.recentTransactions.map((tx: any, i: number) => ({
            id: i,
            type: tx.type,
            from: tx.from + '...',
            to: tx.to + '...',
            value: tx.value,
            time: tx.timestamp,
            status: tx.status,
            sig: tx.signature,
          }))
        );
        setDataSource(json.source === 'live' ? 'live' : 'cache');
        setError(null);
      } else {
        throw new Error(json.error || 'Failed to fetch');
      }
      setLastUpdate(new Date());
    } catch (e: any) {
      setDataSource('error');
      setError(e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(() => fetchAnalytics(), 30000);
    return () => clearInterval(interval);
  }, [fetchAnalytics]);

  const timeAgo = (ts: number) => {
    const s = Math.floor((Date.now() - ts) / 1000);
    if (s < 60) return 'just now';
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    return `${Math.floor(s / 86400)}d ago`;
  };

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
              <BarChart3 className="w-5 h-5 text-yellow-500" />
              <h1 className="text-lg font-bold">Analytics</h1>
            </div>
            <button
              onClick={() => fetchAnalytics(true)}
              disabled={refreshing}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status pill */}
        <div className="flex items-center gap-3 mb-8">
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
            dataSource === 'error'
              ? 'bg-red-500/10 border border-red-500/20 text-red-300'
              : dataSource === 'cache'
              ? 'bg-blue-500/10 border border-blue-500/20 text-blue-300'
              : 'bg-green-500/10 border border-green-500/20 text-green-300'
          }`}>
            {dataSource === 'error' ? <WifiOff className="w-3 h-3" /> : <Wifi className="w-3 h-3" />}
            {dataSource === 'error' ? 'Offline' : dataSource === 'cache' ? 'Cached' : 'Live'}
          </div>
          <span className="text-xs text-gray-600">
            Updated {lastUpdate.toLocaleTimeString()}
          </span>
          {error && <span className="text-xs text-red-400">{error}</span>}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Transactions', value: stats.total.toLocaleString(), icon: Activity, color: 'yellow' },
            { label: 'Volume', value: `${stats.volume.toFixed(2)} SOL`, icon: TrendingUp, color: 'green' },
            { label: 'Success Rate', value: `${stats.successRate}%`, icon: Zap, color: 'amber' },
            { label: 'Unique Accounts', value: stats.accounts.toLocaleString(), icon: Users, color: 'blue' },
          ].map((s, i) => (
            <div key={i} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <s.icon className={`w-4 h-4 text-${s.color}-400/60`} />
                <span className="text-xs text-gray-500">{s.label}</span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
                {loading ? '—' : s.value}
              </div>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Area chart — 2 cols */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-semibold text-gray-300">Transaction Volume (7 Days)</h3>
              <span className="text-[10px] text-gray-600 uppercase tracking-wider">Live Data</span>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={dailyData}>
                <defs>
                  <linearGradient id="colorTx" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#eab308" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="name" stroke="#4b5563" tick={{ fontSize: 11 }} />
                <YAxis stroke="#4b5563" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }}
                  labelStyle={{ color: '#9ca3af' }}
                />
                <Area type="monotone" dataKey="transactions" stroke="#eab308" strokeWidth={2} fillOpacity={1} fill="url(#colorTx)" name="Transactions" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Pie chart — 1 col */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <h3 className="text-sm font-semibold text-gray-300 mb-6">Program Distribution</h3>
            {programData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={programData} cx="50%" cy="50%" outerRadius={80} innerRadius={50}
                      dataKey="count" paddingAngle={3} stroke="none">
                      {programData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {programData.map((p, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                        <span className="text-gray-400">{p.name}</span>
                      </div>
                      <span className="text-white font-medium">{p.count}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-52 text-gray-600 text-sm">No data yet</div>
            )}
          </div>
        </div>

        {/* Recent transactions */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-semibold text-gray-300">Recent Transactions</h3>
            <span className="text-[10px] text-gray-600 uppercase tracking-wider">{recentTxs.length} results</span>
          </div>

          {recentTxs.length === 0 && !loading ? (
            <div className="text-center py-12 text-gray-600 text-sm">No transactions found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Sender</th>
                    <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Receiver</th>
                    <th className="text-right py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                    <th className="text-right py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="text-center py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-center py-3 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Tx</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTxs.map(tx => (
                    <tr key={tx.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-3 text-gray-300 font-medium">{tx.type}</td>
                      <td className="py-3 px-3 font-mono text-gray-500 text-xs">{tx.from}</td>
                      <td className="py-3 px-3 font-mono text-gray-500 text-xs">{tx.to}</td>
                      <td className="py-3 px-3 text-right text-white font-medium">{tx.value.toFixed(4)} SOL</td>
                      <td className="py-3 px-3 text-right text-gray-500 text-xs">{timeAgo(tx.time)}</td>
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                          tx.status === 'success'
                            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>{tx.status}</span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <a href={`https://solscan.io/tx/${tx.sig}`} target="_blank" rel="noopener noreferrer"
                          className="text-yellow-500/50 hover:text-yellow-400 transition-colors">
                          <ExternalLink className="w-3.5 h-3.5 inline" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Token Economics */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-yellow-500/5 to-amber-500/5 border border-yellow-500/10">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <h3 className="text-sm font-semibold text-gray-300">Token Economics Optimizer</h3>
          </div>
          <p className="text-xs text-gray-500 mb-6">Optimal bridge and liquidity recommendations for your migration.</p>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: 'Recommended Bridge', value: 'Sunrise', sub: 'Lowest fees: 0.1% + INX', icon: Globe },
              { label: 'Optimal Liquidity', value: '$250K', sub: '65% Solana / 35% EVM', icon: TrendingUp },
              { label: 'Est. Migration Time', value: '~2-5 min', sub: 'Via Sunrise routes', icon: Clock },
            ].map((item, i) => (
              <div key={i} className="p-4 rounded-xl bg-black/30 border border-white/5">
                <item.icon className="w-4 h-4 text-yellow-500/50 mb-2" />
                <div className="text-[11px] text-gray-500 mb-1">{item.label}</div>
                <div className="text-lg font-bold text-white">{item.value}</div>
                <div className="text-[11px] text-yellow-400/70 mt-1">{item.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Sunrise Metrics */}
        <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-orange-500/5 to-yellow-500/5 border border-orange-500/10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="text-lg">🌅</span>
              <h3 className="text-sm font-semibold text-gray-300">Sunrise Migration Metrics</h3>
            </div>
            <a href="https://www.sunrisedefi.com/" target="_blank" rel="noopener noreferrer" className="text-[10px] text-orange-400 hover:text-orange-300 flex items-center gap-1 transition-colors">
              sunrisedefi.com <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'INX Price', value: '$0.01', change: '+12.5%', positive: true },
              { label: 'Bridges Today', value: '1,247', change: '+8.3%', positive: true },
              { label: 'Chains Supported', value: '6+', change: 'EVM', positive: true },
              { label: 'Total Bridged', value: '$4.2M', change: '24h volume', positive: true },
            ].map((m, i) => (
              <div key={i} className="p-4 rounded-xl bg-black/30 border border-white/5">
                <div className="text-[11px] text-gray-500 mb-1">{m.label}</div>
                <div className="text-lg font-bold text-white">{m.value}</div>
                <div className={`text-[10px] mt-1 ${m.positive ? 'text-green-400' : 'text-red-400'}`}>{m.change}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {['Jupiter', 'Phantom', 'Backpack', 'Orca', 'Drift', 'Mayan', 'Axiom'].map(p => (
              <span key={p} className="px-3 py-1.5 text-[10px] font-medium text-gray-400 bg-white/5 border border-white/5 rounded-full">{p}</span>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
