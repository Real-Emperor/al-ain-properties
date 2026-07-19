import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "next-themes"
import { I18nProvider } from "@/i18n/provider"
import { Toaster } from "@/components/ui/sonner"
import { SITE_CONFIG } from "@/lib/site-config"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

export const metadata: Metadata = {
  title: {
    default: `${SITE_CONFIG.brandName.en} — Al Ain Room For Rent | Flats, Villas, Studios & Property for Sale`,
    template: `%s | ${SITE_CONFIG.brandName.en}`,
  },
  description:
    "Al Ain room for rent, studio for rent, flat for rent, apartment for rent, villa for rent, and property for sale in Al Ain, UAE. Search rooms, studios, 1BR, 2BR, 3BR flats, villas, offices, shops, and land across Al Jimi, Al Hili, Zakher, Falaj Hazza, and all Al Ain areas. WhatsApp instant contact. Bilingual Arabic & English. عقارات العين، غرف للإيجار، شقق للإيجار، فلل للإيجار.",
  keywords: [
    "Al Ain room for rent",
    "Al Ain studio for rent",
    "Al Ain flat for rent",
    "Al Ain apartment for rent",
    "Al Ain villa for rent",
    "Al Ain property for rent",
    "Al Ain property for sale",
    "Al Ain real estate",
    "room for rent in Al Ain",
    "studio for rent in Al Ain",
    "flat for rent in Al Ain",
    "apartment for rent in Al Ain",
    "villa for rent in Al Ain",
    "house for rent in Al Ain",
    "land for sale in Al Ain",
    "shop for rent in Al Ain",
    "office for rent in Al Ain",
    "warehouse for rent in Al Ain",
    "farm for sale in Al Ain",
    "building for sale in Al Ain",
    "property for sale in Al Ain UAE",
    "real estate Al Ain UAE",
    "Al Ain properties",
    "Al Ain real estate agency",
    "property management Al Ain",
    "Al Jimi property for rent",
    "Al Hili property for rent",
    "Zakher property for rent",
    "Falaj Hazza property for rent",
    "Al Maqam property for rent",
    "Al Khibessi property for rent",
    "Zafrana property for rent",
    "غرف للإيجار العين",
    "استوديو للإيجار العين",
    "شقة للإيجار العين",
    "شقق للإيجار العين",
    "فيلا للإيجار العين",
    "فلل للإيجار العين",
    "عقارات للبيع العين",
    "عقارات للإيجار العين",
    "عقارات العين",
    "العين عقارات",
    "سكن للإيجار العين",
    "منزل للإيجار العين",
    "أرض للبيع العين",
    "محل للإيجار العين",
    "مكتب للإيجار العين",
    "مستودع للإيجار العين",
    "إدارة العقارات العين",
    "العين غرفة للإيجار",
    "العين شقة للإيجار",
  ],
  authors: [{ name: "Mohammad Mosa Ali" }],
  openGraph: {
    title: `${SITE_CONFIG.brandName.en} — Al Ain Room, Studio, Flat & Villa For Rent | Property For Sale`,
    description: "Find rooms, studios, flats, apartments, villas, and property for sale in Al Ain, UAE. Search by area, price, and type. WhatsApp instant contact. Bilingual Arabic & English.",
    type: "website",
    locale: "en_US",
    alternateLocale: "ar_AE",
    siteName: SITE_CONFIG.brandName.en,
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  alternates: {
    canonical: "https://alainroomforrent.com",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        {/* Leaflet CSS */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className={inter.variable}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange={false}>
          <I18nProvider>
            {children}
            <Toaster position="top-center" richColors />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
