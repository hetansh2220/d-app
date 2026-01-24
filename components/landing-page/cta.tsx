'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'

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
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function CTA() {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-hope/5 to-background" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-hope/10 rounded-full blur-3xl" />
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-hope/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={containerVariants}
        className="relative max-w-5xl mx-auto"
      >
        <div className="relative text-center">
          {/* Decorative element */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-2 bg-hope/10 border border-hope/20 rounded-full mb-8"
          >
            <Sparkles className="w-4 h-4 text-hope" />
            <span className="font-mono-alt text-sm text-hope">Ready to make an impact?</span>
          </motion.div>

          {/* Main heading */}
          <motion.h2
            variants={itemVariants}
            className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8"
          >
            Start your
            <br />
            <span className="text-gradient-hope">campaign today</span>
          </motion.h2>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12"
          >
            Join thousands of creators who have brought their ideas to life.
            Zero platform fees. 100% of funds go to your project.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/create">
              <Button
                size="lg"
                className="px-10 py-7 rounded-full text-lg font-semibold bg-hope text-black hover:bg-hope/90 glow-hope group"
              >
                Create Campaign
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/explore">
              <Button
                variant="outline"
                size="lg"
                className="px-10 py-7 rounded-full text-lg font-semibold hover:border-hope/50 hover:bg-hope/5"
              >
                Explore Projects
              </Button>
            </Link>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            variants={itemVariants}
            className="mt-16 flex flex-wrap items-center justify-center gap-8 text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-hope rounded-full" />
              <span className="text-sm">No hidden fees</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-hope rounded-full" />
              <span className="text-sm">Instant payouts</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-hope rounded-full" />
              <span className="text-sm">Secure & transparent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-hope rounded-full" />
              <span className="text-sm">24/7 support</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
