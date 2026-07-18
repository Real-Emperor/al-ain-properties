"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { PageLayout } from "@/components/page-layout"
import { PropertyCard } from "@/components/property-card"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, MapPin, Search, Inbox } from "lucide-react"
import { useI18n } from "@/i18n/provider"
import { AL_AIN_AREAS, PROPERTY_TYPES, LISTING_TYPES } from "@/lib/site-config"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export default function AreaPage() {
  const params = useParams()
  const areaValue = params.area as string
  const { t, locale } = useI18n()
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState("all")
  const [filterListing, setFilterListing] = useState("all")

  const area = AL_AIN_AREAS.find(a => a.value === areaValue)

  useEffect(() => {
    fetch(`/api/properties?area=${areaValue}`)
      .then(r => r.json())
      .then(data => {
        setProperties(data.properties || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [areaValue])

  const filtered = properties.filter(p => {
    if (filterType !== "all" && p.type !== filterType) return false
    if (filterListing !== "all" && p.listingType !== filterListing) return false
    return true
  })

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c9a84c]"></div>
        </div>
      </PageLayout>
    )
  }

  if (!area) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Area not found</h1>
          <Link href="/areas"><Button>Browse all areas</Button></Link>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Link href="/areas" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-[#c9a84c] mb-4">
          <ArrowLeft className="h-4 w-4" />
          {locale === "ar" ? "جميع المناطق" : "All Areas"}
        </Link>

        {/* Area header */}
        <div className="flex items-center gap-3 mb-2">
          <MapPin className="h-8 w-8 text-[#c9a84c]" />
          <h1 className="text-3xl md:text-4xl font-bold">
            {locale === "ar" ? area.labelAr : area.labelEn}
          </h1>
        </div>
        <p className="text-muted-foreground mb-6">
          {locale === "ar"
            ? `${filtered.length} عقار متاح في ${area.labelAr}، العين`
            : `${filtered.length} properties available in ${area.labelEn}, Al Ain`}
        </p>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          <div>
            <Label className="text-xs mb-1 block">{t("search.propertyType")}</Label>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40 h-9 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("search.allTypes")}</SelectItem>
                {PROPERTY_TYPES.map(p => (
                  <SelectItem key={p.value} value={p.value}>{p.icon} {locale === "ar" ? p.labelAr : p.labelEn}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs mb-1 block">{t("search.listingType")}</Label>
            <Select value={filterListing} onValueChange={setFilterListing}>
              <SelectTrigger className="w-32 h-9 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("search.any")}</SelectItem>
                {LISTING_TYPES.map(l => (
                  <SelectItem key={l.value} value={l.value}>{locale === "ar" ? l.labelAr : l.labelEn}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Properties grid */}
        {filtered.length === 0 ? (
          <Card className="p-12 text-center">
            <Inbox className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">{locale === "ar" ? "لا توجد عقارات في هذه المنطقة حالياً" : "No properties in this area yet"}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {locale === "ar" ? "يرجى التواصل معنا وسنساعدك في العثور على ما تبحث عنه" : "Please contact us and we'll help you find what you're looking for"}
            </p>
            <Link href="/contact"><Button>{t("common.actions.contactUs")}</Button></Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(p => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  )
}
