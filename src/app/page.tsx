import Header from '@/components/Header'
import Hero from '@/components/Hero'
import VideoSection from '@/components/VideoSection'
import MatchupGrid from '@/components/MatchupGrid'
import About from '@/components/About'
import BuyGuide from '@/components/BuyGuide'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <VideoSection />
      <MatchupGrid />
      <About />
      <BuyGuide />
      <Footer />
    </>
  )
}
