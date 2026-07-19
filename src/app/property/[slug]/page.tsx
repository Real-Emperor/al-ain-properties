"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Bed, Bath, MapPin, Phone, MessageCircle, Calendar, CheckCircle2, ChevronLeft, ChevronRight, Eye, Building, ArrowLeft } from "lucide-react"
import { useI18n } from "@/i18n/provider"
import { formatPrice, getAreaByValue, getTypeByValue, getWhatsAppLink, getTelLink, SITE_CONFIG } from "@/lib/site-config"
import { ViewingBookingModal } from "@/components/viewing-booking-modal"
import Link from "next/link"

export default function PropertyPage() {
  const params = useParams()
  const slug = params.slug as string
  const { t, locale } = useI18n()
  const [property, setProperty] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [currentPhoto, setCurrentPhoto] = useState(0)
  const [bookingOpen, setBookingOpen] = useState(false)

  useEffect(() => {
    if (slug) {
      fetch(`/api/property/${slug}`)
        .then(res => res.json())
        .then(data => {
          if (data.property) setProperty(data.property)
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c9a84c]"></div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Property not found</h1>
            <Link href="/"><Button>Browse all properties</Button></Link>
          </div>
        </main>
        <SiteFooter />
      </div>
    )
  }

  const photos: string[] = (() => {
    try {
      const arr = JSON.parse(property.photos)
      return Array.isArray(arr) && arr.length > 0 ? arr : ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80"]
    } catch { return ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80"] }
  })()

  const features: string[] = (() => {
    try { const arr = JSON.parse(property.features); return Array.isArray(arr) ? arr : [] } catch { return [] }
  })()

  const area = getAreaByValue(property.area)
  const type = getTypeByValue(property.type)

  const inquiryMessage = locale === "ar"
    ? `مرحباً، أنا مهنت بهذا العقار: ${property.titleAr} (${formatPrice(property.price, "ar")})`
    : `Hello, I'm interested in this property: ${property.titleEn} (${formatPrice(property.price, "en")})`

  const nextPhoto = () => setCurrentPhoto(p => (p + 1) % photos.length)
  const prevPhoto = () => setCurrentPhoto(p => (p - 1 + photos.length) % photos.length)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          {/* Back link */}
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-[#c9a84c] mb-4">
            <ArrowLeft className="h-4 w-4" />
            {locale === "ar" ? "العودة للعقارات" : "Back to properties"}
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left — gallery + details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Photo gallery */}
              <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-muted">
                <img src={photos[currentPhoto]} alt={locale === "ar" ? property.titleAr : property.titleEn} className="w-full h-full object-cover" />
                {photos.length > 1 && (
                  <>
                    <button onClick={prevPhoto} className="absolute start-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80">‹</button>
                    <button onClick={nextPhoto} className="absolute end-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80">›</button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                      {photos.map((_, i) => (
                        <button key={i} onClick={() => setCurrentPhoto(i)} className={`h-2 rounded-full transition-all ${i === currentPhoto ? "bg-white w-6" : "bg-white/50 w-2"}`} />
                      ))}
                    </div>
                  </>
                )}
                <div className="absolute top-3 start-3 flex flex-col gap-1">
                  <Badge className={property.listingType === "sale" ? "bg-red-600" : "bg-[#1e3a8a]"}>{property.listingType === "sale" ? (locale === "ar" ? "للبيع" : "For Sale") : (locale === "ar" ? "للإيجار" : "For Rent")}</Badge>
                  {type && <Badge variant="outline" className="bg-black/60 text-white border-0">{type.icon} {locale === "ar" ? type.labelAr : type.labelEn}</Badge>}
                </div>
              </div>

              {/* Photo thumbnails */}
              {photos.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {photos.map((photo, i) => (
                    <button key={i} onClick={() => setCurrentPhoto(i)} className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${i === currentPhoto ? "border-[#c9a84c]" : "border-transparent"}`}>
                      <img src={photo} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Title + location */}
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">{locale === "ar" ? property.titleAr : property.titleEn}</h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 text-[#c9a84c]" />
                  {area ? (locale === "ar" ? area.labelAr : area.labelEn) : property.area}
                  {area && `, ${locale === "ar" ? "العين" : "Al Ain"}`}
                  <span className="mx-1">•</span>
                  <Eye className="h-4 w-4 text-[#c9a84c]" />
                  {property.views} {t("property.views")}
                </div>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-3 gap-4">
                <Card className="p-4 text-center">
                  {property.type === "building" ? <Building className="h-6 w-6 mx-auto mb-2 text-[#1e3a8a] dark:text-[#c9a84c]" /> : <Bed className="h-6 w-6 mx-auto mb-2 text-[#1e3a8a] dark:text-[#c9a84c]" />}
                  <div className="text-xl font-bold">{property.bedrooms}</div>
                  <div className="text-xs text-muted-foreground">{property.type === "building" ? (locale === "ar" ? "وحدات" : "Units") : t("property.bedrooms")}</div>
                </Card>
                <Card className="p-4 text-center">
                  <Bath className="h-6 w-6 mx-auto mb-2 text-[#1e3a8a] dark:text-[#c9a84c]" />
                  <div className="text-xl font-bold">{property.bathrooms}</div>
                  <div className="text-xs text-muted-foreground">{property.type === "building" ? (locale === "ar" ? "حمامات" : "Baths") : t("property.bathrooms")}</div>
                </Card>
                <Card className="p-4 text-center">
                  <CheckCircle2 className="h-6 w-6 mx-auto mb-2 text-[#1e3a8a] dark:text-[#c9a84c]" />
                  <div className="text-sm font-bold">{property.furnished ? t("property.furnished") : t("property.unfurnished")}</div>
                  <div className="text-xs text-muted-foreground">{t("property.details")}</div>
                </Card>
              </div>

              {/* Description */}
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-3">{t("property.description")}</h3>
                <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">{locale === "ar" ? property.descriptionAr : property.descriptionEn}</p>
              </Card>

              {/* Features */}
              {features.length > 0 && (
                <Card className="p-6">
                  <h3 className="font-semibold text-lg mb-3">{t("property.features")}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-[#c9a84c] flex-shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Location map */}
              {property.latitude && property.longitude && (
                <Card className="p-6">
                  <h3 className="font-semibold text-lg mb-3">{t("property.location")}</h3>
                  <div className="text-sm text-foreground/80 mb-3">
                    {property.addressEn || property.addressAr ? (locale === "ar" ? property.addressAr : property.addressEn) : (area ? (locale === "ar" ? area.labelAr : area.labelEn) : property.area)}
                    {area && `, ${locale === "ar" ? "العين" : "Al Ain"}`}
                  </div>
                  <div className="aspect-[16/9] rounded-lg overflow-hidden bg-muted">
                    <iframe src={`https://www.openstreetmap.org/export/embed.html?bbox=${property.longitude - 0.005}%2C${property.latitude - 0.005}%2C${property.longitude + 0.005}%2C${property.latitude + 0.005}&layer=mapnik&marker=${property.latitude}%2C${property.longitude}`} className="w-full h-full" loading="lazy" title="Property location" />
                  </div>
                </Card>
              )}
            </div>

            {/* Right — price + CTA sidebar */}
            <div className="space-y-4">
              <Card className="p-6 sticky top-24">
                <div className="text-3xl font-bold text-[#1e3a8a] dark:text-[#c9a84c] mb-1">
                  {formatPrice(property.price, locale)}
                </div>
                <div className="text-xs text-muted-foreground mb-4">
                  {property.listingType === "rent" ? t("property.perYear") : ""}
                </div>

                <div className="space-y-2">
                  <a href={getWhatsAppLink(inquiryMessage)} target="_blank" rel="noopener noreferrer" className="block">
                    <Button className="w-full bg-[#25D366] hover:bg-[#1da851] text-white">
                      <MessageCircle className="h-4 w-4 me-2" />
                      {t("property.whatsappInquiry")}
                    </Button>
                  </a>
                  <a href={getTelLink()} className="block">
                    <Button variant="outline" className="w-full border-[#1e3a8a] dark:border-[#c9a84c] text-[#1e3a8a] dark:text-[#c9a84c]">
                      <Phone className="h-4 w-4 me-2" />
                      {t("property.callAgent")}
                    </Button>
                  </a>
                  <Button onClick={() => setBookingOpen(true)} className="w-full bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 dark:bg-[#c9a84c] dark:hover:bg-[#c9a84c]/90 dark:text-[#0a0f1e]">
                    <Calendar className="h-4 w-4 me-2" />
                    {t("property.bookViewing")}
                  </Button>
                </div>

                <div className="mt-4 pt-4 border-t border-border text-xs text-muted-foreground space-y-1">
                  <div>{t("property.area")}: {area ? (locale === "ar" ? area.labelAr : area.labelEn) : property.area}</div>
                  <div>{t("property.type")}: {type ? (locale === "ar" ? type.labelAr : type.labelEn) : property.type}</div>
                  <div>{t("property.listingType")}: {property.listingType === "rent" ? (locale === "ar" ? "للإيجار" : "For Rent") : (locale === "ar" ? "للبيع" : "For Sale")}</div>
                  {property.furnished && <div>{t("property.furnished")}</div>}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
      <WhatsAppButton />
      <ViewingBookingModal open={bookingOpen} onOpenChange={setBookingOpen} properties={[{ id: property.id, slug: property.slug, titleEn: property.titleEn, titleAr: property.titleAr }]} preselectedPropertyId={property.id} />
    </div>
  )
}
