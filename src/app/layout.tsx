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
    default: `${SITE_CONFIG.brandName.en} — Premium Real Estate in Al Ain, UAE`,
    template: `%s | ${SITE_CONFIG.brandName.en}`,
  },
  description:
    "Discover premium villas, apartments, shops, offices, warehouses, farms, and land for rent and sale in Al Ain, UAE. Bilingual Arabic-English property listings with WhatsApp instant contact.",
  keywords: [
    "Al Ain real estate",
    "Al Ain properties",
    "villas for rent Al Ain",
    "apartments for rent Al Ain",
    "property for sale Al Ain",
    "real estate UAE",
    "عقارات العين",
    "فلل للإيجار العين",
    "شقق للإيجار العين",
  ],
  authors: [{ name: SITE_CONFIG.brandName.en }],
  openGraph: {
    title: `${SITE_CONFIG.brandName.en} — Premium Real Estate in Al Ain, UAE`,
    description: "Discover premium properties for rent and sale in Al Ain, UAE.",
    type: "website",
    locale: "en_US",
    alternateLocale: "ar_AE",
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: SITE_CONFIG.domainUrl,
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
