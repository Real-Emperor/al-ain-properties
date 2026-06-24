"use client"

import { useI18n } from "@/i18n/provider"
import { SectionHeader } from "./section-header"
import { Card } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"

const TESTIMONIALS = [
  {
    nameEn: "Ahmed Al Marri",
    nameAr: "أحمد المري",
    roleEn: "Villa Owner, Al Jimi",
    roleAr: "مالك فيلا، الجيمي",
    textEn: "Al Ain Properties helped me find my dream villa in Al Jimi within just two weeks. Their team was professional, responsive on WhatsApp, and genuinely understood my family's needs.",
    textAr: "ساعدتني العين العقارية في العثور على فيلا أحلامي في الجيمي خلال أسبوعين فقط. كان فريقهم محترفاً وسريع الرد على واتساب ويفهم احتياجات عائلتي بصدق.",
    rating: 5,
  },
  {
    nameEn: "Sarah Johnson",
    nameAr: "سارة جونسون",
    roleEn: "Tenant, Al Hili",
    roleAr: "مستأجرة، الهيلي",
    textEn: "As an expat new to Al Ain, I was nervous about finding an apartment. The team made the entire process seamless — from viewing to lease signing in 3 days. Highly recommended!",
    textAr: "بصفتي مغتربة جديدة في العين، كنت قلقة بشأن العثور على شقة. جعل الفريق العملية بأكملها سلسة — من المعاينة إلى توقيع العقد في 3 أيام. أنصح بهم بشدة!",
    rating: 5,
  },
  {
    nameEn: "Khalid Al Nuaimi",
    nameAr: "خالد النعيمي",
    roleEn: "Investor, Multiple Properties",
    roleAr: "مستثمر، عقارات متعددة",
    textEn: "I've worked with several agencies in Al Ain, but Al Ain Properties stands out for their transparency and market knowledge. They've helped me acquire 3 investment properties so far.",
    textAr: "عملت مع عدة وكالات في العين، لكن العين العقارية تتميز بشفافيتها ومعرفتها بالسوق. ساعدوني في الحصول على 3 عقارات استثمارية حتى الآن.",
    rating: 5,
  },
]

export function TestimonialsSection() {
  const { t, locale } = useI18n()

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <SectionHeader
          title={t("home.testimonialsTitle")}
          subtitle={t("home.testimonialsSubtitle")}
          centered
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {TESTIMONIALS.map((testimonial, i) => (
            <Card key={i} className="p-6 card-hover relative overflow-hidden">
              <Quote className="absolute top-4 end-4 h-10 w-10 text-[#c9a84c]/15" />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, idx) => (
                  <Star key={idx} className="h-4 w-4 fill-[#c9a84c] text-[#c9a84c]" />
                ))}
              </div>
              <p className="text-sm text-foreground/80 mb-6 leading-relaxed">
                "{locale === "ar" ? testimonial.textAr : testimonial.textEn}"
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#c9a84c] to-[#1e3a8a] text-white font-bold">
                  {(locale === "ar" ? testimonial.nameAr : testimonial.nameEn).charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-sm">
                    {locale === "ar" ? testimonial.nameAr : testimonial.nameEn}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {locale === "ar" ? testimonial.roleAr : testimonial.roleEn}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
