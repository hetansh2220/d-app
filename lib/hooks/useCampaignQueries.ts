'use client';

import { useQuery } from '@tanstack/react-query';
import { useConnection } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, BN } from '@coral-xyz/anchor';
import type { HopeRise } from '@/lib/idl/hope_rise';
import { PublicKey } from '@solana/web3.js';
import {
  idl,
  getCategoryString,
  type Campaign,
  type Milestone,
  type Contribution,
} from '@/lib/solana/program';

// Query keys for cache management
export const campaignKeys = {
  all: ['campaigns'] as const,
  lists: () => [...campaignKeys.all, 'list'] as const,
  list: (filters: string) => [...campaignKeys.lists(), filters] as const,
  details: () => [...campaignKeys.all, 'detail'] as const,
  detail: (id: string) => [...campaignKeys.details(), id] as const,
  milestones: (campaignId: string) => [...campaignKeys.all, 'milestones', campaignId] as const,
  contributions: (campaignId: string) => [...campaignKeys.all, 'contributions', campaignId] as const,
};

// Helper to create read-only program
function createReadOnlyProgram(connection: ReturnType<typeof useConnection>['connection']) {
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
}

// Transform raw campaign account to Campaign type
function transformCampaign(acc: { publicKey: PublicKey; account: Record<string, unknown> }): Campaign {
  return {
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
  };
}

/**
 * Hook to fetch all campaigns with caching
 * Cache time: 5 minutes
 */
export function useCampaigns() {
  const { connection } = useConnection();

  return useQuery({
    queryKey: campaignKeys.lists(),
    queryFn: async (): Promise<Campaign[]> => {
      const program = createReadOnlyProgram(connection);
      const accounts = await program.account.campaign.all();
      return accounts.map(transformCampaign);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to fetch featured/latest campaigns for landing page
 * Fetches all but only returns top N sorted by createdAt
 */
export function useFeaturedCampaigns(limit: number = 3) {
  const { connection } = useConnection();

  return useQuery({
    queryKey: [...campaignKeys.lists(), 'featured', limit],
    queryFn: async (): Promise<Campaign[]> => {
      const program = createReadOnlyProgram(connection);
      const accounts = await program.account.campaign.all();
      const campaigns = accounts.map(transformCampaign);

      // Sort by createdAt descending and take top N
      return campaigns
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, limit);
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook to fetch a single campaign by public key
 */
export function useCampaign(pubkeyString: string | undefined) {
  const { connection } = useConnection();

  return useQuery({
    queryKey: campaignKeys.detail(pubkeyString || ''),
    queryFn: async (): Promise<Campaign | null> => {
      if (!pubkeyString) return null;

      const program = createReadOnlyProgram(connection);
      const pubkey = new PublicKey(pubkeyString);
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
    },
    enabled: !!pubkeyString,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook to fetch milestones for a campaign
 */
export function useMilestones(campaignPubkey: string | undefined) {
  const { connection } = useConnection();

  return useQuery({
    queryKey: campaignKeys.milestones(campaignPubkey || ''),
    queryFn: async (): Promise<Milestone[]> => {
      if (!campaignPubkey) return [];

      const program = createReadOnlyProgram(connection);
      const pubkey = new PublicKey(campaignPubkey);

      const accounts = await program.account.milestone.all([
        {
          memcmp: {
            offset: 8,
            bytes: pubkey.toBase58(),
          },
        },
      ]);

      return accounts
        .map((acc) => ({
          publicKey: acc.publicKey,
          campaign: acc.account.campaign as PublicKey,
          milestoneIndex: acc.account.milestoneIndex as number,
          title: acc.account.title as string,
          targetAmount: (acc.account.targetAmount as BN).toNumber(),
          isCompleted: acc.account.isCompleted as boolean,
          bump: acc.account.bump as number,
        }))
        .sort((a, b) => a.milestoneIndex - b.milestoneIndex);
    },
    enabled: !!campaignPubkey,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch contributions for a campaign with auto-refetch
 * Used for live activity feed
 */
export function useContributions(campaignPubkey: string | undefined, options?: { refetchInterval?: number }) {
  const { connection } = useConnection();

  return useQuery({
    queryKey: campaignKeys.contributions(campaignPubkey || ''),
    queryFn: async (): Promise<Contribution[]> => {
      if (!campaignPubkey) return [];

      const program = createReadOnlyProgram(connection);
      const pubkey = new PublicKey(campaignPubkey);

      const accounts = await program.account.contribution.all([
        {
          memcmp: {
            offset: 8,
            bytes: pubkey.toBase58(),
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
        .sort((a, b) => b.contributedAt - a.contributedAt);
    },
    enabled: !!campaignPubkey,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000,
    refetchInterval: options?.refetchInterval || 10000, // Default 10 seconds polling
  });
}
