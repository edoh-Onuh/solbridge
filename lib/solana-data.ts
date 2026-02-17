import { Connection, PublicKey } from '@solana/web3.js';

// ── Connection singleton ──
let connection: Connection | null = null;

function getConnection(): Connection {
  if (!connection) {
    const endpoint = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
    connection = new Connection(endpoint, 'confirmed');
  }
  return connection;
}

// ── Programs we track ──
const TOKEN_PROGRAM = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';

const PROGRAM_LABELS: Record<string, string> = {
  'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA': 'Token Transfer',
  'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL': 'Associated Token',
  '11111111111111111111111111111111': 'System Transfer',
  'ComputeBudget111111111111111111111111111111': 'Compute Budget',
};

// ── Types ──
export interface LiveTransactionData {
  signature: string;
  type: string;
  from: string;
  to: string;
  value: number;
  timestamp: number;
  status: 'success' | 'failed';
}

export interface LiveAnalyticsData {
  totalTransactions: number;
  totalVolume: number;
  successRate: number;
  activeAccounts: number;
  recentTransactions: LiveTransactionData[];
  programDistribution: { name: string; count: number }[];
  dailyVolume: { name: string; transactions: number; value: number }[];
}

/**
 * Fetch recent signatures, then batch-fetch parsed transactions.
 * Uses getSignaturesForAddress (1 call) + getParsedTransactions (1 call).
 * Total: 2 RPC calls instead of N+1.
 */
export async function getRecentTransactions(limit: number = 15): Promise<LiveTransactionData[]> {
  try {
    const conn = getConnection();

    // 1 RPC call — get signature list
    const signatures = await conn.getSignaturesForAddress(
      new PublicKey(TOKEN_PROGRAM),
      { limit }
    );

    if (signatures.length === 0) return [];

    // 1 RPC call — batch fetch all parsed transactions
    const txs = await conn.getParsedTransactions(
      signatures.map(s => s.signature),
      { maxSupportedTransactionVersion: 0 }
    );

    const transactions: LiveTransactionData[] = [];

    for (let i = 0; i < signatures.length; i++) {
      const sig = signatures[i];
      const tx = txs[i];
      if (!tx || !tx.meta) continue;

      // Extract real transfer value from balance changes
      let transferValue = 0;
      if (tx.meta.preBalances && tx.meta.postBalances && tx.meta.preBalances.length > 1) {
        // Look at the first non-fee-payer account balance change
        for (let j = 1; j < tx.meta.preBalances.length; j++) {
          const change = Math.abs(tx.meta.postBalances[j] - tx.meta.preBalances[j]);
          if (change > 0 && change > transferValue) {
            transferValue = change;
          }
        }
        transferValue = transferValue / 1e9; // lamports → SOL
      }

      // If no significant balance change, use the fee as a minimal value indicator
      if (transferValue === 0) {
        transferValue = (tx.meta.fee || 5000) / 1e9;
      }

      const keys = tx.transaction.message.accountKeys;
      const firstProgram = keys.length > 0 ? keys[0].pubkey.toString() : '';

      transactions.push({
        signature: sig.signature,
        type: PROGRAM_LABELS[firstProgram] || 'Smart Contract',
        from: keys[0]?.pubkey.toString().slice(0, 8) || '—',
        to: keys.length > 1 ? keys[1].pubkey.toString().slice(0, 8) : '—',
        value: transferValue,
        timestamp: sig.blockTime ? sig.blockTime * 1000 : Date.now(),
        status: tx.meta.err ? 'failed' : 'success',
      });
    }

    return transactions;
  } catch (error) {
    console.error('getRecentTransactions error:', error);
    return [];
  }
}

/**
 * Aggregate analytics from recent transactions.
 * Makes exactly 2 RPC calls total (via getRecentTransactions).
 */
export async function getLiveAnalytics(): Promise<LiveAnalyticsData> {
  const recentTxs = await getRecentTransactions(15);

  const successCount = recentTxs.filter(tx => tx.status === 'success').length;
  const successRate = recentTxs.length > 0
    ? Math.round((successCount / recentTxs.length) * 1000) / 10 // 1 decimal
    : 100;

  const totalVolume = recentTxs.reduce((sum, tx) => sum + tx.value, 0);

  const uniqueAccounts = new Set(recentTxs.flatMap(tx => [tx.from, tx.to]));

  // Program distribution
  const counts = new Map<string, number>();
  recentTxs.forEach(tx => counts.set(tx.type, (counts.get(tx.type) || 0) + 1));
  const programDistribution = Array.from(counts.entries()).map(([name, count]) => ({ name, count }));

  // Daily volume (last 7 days)
  const now = Date.now();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dailyVolume = Array.from({ length: 7 }, (_, i) => {
    const dayStart = now - (6 - i) * 86_400_000;
    const dayEnd = dayStart + 86_400_000;
    const dayTxs = recentTxs.filter(tx => tx.timestamp >= dayStart && tx.timestamp < dayEnd);
    return {
      name: dayNames[new Date(dayStart).getDay()],
      transactions: dayTxs.length,
      value: Math.round(dayTxs.reduce((s, tx) => s + tx.value, 0) * 100) / 100,
    };
  });

  return {
    totalTransactions: recentTxs.length,
    totalVolume: Math.round(totalVolume * 100) / 100,
    successRate,
    activeAccounts: uniqueAccounts.size,
    recentTransactions: recentTxs.slice(0, 10),
    programDistribution,
    dailyVolume,
  };
}

/**
 * Get account balance and metadata. 1 RPC call.
 */
export async function getAccountInfo(address: string) {
  try {
    // Validate base58 address
    const pubkey = new PublicKey(address);

    const conn = getConnection();
    const [balance, info] = await Promise.all([
      conn.getBalance(pubkey),
      conn.getAccountInfo(pubkey),
    ]);

    return {
      balance: balance / 1e9,
      exists: info !== null,
      owner: info?.owner.toString() || null,
      executable: info?.executable || false,
      lamports: balance,
    };
  } catch (error) {
    console.error('getAccountInfo error:', error);
    return null;
  }
}
