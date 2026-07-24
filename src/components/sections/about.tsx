"use client"

import { useI18n } from "@/i18n/provider"
import { SectionHeader } from "./section-header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Shield, Eye, MessageCircle, Languages, Headphones, Phone, Mail, BadgeCheck } from "lucide-react"
import { SITE_CONFIG, getWhatsAppLink } from "@/lib/site-config"

export function AboutSection() {
  const { t, locale } = useI18n()

  const features = [
    { icon: MapPin, ...JSON.parse(JSON.stringify(t("about.features.localExpertise"))) },
    { icon: Shield, ...JSON.parse(JSON.stringify(t("about.features.curatedListings"))) },
    { icon: Eye, ...JSON.parse(JSON.stringify(t("about.features.transparentPricing"))) },
    { icon: MessageCircle, ...JSON.parse(JSON.stringify(t("about.features.whatsappFirst"))) },
    { icon: Languages, ...JSON.parse(JSON.stringify(t("about.features.bilingual"))) },
    { icon: Headphones, ...JSON.parse(JSON.stringify(t("about.features.afterSaleSupport"))) },
  ]

  // Stats
  const stats = [
    { value: "100+", label: t("home.statsProperties") },
    { value: "18", label: t("home.statsAreas") },
    { value: "500+", label: t("home.statsClients") },
    { value: "10+", label: t("home.statsYears") },
  ]

  return (
    <section id="about" className="py-16 md:py-24 relative overflow-hidden">
      {/* Faded background photo */}
      <div className="absolute inset-0 z-0 opacity-[0.06]">
        <img
          src="/mohammad-mosa-ali-faded.jpg"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left - story + mission */}
          <div>
            <SectionHeader
              title={t("about.title")}
              subtitle={t("about.subtitle")}
            />

            <div className="mt-8 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-[#1e3a8a] dark:text-[#c9a84c] mb-2">
                  {t("about.storyTitle")}
                </h3>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  {t("about.storyContent")}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#1e3a8a] dark:text-[#c9a84c] mb-2">
                  {t("about.missionTitle")}
                </h3>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  {t("about.missionContent")}
                </p>
              </div>

              {/* Owner profile card */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 border border-border">
                <img
                  src="/mohammad-mosa-ali-profile.jpg"
                  alt="Mohammad Mosa Ali"
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-[#c9a84c]/30 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-sm text-foreground">Mohammad Mosa Ali</h4>
                    <BadgeCheck className="h-4 w-4 text-[#c9a84c] flex-shrink-0" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {locale === "ar"
                      ? "المؤسس والمدير، العين العقارية"
                      : "Founder & Director, Al Ain Real Estate"}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                    <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-[#c9a84c] transition-colors">
                      <Phone className="h-3 w-3" />
                      <span dir="ltr">{SITE_CONFIG.phoneDisplay}</span>
                    </a>
                    <a href={`mailto:${SITE_CONFIG.email}`} className="flex items-center gap-1 hover:text-[#c9a84c] transition-colors truncate">
                      <Mail className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{SITE_CONFIG.email}</span>
                    </a>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                className="bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 dark:bg-[#c9a84c] dark:hover:bg-[#c9a84c]/90 dark:text-[#0a0f1e]"
              >
                {t("common.actions.contactUs")}
              </Button>
            </div>
          </div>

          {/* Right - image collage + stats */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-3">
                <img
                  src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&q=80"
                  alt="Al Ain villa"
                  className="w-full h-48 object-cover rounded-xl"
                />
                <img
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80"
                  alt="Al Ain apartment"
                  className="w-full h-32 object-cover rounded-xl"
                />
              </div>
              <div className="space-y-3 mt-8">
                <img
                  src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80"
                  alt="Al Ain modern home"
                  className="w-full h-32 object-cover rounded-xl"
                />
                <img
                  src="https://images.unsplash.com/photo-1448630360428-65456885c650?w=400&q=80"
                  alt="Al Ain luxury property"
                  className="w-full h-48 object-cover rounded-xl"
                />
              </div>
            </div>
            {/* Stats overlay */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              {stats.map((s, i) => (
                <Card key={i} className="p-4 text-center">
                  <div className="text-2xl md:text-3xl font-bold text-[#1e3a8a] dark:text-[#c9a84c]">
                    {s.value}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Why choose us */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center mb-8">{t("about.whyChooseUs")}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <Card key={i} className="p-5 card-hover">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#1e3a8a]/10 dark:bg-[#c9a84c]/10">
                    <f.icon className="h-5 w-5 text-[#1e3a8a] dark:text-[#c9a84c]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">{f.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{f.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
