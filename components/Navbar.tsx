'use client'

import { motion } from 'framer-motion'
import { Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Navbar() {
    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border"
        >
            <div className="max-w-8xl mx-auto px-6 py-6 flex items-center justify-between">
                {/* Logo */}
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 cursor-pointer"
                >
                    <span className="font-bold text-xl tracking-wider">HOPE RISE</span>
                </motion.div>

                {/* Navigation */}
                <nav className="hidden md:flex items-center gap-8 ">
                    {['Explore', 'Create campaign'].map(
                        (item) => (
                            <motion.a
                                key={item}
                                href="#"
                                whileHover={{ color: '#5bbb7d' }}
                                className="text-md font-semibold text-foreground/70 hover:text-accent transition-colors"
                            >
                                {item}
                            </motion.a>
                        )
                    )}
                </nav>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    <Button
                        className="bg-green-400 hover:bg-accent/90 text-black  font-semibold text-sm px-6 rounded-full"
                    >
                        Wallet Connect
                    </Button>
                </div>
            </div>
        </motion.header>
    )
}
