"use client"

import { Search, MapPin, Home, Building, Store, Warehouse } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useI18n } from "@/i18n/provider"
import { AL_AIN_AREAS, PROPERTY_TYPES, LISTING_TYPES } from "@/lib/site-config"
import { useState, useRef, useEffect } from "react"
import { motion, useReducedMotion } from "framer-motion"

export function HeroSection() {
  const { t, locale } = useI18n()
  const [area, setArea] = useState("all")
  const [type, setType] = useState("all")
  const [listingType, setListingType] = useState("rent")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")

  // Mouse parallax (desktop only, respects reduced motion)
  const prefersReducedMotion = useReducedMotion()
  const heroRef = useRef<HTMLElement>(null)
  const [parallax, setParallax] = useState({ x: 0, y: 0 })
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (prefersReducedMotion) return
    // Disable on touch devices
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) return

    const handleMove = (e: MouseEvent) => {
      if (rafRef.current) return // throttle via RAF
      rafRef.current = requestAnimationFrame(() => {
        const rect = heroRef.current?.getBoundingClientRect()
        if (!rect) return
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        // Normalize to -1..1, then scale to ±15px shift
        const dx = (e.clientX - cx) / (rect.width / 2)
        const dy = (e.clientY - cy) / (rect.height / 2)
        setParallax({ x: dx * 15, y: dy * 15 })
        rafRef.current = null
      })
    }

    window.addEventListener("mousemove", handleMove)
    return () => {
      window.removeEventListener("mousemove", handleMove)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [prefersReducedMotion])

  const onSearch = () => {
    if (typeof document !== "undefined") {
      const el = document.getElementById("search")
      if (el) el.scrollIntoView({ behavior: "smooth" })
      window.dispatchEvent(new CustomEvent("hero-search", {
        detail: { area, type, listingType, minPrice, maxPrice }
      }))
    }
  }

  // Staggered entrance animation variants
  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.12, delayChildren: 0.2 }
    }
  }
  const item = {
    hidden: { opacity: 0, y: 24 },
    show: {
      opacity: 1, y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }
    }
  }
  const searchItem = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1, y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const, delay: 0.5 }
    }
  }

  return (
    <section
      ref={heroRef}
      id="home"
      className="relative min-h-[80vh] md:min-h-[92vh] flex items-center overflow-hidden"
    >
      {/* ═══ Background image with Ken Burns + mouse parallax ═══ */}
      <div
        className="absolute inset-0 z-0"
        style={{
          transform: prefersReducedMotion ? undefined : `translate(${parallax.x}px, ${parallax.y}px) scale(1.08)`,
          transition: "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
          willChange: "transform",
        }}
      >
        <div
          className="w-full h-full"
          style={{
            // Ken Burns: slow zoom + subtle pan over 25s, infinite, alternate
            animation: prefersReducedMotion ? undefined : "kenBurns 25s ease-in-out infinite alternate",
          }}
        >
          <img
            src="/hero-image.jpg"
            alt="Al Ain cityscape"
            className="w-full h-full object-cover"
            // fetchpriority for LCP optimization
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            {...({ fetchpriority: "high" } as any)}
          />
        </div>
      </div>

      {/* ═══ Animated gradient overlay ═══ */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: "linear-gradient(135deg, rgba(10,15,30,0.82) 0%, rgba(10,15,30,0.5) 40%, rgba(10,15,30,0.3) 70%, rgba(10,15,30,0.55) 100%)",
          animation: prefersReducedMotion ? undefined : "gradientShift 12s ease-in-out infinite alternate",
        }}
      />

      {/* ═══ Subtle gold glow accent (top-right) ═══ */}
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] z-[1] pointer-events-none"
        style={{
          background: "radial-gradient(circle at 70% 20%, rgba(201,168,76,0.08) 0%, transparent 60%)",
        }}
      />

      {/* ═══ Content ═══ */}
      <div className="container mx-auto px-4 relative z-10 py-16 md:py-20">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-3xl mx-auto text-center text-white"
        >
          {/* Badge */}
          <motion.div variants={item}>
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
              <MapPin className="h-4 w-4 text-[#c9a84c]" />
              <span className="text-sm font-medium">
                {locale === "ar" ? "العين - الإمارات العربية المتحدة" : "Al Ain — United Arab Emirates"}
              </span>
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={item}
            className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight"
          >
            {t("home.heroTitle")}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={item}
            className="text-sm md:text-lg text-white/90 mb-8 max-w-2xl mx-auto"
          >
            {t("home.heroSubtitle")}
          </motion.p>

          {/* CTAs */}
          <motion.div variants={item} className="flex flex-wrap items-center justify-center gap-3 mb-10">
            <Button
              size="lg"
              onClick={onSearch}
              className="bg-[#c9a84c] hover:bg-[#b8963f] text-[#1a1a1a] font-semibold shadow-lg shadow-[#c9a84c]/20 hover:shadow-[#c9a84c]/40 transition-all hover:scale-105"
            >
              <Search className="h-5 w-5 me-2" />
              {t("home.heroCta")}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => document.getElementById("featured")?.scrollIntoView({ behavior: "smooth" })}
              className="bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20 hover:text-white transition-all hover:scale-105"
            >
              {t("home.heroSecondaryCta")}
            </Button>
          </motion.div>
        </motion.div>

        {/* ═══ Enhanced glassmorphism search bar ═══ */}
        <motion.div
          variants={searchItem}
          initial="hidden"
          animate="show"
          className="max-w-5xl mx-auto rounded-2xl shadow-2xl p-4 md:p-6"
          style={{
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            border: "1px solid rgba(201,168,76,0.2)",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.1) inset",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-2">
              <Select value={listingType} onValueChange={setListingType}>
                <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {LISTING_TYPES.map(lt => (
                    <SelectItem key={lt.value} value={lt.value}>{locale === "ar" ? lt.labelAr : lt.labelEn}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-3">
              <Select value={area} onValueChange={setArea}>
                <SelectTrigger className="h-11"><SelectValue placeholder={t("search.locationPlaceholder")} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("search.allAreas")}</SelectItem>
                  {[...AL_AIN_AREAS].sort((a, b) => a.labelEn.localeCompare(b.labelEn)).map(a => (
                    <SelectItem key={a.value} value={a.value}>{locale === "ar" ? a.labelAr : a.labelEn}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("search.allTypes")}</SelectItem>
                  {PROPERTY_TYPES.map(p => (
                    <SelectItem key={p.value} value={p.value}>{p.icon} {locale === "ar" ? p.labelAr : p.labelEn}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Input type="number" placeholder={t("search.minPrice")} value={minPrice} onChange={e => setMinPrice(e.target.value)} className="h-11" />
            </div>
            <div className="md:col-span-2">
              <Input type="number" placeholder={t("search.maxPrice")} value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="h-11" />
            </div>
            <div className="md:col-span-1">
              <Button onClick={onSearch} className="h-11 w-full bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white shadow-md hover:shadow-lg transition-all">
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Home className="h-3.5 w-3.5 text-[#c9a84c]" /> 49 {locale === "ar" ? "مناطق" : "areas"}</span>
            <span className="flex items-center gap-1"><Building className="h-3.5 w-3.5 text-[#c9a84c]" /> 8 {locale === "ar" ? "أنواع عقارات" : "property types"}</span>
            <span className="flex items-center gap-1"><Store className="h-3.5 w-3.5 text-[#c9a84c]" /> {locale === "ar" ? "إيجار وبيع" : "Rent & Sale"}</span>
            <span className="flex items-center gap-1"><Warehouse className="h-3.5 w-3.5 text-[#c9a84c]" /> {locale === "ar" ? "بأسعار مناسبة" : "Affordable prices"}</span>
          </div>
        </motion.div>
      </div>

      {/* ═══ Wave divider ═══ */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg viewBox="0 0 1440 60" className="w-full h-[60px] fill-background" preserveAspectRatio="none">
          <path d="M0,30L60,32C120,34,240,38,360,36C480,34,600,26,720,24C840,22,960,26,1080,30C1200,34,1320,38,1380,40L1440,42L1440,60L0,60Z" />
        </svg>
      </div>

      {/* ═══ Keyframe animations (inline to avoid CSS file changes) ═══ */}
      <style>{`
        @keyframes kenBurns {
          0%   { transform: scale(1) translate(0%, 0%); }
          50%  { transform: scale(1.06) translate(-1.5%, 1%); }
          100% { transform: scale(1.1) translate(1.5%, -1%); }
        }
        @keyframes gradientShift {
          0%   { background-position: 0% 50%; opacity: 1; }
          50%  { opacity: 0.92; }
          100% { background-position: 100% 50%; opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ken-burns, .gradient-shift { animation: none !important; }
        }
      `}</style>
    </section>
  )
}
