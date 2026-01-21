'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ChevronDown, ExternalLink } from 'lucide-react'
import Image from 'next/image'


export default function Hero() {
  return (
    <section className="relative min-h-screen px-6 pt-28 pb-16 flex items-center justify-center overflow-hidden bg-background">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.2 },
          },
        }}
        className="max-w-7xl w-full mx-auto"
      >
        {/* HERO TEXT + IMAGE */}
        <div className="flex flex-col items-center text-center gap-10">
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 },
            }}
            className="flex items-center justify-center gap-10 flex-wrap lg:flex-nowrap"
          >
            <h1 className="text-[4.5rem] md:text-[7rem] lg:text-[9rem] font-extrabold tracking-tight">
              Fund
            </h1>

            {/* FLOATING IMAGE */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden shadow-2xl"
            >
              <Image
                src="/img.png"
                alt="Crowdfunding"
                fill
                className="object-cover"
                priority
              />
            </motion.div>

            <h1 className="text-[4.5rem] md:text-[7rem] lg:text-[9rem] font-extrabold tracking-tight">
              Future
            </h1>
          </motion.div>

          {/* SUBTEXT */}
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="text-xl md:text-2xl max-w-2xl text-muted-foreground"
          >
            A decentralized crowdfunding platform on Solana —  
            transparent, trustless, and lightning fast.
          </motion.p>

          {/* CTA */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="flex flex-col sm:flex-row gap-6 mt-4"
          >
            <Button className="px-10 py-7 rounded-full text-base font-semibold bg-accent text-black hover:bg-accent/90">
              Launch App
            </Button>

            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#how-it-works"
              className="flex items-center gap-2 px-8 py-4 rounded-full border border-border font-semibold"
            >
              How it works
              <ExternalLink className="w-4 h-4" />
            </motion.a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
