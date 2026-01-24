'use client'

import { motion } from 'framer-motion'
import { Twitter, Github, MessageCircle, Mail } from 'lucide-react'

const footerLinks = {
  product: [
    { label: 'Explore Campaigns', href: '/explore' },
    { label: 'Create Campaign', href: '/create' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Pricing', href: '#' },
  ],
  resources: [
    { label: 'Documentation', href: '#' },
    { label: 'API', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'FAQ', href: '#' },
  ],
  company: [
    { label: 'About', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Contact', href: '#' },
    { label: 'Press Kit', href: '#' },
  ],
  legal: [
    { label: 'Terms of Service', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Cookie Policy', href: '#' },
  ],
}

const socialLinks = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: MessageCircle, href: '#', label: 'Discord' },
  { icon: Mail, href: '#', label: 'Email' },
]

export default function Footer() {
  return (
    <footer className="relative border-t border-border bg-card/30">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Main footer content */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-16">
          {/* Brand section */}
          <div className="col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="font-display font-bold text-2xl tracking-wider mb-4">
                FUNDRA
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-xs">
                Decentralized crowdfunding on Solana. Transparent, trustless, and lightning fast.
              </p>

              {/* Social links */}
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center hover:bg-hope/10 hover:text-hope transition-colors duration-300"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" strokeWidth={1.5} />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Links sections */}
          {Object.entries(footerLinks).map(([title, links], sectionIndex) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * sectionIndex }}
            >
              <h4 className="font-mono-alt text-xs uppercase tracking-widest text-muted-foreground mb-4">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-foreground/70 hover:text-hope transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="border-t border-border pt-8 mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h4 className="font-display font-semibold text-lg mb-1">
                Stay in the loop
              </h4>
              <p className="text-muted-foreground text-sm">
                Get updates on new features and exciting campaigns.
              </p>
            </div>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-3 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:border-hope/50 focus:ring-1 focus:ring-hope/20 min-w-[240px]"
              />
              <button className="px-6 py-3 bg-hope text-black font-semibold rounded-lg hover:bg-hope/90 transition-colors duration-200">
                Subscribe
              </button>
            </div>
          </div>
        </motion.div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Fundra. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Built on</span>
            <span className="font-semibold text-foreground">Solana</span>
            <span className="text-hope">◎</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
