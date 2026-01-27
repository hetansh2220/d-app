'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight, Users, Clock, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useHopeRise } from '@/lib/hooks/useHopeRise'
import { usdcToDisplay } from '@/lib/solana/program'
import { ipfsToHttp } from '@/lib/ipfs'

interface DisplayCampaign {
  id: string
  title: string
  description: string
  raised: number
  goal: number
  backers: number
  daysLeft: number
  category: string
  publicKey: string
  coverImageUrl?: string
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
}

export default function Campaigns() {
  const { fetchAllCampaigns } = useHopeRise()
  const [campaigns, setCampaigns] = useState<DisplayCampaign[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        const blockchainCampaigns = await fetchAllCampaigns()
        const now = Math.floor(Date.now() / 1000)

        // Sort by createdAt descending (latest first) and take top 3
        const sortedCampaigns = [...blockchainCampaigns].sort((a, b) => b.createdAt - a.createdAt)

        const displayCampaigns: DisplayCampaign[] = sortedCampaigns
          .slice(0, 3) // Show latest 3 campaigns
          .map((c) => ({
            id: c.publicKey.toString(),
            title: c.title,
            description: c.shortDescription,
            raised: usdcToDisplay(c.amountRaised),
            goal: usdcToDisplay(c.fundingGoal),
            backers: c.backerCount,
            daysLeft: Math.max(0, Math.floor((c.deadline - now) / 86400)),
            category: c.category,
            publicKey: c.publicKey.toString(),
            coverImageUrl: c.coverImageUrl,
          }))

        setCampaigns(displayCampaigns)
      } catch (err) {
        console.error('Failed to fetch campaigns:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadCampaigns()
  }, [fetchAllCampaigns])

  return (
    <section className="relative py-32 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={containerVariants}
        className="relative max-w-7xl mx-auto"
      >
        {/* Section header */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
          <div>
            <span className="font-mono-alt text-hope text-sm tracking-widest uppercase">
              Trending Now
            </span>
            <h2 className="font-display text-4xl md:text-6xl font-bold mt-4 tracking-tight">
              Featured{' '}
              <span className="text-gradient-hope">campaigns</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mt-4">
              Discover projects that are making a real difference. Back the ones you believe in.
            </p>
          </div>
          <Link href="/explore">
            <Button
              variant="outline"
              className="mt-6 md:mt-0 rounded-full px-6 group"
            >
              View All Campaigns
              <ArrowUpRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Button>
          </Link>
        </motion.div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-hope" />
            <span className="ml-3 text-muted-foreground">Loading campaigns...</span>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && campaigns.length === 0 && (
          <motion.div variants={itemVariants} className="text-center py-16">
            <p className="text-muted-foreground mb-4">No campaigns yet. Be the first to create one!</p>
            <Link href="/create">
              <Button className="bg-hope text-black hover:bg-hope/90">
                Create Campaign
              </Button>
            </Link>
          </motion.div>
        )}

        {/* Campaigns grid */}
        {!isLoading && campaigns.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {campaigns.map((campaign, index) => {
              const progress = (campaign.raised / campaign.goal) * 100
              const imageUrl = campaign.coverImageUrl ? ipfsToHttp(campaign.coverImageUrl) : ''

              return (
                <motion.div
                  key={campaign.id}
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  className="group"
                >
                  <Link href={`/campaigns/${campaign.publicKey}`} className="block">
                  <div className="relative bg-card border border-border rounded-2xl overflow-hidden hover:border-hope/40 transition-all duration-300 hover:shadow-[0_0_60px_rgba(91,187,125,0.1)] cursor-pointer">
                    {/* Image */}
                    <div className="relative h-52 bg-gradient-to-br from-secondary to-muted overflow-hidden">
                      {imageUrl ? (
                        <img src={imageUrl} alt={campaign.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
                      )}
                      <div className="absolute inset-0 bg-hope/5 group-hover:bg-hope/10 transition-colors duration-300" />
                      {/* Category badge */}
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-background/80 backdrop-blur-sm text-xs font-medium rounded-full border border-border">
                          {campaign.category}
                        </span>
                      </div>
                      {/* On-chain badge */}
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 bg-hope/90 text-black text-xs font-bold rounded-full">
                          On-Chain
                        </span>
                      </div>
                      <div className="absolute bottom-4 right-4 font-display text-6xl font-bold text-white/5">
                        {String(index + 1).padStart(2, '0')}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="font-display text-xl font-semibold mb-2 group-hover:text-hope transition-colors duration-300 line-clamp-1">
                        {campaign.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-6 line-clamp-2">
                        {campaign.description}
                      </p>

                      {/* Progress bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-semibold text-hope">
                            ${campaign.raised.toFixed(2)} USDC
                          </span>
                          <span className="text-muted-foreground">
                            of ${campaign.goal.toFixed(2)} USDC
                          </span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${Math.min(progress, 100)}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                            className="h-full bg-gradient-to-r from-hope to-emerald-400 rounded-full"
                          />
                        </div>
                      </div>

                      {/* Meta info */}
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Users className="w-4 h-4" />
                          <span>{campaign.backers} backers</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          <span>{campaign.daysLeft} days left</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        )}
      </motion.div>
    </section>
  )
}
