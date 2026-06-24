// Central site configuration — all contact info, areas, property types
// This is the single source of truth for business-critical data.

export const SITE_CONFIG = {
  brandName: {
    en: "Al Ain Properties",
    ar: "العين العقارية",
  },
  // Phone & WhatsApp (UAE format)
  phone: "+971542311225",
  phoneDisplay: "+971 54 231 1225",
  // Phone without + for tel: links
  phoneTel: "+971542311225",
  // WhatsApp number (digits only, with country code)
  whatsapp: "971542311225",
  whatsappDisplay: "+971 54 231 1225",

  email: "mohammadmosaaliali@gmail.com",

  address: {
    en: "Near LuLu Murab'aa, City Center, Al Ain, UAE",
    ar: "بالقرب من لولو مربعة، وسط المدينة، العين، الإمارات",
  },

  // Al Ain coordinates (approximate city center)
  defaultLocation: {
    lat: 24.2075,
    lng: 55.7447,
  },

  domain: "alainproperties.com",
  domainUrl: "https://alainproperties.com",

  workingHours: {
    en: "Every day: 9:30 AM - 11:00 PM",
    ar: "كل يوم: 9:30 ص - 11:00 م",
  },

  social: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    twitter: "https://twitter.com",
    linkedin: "https://linkedin.com",
    youtube: "https://youtube.com",
  },
} as const

// ─── Property types ───
export const PROPERTY_TYPES = [
  { value: "villa", labelEn: "Villa", labelAr: "فيلا", icon: "🏡" },
  { value: "apartment", labelEn: "Apartment", labelAr: "شقة", icon: "🏢" },
  { value: "shop", labelEn: "Shop", labelAr: "محل", icon: "🏪" },
  { value: "office", labelEn: "Office", labelAr: "مكتب", icon: "🏬" },
  { value: "warehouse", labelEn: "Warehouse", labelAr: "مستودع", icon: "🏭" },
  { value: "farm", labelEn: "Farm", labelAr: "مزرعة", icon: "🌾" },
  { value: "land", labelEn: "Land", labelAr: "أرض", icon: "🗺️" },
] as const

// ─── Listing types ───
export const LISTING_TYPES = [
  { value: "rent", labelEn: "For Rent", labelAr: "للإيجار" },
  { value: "sale", labelEn: "For Sale", labelAr: "للبيع" },
] as const

// ─── Al Ain areas with coordinates ───
export const AL_AIN_AREAS = [
  { value: "al-jimi", labelEn: "Al Jimi", labelAr: "الجيمي", lat: 24.2275, lng: 55.7447 },
  { value: "al-towayya", labelEn: "Al Towayya", labelAr: "الطوية", lat: 24.2175, lng: 55.7547 },
  { value: "al-mutaredh", labelEn: "Al Mutaredh", labelAr: "المترع", lat: 24.2375, lng: 55.7347 },
  { value: "al-hili", labelEn: "Al Hili", labelAr: "الهيلي", lat: 24.2875, lng: 55.7847 },
  { value: "al-maqam", labelEn: "Al Maqam", labelAr: "المقام", lat: 24.1975, lng: 55.7247 },
  { value: "zakher", labelEn: "Zakher", labelAr: "زاخر", lat: 24.1675, lng: 55.7747 },
  { value: "al-foah", labelEn: "Al Foah", labelAr: "الفوعة", lat: 24.2575, lng: 55.7147 },
  { value: "falaj-hazza", labelEn: "Falaj Hazza", labelAr: "فلج هزاع", lat: 24.1875, lng: 55.7647 },
  { value: "al-yahar", labelEn: "Al Yahar", labelAr: "اليحر", lat: 24.2675, lng: 55.8047 },
] as const

// ─── Property categories (combination of type + listing type) ───
export const PROPERTY_CATEGORIES = [
  { value: "villas-rent", type: "villa", listingType: "rent", labelEn: "Villas for Rent", labelAr: "فلل للإيجار", icon: "🏡" },
  { value: "villas-sale", type: "villa", listingType: "sale", labelEn: "Villas for Sale", labelAr: "فلل للبيع", icon: "🏡" },
  { value: "apartments-rent", type: "apartment", listingType: "rent", labelEn: "Apartments for Rent", labelAr: "شقق للإيجار", icon: "🏢" },
  { value: "apartments-sale", type: "apartment", listingType: "sale", labelEn: "Apartments for Sale", labelAr: "شقق للبيع", icon: "🏢" },
  { value: "shops", type: "shop", listingType: "rent", labelEn: "Shops", labelAr: "محلات", icon: "🏪" },
  { value: "offices", type: "office", listingType: "rent", labelEn: "Offices", labelAr: "مكاتب", icon: "🏬" },
  { value: "warehouses", type: "warehouse", listingType: "rent", labelEn: "Warehouses", labelAr: "مستودعات", icon: "🏭" },
  { value: "farms", type: "farm", listingType: "sale", labelEn: "Farms", labelAr: "مزارع", icon: "🌾" },
  { value: "land", type: "land", listingType: "sale", labelEn: "Land", labelAr: "أراضي", icon: "🗺️" },
] as const

// ─── News categories ───
export const NEWS_CATEGORIES = [
  { value: "Al Ain Property News", labelEn: "Al Ain Property News", labelAr: "أخبار عقارات العين" },
  { value: "UAE Real Estate News", labelEn: "UAE Real Estate News", labelAr: "أخبار العقارات الإماراتية" },
  { value: "Rental Market Updates", labelEn: "Rental Market Updates", labelAr: "تحديثات سوق الإيجار" },
  { value: "New Property Projects", labelEn: "New Property Projects", labelAr: "مشاريع عقارية جديدة" },
  { value: "Investment News", labelEn: "Investment News", labelAr: "أخبار الاستثمار" },
] as const

// ─── Helpers ───
export function getAreaByValue(value: string) {
  return AL_AIN_AREAS.find(a => a.value === value)
}

export function getTypeByValue(value: string) {
  return PROPERTY_TYPES.find(t => t.value === value)
}

export function formatPrice(price: number, locale: "en" | "ar" = "en"): string {
  // Format with thousands separator
  const formatted = new Intl.NumberFormat(locale === "ar" ? "ar-AE" : "en-AE").format(price)
  return `${formatted} AED`
}

export function getWhatsAppLink(message: string = ""): string {
  const base = `https://wa.me/${SITE_CONFIG.whatsapp}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

export function getTelLink(): string {
  return `tel:${SITE_CONFIG.phoneTel}`
}
