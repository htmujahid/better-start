import { createFileRoute } from '@tanstack/react-router'

import { Header } from '@/components/header'
import { HeroSection } from '@/components/marketing/hero-section'
import { Footer } from '@/components/footer'
import { Features } from '@/components/marketing/features'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="">
      <Header />
      <HeroSection />
      <Features />
      <Footer />
    </div>
  )
}
