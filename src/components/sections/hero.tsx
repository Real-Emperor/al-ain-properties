"use client"

import { Search, MapPin, Home, Building, Store, Warehouse } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useI18n } from "@/i18n/provider"
import { AL_AIN_AREAS, PROPERTY_TYPES, LISTING_TYPES, SITE_CONFIG } from "@/lib/site-config"
import { useState } from "react"

export function HeroSection() {
  const { t, locale } = useI18n()
  const [area, setArea] = useState("all")
  const [type, setType] = useState("all")
  const [listingType, setListingType] = useState("rent")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")

  const onSearch = () => {
    if (typeof document !== "undefined") {
      const el = document.getElementById("search")
      if (el) el.scrollIntoView({ behavior: "smooth" })
      // Dispatch event so search section picks up the filters
      window.dispatchEvent(new CustomEvent("hero-search", {
        detail: { area, type, listingType, minPrice, maxPrice }
      }))
    }
  }

  return (
    <section id="home" className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background image — Al Ain themed (mountains + greenery) */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1920&q=80"
          alt="Al Ain landscape"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-overlay" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 py-20">
        <div className="max-w-3xl mx-auto text-center text-white">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
            <MapPin className="h-4 w-4 text-[#c9a84c]" />
            <span className="text-sm font-medium">
              {locale === "ar" ? "العين - الإمارات العربية المتحدة" : "Al Ain — United Arab Emirates"}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            {t("home.heroTitle")}
          </h1>
          <p className="text-base md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            {t("home.heroSubtitle")}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            <Button
              size="lg"
              onClick={() => document.getElementById("search")?.scrollIntoView({ behavior: "smooth" })}
              className="bg-[#c9a84c] hover:bg-[#b8963f] text-[#1a1a1a] font-semibold"
            >
              <Search className="h-5 w-5 me-2" />
              {t("home.heroCta")}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => document.getElementById("featured")?.scrollIntoView({ behavior: "smooth" })}
              className="bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20 hover:text-white"
            >
              {t("home.heroSecondaryCta")}
            </Button>
          </div>
        </div>

        {/* Quick search bar */}
        <div className="max-w-5xl mx-auto bg-white/95 dark:bg-card/95 backdrop-blur-lg rounded-2xl shadow-2xl p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Listing type */}
            <div className="md:col-span-2">
              <Select value={listingType} onValueChange={setListingType}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LISTING_TYPES.map(lt => (
                    <SelectItem key={lt.value} value={lt.value}>
                      {locale === "ar" ? lt.labelAr : lt.labelEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Area */}
            <div className="md:col-span-3">
              <Select value={area} onValueChange={setArea}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder={t("search.locationPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("search.allAreas")}</SelectItem>
                  {AL_AIN_AREAS.map(a => (
                    <SelectItem key={a.value} value={a.value}>
                      {locale === "ar" ? a.labelAr : a.labelEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Type */}
            <div className="md:col-span-2">
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("search.allTypes")}</SelectItem>
                  {PROPERTY_TYPES.map(p => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.icon} {locale === "ar" ? p.labelAr : p.labelEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Min price */}
            <div className="md:col-span-2">
              <Input
                type="number"
                placeholder={t("search.minPrice")}
                value={minPrice}
                onChange={e => setMinPrice(e.target.value)}
                className="h-11"
              />
            </div>
            {/* Max price */}
            <div className="md:col-span-2">
              <Input
                type="number"
                placeholder={t("search.maxPrice")}
                value={maxPrice}
                onChange={e => setMaxPrice(e.target.value)}
                className="h-11"
              />
            </div>
            {/* Search button */}
            <div className="md:col-span-1">
              <Button
                onClick={onSearch}
                className="h-11 w-full bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white"
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick stats */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Home className="h-3.5 w-3.5 text-[#c9a84c]" /> 9 {locale === "ar" ? "مناطق" : "areas"}
            </span>
            <span className="flex items-center gap-1">
              <Building className="h-3.5 w-3.5 text-[#c9a84c]" /> 7 {locale === "ar" ? "أنواع عقارات" : "property types"}
            </span>
            <span className="flex items-center gap-1">
              <Store className="h-3.5 w-3.5 text-[#c9a84c]" /> {locale === "ar" ? "إيجار وبيع" : "Rent & Sale"}
            </span>
            <span className="flex items-center gap-1">
              <Warehouse className="h-3.5 w-3.5 text-[#c9a84c]" /> {locale === "ar" ? "بأسعار مناسبة" : "Affordable prices"}
            </span>
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg viewBox="0 0 1440 60" className="w-full h-[60px] fill-background" preserveAspectRatio="none">
          <path d="M0,30L60,32C120,34,240,38,360,36C480,34,600,26,720,24C840,22,960,26,1080,30C1200,34,1320,38,1380,40L1440,42L1440,60L0,60Z" />
        </svg>
      </div>
    </section>
  )
}
