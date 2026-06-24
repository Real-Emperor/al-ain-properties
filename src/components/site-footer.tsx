"use client"

import { Building2, Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter, Linkedin, Youtube } from "lucide-react"
import { useI18n } from "@/i18n/provider"
import { SITE_CONFIG, getTelLink, getWhatsAppLink, AL_AIN_AREAS, PROPERTY_CATEGORIES } from "@/lib/site-config"

export function SiteFooter() {
  const { t, locale } = useI18n()
  const year = new Date().getFullYear()

  const socials = [
    { icon: Facebook, url: SITE_CONFIG.social.facebook },
    { icon: Instagram, url: SITE_CONFIG.social.instagram },
    { icon: Twitter, url: SITE_CONFIG.social.twitter },
    { icon: Linkedin, url: SITE_CONFIG.social.linkedin },
    { icon: Youtube, url: SITE_CONFIG.social.youtube },
  ]

  return (
    <footer className="bg-[#0a0f1e] text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#c9a84c] to-[#1e3a8a]">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-lg font-bold">
                  {locale === "ar" ? SITE_CONFIG.brandName.ar : SITE_CONFIG.brandName.en}
                </div>
                <div className="text-xs text-white/60">{t("common.brandTagline")}</div>
              </div>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              {locale === "ar"
                ? "وكالتك العقارية الموثوقة في العين. نربطك بالعقارات التي تناسب نمط حياتك."
                : "Your trusted real estate agency in Al Ain. We connect you with properties that match your lifestyle."}
            </p>
            <div className="flex gap-2">
              {socials.map((s, i) => (
                <a
                  key={i}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-[#c9a84c] hover:text-[#0a0f1e] transition-colors"
                  aria-label="Social link"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-[#c9a84c] mb-4">{t("common.footer.quickLinks")}</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li><a href="#home" className="hover:text-[#c9a84c] transition-colors">{t("common.nav.home")}</a></li>
              <li><a href="#search" className="hover:text-[#c9a84c] transition-colors">{t("common.nav.search")}</a></li>
              <li><a href="#about" className="hover:text-[#c9a84c] transition-colors">{t("common.nav.about")}</a></li>
              <li><a href="#news" className="hover:text-[#c9a84c] transition-colors">{t("common.nav.news")}</a></li>
              <li><a href="#contact" className="hover:text-[#c9a84c] transition-colors">{t("common.nav.contact")}</a></li>
            </ul>
          </div>

          {/* Areas */}
          <div>
            <h3 className="font-semibold text-[#c9a84c] mb-4">{t("common.footer.areas")}</h3>
            <ul className="space-y-2 text-sm text-white/70">
              {AL_AIN_AREAS.slice(0, 6).map(area => (
                <li key={area.value}>
                  <a href={`#areas`} className="hover:text-[#c9a84c] transition-colors">
                    {locale === "ar" ? area.labelAr : area.labelEn}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-[#c9a84c] mb-4">{t("common.footer.contactUs")}</h3>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-[#c9a84c] mt-0.5 flex-shrink-0" />
                <span>{locale === "ar" ? SITE_CONFIG.address.ar : SITE_CONFIG.address.en}</span>
              </li>
              <li>
                <a href={getTelLink()} className="flex items-center gap-2 hover:text-[#c9a84c] transition-colors">
                  <Phone className="h-4 w-4 text-[#c9a84c] flex-shrink-0" />
                  <span dir="ltr">{SITE_CONFIG.phoneDisplay}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${SITE_CONFIG.email}`} className="flex items-center gap-2 hover:text-[#c9a84c] transition-colors break-all">
                  <Mail className="h-4 w-4 text-[#c9a84c] flex-shrink-0" />
                  <span className="text-xs">{SITE_CONFIG.email}</span>
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-[#c9a84c] mt-0.5 flex-shrink-0" />
                <span className="text-xs">{locale === "ar" ? SITE_CONFIG.workingHours.ar : SITE_CONFIG.workingHours.en}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/60 text-center md:text-start">
            © {year} {locale === "ar" ? SITE_CONFIG.brandName.ar : SITE_CONFIG.brandName.en}. {t("common.footer.rightsReserved")}.
          </p>
          <div className="flex gap-4 text-xs text-white/60">
            <a href="#" className="hover:text-[#c9a84c] transition-colors">{t("common.footer.privacyPolicy")}</a>
            <a href="#" className="hover:text-[#c9a84c] transition-colors">{t("common.footer.termsOfService")}</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
