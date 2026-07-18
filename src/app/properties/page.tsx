"use client"

import { useState, useEffect } from "react"
import { PageLayout } from "@/components/page-layout"
import { PropertyCard } from "@/components/property-card"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/i18n/provider"
import { AL_AIN_AREAS, PROPERTY_TYPES, LISTING_TYPES } from "@/lib/site-config"
import { Search, Inbox, X } from "lucide-react"

export default function PropertiesPage() {
  const { t, locale } = useI18n()
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    area: "all", type: "all", listingType: "all",
    minPrice: "", maxPrice: "", bedrooms: "any",
  })
  const [visibleCount, setVisibleCount] = useState(9)

  useEffect(() => {
    fetch("/api/properties")
      .then(r => r.json())
      .then(data => { setProperties(data.properties || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = properties.filter(p => {
    if (filters.area !== "all" && p.area !== filters.area) return false
    if (filters.type !== "all" && p.type !== filters.type) return false
    if (filters.listingType !== "all" && p.listingType !== filters.listingType) return false
    if (filters.minPrice && p.price < Number(filters.minPrice)) return false
    if (filters.maxPrice && p.price > Number(filters.maxPrice)) return false
    if (filters.bedrooms !== "any" && p.bedrooms < Number(filters.bedrooms)) return false
    return true
  })

  const resetFilters = () => setFilters({ area: "all", type: "all", listingType: "all", minPrice: "", maxPrice: "", bedrooms: "any" })

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c9a84c]"></div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">{locale === "ar" ? "جميع العقارات" : "All Properties"}</h1>
        <p className="text-muted-foreground mb-6">{filtered.length} {t("search.results")}</p>

        <div className="flex flex-wrap gap-3 mb-8">
          <Select value={filters.area} onValueChange={v => setFilters({ ...filters, area: v })}>
            <SelectTrigger className="w-40 h-9 text-sm"><SelectValue placeholder={t("search.location")} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("search.allAreas")}</SelectItem>
              {AL_AIN_AREAS.map(a => <SelectItem key={a.value} value={a.value}>{locale === "ar" ? a.labelAr : a.labelEn}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filters.type} onValueChange={v => setFilters({ ...filters, type: v })}>
            <SelectTrigger className="w-36 h-9 text-sm"><SelectValue placeholder={t("search.propertyType")} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("search.allTypes")}</SelectItem>
              {PROPERTY_TYPES.map(p => <SelectItem key={p.value} value={p.value}>{p.icon} {locale === "ar" ? p.labelAr : p.labelEn}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filters.listingType} onValueChange={v => setFilters({ ...filters, listingType: v })}>
            <SelectTrigger className="w-32 h-9 text-sm"><SelectValue placeholder={t("search.listingType")} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("search.any")}</SelectItem>
              {LISTING_TYPES.map(l => <SelectItem key={l.value} value={l.value}>{locale === "ar" ? l.labelAr : l.labelEn}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filters.bedrooms} onValueChange={v => setFilters({ ...filters, bedrooms: v })}>
            <SelectTrigger className="w-28 h-9 text-sm"><SelectValue placeholder={t("search.bedrooms")} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="any">{t("search.any")}</SelectItem>
              <SelectItem value="1">1+</SelectItem><SelectItem value="2">2+</SelectItem><SelectItem value="3">3+</SelectItem><SelectItem value="4">4+</SelectItem>
            </SelectContent>
          </Select>
          <Input type="number" placeholder={t("search.minPrice")} value={filters.minPrice} onChange={e => setFilters({ ...filters, minPrice: e.target.value })} className="w-28 h-9 text-sm" />
          <Input type="number" placeholder={t("search.maxPrice")} value={filters.maxPrice} onChange={e => setFilters({ ...filters, maxPrice: e.target.value })} className="w-28 h-9 text-sm" />
          <Button variant="outline" size="sm" onClick={resetFilters} className="h-9"><X className="h-3 w-3 me-1" />{t("search.resetFilters")}</Button>
        </div>

        {filtered.length === 0 ? (
          <Card className="p-12 text-center">
            <Inbox className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">{t("search.noResults")}</h3>
            <p className="text-sm text-muted-foreground mb-4">{t("search.noResultsSubtitle")}</p>
            <Button onClick={resetFilters} variant="outline">{t("search.resetFilters")}</Button>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.slice(0, visibleCount).map(p => <PropertyCard key={p.id} property={p} />)}
            </div>
            {visibleCount < filtered.length && (
              <div className="mt-10 text-center">
                <Button variant="outline" size="lg" onClick={() => setVisibleCount(c => c + 6)}>
                  {t("common.actions.loadMore")} ({filtered.length - visibleCount})
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </PageLayout>
  )
}
