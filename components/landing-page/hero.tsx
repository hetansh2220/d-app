'use client'

import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Play, Sparkles, TrendingUp, Users, Zap } from 'lucide-react'
import { useEffect } from 'react'
import Link from 'next/link'

function FloatingOrb({ delay = 0, size = 400, color = 'hope' }: { delay?: number; size?: number; color?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: [0.2, 0.4, 0.2],
        scale: [1, 1.1, 1],
        x: [0, 30, 0],
        y: [0, -20, 0],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        delay,
        ease: "easeInOut"
      }}
      className={`absolute rounded-full blur-3xl pointer-events-none ${
        color === 'hope'
          ? 'bg-hope/30 dark:bg-hope/40'
          : 'bg-blue-500/20 dark:bg-blue-500/30'
      }`}
      style={{
        width: size,
        height: size,
      }}
    />
  )
}

function StatBadge({ icon: Icon, value, label }: { icon: React.ElementType; value: string; label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05, y: -2 }}
      className="flex items-center gap-3 px-4 py-3 bg-card/80 backdrop-blur-sm border border-border rounded-2xl shadow-sm"
    >
      <div className="w-10 h-10 bg-hope/10 rounded-xl flex items-center justify-center">
        <Icon className="w-5 h-5 text-hope" />
      </div>
      <div>
        <p className="font-display font-bold text-lg">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </motion.div>
  )
}

function CampaignCard({ className = '' }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.8 }}
      className={`relative bg-card/90 backdrop-blur-md border border-border rounded-2xl p-5 w-72 shadow-lg dark:shadow-none ${className}`}
    >
      <div className="absolute -top-2 -right-2 px-3 py-1 bg-hope text-white text-xs font-bold rounded-full">
        LIVE
      </div>
      <div className="h-32 bg-gradient-to-br from-hope/20 to-emerald-500/10 rounded-xl mb-4 flex items-center justify-center">
        <div className="w-16 h-16 bg-hope/20 rounded-full flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-hope" />
        </div>
      </div>
      <h4 className="font-display font-semibold mb-1">Solar Water Project</h4>
      <p className="text-xs text-muted-foreground mb-4">Clean water for 10,000 families</p>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-hope font-semibold">$45,200</span>
          <span className="text-muted-foreground">of $60,000</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '75%' }}
            transition={{ delay: 1, duration: 1.5, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-hope to-emerald-400 rounded-full"
          />
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" /> 892 backers
          </span>
          <span>12 days left</span>
        </div>
      </div>
    </motion.div>
  )
}

export default function Hero() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useTransform(mouseY, [-300, 300], [5, -5])
  const rotateY = useTransform(mouseX, [-300, 300], [-5, 5])

  const springRotateX = useSpring(rotateX, { stiffness: 100, damping: 30 })
  const springRotateY = useSpring(rotateY, { stiffness: 100, damping: 30 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const { innerWidth, innerHeight } = window
      mouseX.set(clientX - innerWidth / 2)
      mouseY.set(clientY - innerHeight / 2)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <section className="relative min-h-screen px-6 pt-24 pb-16 flex items-center overflow-hidden bg-background">
      {/* Animated background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40" />
      <div className="absolute top-1/4 -left-32">
        <FloatingOrb size={600} delay={0} />
      </div>
      <div className="absolute bottom-1/4 -right-32">
        <FloatingOrb size={500} delay={2} color="blue" />
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <FloatingOrb size={800} delay={4} />
      </div>

      {/* Grain overlay */}
      <div className="absolute inset-0 bg-noise opacity-50 pointer-events-none" />

      <div className="relative max-w-7xl w-full mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left content */}
          <div className="space-y-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-hope/10 border border-hope/20 rounded-full"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-hope opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-hope"></span>
              </span>
              <span className="font-mono-alt text-sm text-hope">Built on Solana</span>
            </motion.div>

            {/* Main heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
                <span className="block">Crowdfunding</span>
                <span className="block mt-2">
                  without{' '}
                  <span className="relative inline-block">
                    <span className="text-gradient-hope">limits</span>
                    <motion.svg
                      className="absolute -bottom-2 left-0 w-full"
                      viewBox="0 0 200 12"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ delay: 0.8, duration: 0.8 }}
                    >
                      <motion.path
                        d="M2 8 Q 50 2, 100 8 T 198 6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        className="text-hope"
                      />
                    </motion.svg>
                  </span>
                </span>
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed"
            >
              Launch your campaign in minutes. No middlemen, no borders, no hidden fees.
              Just you, your supporters, and the blockchain.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/create">
                <Button
                  size="lg"
                  className="px-8 py-7 rounded-full text-lg font-semibold bg-hope text-white hover:bg-hope/90 glow-hope group"
                >
                  Start Campaign
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-7 rounded-full text-lg font-semibold hover:border-hope/50 hover:bg-hope/5 group"
              >
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Button>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-4 pt-4"
            >
              <StatBadge icon={TrendingUp} value="$2.4M+" label="Total Raised" />
              <StatBadge icon={Users} value="48K+" label="Contributors" />
              <StatBadge icon={Zap} value="<1s" label="Finality" />
            </motion.div>
          </div>

          {/* Right content - 3D Card */}
          <motion.div
            style={{
              rotateX: springRotateX,
              rotateY: springRotateY,
              transformStyle: 'preserve-3d',
            }}
            className="relative flex items-center justify-center lg:justify-end perspective-1000"
          >
            {/* Background decorative elements */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="absolute top-10 -left-8 w-64 h-64 border border-hope/20 rounded-full"
              style={{ transform: 'translateZ(-50px)' }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="absolute -bottom-10 right-10 w-48 h-48 border border-border rounded-full"
              style={{ transform: 'translateZ(-30px)' }}
            />

            {/* Main campaign card */}
            <CampaignCard className="relative z-10" />

            {/* Secondary floating elements */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="absolute -top-4 -right-4 lg:right-8 z-20"
              style={{ transform: 'translateZ(40px)' }}
            >
              <div className="px-4 py-3 bg-card backdrop-blur-sm border border-border rounded-xl shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-hope/20 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-hope" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Just funded</p>
                    <p className="font-semibold text-sm">+$2,400</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="absolute bottom-20 -left-8 lg:left-0 z-20"
              style={{ transform: 'translateZ(60px)' }}
            >
              <div className="px-4 py-3 bg-card backdrop-blur-sm border border-border rounded-xl shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="w-8 h-8 bg-gradient-to-br from-hope/50 to-emerald-500/50 rounded-full border-2 border-card" />
                    ))}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">+127 backers</p>
                    <p className="text-xs text-muted-foreground">this week</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-muted-foreground"
        >
          <span className="text-xs font-mono-alt uppercase tracking-widest">Scroll</span>
          <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center pt-2">
            <motion.div
              animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-hope rounded-full"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
