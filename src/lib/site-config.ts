// Central site configuration - all contact info, areas, property types
// This is the single source of truth for business-critical data.

export const SITE_CONFIG = {
  brandName: {
    en: "Al Ain Real Estate",
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

  domain: "alainroomforrent.com",
  domainUrl: "https://alainroomforrent.com",

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
  { value: "building", labelEn: "Building (Residential)", labelAr: "مبنى سكني", icon: "🏗️" },
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
  { value: "al-ain-industrial", labelEn: "Al Ain Industrial Area", labelAr: "المنطقة الصناعية", lat: 24.2800, lng: 55.7600 },
  { value: "al-ain-oasis", labelEn: "Al Ain Oasis", labelAr: "واحة العين", lat: 24.1300, lng: 55.8000 },
  { value: "al-amerah", labelEn: "Al Amerah", labelAr: "العامرة", lat: 24.1500, lng: 55.7700 },
  { value: "al-arad", labelEn: "Al Arad", labelAr: "العراد", lat: 24.0600, lng: 55.8300 },
  { value: "al-bateen", labelEn: "Al Bateen", labelAr: "البطين", lat: 24.1450, lng: 55.7850 },
  { value: "al-bawadi", labelEn: "Al Bawadi", labelAr: "البوادي", lat: 24.1650, lng: 55.7850 },
  { value: "al-dhahir", labelEn: "Al Dhahir", labelAr: "الظاهر", lat: 24.2700, lng: 55.7900 },
  { value: "al-ebid", labelEn: "Al Ebid", labelAr: "العبيد", lat: 24.2400, lng: 55.7150 },
  { value: "al-faqa", labelEn: "Al Faqa", labelAr: "الفقع", lat: 24.4000, lng: 55.5000 },
  { value: "al-foah", labelEn: "Al Foah", labelAr: "الفوعة", lat: 24.2575, lng: 55.7147 },
  { value: "al-habooy", labelEn: "Al Habooy", labelAr: "الحبوي", lat: 24.1900, lng: 55.7400 },
  { value: "al-hayer", labelEn: "Al Hayer", labelAr: "الهير", lat: 24.3200, lng: 55.8400 },
  { value: "al-hili", labelEn: "Al Hili", labelAr: "الهيلي", lat: 24.2875, lng: 55.7847 },
  { value: "al-jahili", labelEn: "Al Jahili", labelAr: "الجاهلي", lat: 24.2500, lng: 55.7400 },
  { value: "al-jimi", labelEn: "Al Jimi", labelAr: "الجيمي", lat: 24.2275, lng: 55.7447 },
  { value: "al-khabisi", labelEn: "Al Khabisi", labelAr: "الخبيصي", lat: 24.2150, lng: 55.7680 },
  { value: "al-kheer", labelEn: "Al Kheer", labelAr: "الخير", lat: 24.1750, lng: 55.7600 },
  { value: "al-khrair", labelEn: "Al Khrair", labelAr: "الخرير", lat: 24.1600, lng: 55.7100 },
  { value: "al-maqam", labelEn: "Al Maqam", labelAr: "المقام", lat: 24.1975, lng: 55.7247 },
  { value: "al-markhaniya", labelEn: "Al Markhaniya", labelAr: "المرخانية", lat: 24.2400, lng: 55.7750 },
  { value: "al-masoudi", labelEn: "Al Masoudi", labelAr: "المسعودي", lat: 24.2300, lng: 55.7700 },
  { value: "al-murabaa", labelEn: "Al Murabaa", labelAr: "المربعة", lat: 24.2300, lng: 55.7500 },
  { value: "al-mutarad", labelEn: "Al Mutarad", labelAr: "المعترض", lat: 24.2375, lng: 55.7347 },
  { value: "al-muwaiji", labelEn: "Al Muwaiji", labelAr: "المويجعي", lat: 24.2550, lng: 55.7600 },
  { value: "al-naima", labelEn: "Al Naima", labelAr: "النعيمة", lat: 24.2000, lng: 55.7550 },
  { value: "al-niyadat", labelEn: "Al Niyadat", labelAr: "النيادات", lat: 24.2200, lng: 55.7400 },
  { value: "al-oyoun", labelEn: "Al Oyoun", labelAr: "العيون", lat: 24.1000, lng: 55.7800 },
  { value: "al-qattara", labelEn: "Al Qattara", labelAr: "القطارة", lat: 24.2400, lng: 55.7600 },
  { value: "al-quaa", labelEn: "Al Qua'a", labelAr: "القوع", lat: 24.3000, lng: 55.8200 },
  { value: "al-ruwaikah", labelEn: "Al Ruwaikah", labelAr: "الرويكة", lat: 24.1700, lng: 55.7900 },
  { value: "al-saad", labelEn: "Al Saad", labelAr: "السعد", lat: 24.1500, lng: 55.7500 },
  { value: "al-sad", labelEn: "Al Sad", labelAr: "الساد", lat: 24.2200, lng: 55.7800 },
  { value: "al-salamat", labelEn: "Al Salamat", labelAr: "السلامات", lat: 24.1800, lng: 55.7300 },
  { value: "al-sarooj", labelEn: "Al Sarooj", labelAr: "السروج", lat: 24.2100, lng: 55.7800 },
  { value: "al-shiwayb", labelEn: "Al Shiwayb", labelAr: "الشويب", lat: 24.3500, lng: 55.7000 },
  { value: "al-towayya", labelEn: "Al Towayya", labelAr: "الطوية", lat: 24.2175, lng: 55.7547 },
  { value: "al-wagan", labelEn: "Al Wagan", labelAr: "الوقن", lat: 24.0500, lng: 55.8500 },
  { value: "al-yahar", labelEn: "Al Yahar", labelAr: "اليحر", lat: 24.2675, lng: 55.8047 },
  { value: "al-zafranah", labelEn: "Al Zafranah", labelAr: "الزعفرانة", lat: 24.2050, lng: 55.7580 },
  { value: "asharej", labelEn: "Asharej", labelAr: "العشارج", lat: 24.2100, lng: 55.7450 },
  { value: "falaj-hazza", labelEn: "Falaj Hazza", labelAr: "فلج هزاع", lat: 24.1875, lng: 55.7647 },
  { value: "green-mubazzarah", labelEn: "Green Mubazzarah", labelAr: "المبزرة الخضراء", lat: 24.0800, lng: 55.7700 },
  { value: "jebel-hafeet", labelEn: "Jebel Hafeet", labelAr: "جبل حفيت", lat: 24.0000, lng: 55.7800 },
  { value: "mezyad", labelEn: "Mezyad", labelAr: "مزيد", lat: 24.0300, lng: 55.8500 },
  { value: "remah", labelEn: "Remah", labelAr: "رماح", lat: 24.3800, lng: 55.4000 },
  { value: "sanaiya", labelEn: "Sanaiya", labelAr: "الصناعية", lat: 24.2700, lng: 55.7650 },
  { value: "sweihan", labelEn: "Sweihan", labelAr: "السويحان", lat: 24.4500, lng: 55.3500 },
  { value: "um-ghafah", labelEn: "Um Ghafah", labelAr: "أم غافة", lat: 24.2600, lng: 55.7300 },
  { value: "zakher", labelEn: "Zakher", labelAr: "زاخر", lat: 24.1675, lng: 55.7747 },
] as const

// ─── Property categories (combination of type + listing type) ───
export const PROPERTY_CATEGORIES = [
  { value: "villas-rent", type: "villa", listingType: "rent", labelEn: "Villas for Rent", labelAr: "فلل للإيجار", icon: "🏡" },
  { value: "villas-sale", type: "villa", listingType: "sale", labelEn: "Villas for Sale", labelAr: "فلل للبيع", icon: "🏡" },
  { value: "apartments-rent", type: "apartment", listingType: "rent", labelEn: "Apartments for Rent", labelAr: "شقق للإيجار", icon: "🏢" },
  { value: "apartments-sale", type: "apartment", listingType: "sale", labelEn: "Apartments for Sale", labelAr: "شقق للبيع", icon: "🏢" },
  { value: "buildings-rent", type: "building", listingType: "rent", labelEn: "Residential Buildings for Rent", labelAr: "مباني سكنية للإيجار", icon: "🏗️" },
  { value: "buildings-sale", type: "building", listingType: "sale", labelEn: "Residential Buildings for Sale", labelAr: "مباني سكنية للبيع", icon: "🏗️" },
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

// ─── Area sorting helper (sorts by active language) ───
export function sortAreasByLocale(areas: readonly typeof AL_AIN_AREAS[number][], locale: "en" | "ar") {
  return [...areas].sort((a, b) => {
    if (locale === "ar") {
      return a.labelAr.localeCompare(b.labelAr, "ar")
    }
    return a.labelEn.localeCompare(b.labelEn)
  })
}
