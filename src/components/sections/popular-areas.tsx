"use client"

import { Card } from "@/components/ui/card"
import { useI18n } from "@/i18n/provider"
import { AL_AIN_AREAS } from "@/lib/site-config"
import { MapPin } from "lucide-react"
import { SectionHeader } from "./section-header"

export function PopularAreas({ propertyCounts }: { propertyCounts: Record<string, number> }) {
  const { t, locale } = useI18n()

  return (
    <section id="areas" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <SectionHeader
          title={t("home.popularAreas")}
          subtitle={t("home.popularAreasSubtitle")}
          centered
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 mt-10">
          {AL_AIN_AREAS.map(area => {
            const count = propertyCounts[area.value] || 0
            return (
              <Card
                key={area.value}
                className="relative overflow-hidden card-hover group cursor-pointer p-0 border-0"
                onClick={() => {
                  // Update search filter and scroll to search section
                  window.dispatchEvent(new CustomEvent("filter-by-area", { detail: area.value }))
                  document.getElementById("search")?.scrollIntoView({ behavior: "smooth" })
                }}
              >
                <div className="aspect-[16/10] relative">
                  <img
                    src={getAreaImage(area.value)}
                    alt={locale === "ar" ? area.labelAr : area.labelEn}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute inset-0 flex flex-col items-start justify-end p-4 text-white">
                    <div className="flex items-center gap-1 mb-1">
                      <MapPin className="h-4 w-4 text-[#c9a84c]" />
                      <span className="text-xs text-white/80">{locale === "ar" ? "العين" : "Al Ain"}</span>
                    </div>
                    <h3 className="text-lg md:text-xl font-bold">
                      {locale === "ar" ? area.labelAr : area.labelEn}
                    </h3>
                    <p className="text-xs text-white/70">
                      {count} {t("areas.propertiesIn").includes("في") ? "عقار" : "properties"}
                    </p>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function getAreaImage(area: string): string {
  const images: Record<string, string> = {
    "al-jimi": "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80",
    "al-towayya": "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80",
    "al-mutaredh": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80",
    "al-hili": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80",
    "al-maqam": "https://images.unsplash.com/photo-1448630360428-65456885c650?w=600&q=80",
    "zakher": "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&q=80",
    "al-foah": "https://images.unsplash.com/photo-1416339306562-f3d12fefd36f?w=600&q=80",
    "falaj-hazza": "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80",
    "al-yahar": "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80",
  }
  return images[area] || images["al-jimi"]
}
