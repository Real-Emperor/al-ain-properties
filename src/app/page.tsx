"use client"

import { useState, useEffect } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { HeroSection } from "@/components/sections/hero"
import { SearchSection } from "@/components/sections/search-section"
import { FeaturedProperties } from "@/components/sections/featured-properties"
import { PopularAreas } from "@/components/sections/popular-areas"
import { CategoriesSection } from "@/components/sections/categories"
import { NewsSection } from "@/components/sections/news"
import { TestimonialsSection } from "@/components/sections/testimonials"
import { AboutSection } from "@/components/sections/about"
import { ContactSection } from "@/components/sections/contact"
import { PropertyDetailsModal } from "@/components/property-details-modal"
import { PropertyCardData } from "@/components/property-card"

export default function HomePage() {
  const [properties, setProperties] = useState<PropertyCardData[]>([])
  const [articles, setArticles] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [selectedProperty, setSelectedProperty] = useState<any | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Auto-seed on first visit
    const seedIfNeeded = async () => {
      try {
        await fetch("/api/seed", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) })
      } catch {}
    }

    const fetchData = async () => {
      try {
        await seedIfNeeded()
        const [propsRes, newsRes, statsRes] = await Promise.all([
          fetch("/api/properties"),
          fetch("/api/news"),
          fetch("/api/stats"),
        ])
        const propsData = await propsRes.json()
        const newsData = await newsRes.json()
        const statsData = await statsRes.json()
        setProperties(propsData.properties || [])
        setArticles(newsData.articles || [])
        setStats(statsData)
      } catch (e) {
        console.error("Failed to fetch data:", e)
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  const openProperty = (p: PropertyCardData) => {
    setSelectedProperty(p)
    setDetailsOpen(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c9a84c] mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Al Ain Properties...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <SearchSection properties={properties} onPropertyClick={openProperty} />
        <FeaturedProperties properties={properties} onPropertyClick={openProperty} />
        <PopularAreas propertyCounts={stats?.propertyCountsByArea || {}} />
        <CategoriesSection propertyCounts={stats?.propertyCountsByCategory || {}} />
        <AboutSection />
        <NewsSection articles={articles} />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <SiteFooter />
      <WhatsAppButton />
      <PropertyDetailsModal
        property={selectedProperty}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        allProperties={properties}
      />
    </div>
  )
}
