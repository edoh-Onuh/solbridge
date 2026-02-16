# 🌉 SolBridge - Universal EVM→Solana Migration Suite

![SolBridge Banner](https://img.shields.io/badge/Solana-Graveyard_Hackathon_2026-purple?style=for-the-badge&logo=solana)
![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=for-the-badge&logo=typescript)

**SolBridge** is an AI-powered migration suite that makes moving from EVM chains to Solana seamless, fast, and secure. Built for the **Solana Graveyard Hackathon 2026 - Migrations Track**.

## 🌟 Features

### 🤖 AI Smart Contract Converter
- **GPT-4 Powered**: Converts Solidity contracts to Rust/Anchor with enterprise-grade accuracy
- **Side-by-Side Comparison**: View original and converted code with syntax highlighting
- **Automated Analysis**: Detects functions, structs, events, and complexity metrics
- **Download & Deploy**: Export converted code ready for Solana deployment

### 💼 One-Click Wallet Migration
- **Multi-Wallet Support**: Connects MetaMask (EVM) and Phantom (Solana) simultaneously
- **Asset Transfer**: Migrates tokens and NFTs across chains via Wormhole bridge
- **Fee Optimization**: Calculates optimal routes to minimize transaction costs
- **Real-Time Tracking**: Monitor migration progress with live transaction updates

### 📊 Live Migration Analytics
- **Interactive Dashboard**: Real-time charts powered by Recharts
- **Migration Metrics**: Track total migrations, success rates, and user activity
- **Contract Types Analysis**: Breakdown by vault, token, NFT, DEX, and staking contracts
- **Recent Activity Feed**: Live table of ongoing and completed migrations

### 💰 Token Economics Optimizer
- **Bridge Selection**: Recommends optimal bridges (Wormhole, Sunrise) based on fees
- **Liquidity Distribution**: Calculates ideal cross-chain liquidity splits
- **Time Estimation**: Predicts migration duration based on network conditions

## 🛠️ Tech Stack

- **Frontend**: Next.js 16.1, React 19, TypeScript 5, Tailwind CSS 4
- **Blockchain**: Solana Web3.js, Wallet Adapter (Phantom, Solflare)
- **AI**: OpenAI GPT-4 for smart contract conversion
- **Charts**: Recharts for data visualization
- **Code Highlighting**: React Syntax Highlighter with VS Code Dark theme

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- OpenAI API key (optional - falls back to mock conversion)

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/solbridge.git
cd solbridge
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your API keys:
```env
OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
```

4. **Run development server**
```bash
npm run dev
```

5. **Open browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🚀 Usage

### Converting Smart Contracts

1. Navigate to **Convert** page
2. Paste your Solidity contract or click **Load Sample**
3. Click **Convert to Rust/Anchor**
4. Review the generated Rust code with side-by-side comparison
5. Download the converted contract

### Migrating Wallets

1. Navigate to **Migrate** page
2. Connect your Solana wallet (Phantom/Solflare)
3. Enter your EVM address (MetaMask)
4. Click **Start Migration**
5. Approve transactions in both wallets
6. Monitor progress in real-time

### Viewing Analytics

1. Navigate to **Analytics** page
2. View migration volume charts (7-day trend)
3. Analyze contract types migrated
4. Check recent migration activity
5. Use Token Economics Optimizer for planning

## 📁 Project Structure

```
solbridge/
├── app/
│   ├── api/
│   │   └── convert/
│   │       └── route.ts          # AI conversion API endpoint
│   ├── analytics/
│   │   └── page.tsx              # Analytics dashboard
│   ├── convert/
│   │   └── page.tsx              # Smart contract converter
│   ├── migrate/
│   │   └── page.tsx              # Wallet migration tool
│   ├── layout.tsx                # Root layout with wallet provider
│   ├── page.tsx                  # Landing page
│   └── globals.css               # Global styles
├── components/
│   └── WalletProvider.tsx        # Solana wallet configuration
├── public/                        # Static assets
├── .env.local.example            # Environment variables template
├── next.config.js                # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies
```


**Problem Solved**: EVM to Solana migration is complex, time-consuming, and error-prone. ChainPort automates the entire process with AI-powered tools.

**Innovation**:
- First AI-powered Solidity→Rust converter using GPT-4
- Unified migration suite combining contracts, wallets, and state
- Real-time analytics for migration transparency
- Token economics optimizer for DeFi protocols

**Impact**:
- Reduces migration time from months to minutes
- Eliminates manual contract rewriting errors
- Lowers barrier to entry for Solana ecosystem
- Enables mass migration of EVM projects

## 🔒 Security

- **Non-Custodial**: ChainPort never holds your private keys
- **Open Source**: All code is transparent and auditable
- **Secure Bridging**: Uses battle-tested Wormhole protocol
- **Transaction Validation**: Multi-step verification before execution

## 🌐 Deployment


### Manual Deployment

```bash
npm run build
npm run start
```

## 📈 Roadmap

- [ ] Support for additional EVM chains (Polygon, Arbitrum, Optimism)
- [ ] Advanced contract testing suite
- [ ] State migration automation
- [ ] Multi-signature wallet support
- [ ] Mobile-responsive PWA
- [ ] WebSocket live updates
- [ ] Integration with additional bridges (Allbridge, Portal)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

Built for **Solana Graveyard Hackathon 2026** by the ChainPort team.

## 📞 Contact

- **GitHub**: [@edoh-Onuh](https://github.com/edoh-Onuh)
- **Twitter**: [@Adanubrown](https://X.com/Adanubrown)


## 🙏 Acknowledgments

- Solana Foundation for hosting the Graveyard Hackathon
- Sunrise for sponsoring the Migrations track
- OpenAI for GPT-4 API access
- Wormhole for secure cross-chain bridging
- Anchor framework for Solana development patterns

---

**Built with ❤️ for the Solana ecosystem**

[![Solana](https://img.shields.io/badge/Powered_by-Solana-9945FF?style=for-the-badge&logo=solana)](https://solana.com)
[![Next.js](https://img.shields.io/badge/Built_with-Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/Written_in-TypeScript-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
