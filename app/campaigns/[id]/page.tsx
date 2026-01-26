'use client'

import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Share2,
  Heart,
  Users,
  Clock,
  Target,
  CheckCircle2,
  ExternalLink,
  Twitter,
  Copy,
  Wallet,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Navbar from '@/components/landing-page/Navbar'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useHopeRise, usdcToDisplay, type Campaign, type Milestone } from '@/lib/hooks/useHopeRise'
import { PublicKey } from '@solana/web3.js'
import { ipfsToHttp } from '@/lib/ipfs'

const fundingTiers = [
  { amount: 10, label: 'Supporter', description: 'Show your support for this cause' },
  { amount: 50, label: 'Backer', description: 'Get exclusive project updates' },
  { amount: 100, label: 'Champion', description: 'Your name on the donor wall' },
  { amount: 500, label: 'Hero', description: 'VIP access + all previous rewards' },
]

interface DisplayCampaign {
  id: string
  title: string
  description: string
  longDescription: string
  raised: number
  goal: number
  backers: number
  daysLeft: number
  category: string
  creator: string
  creatorWallet: string
  updates: { date: string; title: string; content: string }[]
  milestones: { title: string; amount: number; completed: boolean }[]
  faqs: { question: string; answer: string }[]
  publicKey: PublicKey
  coverImageUrl?: string
}

export default function CampaignDetailPage() {
  const params = useParams()
  const id = params.id as string

  const { connected } = useWallet()
  const { fetchCampaign, fetchMilestones, fundCampaign, loading, publicKey } = useHopeRise()

  const [campaign, setCampaign] = useState<DisplayCampaign | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTier, setSelectedTier] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState('')
  const [activeTab, setActiveTab] = useState<'about' | 'updates' | 'faq'>('about')
  const [isFunding, setIsFunding] = useState(false)
  const [fundingError, setFundingError] = useState<string | null>(null)
  const [fundingSuccess, setFundingSuccess] = useState(false)

  // Load campaign data from blockchain
  useEffect(() => {
    const loadCampaign = async () => {
      setIsLoading(true)

      try {
        const pubkey = new PublicKey(id)
        const blockchainCampaign = await fetchCampaign(pubkey)

        if (blockchainCampaign) {
          const now = Math.floor(Date.now() / 1000)
          const milestones = await fetchMilestones(pubkey)

          setCampaign({
            id: blockchainCampaign.publicKey.toString(),
            title: blockchainCampaign.title,
            description: blockchainCampaign.shortDescription,
            longDescription: `Campaign created on Hope Rise blockchain platform.\n\nFunding Goal: ${usdcToDisplay(blockchainCampaign.fundingGoal).toFixed(2)} USDC\nAmount Raised: ${usdcToDisplay(blockchainCampaign.amountRaised).toFixed(2)} USDC\n\nThis campaign is stored on the Solana blockchain and all contributions are transparent and verifiable.`,
            raised: usdcToDisplay(blockchainCampaign.amountRaised),
            goal: usdcToDisplay(blockchainCampaign.fundingGoal),
            backers: blockchainCampaign.backerCount,
            daysLeft: Math.max(0, Math.floor((blockchainCampaign.deadline - now) / 86400)),
            category: blockchainCampaign.category,
            creator: blockchainCampaign.creator.toString().slice(0, 4) + '...' + blockchainCampaign.creator.toString().slice(-4),
            creatorWallet: blockchainCampaign.creator.toString(),
            updates: [],
            milestones: milestones.map(m => ({
              title: m.title,
              amount: usdcToDisplay(m.targetAmount),
              completed: m.isCompleted,
            })),
            faqs: [],
            publicKey: blockchainCampaign.publicKey,
            coverImageUrl: blockchainCampaign.coverImageUrl,
          })
        } else {
          setCampaign(null)
        }
      } catch (err) {
        console.error('Failed to fetch campaign:', err)
        setCampaign(null)
      }

      setIsLoading(false)
    }

    loadCampaign()
  }, [id, fetchCampaign, fetchMilestones])

  const progress = campaign ? (campaign.raised / campaign.goal) * 100 : 0

  const handleFund = async () => {
    if (!connected || !campaign) {
      return
    }

    const amount = selectedTier || Number(customAmount)
    if (!amount || amount <= 0) return

    setIsFunding(true)
    setFundingError(null)

    try {
      await fundCampaign(campaign.publicKey, amount)
      setFundingSuccess(true)
      setSelectedTier(null)
      setCustomAmount('')

      // Refresh campaign data
      const updatedCampaign = await fetchCampaign(campaign.publicKey)
      if (updatedCampaign) {
        setCampaign(prev => prev ? {
          ...prev,
          raised: usdcToDisplay(updatedCampaign.amountRaised),
          backers: updatedCampaign.backerCount,
        } : null)
      }

      setTimeout(() => setFundingSuccess(false), 5000)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fund campaign'
      setFundingError(message)
    } finally {
      setIsFunding(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-hope" />
          <span className="ml-3 text-muted-foreground">Loading campaign...</span>
        </div>
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 px-6">
          <div className="max-w-md mx-auto text-center">
            <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="font-display text-2xl font-bold mb-2">Campaign Not Found</h1>
            <p className="text-muted-foreground mb-6">This campaign does not exist or has been removed.</p>
            <Link href="/explore">
              <Button className="bg-hope text-black hover:bg-hope/90">
                Explore Campaigns
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Back button */}
      <div className="pt-24 px-6">
        <div className="max-w-7xl mx-auto">
          <Link href="/explore">
            <Button variant="ghost" className="mb-6 -ml-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Explore
            </Button>
          </Link>
        </div>
      </div>

      <div className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Hero image */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative h-64 md:h-96 bg-gradient-to-br from-secondary to-muted rounded-2xl overflow-hidden"
              >
                {campaign.coverImageUrl && ipfsToHttp(campaign.coverImageUrl) ? (
                  <img
                    src={ipfsToHttp(campaign.coverImageUrl)}
                    alt={campaign.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-grid-pattern opacity-20" />
                )}
                <div className="absolute top-4 right-4 flex gap-2">
                  <span className="px-3 py-1 bg-hope/90 text-black text-xs font-bold rounded-full">
                    On-Chain
                  </span>
                  <span className="px-4 py-2 bg-background/90 backdrop-blur-sm text-sm font-medium rounded-full border border-border">
                    {campaign.category}
                  </span>
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-hope/20 rounded-full flex items-center justify-center">
                      <span className="text-hope font-bold">{campaign.creator.slice(0, 2).toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="text-sm text-white/70">Created by</p>
                      <p className="font-semibold text-white">{campaign.creator}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Title and description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
                  {campaign.title}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {campaign.description}
                </p>
              </motion.div>

              {/* Tabs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex gap-1 p-1 bg-secondary rounded-xl mb-6">
                  {(['about', 'updates', 'faq'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                        activeTab === tab
                          ? 'bg-background text-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      {tab === 'updates' && campaign.updates.length > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-hope/20 text-hope text-xs rounded-full">
                          {campaign.updates.length}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Tab content */}
                {activeTab === 'about' && (
                  <div className="prose prose-invert max-w-none">
                    <div className="text-muted-foreground whitespace-pre-line leading-relaxed">
                      {campaign.longDescription}
                    </div>
                  </div>
                )}

                {activeTab === 'updates' && (
                  <div className="space-y-6">
                    {campaign.updates.length > 0 ? (
                      campaign.updates.map((update, i) => (
                        <div key={i} className="p-6 bg-card border border-border rounded-xl">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-xs text-muted-foreground">{update.date}</span>
                          </div>
                          <h3 className="font-display font-semibold text-lg mb-2">{update.title}</h3>
                          <p className="text-muted-foreground">{update.content}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-center py-8">No updates yet</p>
                    )}
                  </div>
                )}

                {activeTab === 'faq' && (
                  <div className="space-y-4">
                    {campaign.faqs.length > 0 ? (
                      campaign.faqs.map((faq, i) => (
                        <div key={i} className="p-6 bg-card border border-border rounded-xl">
                          <h3 className="font-semibold mb-2">{faq.question}</h3>
                          <p className="text-muted-foreground text-sm">{faq.answer}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-center py-8">No FAQs yet</p>
                    )}
                  </div>
                )}
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Funding card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="sticky top-28 p-6 bg-card border border-border rounded-2xl"
              >
                {/* Progress */}
                <div className="mb-6">
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="font-display text-3xl font-bold text-hope">
                      {campaign.raised.toFixed(2)} USDC
                    </span>
                    <span className="text-muted-foreground">
                      of {campaign.goal.toFixed(2)} USDC
                    </span>
                  </div>
                  <div className="h-3 bg-secondary rounded-full overflow-hidden mb-4">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(progress, 100)}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-hope to-emerald-400 rounded-full"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="font-semibold">{Math.round(progress)}%</p>
                      <p className="text-xs text-muted-foreground">Funded</p>
                    </div>
                    <div>
                      <p className="font-semibold">{campaign.backers}</p>
                      <p className="text-xs text-muted-foreground">Backers</p>
                    </div>
                    <div>
                      <p className="font-semibold">{campaign.daysLeft}</p>
                      <p className="text-xs text-muted-foreground">Days Left</p>
                    </div>
                  </div>
                </div>

                {/* Success message */}
                {fundingSuccess && (
                  <div className="mb-4 p-3 bg-hope/10 border border-hope/20 rounded-xl">
                    <div className="flex items-center gap-2 text-hope">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="text-sm font-medium">Thank you for your contribution!</span>
                    </div>
                  </div>
                )}

                {/* Error message */}
                {fundingError && (
                  <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-xl">
                    <div className="flex items-center gap-2 text-destructive">
                      <AlertCircle className="w-5 h-5" />
                      <span className="text-sm">{fundingError}</span>
                    </div>
                  </div>
                )}

                {/* Funding tiers */}
                <div className="space-y-3 mb-6">
                  <p className="text-sm font-medium text-muted-foreground">
                    Select amount (USDC)
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {fundingTiers.map((tier) => (
                      <button
                        key={tier.amount}
                        onClick={() => { setSelectedTier(tier.amount); setCustomAmount(''); }}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          selectedTier === tier.amount
                            ? 'border-hope bg-hope/10'
                            : 'border-border hover:border-hope/50'
                        }`}
                      >
                        <p className="font-semibold">{tier.amount} USDC</p>
                        <p className="text-xs text-muted-foreground">{tier.label}</p>
                      </button>
                    ))}
                  </div>

                  {/* Custom amount */}
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                      USDC
                    </span>
                    <input
                      type="number"
                      placeholder="Custom amount"
                      value={customAmount}
                      onChange={(e) => { setCustomAmount(e.target.value); setSelectedTier(null); }}
                      className="w-full pl-14 pr-4 py-3 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-hope/50"
                    />
                  </div>
                </div>

                {/* Fund button */}
                {connected ? (
                  <Button
                    onClick={handleFund}
                    className="w-full py-6 rounded-xl text-lg font-semibold bg-hope text-black hover:bg-hope/90 glow-hope mb-4"
                    disabled={(!selectedTier && !customAmount) || isFunding}
                  >
                    {isFunding ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Wallet className="w-5 h-5 mr-2" />
                        Fund This Project
                      </>
                    )}
                  </Button>
                ) : (
                  <WalletMultiButton className="!w-full !py-6 !rounded-xl !text-lg !font-semibold !bg-hope !text-black hover:!bg-hope/90 !justify-center !mb-4" />
                )}

                {/* Share buttons */}
                <div className="flex items-center justify-center gap-3">
                  <Button variant="outline" size="sm" className="rounded-full">
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-full">
                    <Twitter className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-full">
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-full">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* Milestones */}
                {campaign.milestones.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <p className="text-sm font-medium mb-4 flex items-center gap-2">
                      <Target className="w-4 h-4 text-hope" />
                      Funding Milestones
                    </p>
                    <div className="space-y-3">
                      {campaign.milestones.map((milestone, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            milestone.completed ? 'bg-hope/20' : 'bg-secondary'
                          }`}>
                            {milestone.completed ? (
                              <CheckCircle2 className="w-4 h-4 text-hope" />
                            ) : (
                              <span className="text-xs text-muted-foreground">{i + 1}</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className={`text-sm ${milestone.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {milestone.title}
                            </p>
                          </div>
                          <span className={`text-sm ${milestone.completed ? 'text-hope' : 'text-muted-foreground'}`}>
                            {milestone.amount.toFixed(2)} USDC
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Creator info */}
                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-hope/20 rounded-full flex items-center justify-center">
                      <span className="text-hope font-bold text-sm">{campaign.creator.slice(0, 2).toUpperCase()}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{campaign.creator}</p>
                      <p className="text-xs text-muted-foreground font-mono truncate">{campaign.creatorWallet}</p>
                    </div>
                    <a
                      href={`https://explorer.solana.com/address/${campaign.creatorWallet}?cluster=devnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="ghost" size="sm" className="rounded-full">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
