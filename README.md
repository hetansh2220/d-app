# Fundra - Decentralized Crowdfunding on Solana

Launch your campaign in minutes. No middlemen, no borders, no hidden fees.

## Overview

Fundra is a decentralized crowdfunding platform built on Solana blockchain that allows users to create campaigns and fund projects using USDC stablecoin. The platform combines a modern Next.js frontend with a secure Solana smart contract backend.

## Tech Stack

### Frontend
- **Framework**: Next.js 16.1.2 (React 19)
- **Language**: TypeScript 5
- **Styling**: TailwindCSS 4, Framer Motion
- **Font**: Montserrat (via Fontshare)

### Blockchain
- **Network**: Solana (Devnet)
- **Framework**: Anchor 0.32.1
- **Token**: USDC (Circle official)
- **Program ID**: `BAaDjLVffrtNzgKLoUjmM9t1tWBHxMF6UFdnL1NYmQ3J`

### Storage
- **IPFS**: Pinata Gateway

## Features

### Campaign Creation
- Multi-step wizard (Basics → Story → Funding → Review)
- Image upload to IPFS
- Milestone creation with target amounts
- Category selection (Environment, Education, Healthcare, Technology, Community, Arts)

### Campaign Funding
- Quick-fund tiers ($10, $50, $100, $500)
- Custom amount support
- Live funding activity feed
- Real-time progress tracking

### Wallet Integration
- Phantom, Solflare, Torus, Ledger support
- One-click connect/disconnect
- Automatic token account creation

### Smart Contract Functions
- `create_campaign()` - Create new campaign (1-90 days)
- `fund_campaign()` - Contribute USDC
- `withdraw_funds()` - Creator withdrawal after goal met
- `add_milestone()` - Create milestones
- `complete_milestone()` - Mark milestone complete
- `claim_refund()` - Refund if goal not met
- `close_campaign()` - Deactivate campaign

## Project Structure

```
fundra/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Landing page
│   ├── campaigns/[id]/           # Campaign detail page
│   ├── create/                   # Campaign creation wizard
│   ├── explore/                  # Campaign discovery
│   ├── globals.css               # Global styles
│   └── layout.tsx                # Root layout
│
├── components/
│   ├── landing-page/             # Landing page sections
│   │   ├── Navbar.tsx
│   │   ├── hero.tsx
│   │   ├── features.tsx
│   │   ├── stats.tsx
│   │   ├── how-it-works.tsx
│   │   ├── campaigns.tsx
│   │   ├── cta.tsx
│   │   └── footer.tsx
│   ├── campaigns/
│   │   └── FundingActivity.tsx   # Live transaction feed
│   └── ui/                       # UI primitives
│
├── lib/
│   ├── hooks/
│   │   └── useHopeRise.ts        # Solana contract hook
│   ├── solana/
│   │   └── program.ts            # Program config & types
│   ├── idl/                      # Anchor IDL files
│   ├── ipfs.ts                   # IPFS/Pinata integration
│   └── providers.tsx             # Wallet & theme providers
│
└── smart-contract/               # Solana program
    └── programs/hope_rise/src/
        ├── lib.rs                # Contract logic
        ├── state.rs              # Account structures
        ├── errors.rs             # Error codes
        └── constants.rs          # Configuration
```

## Smart Contract Architecture

### Account Structures

| Account | Purpose |
|---------|---------|
| CampaignCounter | Global state tracking total campaigns |
| Campaign | Main crowdfunding account with metadata |
| Milestone | Target amounts and completion status |
| Contribution | Individual backer contributions |

### PDA Seeds

```rust
Campaign Counter: b"campaign_counter"
Campaign:         [b"campaign", creator, campaign_id]
Milestone:        [b"milestone", campaign, index]
Contribution:     [b"contribution", campaign, contributor]
Campaign Vault:   [b"campaign_vault", campaign]
```

### Validation Rules

- Title: Max 80 characters
- Description: Max 200 characters
- Duration: 1-90 days
- Milestones: Max 10 per campaign

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- Solana CLI
- Anchor CLI

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd fundra

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Add your Pinata JWT and other keys
```

### Development

```bash
# Run frontend
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

### Smart Contract

```bash
cd smart-contract

# Build
anchor build

# Test
anchor test

# Deploy
anchor deploy
```

## Environment Variables

```env
NEXT_PUBLIC_PINATA_JWT=your_pinata_jwt
NEXT_PUBLIC_SOLANA_RPC=https://api.devnet.solana.com
```

## Data Flow

```
User Interface (React)
    ↓
useHopeRise Hook
    ↓
Anchor Program (Rust)
    ↓
Solana Blockchain
    ↓
USDC Token Program
    ↓
Campaign Vault (PDA)
```

## Campaign Lifecycle

```
Create Campaign
    ↓
Fund Campaign → Update Balances
    ↓
Add/Complete Milestones
    ↓
Goal Met? → Withdraw Funds
Goal Failed? → Claim Refunds
    ↓
Close Campaign
```

## Key Files

| File | Purpose |
|------|---------|
| `lib/hooks/useHopeRise.ts` | Contract interaction hook |
| `app/create/page.tsx` | Campaign creation UI |
| `app/campaigns/[id]/page.tsx` | Campaign detail page |
| `lib/solana/program.ts` | Program config & types |
| `smart-contract/.../lib.rs` | Smart contract core |

## Security

- Anchor framework validation
- PDA-based account derivation
- Custom error codes (13 types)
- Token transfer safeguards

## License

MIT
