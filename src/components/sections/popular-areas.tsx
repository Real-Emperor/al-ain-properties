"use client"

import { Card } from "@/components/ui/card"
import { useI18n } from "@/i18n/provider"
import { AL_AIN_AREAS } from "@/lib/site-config"
import { MapPin } from "lucide-react"
import { SectionHeader } from "./section-header"
import Link from "next/link"

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
              <Link key={area.value} href={`/areas/${area.value}`}>
                <Card
                  className="relative overflow-hidden card-hover group cursor-pointer p-0 border-0"
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
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Unique photo for each Al Ain area — all different, all UAE-appropriate
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
    "al-khibessi": "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=600&q=80",
    "zafrana": "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80",
    "al-sarouj": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80",
    "al-qattara": "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&q=80",
    "al-muwaiji": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80",
    "al-nakhla": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80",
    "al-ain-oasis": "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&q=80",
    "al-bateen": "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&q=80",
    "al-mankhool": "https://images.unsplash.com/photo-1600573472556-e636c2acda88?w=600&q=80",
  }
  return images[area] || images["al-jimi"]
}
