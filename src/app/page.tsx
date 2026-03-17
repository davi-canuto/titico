import Header from '@/components/Header'
import Hero from '@/components/Hero'
import About from '@/components/About'
import MatchupGrid from '@/components/MatchupGrid'
import BuyGuide from '@/components/BuyGuide'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <MatchupGrid />
      <About />
      <BuyGuide />
      <Footer />
    </>
  )
}
