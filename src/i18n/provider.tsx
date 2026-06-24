"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export type Locale = "en" | "ar"

interface I18nContextValue {
  locale: Locale
  setLocale: (l: Locale) => void
  toggleLocale: () => void
  dir: "ltr" | "rtl"
  t: (path: string) => any
}

const I18nContext = createContext<I18nContextValue | null>(null)

// Cache for loaded messages
const messagesCache: Record<Locale, any> = {
  en: null,
  ar: null,
}

async function loadMessages(locale: Locale): Promise<any> {
  if (messagesCache[locale]) return messagesCache[locale]
  try {
    if (locale === "en") {
      const mod = await import("@/i18n/messages/en")
      messagesCache[locale] = (mod as any).default || mod
    } else {
      const mod = await import("@/i18n/messages/ar")
      messagesCache[locale] = (mod as any).default || mod
    }
    return messagesCache[locale]
  } catch (e) {
    console.error(`Failed to load messages for ${locale}:`, e)
    return {}
  }
}

// Get nested value from object by dot-path
function getByPath(obj: any, path: string): any {
  return path.split(".").reduce((acc, key) => {
    if (acc && typeof acc === "object" && key in acc) return acc[key]
    return undefined
  }, obj)
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en")
  const [messages, setMessages] = useState<any>(null)
  const [loaded, setLoaded] = useState(false)

  // Load initial locale from localStorage or browser
  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("locale")) as Locale | null
    const browserLang = typeof navigator !== "undefined" ? navigator.language.split("-")[0] : "en"
    const initial: Locale = saved || (browserLang === "ar" ? "ar" : "en")
    setLocaleState(initial)
  }, [])

  // Load messages when locale changes
  useEffect(() => {
    let active = true
    loadMessages(locale).then(msg => {
      if (active) {
        setMessages(msg)
        setLoaded(true)
      }
    })
    return () => { active = false }
  }, [locale])

  // Apply dir and lang to <html>
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale
      document.documentElement.dir = locale === "ar" ? "rtl" : "ltr"
    }
  }, [locale])

  const setLocale = (l: Locale) => {
    setLocaleState(l)
    if (typeof window !== "undefined") localStorage.setItem("locale", l)
  }

  const toggleLocale = () => setLocale(locale === "en" ? "ar" : "en")

  const t = (path: string) => {
    if (!messages) return path
    return getByPath(messages, path) ?? path
  }

  const value: I18nContextValue = {
    locale,
    setLocale,
    toggleLocale,
    dir: locale === "ar" ? "rtl" : "ltr",
    t,
  }

  return (
    <I18nContext.Provider value={value}>
      {loaded ? children : <div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-muted-foreground">Loading...</div></div>}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error("useI18n must be used within I18nProvider")
  return ctx
}

// Helper for accessing config values by locale
export function localized(value: { en: string; ar: string }, locale: Locale): string {
  return value[locale] || value.en
}
