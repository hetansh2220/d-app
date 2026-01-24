'use client'

import { motion } from 'framer-motion'
import { Search, Filter, TrendingUp, Clock, Users, ArrowUpRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useState } from 'react'
import Navbar from '@/components/landing-page/Navbar'

const categories = ['All', 'Environment', 'Education', 'Healthcare', 'Technology', 'Community', 'Arts']

const campaigns = [
  {
    id: '1',
    title: 'Solar-Powered Water Purification',
    description: 'Bringing clean drinking water to rural communities using sustainable solar technology.',
    raised: 45000,
    goal: 60000,
    backers: 892,
    daysLeft: 12,
    category: 'Environment',
    creator: 'GreenFuture DAO',
    featured: true,
  },
  {
    id: '2',
    title: 'Open Source Education Platform',
    description: 'Building a free, decentralized learning platform accessible to students worldwide.',
    raised: 28500,
    goal: 40000,
    backers: 456,
    daysLeft: 21,
    category: 'Education',
    creator: 'EduChain Collective',
    featured: false,
  },
  {
    id: '3',
    title: 'Community Health Clinic',
    description: 'Establishing a mobile health clinic for underserved neighborhoods in urban areas.',
    raised: 72000,
    goal: 85000,
    backers: 1203,
    daysLeft: 5,
    category: 'Healthcare',
    creator: 'HealthFirst Initiative',
    featured: true,
  },
  {
    id: '4',
    title: 'Decentralized Art Gallery',
    description: 'Creating a virtual gallery to showcase and sell digital art from emerging artists.',
    raised: 15000,
    goal: 25000,
    backers: 234,
    daysLeft: 30,
    category: 'Arts',
    creator: 'ArtBlock Studios',
    featured: false,
  },
  {
    id: '5',
    title: 'AI-Powered Crop Monitoring',
    description: 'Developing affordable drone technology for small-scale farmers to monitor crop health.',
    raised: 38000,
    goal: 50000,
    backers: 567,
    daysLeft: 18,
    category: 'Technology',
    creator: 'AgriTech Labs',
    featured: false,
  },
  {
    id: '6',
    title: 'Youth Coding Bootcamp',
    description: 'Free coding workshops for underprivileged youth in developing countries.',
    raised: 22000,
    goal: 30000,
    backers: 389,
    daysLeft: 25,
    category: 'Education',
    creator: 'CodeForAll',
    featured: true,
  },
  {
    id: '7',
    title: 'Ocean Cleanup Initiative',
    description: 'Deploying autonomous boats to collect plastic waste from coastal waters.',
    raised: 95000,
    goal: 120000,
    backers: 1876,
    daysLeft: 8,
    category: 'Environment',
    creator: 'BlueOcean DAO',
    featured: false,
  },
  {
    id: '8',
    title: 'Mental Health App',
    description: 'Building a free, privacy-focused mental health support application.',
    raised: 18500,
    goal: 35000,
    backers: 312,
    daysLeft: 45,
    category: 'Healthcare',
    creator: 'MindWell Labs',
    featured: false,
  },
]

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
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
}

function CampaignCard({ campaign }: { campaign: typeof campaigns[0] }) {
  const progress = (campaign.raised / campaign.goal) * 100

  return (
    <motion.div variants={itemVariants} whileHover={{ y: -6 }} className="group">
      <Link href={`/campaigns/${campaign.id}`}>
        <div className="relative bg-card border border-border rounded-2xl overflow-hidden hover:border-hope/40 transition-all duration-300 hover:shadow-[0_0_60px_rgba(91,187,125,0.1)] h-full">
          {/* Image placeholder */}
          <div className="relative h-48 bg-gradient-to-br from-secondary to-muted overflow-hidden">
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
            <div className="absolute inset-0 bg-grid-pattern opacity-20" />
            <div className="absolute bottom-4 right-4 font-display text-6xl font-bold text-white/5">
              {String(campaign.id).padStart(2, '0')}
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
                  ${campaign.raised.toLocaleString()}
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

  const filteredCampaigns = campaigns.filter((campaign) => {
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

          {/* Empty state */}
          {filteredCampaigns.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="font-display text-2xl font-semibold mb-2">No campaigns found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your search or filters</p>
              <Button onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}>
                Clear filters
              </Button>
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
