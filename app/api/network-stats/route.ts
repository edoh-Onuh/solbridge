import { NextResponse } from 'next/server';
import { Connection } from '@solana/web3.js';

let cached: { tps: number; slot: number; blockTime: number; timestamp: number } | null = null;
const CACHE_TTL = 10000; // 10 seconds

export async function GET() {
  try {
    const now = Date.now();
    if (cached && (now - cached.timestamp) < CACHE_TTL) {
      return NextResponse.json({ success: true, ...cached });
    }

    const endpoint = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
    const conn = new Connection(endpoint, 'confirmed');

    const [perfSamples, slot] = await Promise.all([
      conn.getRecentPerformanceSamples(1),
      conn.getSlot(),
    ]);

    const tps = perfSamples[0]
      ? Math.round(perfSamples[0].numTransactions / perfSamples[0].samplePeriodSecs)
      : 0;
    const blockTime = perfSamples[0]
      ? Math.round((perfSamples[0].samplePeriodSecs / perfSamples[0].numSlots) * 1000)
      : 400;

    cached = { tps, slot, blockTime, timestamp: now };

    return NextResponse.json({ success: true, tps, slot, blockTime });
  } catch (error: any) {
    console.error('Network stats error:', error.message);
    if (cached) {
      return NextResponse.json({ success: true, ...cached, stale: true });
    }
    return NextResponse.json({ success: false, tps: 0, slot: 0, blockTime: 400 });
  }
}
