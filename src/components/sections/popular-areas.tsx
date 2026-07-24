"use client"

import { Card } from "@/components/ui/card"
import { useI18n } from "@/i18n/provider"
import { AL_AIN_AREAS } from "@/lib/site-config"
import { MapPin } from "lucide-react"
import { SectionHeader } from "./section-header"
import Link from "next/link"
import { useAreas } from "@/hooks/use-areas"

export function PopularAreas({ propertyCounts }: { propertyCounts: Record<string, number> }) {
  const { t, locale } = useI18n()
  const apiAreas = useAreas()

  // Use API areas if available, otherwise fall back to built-in
  const displayAreas = apiAreas.length > 0
    ? apiAreas
    : AL_AIN_AREAS.map(a => ({ value: a.value, labelEn: a.labelEn, labelAr: a.labelAr, coverImage: null }))

  // Sort by current locale
  const sortedAreas = [...displayAreas].sort((a, b) => {
    if (locale === "ar") return a.labelAr.localeCompare(b.labelAr, "ar")
    return a.labelEn.localeCompare(b.labelEn)
  })

  return (
    <section id="areas" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <SectionHeader
          title={t("home.popularAreas")}
          subtitle={t("home.popularAreasSubtitle")}
          centered
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-10">
          {sortedAreas.map(area => {
            const count = propertyCounts[area.value] || 0
            const imageUrl = area.coverImage || getAreaImage(area.value)
            return (
              <Link key={area.value} href={`/areas/${area.value}`}>
                <Card className="relative overflow-hidden card-hover group cursor-pointer p-0 border-0">
                  <div className="aspect-square relative">
                    <img
                      src={imageUrl}
                      alt={locale === "ar" ? area.labelAr : area.labelEn}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute inset-0 flex flex-col items-start justify-end p-3 text-white">
                      <div className="flex items-center gap-1 mb-0.5">
                        <MapPin className="h-3 w-3 text-[#c9a84c]" />
                        <span className="text-[10px] text-white/80">{locale === "ar" ? "العين" : "Al Ain"}</span>
                      </div>
                      <h3 className="text-sm md:text-base font-bold leading-tight">
                        {locale === "ar" ? area.labelAr : area.labelEn}
                      </h3>
                      <p className="text-[10px] text-white/70">
                        {count} {locale === "ar" ? "عقار" : "properties"}
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

// Fallback images (used when admin hasn't uploaded a custom photo)
function getAreaImage(area: string): string {
  const images: Record<string, string> = {
    "al-jimi": "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600&h=600&fit=crop&q=80",
    "al-towayya": "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=600&h=600&fit=crop&q=80",
    "al-muwaiji": "https://images.unsplash.com/photo-1613490493576-7fde63acd311?w=600&h=600&fit=crop&q=80",
    "al-mutarad": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=600&fit=crop&q=80",
    "al-bateen": "https://images.unsplash.com/photo-1448630360428-65456885c650?w=600&h=600&fit=crop&q=80",
    "al-niyadat": "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=600&fit=crop&q=80",
    "zakher": "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=600&fit=crop&q=80",
    "al-khabisi": "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=600&fit=crop&q=80",
    "al-hili": "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=600&fit=crop&q=80",
    "al-maqam": "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=600&fit=crop&q=80",
    "al-masoudi": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=600&fit=crop&q=80",
    "al-markhaniya": "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&h=600&fit=crop&q=80",
    "falaj-hazza": "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=600&fit=crop&q=80",
    "al-foah": "https://images.unsplash.com/photo-1416339306562-f3d12fefd36f?w=600&h=600&fit=crop&q=80",
    "al-jahili": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=600&fit=crop&q=80",
    "asharej": "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=600&fit=crop&q=80",
    "al-naima": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=600&fit=crop&q=80",
    "al-dhahir": "https://images.unsplash.com/photo-1600573472556-e636c2acda88?w=600&h=600&fit=crop&q=80",
    "al-yahar": "https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=600&h=600&fit=crop&q=80",
    "al-wagan": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=600&fit=crop&q=80",
    "al-quaa": "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=600&h=600&fit=crop&q=80",
    "al-hayer": "https://images.unsplash.com/photo-1416339306562-f3d12fefd36f?w=600&h=600&fit=crop&q=80",
    "al-salamat": "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&h=600&fit=crop&q=80",
    "al-khrair": "https://images.unsplash.com/photo-1600573472556-e636c2acda88?w=600&h=600&fit=crop&q=80",
    "al-sad": "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600&h=600&fit=crop&q=80",
    "sweihan": "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=600&h=600&fit=crop&q=80",
    "al-zafranah": "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&h=600&fit=crop&q=80",
    "al-habooy": "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&h=600&fit=crop&q=80",
    "al-sarooj": "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&h=600&fit=crop&q=80",
    "al-shiwayb": "https://images.unsplash.com/photo-1416339306562-f3d12fefd36f?w=600&h=600&fit=crop&q=80",
    "al-ain-industrial": "https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=600&h=600&fit=crop&q=80",
    "al-murabaa": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=600&fit=crop&q=80",
    "al-qattara": "https://images.unsplash.com/photo-1460317442991-0ec209397cb4?w=600&h=600&fit=crop&q=80",
    "al-ruwaikah": "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=600&fit=crop&q=80",
    "al-amerah": "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&h=600&fit=crop&q=80",
    "al-oyoun": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=600&fit=crop&q=80",
    "green-mubazzarah": "https://images.unsplash.com/photo-1500076656116-558758c991c1?w=600&h=600&fit=crop&q=80",
    "jebel-hafeet": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=600&fit=crop&q=80",
    "remah": "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=600&h=600&fit=crop&q=80",
    "um-ghafah": "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=600&fit=crop&q=80",
    "al-ebid": "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&h=600&fit=crop&q=80",
    "al-faqa": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=600&fit=crop&q=80",
    "mezyad": "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&h=600&fit=crop&q=80",
    "al-arad": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=600&fit=crop&q=80",
    "al-ain-oasis": "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=600&fit=crop&q=80",
    "sanaiya": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=600&fit=crop&q=80",
    "al-kheer": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=600&fit=crop&q=80",
    "al-saad": "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&h=600&fit=crop&q=80",
    "al-bawadi": "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=600&fit=crop&q=80",
  }
  return images[area] || images["al-jimi"]
}
