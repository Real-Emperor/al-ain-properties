"use client"

import { Bed, Bath, Maximize, MapPin, Heart, GitCompare, Eye } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/i18n/provider"
import { formatPrice, getAreaByValue, getTypeByValue, getWhatsAppLink } from "@/lib/site-config"
import { useState, useEffect } from "react"
import { toast } from "sonner"

export interface PropertyCardData {
  id: string
  slug: string
  titleEn: string
  titleAr: string
  descriptionEn?: string
  descriptionAr?: string
  type: string
  listingType: string
  area: string
  addressEn?: string | null
  addressAr?: string | null
  latitude?: number | null
  longitude?: number | null
  price: number
  bedrooms: number
  bathrooms: number
  sizeSqft: number
  furnished: boolean
  photos: string
  videoUrl?: string | null
  features: string
  featured: boolean
  views: number
  createdAt?: string
}

function safeParsePhotos(photos: string): string[] {
  try {
    const arr = JSON.parse(photos)
    return Array.isArray(arr) && arr.length > 0 ? arr : []
  } catch {
    return []
  }
}

export function PropertyCard({ property, onClick }: { property: PropertyCardData; onClick?: (p: PropertyCardData) => void }) {
  const { t, locale } = useI18n()
  const [isFav, setIsFav] = useState(false)
  const [inCompare, setInCompare] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const favs = JSON.parse(localStorage.getItem("favorites") || "[]")
      setIsFav(favs.includes(property.id))
      const compare = JSON.parse(localStorage.getItem("compare") || "[]")
      setInCompare(compare.includes(property.id))
    } catch {}
  }, [property.id])

  const area = getAreaByValue(property.area)
  const type = getTypeByValue(property.type)
  const photos = safeParsePhotos(property.photos)
  const coverPhoto = photos[0] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80"

  const toggleFav = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (typeof window === "undefined") return
    try {
      const favs = JSON.parse(localStorage.getItem("favorites") || "[]")
      const newFavs = isFav ? favs.filter((id: string) => id !== property.id) : [...favs, property.id]
      localStorage.setItem("favorites", JSON.stringify(newFavs))
      setIsFav(!isFav)
      toast.success(isFav ? t("common.actions.removeFromFavorites") : t("common.actions.addToFavorites"))
    } catch {}
  }

  const toggleCompare = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (typeof window === "undefined") return
    try {
      const compare = JSON.parse(localStorage.getItem("compare") || "[]")
      if (inCompare) {
        const newCompare = compare.filter((id: string) => id !== property.id)
        localStorage.setItem("compare", JSON.stringify(newCompare))
        setInCompare(false)
        toast.success("Removed from comparison")
      } else {
        if (compare.length >= 3) {
          toast.error("You can compare up to 3 properties at a time")
          return
        }
        const newCompare = [...compare, property.id]
        localStorage.setItem("compare", JSON.stringify(newCompare))
        setInCompare(true)
        toast.success("Added to comparison")
      }
    } catch {}
  }

  const inquiryMessage = locale === "ar"
    ? `مرحباً، أنا مهتم بهذا العقار: ${property.titleAr} (${formatPrice(property.price, "ar")})`
    : `Hello, I'm interested in this property: ${property.titleEn} (${formatPrice(property.price, "en")})`

  return (
    <Card
      className="overflow-hidden card-hover group relative flex flex-col h-full p-0 cursor-pointer"
      onClick={() => onClick?.(property)}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={coverPhoto}
          alt={locale === "ar" ? property.titleAr : property.titleEn}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Top badges */}
        <div className="absolute top-2 start-2 flex flex-col gap-1">
          {property.featured && (
            <Badge className="bg-[#c9a84c] text-[#1a1a1a] hover:bg-[#c9a84c]">★ {locale === "ar" ? "مميز" : "Featured"}</Badge>
          )}
          <Badge variant={property.listingType === "sale" ? "destructive" : "secondary"}>
            {property.listingType === "sale" ? (locale === "ar" ? "للبيع" : "For Sale") : (locale === "ar" ? "للإيجار" : "For Rent")}
          </Badge>
        </div>
        {/* Quick actions */}
        <div className="absolute top-2 end-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 rounded-full bg-white/90 hover:bg-white"
            onClick={toggleFav}
            aria-label="Add to favorites"
          >
            <Heart className={`h-4 w-4 ${isFav ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 rounded-full bg-white/90 hover:bg-white"
            onClick={toggleCompare}
            aria-label="Compare"
          >
            <GitCompare className={`h-4 w-4 ${inCompare ? "text-[#c9a84c]" : ""}`} />
          </Button>
        </div>
        {/* Type badge */}
        {type && (
          <div className="absolute bottom-2 start-2">
            <Badge variant="outline" className="bg-black/60 text-white border-0 backdrop-blur-sm">
              <span className="me-1">{type.icon}</span>
              {locale === "ar" ? type.labelAr : type.labelEn}
            </Badge>
          </div>
        )}
        {/* Views */}
        <div className="absolute bottom-2 end-2">
          <Badge variant="outline" className="bg-black/60 text-white border-0 backdrop-blur-sm">
            <Eye className="h-3 w-3 me-1" />
            {property.views}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        <h3 className="font-semibold text-base line-clamp-1 mb-1">
          {locale === "ar" ? property.titleAr : property.titleEn}
        </h3>
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
          <MapPin className="h-3 w-3 text-[#c9a84c]" />
          <span>{area ? (locale === "ar" ? area.labelAr : area.labelEn) : property.area}</span>
        </div>

        {/* Specs */}
        <div className="grid grid-cols-3 gap-2 text-xs mb-3 py-2 border-y border-border">
          <div className="flex items-center gap-1">
            <Bed className="h-3.5 w-3.5 text-[#1e3a8a] dark:text-[#c9a84c]" />
            <span className="font-medium">{property.bedrooms}</span>
            <span className="text-muted-foreground hidden sm:inline">{t("property.bedrooms")}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="h-3.5 w-3.5 text-[#1e3a8a] dark:text-[#c9a84c]" />
            <span className="font-medium">{property.bathrooms}</span>
            <span className="text-muted-foreground hidden sm:inline">{t("property.bathrooms")}</span>
          </div>
          <div className="flex items-center gap-1">
            <Maximize className="h-3.5 w-3.5 text-[#1e3a8a] dark:text-[#c9a84c]" />
            <span className="font-medium">{property.sizeSqft.toLocaleString()}</span>
            <span className="text-muted-foreground text-[10px]">ft²</span>
          </div>
        </div>

        {/* Price + CTA */}
        <div className="mt-auto flex items-end justify-between gap-2">
          <div>
            <div className="text-lg font-bold text-[#1e3a8a] dark:text-[#c9a84c]">
              {formatPrice(property.price, locale)}
            </div>
            <div className="text-[10px] text-muted-foreground">
              {property.listingType === "rent" ? t("property.perYear") : ""}
            </div>
          </div>
          <a
            href={getWhatsAppLink(inquiryMessage)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            <Button size="sm" className="bg-[#25D366] hover:bg-[#1da851] text-white">
              {t("common.actions.whatsappUs")}
            </Button>
          </a>
        </div>
      </div>
    </Card>
  )
}
