"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bed, Bath, MapPin, Phone, MessageCircle, Calendar, Heart, Share2, Eye, CheckCircle2, X, ChevronLeft, ChevronRight, Building } from "lucide-react"
import { useI18n } from "@/i18n/provider"
import { formatPrice, getAreaByValue, getTypeByValue, getWhatsAppLink, getTelLink, SITE_CONFIG } from "@/lib/site-config"
import { ViewingBookingModal } from "./viewing-booking-modal"
import { toast } from "sonner"

interface Property {
  id: string
  slug: string
  titleEn: string
  titleAr: string
  descriptionEn: string
  descriptionAr: string
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
  views: number
  createdAt: string
}

interface PropertyDetailsModalProps {
  property: Property | null
  open: boolean
  onOpenChange: (open: boolean) => void
  allProperties: Property[]
}

export function PropertyDetailsModal({
  property,
  open,
  onOpenChange,
  allProperties,
}: PropertyDetailsModalProps) {
  const { t, locale } = useI18n()
  const [currentPhoto, setCurrentPhoto] = useState(0)
  const [bookingOpen, setBookingOpen] = useState(false)
  const [isFav, setIsFav] = useState(false)

  useEffect(() => {
    if (property) {
      setCurrentPhoto(0)
      // Check favorite
      if (typeof window !== "undefined") {
        try {
          const favs = JSON.parse(localStorage.getItem("favorites") || "[]")
          setIsFav(favs.includes(property.id))
        } catch {}
      }
    }
  }, [property])

  if (!property) return null

  const photos: string[] = (() => {
    try {
      const arr = JSON.parse(property.photos)
      return Array.isArray(arr) && arr.length > 0 ? arr : ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80"]
    } catch {
      return ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80"]
    }
  })()

  const features: string[] = (() => {
    try {
      const arr = JSON.parse(property.features)
      return Array.isArray(arr) ? arr : []
    } catch {
      return []
    }
  })()

  const area = getAreaByValue(property.area)
  const type = getTypeByValue(property.type)

  const toggleFav = () => {
    if (typeof window === "undefined") return
    try {
      const favs = JSON.parse(localStorage.getItem("favorites") || "[]")
      const newFavs = isFav ? favs.filter((id: string) => id !== property.id) : [...favs, property.id]
      localStorage.setItem("favorites", JSON.stringify(newFavs))
      setIsFav(!isFav)
      toast.success(isFav ? t("common.actions.removeFromFavorites") : t("common.actions.addToFavorites"))
    } catch {}
  }

  const share = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: locale === "ar" ? property.titleAr : property.titleEn,
          text: locale === "ar" ? property.descriptionAr : property.descriptionEn,
          url: window.location.href,
        })
      } catch {}
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href)
      toast.success(locale === "ar" ? "تم نسخ الرابط" : "Link copied!")
    }
  }

  const inquiryMessage = locale === "ar"
    ? `مرحباً، أنا مهتم بهذا العقار: ${property.titleAr}\nالسعر: ${formatPrice(property.price, "ar")}\nالمنطقة: ${area?.labelAr || property.area}\n`
    : `Hello, I'm interested in this property: ${property.titleEn}\nPrice: ${formatPrice(property.price, "en")}\nArea: ${area?.labelEn || property.area}\n`

  const nextPhoto = () => setCurrentPhoto(p => (p + 1) % photos.length)
  const prevPhoto = () => setCurrentPhoto(p => (p - 1 + photos.length) % photos.length)

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto p-0">
          {/* Photo gallery */}
          <div className="relative aspect-[16/10] bg-muted">
            <img
              src={photos[currentPhoto]}
              alt={locale === "ar" ? property.titleAr : property.titleEn}
              className="w-full h-full object-cover"
            />
            {photos.length > 1 && (
              <>
                <button
                  onClick={prevPhoto}
                  className="absolute start-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="h-5 w-5 ltr-flip" />
                </button>
                <button
                  onClick={nextPhoto}
                  className="absolute end-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                  aria-label="Next photo"
                >
                  <ChevronRight className="h-5 w-5 ltr-flip" />
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {photos.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPhoto(i)}
                      className={`h-2 rounded-full transition-all ${i === currentPhoto ? "bg-white w-6" : "bg-white/50 w-2"}`}
                      aria-label={`Photo ${i + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
            {/* Top badges */}
            <div className="absolute top-3 start-3 flex flex-col gap-1">
              {property.listingType === "sale" ? (
                <Badge className="bg-red-600 hover:bg-red-600">{locale === "ar" ? "للبيع" : "For Sale"}</Badge>
              ) : (
                <Badge className="bg-[#1e3a8a] hover:bg-[#1e3a8a]">{locale === "ar" ? "للإيجار" : "For Rent"}</Badge>
              )}
              {type && (
                <Badge variant="outline" className="bg-black/60 text-white border-0 backdrop-blur-sm">
                  {type.icon} {locale === "ar" ? type.labelAr : type.labelEn}
                </Badge>
              )}
            </div>
            {/* Top right actions */}
            <div className="absolute top-3 end-3 flex gap-1">
              <Button
                size="icon"
                variant="secondary"
                className="h-9 w-9 rounded-full bg-white/90 hover:bg-white"
                onClick={toggleFav}
              >
                <Heart className={`h-4 w-4 ${isFav ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
              <Button
                size="icon"
                variant="secondary"
                className="h-9 w-9 rounded-full bg-white/90 hover:bg-white"
                onClick={share}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            <DialogHeader className="p-0 space-y-0 mb-4">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                <DialogTitle className="text-xl md:text-2xl font-bold leading-tight">
                  {locale === "ar" ? property.titleAr : property.titleEn}
                </DialogTitle>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-[#c9a84c]" />
                  {area ? (locale === "ar" ? area.labelAr : area.labelEn) : property.area}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4 text-[#c9a84c]" />
                  {property.views} {t("property.views")}
                </span>
              </div>
            </DialogHeader>

            {/* Price */}
            <div className="flex items-end gap-2 mb-6 pb-6 border-b border-border">
              <div>
                <div className="text-3xl font-bold text-[#1e3a8a] dark:text-[#c9a84c]">
                  {formatPrice(property.price, locale)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {property.listingType === "rent" ? t("property.perYear") : ""}
                </div>
              </div>
            </div>

            {/* Specs grid */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-3 rounded-lg bg-muted/50">
                {property.type === "building" ? <Building className="h-5 w-5 mx-auto mb-1 text-[#1e3a8a] dark:text-[#c9a84c]" /> : <Bed className="h-5 w-5 mx-auto mb-1 text-[#1e3a8a] dark:text-[#c9a84c]" />}
                <div className="text-lg font-bold">{property.bedrooms}</div>
                <div className="text-xs text-muted-foreground">{property.type === "building" ? (locale === "ar" ? "وحدات" : "Units") : t("property.bedrooms")}</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <Bath className="h-5 w-5 mx-auto mb-1 text-[#1e3a8a] dark:text-[#c9a84c]" />
                <div className="text-lg font-bold">{property.bathrooms}</div>
                <div className="text-xs text-muted-foreground">{property.type === "building" ? (locale === "ar" ? "حمامات" : "Baths") : t("property.bathrooms")}</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <CheckCircle2 className="h-5 w-5 mx-auto mb-1 text-[#1e3a8a] dark:text-[#c9a84c]" />
                <div className="text-sm font-bold">
                  {property.furnished ? t("property.furnished") : t("property.unfurnished")}
                </div>
                <div className="text-xs text-muted-foreground">{t("property.details")}</div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2 text-lg">{t("property.description")}</h3>
              <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
                {locale === "ar" ? property.descriptionAr : property.descriptionEn}
              </p>
            </div>

            {/* Features */}
            {features.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3 text-lg">{t("property.features")}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-[#c9a84c] flex-shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Address / Location */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2 text-lg">{t("property.location")}</h3>
              <div className="text-sm text-foreground/80">
                {property.addressEn || property.addressAr
                  ? (locale === "ar" ? property.addressAr : property.addressEn)
                  : (area ? (locale === "ar" ? area.labelAr : area.labelEn) : property.area)
                }
                {area && `, ${locale === "ar" ? "العين" : "Al Ain"}`}
              </div>
              {property.latitude && property.longitude && (
                <div className="mt-3 aspect-[16/9] rounded-lg overflow-hidden bg-muted relative">
                  <iframe
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${property.longitude - 0.005}%2C${property.latitude - 0.005}%2C${property.longitude + 0.005}%2C${property.latitude + 0.005}&layer=mapnik&marker=${property.latitude}%2C${property.longitude}`}
                    className="w-full h-full"
                    loading="lazy"
                    title="Property location"
                  />
                </div>
              )}
            </div>

            {/* CTA bar */}
            <div className="sticky bottom-0 bg-background/95 backdrop-blur-md -mx-6 md:-mx-8 px-6 md:px-8 py-4 border-t border-border">
              <div className="flex flex-wrap items-center gap-2">
                <a href={getWhatsAppLink(inquiryMessage)} target="_blank" rel="noopener noreferrer" className="flex-1 min-w-[140px]">
                  <Button className="w-full bg-[#25D366] hover:bg-[#1da851] text-white">
                    <MessageCircle className="h-4 w-4 me-2" />
                    {t("property.whatsappInquiry")}
                  </Button>
                </a>
                <a href={getTelLink()} className="flex-1 min-w-[140px]">
                  <Button variant="outline" className="w-full border-[#1e3a8a] dark:border-[#c9a84c] text-[#1e3a8a] dark:text-[#c9a84c]">
                    <Phone className="h-4 w-4 me-2" />
                    {t("property.callAgent")}
                  </Button>
                </a>
                <Button
                  onClick={() => setBookingOpen(true)}
                  className="flex-1 min-w-[140px] bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 dark:bg-[#c9a84c] dark:hover:bg-[#c9a84c]/90 dark:text-[#0a0f1e]"
                >
                  <Calendar className="h-4 w-4 me-2" />
                  {t("property.bookViewing")}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ViewingBookingModal
        open={bookingOpen}
        onOpenChange={setBookingOpen}
        properties={allProperties}
        preselectedPropertyId={property.id}
      />
    </>
  )
}
