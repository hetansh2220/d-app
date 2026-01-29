# FUNDRA - Complete Project Documentation

## 1. Project Overview

**Fundra** is a decentralized crowdfunding platform built on the Solana blockchain, enabling users to create campaigns and fund projects using USDC stablecoin.

### Key Information
| Property | Value |
|----------|-------|
| Network | Solana Devnet |
| Program ID | `BAaDjLVffrtNzgKLoUjmM9t1tWBHxMF6UFdnL1NYmQ3J` |
| USDC Mint | `Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr` |
| USDC Decimals | 6 |

---

## 2. Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 16.1.2 | React framework with App Router |
| React | 19.2.3 | UI library |
| TypeScript | 5 | Type-safe JavaScript |
| TailwindCSS | 4 | Utility-first CSS |
| Framer Motion | 12.26.2 | Animation library |
| Lucide React | 0.562.0 | Icons |

### Blockchain
| Technology | Version | Purpose |
|-----------|---------|---------|
| @solana/web3.js | 1.98.4 | Solana SDK |
| @coral-xyz/anchor | 0.32.1 | Smart contract framework |
| @solana/wallet-adapter-react | 0.15.39 | Wallet integration |
| @solana/spl-token | 0.4.14 | Token program |

### Storage
| Service | Purpose |
|---------|---------|
| Pinata | IPFS gateway for images and stories |

---

## 3. Components & Props

### Navbar
**Location**: `/components/landing-page/Navbar.tsx`
- Responsive navigation with theme toggle
- Wallet connection via WalletMultiButton
- Mobile menu support

### Button
**Location**: `/components/ui/button.tsx`
```typescript
Props:
- variant: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
- size: "default" | "sm" | "lg" | "icon"
- asChild: boolean
```

### FundingActivity
**Location**: `/components/campaigns/FundingActivity.tsx`
```typescript
Props:
- campaignPubkey: PublicKey
- onNewContribution?: () => void

Features:
- Live transaction feed (max 20)
- Auto-refresh every 10 seconds
- Relative timestamps
```

### CreateCampaignPage Form State
```typescript
{
  title: string              // Max 80 chars
  shortDescription: string   // Max 200 chars
  category: string
  coverImage: File | null
  story: string              // Min 100 chars
  fundingGoal: string
  duration: '14' | '30' | '45' | '60'
  milestones: Array<{ title: string, amount: string }>
}
```

### CampaignDetailPage State
```typescript
{
  campaign: DisplayCampaign | null
  selectedTier: number | null
  customAmount: string
  activeTab: 'about' | 'updates' | 'faq'
  isFunding: boolean
  fundingError: string | null
  fundingSuccess: boolean
}
```

---

## 4. Hooks & Methods

### useHopeRise() Hook
**Location**: `/lib/hooks/useHopeRise.ts`

#### State Properties
```typescript
{
  loading: boolean
  error: string | null
  connected: boolean
  publicKey: PublicKey | null
  walletAddress: string | null
}
```

#### Write Operations (8)

| Method | Parameters | Returns |
|--------|------------|---------|
| `initialize()` | - | Transaction signature |
| `createCampaign()` | title, shortDescription, category, coverImageUrl, storyUrl, fundingGoalUsdc, durationDays | { tx, campaignPda } |
| `fundCampaign()` | campaignPubkey, amountUsdc | Transaction signature |
| `withdrawFunds()` | campaignPubkey | Transaction signature |
| `addMilestone()` | campaignPubkey, index, title, amount | Transaction signature |
| `completeMilestone()` | campaignPubkey, milestonePubkey | Transaction signature |
| `closeCampaign()` | campaignPubkey | Transaction signature |
| `claimRefund()` | campaignPubkey | Transaction signature |

#### Read Operations (6)

| Method | Parameters | Returns |
|--------|------------|---------|
| `fetchAllCampaigns()` | - | Campaign[] |
| `fetchCampaign()` | pubkey | Campaign \| null |
| `fetchMilestones()` | campaignPubkey | Milestone[] |
| `fetchContribution()` | campaignPubkey, contributorPubkey | Contribution \| null |
| `fetchAllContributions()` | campaignPubkey | Contribution[] |
| `isInitialized()` | - | boolean |

#### Helper Functions
```typescript
usdcToDisplay(baseUnits: number | BN): number
displayToUsdc(displayValue: number): BN
```

---

## 5. Smart Contract Functions

### 1. initialize()
- One-time setup for campaign counter
- Creates CampaignCounter PDA

### 2. create_campaign()
```rust
Parameters:
- title: String               // Max 80 chars
- short_description: String   // Max 200 chars
- category: Category          // Enum
- cover_image_url: String     // Max 200 chars
- story_url: String           // Max 200 chars
- funding_goal: u64           // USDC base units
- duration_days: u64          // 1-90 days
```

### 3. fund_campaign()
```rust
Parameters:
- amount: u64                 // USDC base units

Validations:
- Amount > 0
- Campaign active
- Deadline not passed
```

### 4. withdraw_funds()
```rust
Validations:
- Only campaign creator
- Funding goal met
- Vault has balance
```

### 5. add_milestone()
```rust
Parameters:
- title: String               // Max 100 chars
- target_amount: u64

Validations:
- Only creator
- Campaign active
- Milestone count < 10
```

### 6. complete_milestone()
```rust
Validations:
- Only creator
- Not already completed
- amount_raised >= target
```

### 7. close_campaign()
- Only creator can close
- Sets is_active = false

### 8. claim_refund()
```rust
Validations:
- Campaign not active
- Goal NOT met
- Refund not claimed
- Contribution > 0
```

---

## 6. Account Structures

### PDA Seeds
```
Campaign Counter: [b"campaign_counter"]
Campaign:         [b"campaign", creator, campaign_id]
Milestone:        [b"milestone", campaign, index]
Contribution:     [b"contribution", campaign, contributor]
Campaign Vault:   [b"campaign_vault", campaign]
```

### Campaign Account (800 bytes)
```rust
{
  campaign_id: u64
  creator: Pubkey
  title: String              // Max 80
  short_description: String  // Max 200
  category: Category
  cover_image_url: String    // Max 200
  story_url: String          // Max 200
  funding_goal: u64
  deadline: i64
  amount_raised: u64
  backer_count: u64
  is_active: bool
  created_at: i64
  milestone_count: u8
  bump: u8
}
```

### Milestone Account (160 bytes)
```rust
{
  campaign: Pubkey
  milestone_index: u8
  title: String              // Max 100
  target_amount: u64
  is_completed: bool
  bump: u8
}
```

### Contribution Account (96 bytes)
```rust
{
  campaign: Pubkey
  contributor: Pubkey
  amount: u64
  contributed_at: i64
  refund_claimed: bool
  bump: u8
}
```

---

## 7. State Management

### Provider Setup
**Location**: `/lib/providers.tsx`

```typescript
Providers (nested):
1. ThemeProvider
   - attribute: "class"
   - defaultTheme: "dark"

2. ConnectionProvider
   - endpoint: NEXT_PUBLIC_SOLANA_RPC

3. WalletProvider
   - Wallets: Phantom, Solflare, Torus, Ledger
   - autoConnect: true

4. WalletModalProvider
```

---

## 8. External Integrations

### IPFS (Pinata)
**Location**: `/lib/ipfs.ts`

```typescript
uploadToIPFS(file: File): Promise<string>
uploadTextToIPFS(text: string): Promise<string>
ipfsToHttp(ipfsUrl: string): string
```

**Endpoint**: `https://api.pinata.cloud/pinning/pinFileToIPFS`
**Gateway**: `https://gateway.pinata.cloud/ipfs/`

### Wallet Adapters
- PhantomWalletAdapter
- SolflareWalletAdapter
- TorusWalletAdapter
- LedgerWalletAdapter

---

## 9. Constants & Configuration

### Smart Contract Limits
| Constant | Value |
|----------|-------|
| MAX_TITLE_LENGTH | 80 |
| MAX_DESCRIPTION_LENGTH | 200 |
| MAX_URL_LENGTH | 200 |
| MAX_MILESTONE_TITLE_LENGTH | 100 |
| MAX_MILESTONES_PER_CAMPAIGN | 10 |
| MIN_CAMPAIGN_DURATION_DAYS | 1 |
| MAX_CAMPAIGN_DURATION_DAYS | 90 |

### Categories
```typescript
[
  { id: 'environment', label: 'Environment', icon: '🌱' },
  { id: 'education', label: 'Education', icon: '📚' },
  { id: 'healthcare', label: 'Healthcare', icon: '🏥' },
  { id: 'technology', label: 'Technology', icon: '💻' },
  { id: 'community', label: 'Community', icon: '🤝' },
  { id: 'arts', label: 'Arts & Culture', icon: '🎨' },
]
```

### Funding Tiers
```typescript
[
  { amount: 10, label: 'Supporter' },
  { amount: 50, label: 'Backer' },
  { amount: 100, label: 'Champion' },
  { amount: 500, label: 'Hero' },
]
```

### Environment Variables
```env
NEXT_PUBLIC_SOLANA_RPC=https://api.devnet.solana.com
NEXT_PUBLIC_PINATA_JWT=[your_jwt_token]
```

---

## 10. UI/UX Flows

### Campaign Creation Flow
```
1. Connect Wallet
   ↓
2. Step 1: Basics
   - Title, description, category
   - Cover image upload
   ↓
3. Step 2: Story
   - Detailed narrative (min 100 chars)
   ↓
4. Step 3: Funding
   - Goal, duration, milestones
   ↓
5. Step 4: Review & Launch
   ↓
6. Backend Process
   - Upload image to IPFS
   - Upload story to IPFS
   - Create campaign on-chain
   - Add milestones on-chain
```

### Campaign Funding Flow
```
1. Browse/Search campaigns
   ↓
2. View campaign details
   ↓
3. Select amount (tier or custom)
   ↓
4. Connect wallet (if needed)
   ↓
5. Approve transaction
   ↓
6. Success + activity refresh
```

### Campaign Completion Flow
```
Goal Met:
  → Creator withdraws funds
  → Full vault transferred

Goal Not Met:
  → Campaign closes
  → Backers claim refunds
```

---

## 11. Error Handling

### Smart Contract Errors (24)
| Error | Description |
|-------|-------------|
| Unauthorized | Not authorized for action |
| CampaignNotActive | Campaign is closed |
| CampaignStillActive | Campaign still running |
| CampaignEnded | Deadline passed |
| CampaignNotEnded | Deadline not passed |
| GoalWasMet | Cannot refund - goal met |
| GoalNotMet | Cannot withdraw - goal not met |
| WithdrawalNotAllowed | Invalid withdrawal state |
| RefundAlreadyClaimed | Double refund attempt |
| NoContribution | No contribution found |
| MilestoneAlreadyCompleted | Already completed |
| MilestoneTargetNotReached | Target not reached |
| MaxMilestonesReached | Max 10 milestones |
| TitleTooLong | Title > 80 chars |
| DescriptionTooLong | Description > 200 chars |
| UrlTooLong | URL > 200 chars |
| MilestoneTitleTooLong | Title > 100 chars |
| InvalidFundingGoal | Goal must be > 0 |
| InvalidContributionAmount | Amount must be > 0 |
| InvalidDuration | Duration 1-90 days |
| ArithmeticOverflow | Number overflow |
| InsufficientFunds | Empty vault |
| InvalidMint | Wrong USDC mint |
| InvalidTokenAccount | Wrong token account |

---

## 12. Types & Interfaces

### Campaign
```typescript
interface Campaign {
  publicKey: PublicKey
  campaignId: number
  creator: PublicKey
  title: string
  shortDescription: string
  category: string
  coverImageUrl: string
  storyUrl: string
  fundingGoal: number
  deadline: number
  amountRaised: number
  backerCount: number
  isActive: boolean
  createdAt: number
  milestoneCount: number
  bump: number
}
```

### Milestone
```typescript
interface Milestone {
  publicKey: PublicKey
  campaign: PublicKey
  milestoneIndex: number
  title: string
  targetAmount: number
  isCompleted: boolean
  bump: number
}
```

### Contribution
```typescript
interface Contribution {
  publicKey: PublicKey
  campaign: PublicKey
  contributor: PublicKey
  amount: number
  contributedAt: number
  refundClaimed: boolean
  bump: number
}
```

### Category Enum
```typescript
type CategoryKey = 'environment' | 'education' | 'healthcare' | 'technology' | 'community' | 'arts'
```

---

## 13. Routing & Pages

```
/                     Landing page
├── Hero section
├── Features
├── Stats
├── How It Works
├── Featured Campaigns
├── CTA
└── Footer

/explore              Campaign discovery
├── Search bar
├── Category filters
└── Campaign grid

/create               Campaign creation
├── Step indicator
├── Multi-step form
└── Navigation

/campaigns/[id]       Campaign details
├── Hero image
├── Campaign info
├── Funding card
├── Tabs (About/Updates/FAQ)
├── Milestones
└── Live Activity
```

---

## 14. Security Considerations

### Smart Contract
- PDA-based authorization
- Anchor constraint validation
- Overflow protection (checked arithmetic)
- Token mint verification
- Creator verification (`has_one = creator`)

### Frontend
- Wallet-signed transactions only
- Input validation (length limits, positive amounts)
- Error messages without sensitive data

### IPFS
- JWT authentication for uploads
- Content addressing for integrity

---

## 15. Key Files Reference

| File | Purpose |
|------|---------|
| `/lib/hooks/useHopeRise.ts` | Smart contract interaction hook |
| `/lib/solana/program.ts` | Program config, PDAs, types |
| `/lib/ipfs.ts` | IPFS upload utilities |
| `/lib/providers.tsx` | Wallet & theme providers |
| `/app/page.tsx` | Landing page |
| `/app/explore/page.tsx` | Campaign discovery |
| `/app/create/page.tsx` | Campaign creation wizard |
| `/app/campaigns/[id]/page.tsx` | Campaign details |
| `/components/campaigns/FundingActivity.tsx` | Live activity feed |
| `/smart-contract/.../lib.rs` | Smart contract core |
| `/smart-contract/.../state.rs` | Account structures |
| `/smart-contract/.../errors.rs` | Error codes |

---

## 16. Development Commands

```bash
# Frontend
pnpm dev              # Development server
pnpm build            # Production build
pnpm start            # Production server

# Smart Contract
cd smart-contract
anchor build          # Build program
anchor test           # Run tests
anchor deploy         # Deploy to network
```

---

## 17. Campaign State Machine

```
[Created]
    ↓
[Active] ←── Fund Campaign (multiple times)
    │
    ├── Complete Milestone (when target reached)
    │
    └── Close Campaign (creator action)
            ↓
        [Closed]
            │
            ├── Goal Met → Withdraw Funds
            │
            └── Goal Not Met → Claim Refunds
```

---

*Last Updated: January 2025*
