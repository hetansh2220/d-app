'use client'

import { motion, useInView, useSpring } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { useHopeRise, usdcToDisplay } from '@/lib/hooks/useHopeRise'

interface PlatformStats {
  totalRaised: number
  totalCampaigns: number
  totalContributors: number
  totalFunded: number
}

function AnimatedNumber({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [displayValue, setDisplayValue] = useState(value)

  const spring = useSpring(0, { stiffness: 50, damping: 30 })

  useEffect(() => {
    if (isInView) {
      spring.set(value)
    }
  }, [isInView, spring, value])

  useEffect(() => {
    const unsubscribe = spring.on('change', (latest) => {
      setDisplayValue(Math.floor(latest))
    })
    return unsubscribe
  }, [spring])

  // Update displayValue when value prop changes (for initial render)
  useEffect(() => {
    if (!isInView) {
      setDisplayValue(Math.floor(value))
    }
  }, [value, isInView])

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  )
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
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

export default function Stats() {
  const { fetchAllCampaigns } = useHopeRise()
  const fetchRef = useRef(fetchAllCampaigns)
  fetchRef.current = fetchAllCampaigns

  const [platformStats, setPlatformStats] = useState<PlatformStats>({
    totalRaised: 0,
    totalCampaigns: 0,
    totalContributors: 0,
    totalFunded: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const campaigns = await fetchRef.current()

        let totalRaised = 0
        let totalContributors = 0
        let totalFunded = 0

        campaigns.forEach(campaign => {
          totalRaised += usdcToDisplay(campaign.amountRaised)
          totalContributors += campaign.backerCount
          // Count as funded if reached goal
          if (campaign.amountRaised >= campaign.fundingGoal) {
            totalFunded++
          }
        })

        setPlatformStats({
          totalRaised,
          totalCampaigns: campaigns.length,
          totalContributors,
          totalFunded,
        })
      } catch (err) {
        console.error('Failed to fetch platform stats:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadStats()
  }, [])

  // Build stats array from real data
  const stats = [
    { value: platformStats.totalRaised, suffix: '', label: 'Total Raised', prefix: '$' },
    { value: platformStats.totalCampaigns, suffix: '', label: 'Total Campaigns', prefix: '' },
    { value: platformStats.totalContributors, suffix: '', label: 'Contributors', prefix: '' },
    { value: platformStats.totalFunded, suffix: '', label: 'Funded', prefix: '' },
  ]

  return (
    <section className="relative py-24 px-6 overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-hope/10 rounded-full blur-3xl" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={containerVariants}
        className="relative max-w-6xl mx-auto"
      >
        <div className="relative bg-card/30 backdrop-blur-sm border border-border rounded-3xl p-12 overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-grid-pattern opacity-30" />

          {/* Stats grid */}
          <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className="relative text-center group"
              >
                {/* Divider */}
                {index > 0 && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-16 bg-gradient-to-b from-transparent via-border to-transparent hidden lg:block" />
                )}

                {/* Number */}
                <div className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-2 group-hover:text-hope transition-colors duration-300">
                  {isLoading ? (
                    <span className="inline-block w-24 h-12 bg-secondary rounded animate-pulse" />
                  ) : (
                    <AnimatedNumber value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                  )}
                </div>

                {/* Label */}
                <div className="font-mono-alt text-sm text-muted-foreground tracking-wide uppercase">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
