'use client'

import { motion } from 'framer-motion'
import { Search, Filter, TrendingUp, Clock, Users, ArrowUpRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useState, useMemo } from 'react'
import Navbar from '@/components/landing-page/Navbar'
import { useCampaigns } from '@/lib/hooks/useCampaignQueries'
import { usdcToDisplay } from '@/lib/solana/program'
import { ipfsToHttp } from '@/lib/ipfs'

const categories = ['All', 'Environment', 'Education', 'Healthcare', 'Technology', 'Community', 'Arts']

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
}

function CampaignCardSkeleton() {
  return (
    <div className="relative bg-card border border-border rounded-2xl overflow-hidden h-full">
      {/* Image skeleton */}
      <div className="relative h-48 bg-secondary animate-pulse">
        <div className="absolute top-4 right-4">
          <div className="w-20 h-6 bg-muted rounded-full" />
        </div>
      </div>
      {/* Content skeleton */}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 bg-secondary rounded-full animate-pulse" />
          <div className="h-3 bg-secondary rounded w-16 animate-pulse" />
        </div>
        <div className="h-5 bg-secondary rounded w-3/4 mb-2 animate-pulse" />
        <div className="h-4 bg-secondary rounded w-full mb-1 animate-pulse" />
        <div className="h-4 bg-secondary rounded w-2/3 mb-5 animate-pulse" />
        {/* Progress skeleton */}
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <div className="h-4 bg-secondary rounded w-20 animate-pulse" />
            <div className="h-4 bg-secondary rounded w-12 animate-pulse" />
          </div>
          <div className="h-2 bg-secondary rounded-full animate-pulse" />
        </div>
        {/* Meta skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-4 bg-secondary rounded w-20 animate-pulse" />
          <div className="h-4 bg-secondary rounded w-20 animate-pulse" />
        </div>
      </div>
    </div>
  )
}

interface DisplayCampaign {
  id: string;
  title: string;
  description: string;
  raised: number;
  goal: number;
  backers: number;
  daysLeft: number;
  category: string;
  creator: string;
  featured: boolean;
  publicKey: string;
  coverImageUrl?: string;
}

function CampaignCard({ campaign }: { campaign: DisplayCampaign }) {
  const progress = (campaign.raised / campaign.goal) * 100
  const imageUrl = campaign.coverImageUrl ? ipfsToHttp(campaign.coverImageUrl) : ''

  return (
    <motion.div variants={itemVariants} whileHover={{ y: -6 }} className="group">
      <Link href={`/campaigns/${campaign.publicKey}`}>
        <div className="relative bg-card border border-border rounded-2xl overflow-hidden hover:border-hope/40 transition-all duration-300 hover:shadow-[0_0_60px_rgba(91,187,125,0.1)] h-full">
          {/* Campaign image */}
          <div className="relative h-48 bg-gradient-to-br from-secondary to-muted overflow-hidden">
            {imageUrl ? (
              <img src={imageUrl} alt={campaign.title} className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 bg-grid-pattern opacity-20" />
            )}
            <div className="absolute inset-0 bg-hope/5 group-hover:bg-hope/10 transition-colors duration-300" />
            {campaign.featured && (
              <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 bg-hope text-black text-xs font-bold rounded-full">
                <Sparkles className="w-3 h-3" />
                Featured
              </div>
            )}
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 bg-background/80 backdrop-blur-sm text-xs font-medium rounded-full border border-border">
                {campaign.category}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-hope/20 rounded-full" />
              <span className="text-xs text-muted-foreground">{campaign.creator}</span>
            </div>

            <h3 className="font-display text-lg font-semibold mb-2 group-hover:text-hope transition-colors duration-300 line-clamp-1">
              {campaign.title}
            </h3>
            <p className="text-muted-foreground text-sm mb-5 line-clamp-2">
              {campaign.description}
            </p>

            {/* Progress bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold text-hope">
                  {campaign.raised.toLocaleString()} USDC
                </span>
                <span className="text-muted-foreground">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-hope to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(progress, 100)}%` }}
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
}

export default function ExplorePage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const { data: campaigns, isLoading } = useCampaigns()

  // Transform and filter campaigns
  const allCampaigns = useMemo((): DisplayCampaign[] => {
    if (!campaigns) return []

    const now = Math.floor(Date.now() / 1000)

    return campaigns.map((c) => ({
      id: c.publicKey.toString(),
      title: c.title,
      description: c.shortDescription,
      raised: usdcToDisplay(c.amountRaised),
      goal: usdcToDisplay(c.fundingGoal),
      backers: c.backerCount,
      daysLeft: Math.max(0, Math.floor((c.deadline - now) / 86400)),
      category: c.category,
      creator: c.creator.toString().slice(0, 4) + '...' + c.creator.toString().slice(-4),
      featured: c.amountRaised > c.fundingGoal * 0.5,
      publicKey: c.publicKey.toString(),
      coverImageUrl: c.coverImageUrl,
    }))
  }, [campaigns])

  const filteredCampaigns = allCampaigns.filter((campaign) => {
    const matchesCategory = activeCategory === 'All' || campaign.category === activeCategory
    const matchesSearch = campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero section */}
      <section className="relative pt-32 pb-16 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-hope/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight mb-4">
              Explore <span className="text-gradient-hope">Campaigns</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover innovative projects making a difference. Back the ones you believe in.
            </p>
          </motion.div>

          {/* Search and filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col md:flex-row gap-4 mb-8"
          >
            {/* Search bar */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-hope/50 focus:ring-1 focus:ring-hope/20 transition-all"
              />
            </div>

            {/* Filter button */}
            <Button variant="outline" className="px-6 py-4 rounded-xl h-auto">
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </Button>
          </motion.div>

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap gap-3 mb-12"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-hope text-black'
                    : 'bg-secondary text-foreground hover:bg-secondary/80'
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* Results count */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center justify-between mb-8"
          >
            <p className="text-muted-foreground">
              Showing <span className="text-foreground font-semibold">{filteredCampaigns.length}</span> campaigns
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="w-4 h-4" />
              <span>Sorted by trending</span>
            </div>
          </motion.div>

          {/* Campaign grid */}
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <CampaignCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredCampaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </motion.div>
          )}

          {/* Empty state */}
          {!isLoading && filteredCampaigns.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="font-display text-2xl font-semibold mb-2">
                {searchQuery || activeCategory !== 'All' ? 'No campaigns found' : 'No campaigns yet'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery || activeCategory !== 'All'
                  ? 'Try adjusting your search or filters'
                  : 'Be the first to create a campaign on Fundra!'}
              </p>
              {searchQuery || activeCategory !== 'All' ? (
                <Button onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}>
                  Clear filters
                </Button>
              ) : (
                <Link href="/create">
                  <Button className="bg-hope text-black hover:bg-hope/90">
                    Create Campaign
                  </Button>
                </Link>
              )}
            </motion.div>
          )}

          {/* Load more */}
          {filteredCampaigns.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex justify-center mt-12"
            >
              <Button variant="outline" size="lg" className="px-8 rounded-full group">
                Load More
                <ArrowUpRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Button>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}
