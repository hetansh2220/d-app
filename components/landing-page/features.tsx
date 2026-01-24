'use client'

import { motion } from 'framer-motion'
import { Shield, Eye, Zap, Globe } from 'lucide-react'

const features = [
  {
    icon: Shield,
    title: 'Decentralized',
    description: 'No middlemen. Funds flow directly from supporters to creators through smart contracts on Solana.',
    gradient: 'from-emerald-500/20 to-teal-500/20',
  },
  {
    icon: Eye,
    title: 'Transparent',
    description: 'Every transaction is recorded on-chain. Track exactly where funds go in real-time.',
    gradient: 'from-cyan-500/20 to-blue-500/20',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Built on Solana for sub-second finality and fees that cost less than a penny.',
    gradient: 'from-yellow-500/20 to-orange-500/20',
  },
  {
    icon: Globe,
    title: 'Borderless',
    description: 'Fund projects from anywhere in the world. No banks, no borders, no limits.',
    gradient: 'from-purple-500/20 to-pink-500/20',
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

export default function Features() {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-50" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-hope/5 rounded-full blur-3xl" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={containerVariants}
        className="relative max-w-7xl mx-auto"
      >
        {/* Section header */}
        <motion.div variants={itemVariants} className="text-center mb-20">
          <span className="font-mono-alt text-hope text-sm tracking-widest uppercase">
            Why Choose Us
          </span>
          <h2 className="font-display text-4xl md:text-6xl font-bold mt-4 tracking-tight">
            Built for the{' '}
            <span className="text-gradient-hope">future</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mt-6">
            Traditional crowdfunding is broken. High fees, slow payouts, and zero transparency.
            We&apos;re fixing that with blockchain technology.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -4 }}
              className="group relative"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="relative bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 h-full hover:border-hope/30 transition-colors duration-300">
                {/* Icon */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-hope/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative w-14 h-14 bg-secondary rounded-xl flex items-center justify-center group-hover:bg-hope/10 transition-colors duration-300">
                    <feature.icon className="w-7 h-7 text-hope" strokeWidth={1.5} />
                  </div>
                </div>

                {/* Content */}
                <h3 className="font-display text-xl font-semibold mb-3 group-hover:text-hope transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>

                {/* Corner accent */}
                <div className="absolute top-4 right-4 font-mono-alt text-xs text-muted-foreground/30">
                  0{index + 1}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
