"use client"

import { Card } from "@/components/ui/card"
import { useI18n } from "@/i18n/provider"
import { PROPERTY_CATEGORIES } from "@/lib/site-config"
import { SectionHeader } from "./section-header"
import Link from "next/link"

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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-10">
          {PROPERTY_CATEGORIES.map(cat => {
            const count = propertyCounts[cat.value] || 0
            return (
              <Link key={cat.value} href={`/properties/category/${cat.value}`}>
                <Card className="card-hover cursor-pointer p-6 text-center group h-full">
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{cat.icon}</div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">
                    {locale === "ar" ? cat.labelAr : cat.labelEn}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {count} {locale === "ar" ? "عقار" : "properties"}
                  </p>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
