import Navbar from '@/components/landing-page/Navbar'
import Hero from '@/components/landing-page/hero'
import Features from '@/components/landing-page/features'
import HowItWorks from '@/components/landing-page/how-it-works'
import Stats from '@/components/landing-page/stats'
import Campaigns from '@/components/landing-page/campaigns'
import CTA from '@/components/landing-page/cta'
import Footer from '@/components/landing-page/footer'

function page() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Stats />
        <HowItWorks />
        <Campaigns />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}

export default page