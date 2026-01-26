import { Program, AnchorProvider, Idl, BN } from '@coral-xyz/anchor';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import idl from '@/lib/idl/hope_rise.json';

// Program ID from the deployed contract
export const PROGRAM_ID = new PublicKey('BAaDjLVffrtNzgKLoUjmM9t1tWBHxMF6UFdnL1NYmQ3J');

// Circle's official USDC Mint on Solana devnet (faucet: https://faucet.circle.com/)
export const USDC_MINT = new PublicKey('Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr');

// USDC has 6 decimals
export const USDC_DECIMALS = 6;

// Connection to Solana devnet
export const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

// PDA Seeds
export const CAMPAIGN_COUNTER_SEED = 'campaign_counter';
export const CAMPAIGN_SEED = 'campaign';
export const MILESTONE_SEED = 'milestone';
export const CONTRIBUTION_SEED = 'contribution';
export const CAMPAIGN_VAULT_SEED = 'campaign_vault';

// Category enum mapping
export const CategoryEnum = {
  environment: { environment: {} },
  education: { education: {} },
  healthcare: { healthcare: {} },
  technology: { technology: {} },
  community: { community: {} },
  arts: { arts: {} },
} as const;

export type CategoryKey = keyof typeof CategoryEnum;

// Helper to convert category string to enum
export function getCategoryEnum(category: string) {
  const key = category.toLowerCase() as CategoryKey;
  return CategoryEnum[key] || CategoryEnum.community;
}

// Helper to convert category enum to string
export function getCategoryString(category: Record<string, object>): string {
  const key = Object.keys(category)[0];
  return key.charAt(0).toUpperCase() + key.slice(1);
}

// PDA derivation helpers
export function getCampaignCounterPDA(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(CAMPAIGN_COUNTER_SEED)],
    PROGRAM_ID
  );
}

export function getCampaignPDA(creator: PublicKey, campaignId: BN | number): [PublicKey, number] {
  const id = typeof campaignId === 'number' ? new BN(campaignId) : campaignId;
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(CAMPAIGN_SEED),
      creator.toBuffer(),
      id.toArrayLike(Buffer, 'le', 8),
    ],
    PROGRAM_ID
  );
}

export function getMilestonePDA(campaignPubkey: PublicKey, milestoneIndex: number): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(MILESTONE_SEED),
      campaignPubkey.toBuffer(),
      Buffer.from([milestoneIndex]),
    ],
    PROGRAM_ID
  );
}

export function getContributionPDA(campaignPubkey: PublicKey, contributor: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(CONTRIBUTION_SEED),
      campaignPubkey.toBuffer(),
      contributor.toBuffer(),
    ],
    PROGRAM_ID
  );
}

// Get campaign vault PDA (token account that holds USDC)
export function getCampaignVaultPDA(campaignPubkey: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(CAMPAIGN_VAULT_SEED),
      campaignPubkey.toBuffer(),
    ],
    PROGRAM_ID
  );
}

// Helper to convert USDC base units to display value (6 decimals)
export function usdcToDisplay(baseUnits: number | BN): number {
  const value = typeof baseUnits === 'number' ? baseUnits : baseUnits.toNumber();
  return value / Math.pow(10, USDC_DECIMALS);
}

// Helper to convert display value to USDC base units
export function displayToUsdc(displayValue: number): BN {
  return new BN(Math.floor(displayValue * Math.pow(10, USDC_DECIMALS)));
}

// Legacy aliases for backwards compatibility
export const lamportsToSol = usdcToDisplay;
export const solToLamports = displayToUsdc;

// Campaign type for frontend
export interface Campaign {
  publicKey: PublicKey;
  campaignId: number;
  creator: PublicKey;
  title: string;
  shortDescription: string;
  category: string;
  coverImageUrl: string;
  storyUrl: string;
  fundingGoal: number; // in USDC base units (6 decimals)
  deadline: number; // unix timestamp
  amountRaised: number; // in USDC base units (6 decimals)
  backerCount: number;
  isActive: boolean;
  createdAt: number; // unix timestamp
  milestoneCount: number;
  bump: number;
}

// Milestone type for frontend
export interface Milestone {
  publicKey: PublicKey;
  campaign: PublicKey;
  milestoneIndex: number;
  title: string;
  targetAmount: number; // in USDC base units (6 decimals)
  isCompleted: boolean;
  bump: number;
}

// Contribution type for frontend
export interface Contribution {
  publicKey: PublicKey;
  campaign: PublicKey;
  contributor: PublicKey;
  amount: number; // in USDC base units (6 decimals)
  contributedAt: number; // unix timestamp
  refundClaimed: boolean;
  bump: number;
}

// Get program instance (without wallet - for read-only operations)
export function getReadOnlyProgram(): Program {
  const provider = new AnchorProvider(
    connection,
    {
      publicKey: PublicKey.default,
      signTransaction: async (tx) => tx,
      signAllTransactions: async (txs) => txs,
    },
    { commitment: 'confirmed' }
  );
  return new Program(idl as Idl, provider);
}

// Export IDL for use in components
export { idl };
