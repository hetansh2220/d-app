'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { PublicKey } from '@solana/web3.js'
import { useContributions } from '@/lib/hooks/useCampaignQueries'
import { usdcToDisplay } from '@/lib/solana/program'
import { Users, Clock, TrendingUp, RefreshCw } from 'lucide-react'

interface FundingActivityProps {
  campaignPubkey: PublicKey
  onNewContribution?: () => void
}

function formatTimeAgo(timestamp: number): string {
  const now = Math.floor(Date.now() / 1000)
  const diff = now - timestamp

  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  return new Date(timestamp * 1000).toLocaleDateString()
}

function shortenAddress(address: string): string {
  return `${address.slice(0, 4)}...${address.slice(-4)}`
}

export default function FundingActivity({ campaignPubkey, onNewContribution }: FundingActivityProps) {
  const pubkeyString = campaignPubkey.toString()
  const lastCountRef = useRef(0)

  // Use TanStack Query with automatic 10-second polling
  const { data: contributions = [], isLoading, isFetching, refetch } = useContributions(pubkeyString, {
    refetchInterval: 10000,
  })

  // Detect new contributions and notify parent
  useEffect(() => {
    if (contributions.length > lastCountRef.current && lastCountRef.current > 0) {
      onNewContribution?.()
    }
    lastCountRef.current = contributions.length
  }, [contributions.length, onNewContribution])

  const manualRefresh = () => {
    refetch()
  }

  const isPolling = isFetching && !isLoading

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-hope" />
          <h3 className="font-display font-semibold">Live Activity</h3>
        </div>
        {/* Skeleton loading */}
        <div className="flex items-center gap-4 mb-4 pb-4 border-b border-border">
          <div className="h-4 bg-secondary rounded w-20 animate-pulse" />
          <div className="h-4 bg-secondary rounded w-24 animate-pulse" />
        </div>
        <div className="space-y-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between py-3 px-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-secondary rounded-full animate-pulse" />
                <div>
                  <div className="h-4 bg-secondary rounded w-20 mb-1 animate-pulse" />
                  <div className="h-3 bg-secondary rounded w-12 animate-pulse" />
                </div>
              </div>
              <div className="h-4 bg-secondary rounded w-16 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-hope" />
          <h3 className="font-display font-semibold">Live Activity</h3>
          <span className="relative flex h-2 w-2 ml-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-hope opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-hope"></span>
          </span>
        </div>
        <button
          onClick={manualRefresh}
          disabled={isPolling}
          className="p-2 hover:bg-secondary rounded-lg transition-colors disabled:opacity-50"
          title="Refresh"
        >
          <RefreshCw className={`w-4 h-4 text-muted-foreground ${isPolling ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 mb-4 pb-4 border-b border-border">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Users className="w-4 h-4" />
          <span>{contributions.length} backer{contributions.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>Updates live</span>
        </div>
      </div>

      {/* Activity Feed */}
      {contributions.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-sm">No contributions yet</p>
          <p className="text-muted-foreground text-xs mt-1">Be the first to back this campaign!</p>
        </div>
      ) : (
        <div className="space-y-1 max-h-80 overflow-y-auto">
          <AnimatePresence mode="popLayout">
            {contributions.slice(0, 20).map((contribution, index) => (
              <motion.div
                key={contribution.publicKey.toString()}
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.05,
                  ease: [0.22, 1, 0.36, 1]
                }}
                className="group"
              >
                <div className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-secondary/50 transition-colors duration-200">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-8 h-8 bg-gradient-to-br from-hope/30 to-emerald-500/30 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium">
                        {contribution.contributor.toString().slice(0, 2)}
                      </span>
                    </div>

                    {/* Info */}
                    <div>
                      <p className="text-sm font-medium font-mono">
                        {shortenAddress(contribution.contributor.toString())}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatTimeAgo(contribution.contributedAt)}
                      </p>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="text-right">
                    <p className="text-sm font-semibold text-hope">
                      +{usdcToDisplay(contribution.amount).toFixed(2)} USDC
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {contributions.length > 20 && (
            <p className="text-center text-xs text-muted-foreground pt-2">
              + {contributions.length - 20} more contributions
            </p>
          )}
        </div>
      )}
    </div>
  )
}
