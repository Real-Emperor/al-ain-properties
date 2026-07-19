"use client"

import { Card } from "@/components/ui/card"
import { useI18n } from "@/i18n/provider"
import { PROPERTY_CATEGORIES } from "@/lib/site-config"
import { SectionHeader } from "./section-header"

export function CategoriesSection({ propertyCounts }: { propertyCounts: Record<string, number> }) {
  const { t, locale } = useI18n()

  return (
    <section id="categories" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <SectionHeader
          title={t("categories.title")}
          subtitle={t("categories.subtitle")}
          centered
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-10">
          {PROPERTY_CATEGORIES.map(cat => {
            const count = propertyCounts[cat.value] || 0
            return (
              <Card
                key={cat.value}
                className="card-hover cursor-pointer p-6 text-center group"
                onClick={() => {
                  // Update search filter and scroll to search section
                  window.dispatchEvent(new CustomEvent("filter-by-category", { detail: { type: cat.type, listingType: cat.listingType } }))
                  document.getElementById("search")?.scrollIntoView({ behavior: "smooth" })
                }}
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{cat.icon}</div>
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  {locale === "ar" ? cat.labelAr : cat.labelEn}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {count} {locale === "ar" ? "عقار" : "properties"}
                </p>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
