"use client"

import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PropertyCard } from "@/components/property-card"
import { useI18n } from "@/i18n/provider"
import { SectionHeader } from "@/components/sections/section-header"

export function FeaturedProperties({ properties, onPropertyClick }: { properties: any[]; onPropertyClick?: (p: any) => void }) {
  const { t, locale } = useI18n()
  const featured = properties.filter(p => p.featured).slice(0, 6)
  const toShow = featured.length > 0 ? featured : properties.slice(0, 6)

  if (toShow.length === 0) return null

  return (
    <section id="featured" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <SectionHeader
          title={t("home.featuredProperties")}
          subtitle={t("home.featuredSubtitle")}
          centered
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {toShow.map((p) => (
            <PropertyCard key={p.id} property={p} onClick={onPropertyClick} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button
            variant="outline"
            size="lg"
            onClick={() => document.getElementById("search")?.scrollIntoView({ behavior: "smooth" })}
            className="border-[#1e3a8a] dark:border-[#c9a84c] text-[#1e3a8a] dark:text-[#c9a84c] hover:bg-[#1e3a8a] hover:text-white dark:hover:bg-[#c9a84c] dark:hover:text-[#0a0f1e]"
          >
            {locale === "ar" ? "عرض جميع العقارات" : "View All Properties"}
            <ArrowRight className="h-4 w-4 ms-2 ltr-flip" />
          </Button>
        </div>
      </div>
    </section>
  )
}
