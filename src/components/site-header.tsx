"use client"

import { useState, useEffect } from "react"
import { Menu, X, Phone, Moon, Sun, Globe, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/i18n/provider"
import { useTheme } from "next-themes"
import { SITE_CONFIG, getTelLink } from "@/lib/site-config"
import { cn } from "@/lib/utils"

// Smooth scroll helper
function scrollToId(id: string) {
  if (typeof document !== "undefined") {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
  }
}

export function SiteHeader() {
  const { t, locale, toggleLocale, dir } = useI18n()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const navItems = [
    { id: "home", label: t("common.nav.home") },
    { id: "search", label: t("common.nav.search") },
    { id: "categories", label: t("common.nav.categories") },
    { id: "areas", label: t("common.nav.areas") },
    { id: "news", label: t("common.nav.news") },
    { id: "about", label: t("common.nav.about") },
    { id: "contact", label: t("common.nav.contact") },
  ]

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        scrolled
          ? "bg-background/95 backdrop-blur-md shadow-md border-b border-border"
          : "bg-background/80 backdrop-blur-sm"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 md:h-20 items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => scrollToId("home")}
            className="flex items-center gap-2 group"
            aria-label="Al Ain Properties — Home"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#c9a84c] to-[#1e3a8a] rounded-lg blur-sm opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#c9a84c] to-[#1e3a8a] text-white">
                <Building2 className="h-6 w-6" />
              </div>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-lg md:text-xl font-bold text-foreground">
                {locale === "ar" ? SITE_CONFIG.brandName.ar : SITE_CONFIG.brandName.en}
              </span>
              <span className="text-[10px] md:text-xs text-muted-foreground hidden sm:block">
                {t("common.brandTagline")}
              </span>
            </div>
          </button>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => scrollToId(item.id)}
                className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground animated-underline transition-colors"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1 md:gap-2">
            {/* Language toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLocale}
              aria-label="Toggle language"
              className="rounded-full"
            >
              <Globe className="h-5 w-5" />
              <span className="sr-only">Toggle language</span>
              <span className="absolute -bottom-1 -right-1 text-[9px] font-bold bg-accent text-accent-foreground rounded-full h-4 w-4 flex items-center justify-center">
                {locale === "en" ? "ع" : "EN"}
              </span>
            </Button>

            {/* Theme toggle */}
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle theme"
                className="rounded-full"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            )}

            {/* Call button */}
            <a href={getTelLink()}>
              <Button
                variant="outline"
                size="sm"
                className="hidden md:flex items-center gap-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground"
              >
                <Phone className="h-4 w-4" />
                <span className="text-xs font-semibold">{SITE_CONFIG.phoneDisplay}</span>
              </Button>
            </a>

            {/* Mobile menu */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="lg:hidden border-t border-border py-4 space-y-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  scrollToId(item.id)
                  setMobileOpen(false)
                }}
                className="block w-full text-start px-3 py-2.5 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-muted rounded-md transition-colors"
              >
                {item.label}
              </button>
            ))}
            <a href={getTelLink()} className="block px-3 pt-2">
              <Button variant="outline" className="w-full border-accent text-accent">
                <Phone className="h-4 w-4 me-2" />
                {SITE_CONFIG.phoneDisplay}
              </Button>
            </a>
          </nav>
        )}
      </div>
    </header>
  )
}
