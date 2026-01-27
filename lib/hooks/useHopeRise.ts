'use client';

import { useState, useCallback } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, BN } from '@coral-xyz/anchor';
import type { HopeRise } from '@/lib/idl/hope_rise';
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import {
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAccount,
  createAssociatedTokenAccountInstruction
} from '@solana/spl-token';
import {
  idl,
  getCampaignCounterPDA,
  getCampaignPDA,
  getMilestonePDA,
  getContributionPDA,
  getCampaignVaultPDA,
  getCategoryEnum,
  getCategoryString,
  displayToUsdc,
  usdcToDisplay,
  USDC_MINT,
  type Campaign,
  type Milestone,
  type Contribution,
} from '@/lib/solana/program';

export function useHopeRise() {
  const { publicKey, signTransaction, signAllTransactions, connected } = useWallet();
  const { connection } = useConnection();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const walletAddress = publicKey?.toBase58() || null;

  // Create program with wallet for write operations
  const getProgram = useCallback(async () => {
    if (!publicKey || !signTransaction) {
      throw new Error('Wallet not connected. Please connect your wallet and try again.');
    }

    const provider = new AnchorProvider(
      connection,
      {
        publicKey,
        signTransaction,
        signAllTransactions: signAllTransactions!,
      },
      { commitment: 'confirmed' }
    );

    return new Program<HopeRise>(idl as unknown as HopeRise, provider);
  }, [publicKey, signTransaction, signAllTransactions, connection]);

  // Read-only program for fetching data
  const getReadOnlyProgram = useCallback(() => {
    const provider = new AnchorProvider(
      connection,
      {
        publicKey: PublicKey.default,
        signTransaction: async (tx) => tx,
        signAllTransactions: async (txs) => txs,
      },
      { commitment: 'confirmed' }
    );
    return new Program<HopeRise>(idl as unknown as HopeRise, provider);
  }, [connection]);

  // Initialize campaign counter (one-time admin operation)
  const initialize = useCallback(async () => {
    if (!publicKey) throw new Error('Wallet not connected');
    setLoading(true);
    setError(null);

    try {
      const program = await getProgram();
      const [campaignCounterPda] = getCampaignCounterPDA();

      const tx = await program.methods
        .initialize()
        .accountsPartial({
          campaignCounter: campaignCounterPda,
          authority: publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      return tx;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to initialize';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [publicKey, getProgram]);

  // Create a new campaign
  const createCampaign = useCallback(async (params: {
    title: string;
    shortDescription: string;
    category: string;
    coverImageUrl: string;
    storyUrl: string;
    fundingGoalUsdc: number;
    durationDays: number;
  }) => {
    if (!publicKey) throw new Error('Wallet not connected');
    setLoading(true);
    setError(null);

    try {
      const program = await getProgram();
      const [campaignCounterPda] = getCampaignCounterPDA();

      // Check if counter is initialized, if not initialize it first
      let counter;
      try {
        counter = await program.account.campaignCounter.fetch(campaignCounterPda);
      } catch {
        // Counter not initialized, initialize it first
        await program.methods
          .initialize()
          .accountsPartial({
            campaignCounter: campaignCounterPda,
            authority: publicKey,
            systemProgram: SystemProgram.programId,
          })
          .rpc();

        // Fetch the counter after initialization
        counter = await program.account.campaignCounter.fetch(campaignCounterPda);
      }

      const [campaignPda] = getCampaignPDA(publicKey, counter.count);

      const tx = await program.methods
        .createCampaign(
          params.title,
          params.shortDescription,
          getCategoryEnum(params.category),
          params.coverImageUrl,
          params.storyUrl,
          displayToUsdc(params.fundingGoalUsdc),
          new BN(params.durationDays)
        )
        .accountsPartial({
          campaign: campaignPda,
          campaignCounter: campaignCounterPda,
          creator: publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      return { tx, campaignPda };

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create campaign';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [publicKey, getProgram]);
  
  // Fund a campaign with USDC
  const fundCampaign = useCallback(async (
    campaignPubkey: PublicKey,
    amountUsdc: number
  ) => {
    if (!publicKey || !signTransaction) throw new Error('Wallet not connected');
    setLoading(true);
    setError(null);

    try {
      const program = await getProgram();
      const [contributionPda] = getContributionPDA(campaignPubkey, publicKey);
      const [campaignVaultPda] = getCampaignVaultPDA(campaignPubkey);

      // Get contributor's USDC ATA
      const contributorTokenAccount = await getAssociatedTokenAddress(
        USDC_MINT,
        publicKey
      );

      // Check if contributor's USDC token account exists, create if not
      try {
        await getAccount(connection, contributorTokenAccount);
      } catch {
        // Account doesn't exist, create it first
        const createAtaIx = createAssociatedTokenAccountInstruction(
          publicKey, // payer
          contributorTokenAccount, // ata address
          publicKey, // owner
          USDC_MINT // mint
        );

        const createAtaTx = new Transaction().add(createAtaIx);
        createAtaTx.feePayer = publicKey;
        const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
        createAtaTx.recentBlockhash = blockhash;

        const signedTx = await signTransaction(createAtaTx);
        const sig = await connection.sendRawTransaction(signedTx.serialize());
        await connection.confirmTransaction({
          signature: sig,
          blockhash,
          lastValidBlockHeight
        });
      }

      const tx = await program.methods
        .fundCampaign(displayToUsdc(amountUsdc))
        .accountsPartial({
          campaign: campaignPubkey,
          campaignVault: campaignVaultPda,
          contribution: contributionPda,
          contributor: publicKey,
          contributorTokenAccount: contributorTokenAccount,
          usdcMint: USDC_MINT,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      return tx;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fund campaign';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [publicKey, signTransaction, connection, getProgram]);

  // Withdraw USDC funds (creator only)
  const withdrawFunds = useCallback(async (campaignPubkey: PublicKey) => {
    if (!publicKey) throw new Error('Wallet not connected');
    setLoading(true);
    setError(null);

    try {
      const program = await getProgram();
      const [campaignVaultPda] = getCampaignVaultPDA(campaignPubkey);

      // Get creator's USDC ATA
      const creatorTokenAccount = await getAssociatedTokenAddress(
        USDC_MINT,
        publicKey
      );

      const tx = await program.methods
        .withdrawFunds()
        .accountsPartial({
          campaign: campaignPubkey,
          campaignVault: campaignVaultPda,
          creator: publicKey,
          creatorTokenAccount: creatorTokenAccount,
          usdcMint: USDC_MINT,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      return tx;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to withdraw funds';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [publicKey, getProgram]);

  // Add milestone to campaign
  const addMilestone = useCallback(async (
    campaignPubkey: PublicKey,
    milestoneIndex: number,
    title: string,
    targetAmountUsdc: number
  ) => {
    if (!publicKey) throw new Error('Wallet not connected');
    setLoading(true);
    setError(null);

    try {
      const program = await getProgram();
      const [milestonePda] = getMilestonePDA(campaignPubkey, milestoneIndex);

      const tx = await program.methods
        .addMilestone(title, displayToUsdc(targetAmountUsdc))
        .accountsPartial({
          campaign: campaignPubkey,
          milestone: milestonePda,
          creator: publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      return tx;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to add milestone';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [publicKey, getProgram]);

  // Complete milestone
  const completeMilestone = useCallback(async (
    campaignPubkey: PublicKey,
    milestonePubkey: PublicKey
  ) => {
    if (!publicKey) throw new Error('Wallet not connected');
    setLoading(true);
    setError(null);

    try {
      const program = await getProgram();

      const tx = await program.methods
        .completeMilestone()
        .accountsPartial({
          campaign: campaignPubkey,
          milestone: milestonePubkey,
          creator: publicKey,
        })
        .rpc();

      return tx;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to complete milestone';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [publicKey, getProgram]);

  // Close campaign
  const closeCampaign = useCallback(async (campaignPubkey: PublicKey) => {
    if (!publicKey) throw new Error('Wallet not connected');
    setLoading(true);
    setError(null);

    try {
      const program = await getProgram();

      const tx = await program.methods
        .closeCampaign()
        .accountsPartial({
          campaign: campaignPubkey,
          creator: publicKey,
        })
        .rpc();

      return tx;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to close campaign';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [publicKey, getProgram]);

  // Claim USDC refund
  const claimRefund = useCallback(async (campaignPubkey: PublicKey) => {
    if (!publicKey) throw new Error('Wallet not connected');
    setLoading(true);
    setError(null);

    try {
      const program = await getProgram();
      const [contributionPda] = getContributionPDA(campaignPubkey, publicKey);
      const [campaignVaultPda] = getCampaignVaultPDA(campaignPubkey);

      // Get contributor's USDC ATA
      const contributorTokenAccount = await getAssociatedTokenAddress(
        USDC_MINT,
        publicKey
      );

      const tx = await program.methods
        .claimRefund()
        .accountsPartial({
          campaign: campaignPubkey,
          campaignVault: campaignVaultPda,
          contribution: contributionPda,
          contributor: publicKey,
          contributorTokenAccount: contributorTokenAccount,
          usdcMint: USDC_MINT,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      return tx;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to claim refund';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [publicKey, getProgram]);

  // Fetch all campaigns
  const fetchAllCampaigns = useCallback(async (): Promise<Campaign[]> => {
    try {
      const program = getReadOnlyProgram();
      const accounts = await program.account.campaign.all();

      return accounts.map((acc) => ({
        publicKey: acc.publicKey,
        campaignId: (acc.account.campaignId as BN).toNumber(),
        creator: acc.account.creator as PublicKey,
        title: acc.account.title as string,
        shortDescription: acc.account.shortDescription as string,
        category: getCategoryString(acc.account.category as Record<string, object>),
        coverImageUrl: acc.account.coverImageUrl as string,
        storyUrl: acc.account.storyUrl as string,
        fundingGoal: (acc.account.fundingGoal as BN).toNumber(),
        deadline: (acc.account.deadline as BN).toNumber(),
        amountRaised: (acc.account.amountRaised as BN).toNumber(),
        backerCount: (acc.account.backerCount as BN).toNumber(),
        isActive: acc.account.isActive as boolean,
        createdAt: (acc.account.createdAt as BN).toNumber(),
        milestoneCount: acc.account.milestoneCount as number,
        bump: acc.account.bump as number,
      }));
    } catch (err) {
      console.error('Failed to fetch campaigns:', err);
      return [];
    }
  }, [getReadOnlyProgram]);

  // Fetch single campaign
  const fetchCampaign = useCallback(async (pubkey: PublicKey): Promise<Campaign | null> => {
    try {
      const program = getReadOnlyProgram();
      const acc = await program.account.campaign.fetch(pubkey);

      return {
        publicKey: pubkey,
        campaignId: (acc.campaignId as BN).toNumber(),
        creator: acc.creator as PublicKey,
        title: acc.title as string,
        shortDescription: acc.shortDescription as string,
        category: getCategoryString(acc.category as Record<string, object>),
        coverImageUrl: acc.coverImageUrl as string,
        storyUrl: acc.storyUrl as string,
        fundingGoal: (acc.fundingGoal as BN).toNumber(),
        deadline: (acc.deadline as BN).toNumber(),
        amountRaised: (acc.amountRaised as BN).toNumber(),
        backerCount: (acc.backerCount as BN).toNumber(),
        isActive: acc.isActive as boolean,
        createdAt: (acc.createdAt as BN).toNumber(),
        milestoneCount: acc.milestoneCount as number,
        bump: acc.bump as number,
      };
    } catch (err) {
      console.error('Failed to fetch campaign:', err);
      return null;
    }
  }, [getReadOnlyProgram]);

  // Fetch milestones for a campaign
  const fetchMilestones = useCallback(async (campaignPubkey: PublicKey): Promise<Milestone[]> => {
    try {
      const program = getReadOnlyProgram();
      const accounts = await program.account.milestone.all([
        {
          memcmp: {
            offset: 8, // after discriminator
            bytes: campaignPubkey.toBase58(),
          },
        },
      ]);

      return accounts.map((acc) => ({
        publicKey: acc.publicKey,
        campaign: acc.account.campaign as PublicKey,
        milestoneIndex: acc.account.milestoneIndex as number,
        title: acc.account.title as string,
        targetAmount: (acc.account.targetAmount as BN).toNumber(),
        isCompleted: acc.account.isCompleted as boolean,
        bump: acc.account.bump as number,
      })).sort((a, b) => a.milestoneIndex - b.milestoneIndex);
    } catch (err) {
      console.error('Failed to fetch milestones:', err);
      return [];
    }
  }, [getReadOnlyProgram]);

  // Fetch contribution for a campaign and user
  const fetchContribution = useCallback(async (
    campaignPubkey: PublicKey,
    contributorPubkey: PublicKey
  ): Promise<Contribution | null> => {
    try {
      const program = getReadOnlyProgram();
      const [contributionPda] = getContributionPDA(campaignPubkey, contributorPubkey);
      const acc = await program.account.contribution.fetch(contributionPda);

      return {
        publicKey: contributionPda,
        campaign: acc.campaign as PublicKey,
        contributor: acc.contributor as PublicKey,
        amount: (acc.amount as BN).toNumber(),
        contributedAt: (acc.contributedAt as BN).toNumber(),
        refundClaimed: acc.refundClaimed as boolean,
        bump: acc.bump as number,
      };
    } catch {
      return null;
    }
  }, [getReadOnlyProgram]);

  // Fetch all contributions for a campaign (for live activity feed)
  const fetchAllContributions = useCallback(async (
    campaignPubkey: PublicKey
  ): Promise<Contribution[]> => {
    try {
      const program = getReadOnlyProgram();
      // Filter contributions by campaign pubkey (offset 8 is after discriminator)
      const accounts = await program.account.contribution.all([
        {
          memcmp: {
            offset: 8, // after discriminator
            bytes: campaignPubkey.toBase58(),
          },
        },
      ]);

      return accounts
        .map((acc) => ({
          publicKey: acc.publicKey,
          campaign: acc.account.campaign as PublicKey,
          contributor: acc.account.contributor as PublicKey,
          amount: (acc.account.amount as BN).toNumber(),
          contributedAt: (acc.account.contributedAt as BN).toNumber(),
          refundClaimed: acc.account.refundClaimed as boolean,
          bump: acc.account.bump as number,
        }))
        .sort((a, b) => b.contributedAt - a.contributedAt); // Sort by newest first
    } catch (err) {
      console.error('Failed to fetch contributions:', err);
      return [];
    }
  }, [getReadOnlyProgram]);

  // Check if campaign counter is initialized
  const isInitialized = useCallback(async (): Promise<boolean> => {
    try {
      const program = getReadOnlyProgram();
      const [campaignCounterPda] = getCampaignCounterPDA();
      await program.account.campaignCounter.fetch(campaignCounterPda);
      return true;
    } catch {
      return false;
    }
  }, [getReadOnlyProgram]);

  return {
    // State
    loading,
    error,
    connected,
    publicKey,
    walletAddress,

    // Write operations
    initialize,
    createCampaign,
    fundCampaign,
    withdrawFunds,
    addMilestone,
    completeMilestone,
    closeCampaign,
    claimRefund,

    // Read operations
    fetchAllCampaigns,
    fetchCampaign,
    fetchMilestones,
    fetchContribution,
    fetchAllContributions,
    isInitialized,

    // Helpers (USDC conversion)
    usdcToDisplay,
    displayToUsdc,
  };
}

export { usdcToDisplay, displayToUsdc };
export type { Campaign, Milestone, Contribution };
