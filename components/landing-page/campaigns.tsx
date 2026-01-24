'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight, Users, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const campaigns = [
  {
    id: 1,
    title: 'Solar-Powered Water Purification',
    description: 'Bringing clean drinking water to rural communities using sustainable solar technology.',
    image: '/campaign-1.jpg',
    raised: 45000,
    goal: 60000,
    backers: 892,
    daysLeft: 12,
    category: 'Environment',
  },
  {
    id: 2,
    title: 'Open Source Education Platform',
    description: 'Building a free, decentralized learning platform accessible to students worldwide.',
    image: '/campaign-2.jpg',
    raised: 28500,
    goal: 40000,
    backers: 456,
    daysLeft: 21,
    category: 'Education',
  },
  {
    id: 3,
    title: 'Community Health Clinic',
    description: 'Establishing a mobile health clinic for underserved neighborhoods in urban areas.',
    image: '/campaign-3.jpg',
    raised: 72000,
    goal: 85000,
    backers: 1203,
    daysLeft: 5,
    category: 'Healthcare',
  },
]

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
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function Campaigns() {
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

        {/* Campaigns grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.map((campaign) => {
            const progress = (campaign.raised / campaign.goal) * 100

            return (
              <motion.div
                key={campaign.id}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="group"
              >
                <Link href={`/campaigns/${campaign.id}`} className="block">
                <div className="relative bg-card border border-border rounded-2xl overflow-hidden hover:border-hope/40 transition-all duration-300 hover:shadow-[0_0_60px_rgba(91,187,125,0.1)] cursor-pointer">
                  {/* Image placeholder */}
                  <div className="relative h-52 bg-gradient-to-br from-secondary to-muted overflow-hidden">
                    <div className="absolute inset-0 bg-hope/5 group-hover:bg-hope/10 transition-colors duration-300" />
                    {/* Category badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-background/80 backdrop-blur-sm text-xs font-medium rounded-full border border-border">
                        {campaign.category}
                      </span>
                    </div>
                    {/* Decorative pattern */}
                    <div className="absolute inset-0 bg-grid-pattern opacity-20" />
                    <div className="absolute bottom-4 right-4 font-display text-6xl font-bold text-white/5">
                      {String(campaign.id).padStart(2, '0')}
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
                          ${campaign.raised.toLocaleString()}
                        </span>
                        <span className="text-muted-foreground">
                          of ${campaign.goal.toLocaleString()}
                        </span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${progress}%` }}
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
      </motion.div>
    </section>
  )
}
