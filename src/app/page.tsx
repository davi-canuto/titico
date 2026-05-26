import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import LandingHeader from '@/components/landing/LandingHeader'
import Hero from '@/components/landing/Hero'
import ProductsCTA from '@/components/landing/ProductsCTA'
import VideoSection from '@/components/landing/VideoSection'
import MatchupGrid from '@/components/landing/MatchupGrid'
import About from '@/components/landing/About'
import PricingSection from '@/components/landing/PricingSection'
import LandingFooter from '@/components/landing/LandingFooter'

const PDF_PRODUCT_SLUG = 'guia-shaco-ad'

export default async function RootPage() {
  const [session, products, pdfProduct] = await Promise.all([
    auth(),
    prisma.product.findMany({
      where: { active: true },
      select: { id: true, slug: true, calSlug: true },
    }),
    prisma.product.findUnique({
      where: { slug: PDF_PRODUCT_SLUG, active: true },
      select: { id: true },
    }),
  ])

  const productsBySlug = Object.fromEntries(products.map((p) => [p.slug, { id: p.id, calSlug: p.calSlug ?? '' }]))

  return (
    <div className="bg-[#0d0d0d] text-white min-h-screen">
      <LandingHeader isAuthenticated={!!session} />
      <main className="pt-16">
        <Hero />
        <ProductsCTA isAuthenticated={!!session} productsBySlug={productsBySlug} pdfProductId={pdfProduct?.id ?? null} />
        <VideoSection />
        <MatchupGrid />
        <About />
        <PricingSection />
      </main>
      <LandingFooter />
    </div>
  )
}
