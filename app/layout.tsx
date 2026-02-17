import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { WalletProvider } from '@/components/WalletProvider'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0A0A0F',
}

export const metadata: Metadata = {
  title: 'SolBridge — Universal EVM → Solana Migration Suite',
  description:
    'AI-powered smart contract conversion, wallet migration, and real-time Solana analytics. Migrate seamlessly from EVM chains to Solana with GPT-4 and Wormhole bridge.',
  keywords: [
    'Solana', 'EVM', 'migration', 'smart contract', 'Rust', 'Anchor',
    'Wormhole', 'bridge', 'GPT-4', 'blockchain', 'DeFi',
  ],
  authors: [{ name: 'SolBridge Team' }],
  openGraph: {
    title: 'SolBridge — Universal EVM → Solana Migration Suite',
    description:
      'Convert Solidity to Rust/Anchor, migrate wallets, and monitor Solana on-chain analytics — all in one platform.',
    url: 'https://solbridge.dev',
    siteName: 'SolBridge',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SolBridge — Universal EVM → Solana Migration Suite',
    description:
      'AI smart-contract converter, cross-chain wallet migration, and live Solana analytics.',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased`}>
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  )
}
