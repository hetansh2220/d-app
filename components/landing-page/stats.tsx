'use client'

import { motion, useInView, useSpring, useTransform } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'

const stats = [
  { value: 2.4, suffix: 'M+', label: 'Total Raised', prefix: '$' },
  { value: 1250, suffix: '+', label: 'Campaigns Funded', prefix: '' },
  { value: 48000, suffix: '+', label: 'Contributors', prefix: '' },
  { value: 89, suffix: '', label: 'Countries', prefix: '' },
]

function AnimatedNumber({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [displayValue, setDisplayValue] = useState(0)

  const spring = useSpring(0, { stiffness: 50, damping: 30 })
  const display = useTransform(spring, (latest) => {
    if (value < 100) {
      return latest.toFixed(1)
    }
    return Math.floor(latest).toLocaleString()
  })

  useEffect(() => {
    if (isInView) {
      spring.set(value)
    }
  }, [isInView, spring, value])

  useEffect(() => {
    const unsubscribe = display.on('change', (v) => {
      setDisplayValue(parseFloat(v.replace(/,/g, '')))
    })
    return unsubscribe
  }, [display])

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {value < 100 ? displayValue.toFixed(1) : Math.floor(displayValue).toLocaleString()}
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
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function Stats() {
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
                  <AnimatedNumber value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
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
