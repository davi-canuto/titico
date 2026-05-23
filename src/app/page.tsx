import { auth } from '@/lib/auth'
import LandingHeader from '@/components/landing/LandingHeader'
import Hero from '@/components/landing/Hero'
import VideoSection from '@/components/landing/VideoSection'
import MatchupGrid from '@/components/landing/MatchupGrid'
import About from '@/components/landing/About'
import PricingSection from '@/components/landing/PricingSection'
import LandingFooter from '@/components/landing/LandingFooter'

export default async function RootPage() {
  const session = await auth()

  return (
    <div className="bg-[#0d0d0d] text-white min-h-screen">
      <LandingHeader isAuthenticated={!!session} />
      <main className="pt-16">
        <Hero />
        <VideoSection />
        <MatchupGrid />
        <About />
        <PricingSection />
      </main>
      <LandingFooter />
    </div>
  )
}
