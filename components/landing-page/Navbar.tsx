'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { usePrivy } from '@privy-io/react-auth'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { Menu, X, Mail, LogOut, Sun, Moon } from 'lucide-react'
import { useState, useEffect } from 'react'

const navLinks = [
  { label: 'Explore', href: '/explore' },
  { label: 'Create Campaign', href: '/create' },
]

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-full bg-secondary animate-pulse" />
    )
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="relative w-10 h-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden group"
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait">
        {theme === 'dark' ? (
          <motion.div
            key="moon"
            initial={{ y: 20, opacity: 0, rotate: -90 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -20, opacity: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            <Moon className="w-5 h-5 text-hope" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ y: 20, opacity: 0, rotate: -90 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -20, opacity: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            <Sun className="w-5 h-5 text-hope" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

export default function Navbar() {
  const { login, logout, authenticated, user } = usePrivy()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const walletAddress = user?.wallet?.address
  const shortenedAddress = walletAddress
    ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`
    : null

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-8 h-8 bg-hope rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="font-display font-bold text-xl tracking-wider">FUNDRA</span>
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href}>
              <motion.span
                whileHover={{ color: 'var(--hope)' }}
                className="text-sm font-medium text-foreground/70 hover:text-hope transition-colors cursor-pointer"
              >
                {link.label}
              </motion.span>
            </Link>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Toggle */}
          <ThemeToggle />

          {authenticated ? (
            <div className="flex items-center gap-3">
              {/* Wallet address */}
              <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-full">
                <div className="w-2 h-2 bg-hope rounded-full" />
                <span className="text-sm font-mono">{shortenedAddress}</span>
              </div>

              {/* Logout button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => logout()}
                className="rounded-full hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => login()}
              className="rounded-full px-6 bg-hope text-white hover:bg-hope/90 font-semibold"
            >
              <Mail className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            className="p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-background/95 backdrop-blur-md border-b border-border"
          >
            <div className="px-6 py-4 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="py-2 text-foreground/70 hover:text-hope transition-colors">
                    {link.label}
                  </div>
                </Link>
              ))}

              <div className="pt-4 border-t border-border">
                {authenticated ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-xl">
                      <div className="w-2 h-2 bg-hope rounded-full" />
                      <span className="text-sm font-mono">{shortenedAddress}</span>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => { logout(); setMobileMenuOpen(false); }}
                      className="w-full rounded-xl"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Disconnect
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => { login(); setMobileMenuOpen(false); }}
                    className="w-full rounded-xl bg-hope text-white hover:bg-hope/90"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
