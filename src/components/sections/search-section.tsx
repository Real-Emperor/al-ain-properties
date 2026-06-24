"use client"

import { useState, useEffect, useMemo } from "react"
import { useI18n } from "@/i18n/provider"
import { SectionHeader } from "./section-header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PropertyCard } from "@/components/property-card"
import { AL_AIN_AREAS, PROPERTY_TYPES, LISTING_TYPES } from "@/lib/site-config"
import { Search, SlidersHorizontal, X, Inbox } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface SearchProperty {
  id: string
  slug: string
  titleEn: string
  titleAr: string
  type: string
  listingType: string
  area: string
  price: number
  bedrooms: number
  bathrooms: number
  sizeSqft: number
  furnished: boolean
  photos: string
  featured: boolean
  views: number
}

export function SearchSection({ properties, onPropertyClick }: { properties: SearchProperty[]; onPropertyClick?: (p: SearchProperty) => void }) {
  const { t, locale } = useI18n()
  const [filters, setFilters] = useState({
    area: "all",
    type: "all",
    listingType: "all",
    minPrice: "",
    maxPrice: "",
    bedrooms: "any",
    bathrooms: "any",
    minSize: "",
    furnished: "any",
  })
  const [sortBy, setSortBy] = useState("newest")
  const [showFilters, setShowFilters] = useState(false)
  const [visibleCount, setVisibleCount] = useState(9)

  // Listen for hero-search and filter events
  useEffect(() => {
    const onHeroSearch = (e: Event) => {
      const detail = (e as CustomEvent).detail
      setFilters(prev => ({
        ...prev,
        area: detail.area || "all",
        type: detail.type || "all",
        listingType: detail.listingType || "all",
        minPrice: detail.minPrice || "",
        maxPrice: detail.maxPrice || "",
      }))
    }
    const onFilterByArea = (e: Event) => {
      const area = (e as CustomEvent).detail
      setFilters(prev => ({ ...prev, area }))
    }
    const onFilterByCategory = (e: Event) => {
      const detail = (e as CustomEvent).detail
      setFilters(prev => ({ ...prev, type: detail.type, listingType: detail.listingType }))
    }
    window.addEventListener("hero-search", onHeroSearch)
    window.addEventListener("filter-by-area", onFilterByArea)
    window.addEventListener("filter-by-category", onFilterByCategory)
    return () => {
      window.removeEventListener("hero-search", onHeroSearch)
      window.removeEventListener("filter-by-area", onFilterByArea)
      window.removeEventListener("filter-by-category", onFilterByCategory)
    }
  }, [])

  // Apply filters
  const filtered = useMemo(() => {
    let result = properties.filter(p => {
      if (filters.area !== "all" && p.area !== filters.area) return false
      if (filters.type !== "all" && p.type !== filters.type) return false
      if (filters.listingType !== "all" && p.listingType !== filters.listingType) return false
      if (filters.minPrice && p.price < Number(filters.minPrice)) return false
      if (filters.maxPrice && p.price > Number(filters.maxPrice)) return false
      if (filters.bedrooms !== "any" && p.bedrooms < Number(filters.bedrooms)) return false
      if (filters.bathrooms !== "any" && p.bathrooms < Number(filters.bathrooms)) return false
      if (filters.minSize && p.sizeSqft < Number(filters.minSize)) return false
      if (filters.furnished === "yes" && !p.furnished) return false
      if (filters.furnished === "no" && p.furnished) return false
      return true
    })

    // Sort
    switch (sortBy) {
      case "newest":
        // We don't have createdAt in the data here, so just keep order
        break
      case "oldest":
        result = [...result].reverse()
        break
      case "price-low":
        result = [...result].sort((a, b) => a.price - b.price)
        break
      case "price-high":
        result = [...result].sort((a, b) => b.price - a.price)
        break
      case "size":
        result = [...result].sort((a, b) => b.sizeSqft - a.sizeSqft)
        break
    }

    return result
  }, [properties, filters, sortBy])

  const resetFilters = () => {
    setFilters({
      area: "all", type: "all", listingType: "all",
      minPrice: "", maxPrice: "", bedrooms: "any",
      bathrooms: "any", minSize: "", furnished: "any",
    })
  }

  const activeFiltersCount = Object.entries(filters).filter(([k, v]) => v !== "all" && v !== "any" && v !== "").length

  return (
    <section id="search" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <SectionHeader
          title={t("search.title")}
          subtitle={t("search.subtitle")}
          centered
        />

        {/* Filter toggle (mobile) */}
        <div className="lg:hidden flex items-center justify-center mt-6">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="border-[#1e3a8a] dark:border-[#c9a84c]"
          >
            <SlidersHorizontal className="h-4 w-4 me-2" />
            {t("search.filters")} ({activeFiltersCount})
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
          {/* Filters sidebar */}
          <aside className={`lg:col-span-3 ${showFilters ? "block" : "hidden lg:block"}`}>
            <Card className="p-5 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-[#c9a84c]" />
                  {t("search.filters")}
                </h3>
                {activeFiltersCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={resetFilters} className="h-7 text-xs">
                    <X className="h-3 w-3 me-1" />
                    {t("search.resetFilters")}
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                {/* Listing type */}
                <div>
                  <Label className="text-xs font-semibold mb-1.5 block">{t("search.listingType")}</Label>
                  <Select value={filters.listingType} onValueChange={v => setFilters({ ...filters, listingType: v })}>
                    <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("search.any")}</SelectItem>
                      {LISTING_TYPES.map(lt => (
                        <SelectItem key={lt.value} value={lt.value}>
                          {locale === "ar" ? lt.labelAr : lt.labelEn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Area */}
                <div>
                  <Label className="text-xs font-semibold mb-1.5 block">{t("search.location")}</Label>
                  <Select value={filters.area} onValueChange={v => setFilters({ ...filters, area: v })}>
                    <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
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

                {/* Property type */}
                <div>
                  <Label className="text-xs font-semibold mb-1.5 block">{t("search.propertyType")}</Label>
                  <Select value={filters.type} onValueChange={v => setFilters({ ...filters, type: v })}>
                    <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
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

                {/* Price range */}
                <div>
                  <Label className="text-xs font-semibold mb-1.5 block">{t("search.priceRange")}</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      placeholder={t("search.minPrice")}
                      value={filters.minPrice}
                      onChange={e => setFilters({ ...filters, minPrice: e.target.value })}
                      className="h-9 text-sm"
                    />
                    <Input
                      type="number"
                      placeholder={t("search.maxPrice")}
                      value={filters.maxPrice}
                      onChange={e => setFilters({ ...filters, maxPrice: e.target.value })}
                      className="h-9 text-sm"
                    />
                  </div>
                </div>

                {/* Bedrooms */}
                <div>
                  <Label className="text-xs font-semibold mb-1.5 block">{t("search.bedrooms")}</Label>
                  <Select value={filters.bedrooms} onValueChange={v => setFilters({ ...filters, bedrooms: v })}>
                    <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">{t("search.any")}</SelectItem>
                      <SelectItem value="1">1+</SelectItem>
                      <SelectItem value="2">2+</SelectItem>
                      <SelectItem value="3">3+</SelectItem>
                      <SelectItem value="4">4+</SelectItem>
                      <SelectItem value="5">5+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Bathrooms */}
                <div>
                  <Label className="text-xs font-semibold mb-1.5 block">{t("search.bathrooms")}</Label>
                  <Select value={filters.bathrooms} onValueChange={v => setFilters({ ...filters, bathrooms: v })}>
                    <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">{t("search.any")}</SelectItem>
                      <SelectItem value="1">1+</SelectItem>
                      <SelectItem value="2">2+</SelectItem>
                      <SelectItem value="3">3+</SelectItem>
                      <SelectItem value="4">4+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Min size */}
                <div>
                  <Label className="text-xs font-semibold mb-1.5 block">{t("search.minSize")} (ft²)</Label>
                  <Input
                    type="number"
                    placeholder="1000"
                    value={filters.minSize}
                    onChange={e => setFilters({ ...filters, minSize: e.target.value })}
                    className="h-9 text-sm"
                  />
                </div>

                {/* Furnished */}
                <div>
                  <Label className="text-xs font-semibold mb-1.5 block">{t("search.furnished")}</Label>
                  <Select value={filters.furnished} onValueChange={v => setFilters({ ...filters, furnished: v })}>
                    <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">{t("search.any")}</SelectItem>
                      <SelectItem value="yes">{t("search.furnishedOnly")}</SelectItem>
                      <SelectItem value="no">{t("search.unfurnishedOnly")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={resetFilters} variant="outline" className="w-full">
                  {t("search.resetFilters")}
                </Button>
              </div>
            </Card>
          </aside>

          {/* Results grid */}
          <div className="lg:col-span-9">
            {/* Top bar: count + sort */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-sm">
                  {filtered.length} {t("search.results")}
                </Badge>
                {activeFiltersCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={resetFilters} className="text-xs h-7">
                    <X className="h-3 w-3 me-1" />
                    {t("search.resetFilters")} ({activeFiltersCount})
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-xs text-muted-foreground">{t("search.sortBy")}:</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-8 w-48 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">{t("search.sortNewest")}</SelectItem>
                    <SelectItem value="oldest">{t("search.sortOldest")}</SelectItem>
                    <SelectItem value="price-low">{t("search.sortPriceLow")}</SelectItem>
                    <SelectItem value="price-high">{t("search.sortPriceHigh")}</SelectItem>
                    <SelectItem value="size">{t("search.sortSize")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Grid */}
            {filtered.length === 0 ? (
              <Card className="p-12 text-center">
                <Inbox className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">{t("search.noResults")}</h3>
                <p className="text-sm text-muted-foreground mb-4">{t("search.noResultsSubtitle")}</p>
                <Button onClick={resetFilters} variant="outline">
                  {t("search.resetFilters")}
                </Button>
              </Card>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filtered.slice(0, visibleCount).map(p => (
                    <PropertyCard key={p.id} property={p} onClick={onPropertyClick} />
                  ))}
                </div>
                {visibleCount < filtered.length && (
                  <div className="mt-10 text-center">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setVisibleCount(c => c + 6)}
                      className="border-[#1e3a8a] dark:border-[#c9a84c]"
                    >
                      {t("common.actions.loadMore")} ({filtered.length - visibleCount})
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
