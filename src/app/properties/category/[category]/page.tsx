"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { PageLayout } from "@/components/page-layout"
import { PropertyCard } from "@/components/property-card"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Inbox } from "lucide-react"
import { useI18n } from "@/i18n/provider"
import { PROPERTY_CATEGORIES } from "@/lib/site-config"

export default function CategoryPage() {
  const params = useParams()
  const categoryValue = params.category as string
  const { t, locale } = useI18n()
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const category = PROPERTY_CATEGORIES.find(c => c.value === categoryValue || c.type === categoryValue)

  useEffect(() => {
    let url = "/api/properties?"
    if (category?.type) url += `type=${category.type}&`
    if (category?.listingType) url += `listingType=${category.listingType}&`
    fetch(url)
      .then(r => r.json())
      .then(data => { setProperties(data.properties || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [categoryValue])

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c9a84c]"></div>
        </div>
      </PageLayout>
    )
  }

  const title = category
    ? (locale === "ar" ? category.labelAr : category.labelEn)
    : (locale === "ar" ? "العقارات" : "Properties")

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <Link href="/properties" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-[#c9a84c] mb-4">
          <ArrowLeft className="h-4 w-4" />
          {locale === "ar" ? "جميع العقارات" : "All Properties"}
        </Link>

        <h1 className="text-3xl font-bold mb-2">
          {category?.icon} {title}
        </h1>
        <p className="text-muted-foreground mb-6">
          {properties.length} {locale === "ar" ? "عقار" : "properties"}
        </p>

        {properties.length === 0 ? (
          <Card className="p-12 text-center">
            <Inbox className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">{t("search.noResults")}</h3>
            <p className="text-sm text-muted-foreground mb-4">{t("search.noResultsSubtitle")}</p>
            <Link href="/contact"><Button>{t("common.actions.contactUs")}</Button></Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map(p => <PropertyCard key={p.id} property={p} />)}
          </div>
        )}
      </div>
    </PageLayout>
  )
}
