"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/i18n/provider"
import { SectionHeader } from "./section-header"
import { Calendar, ArrowRight } from "lucide-react"
import { NewsDetailsModal } from "@/components/news-details-modal"

export function NewsSection({ articles }: { articles: any[] }) {
  const { t, locale } = useI18n()
  const [selected, setSelected] = useState<any | null>(null)
  const [open, setOpen] = useState(false)

  if (!articles || articles.length === 0) return null

  const toShow = articles.slice(0, 3)

  const openArticle = (article: any) => {
    setSelected(article)
    setOpen(true)
  }

  return (
    <>
      <section id="news" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <SectionHeader
            title={t("news.title")}
            subtitle={t("news.subtitle")}
            centered
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {toShow.map(article => (
              <Card
                key={article.id}
                className="overflow-hidden card-hover group cursor-pointer p-0 flex flex-col"
                onClick={() => openArticle(article)}
              >
                <div className="aspect-[16/9] overflow-hidden bg-muted">
                  <img
                    src={article.coverImage || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80"}
                    alt={locale === "ar" ? article.titleAr : article.titleEn}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <Badge className="self-start mb-2 bg-[#c9a84c]/15 text-[#c9a84c] hover:bg-[#c9a84c]/20 border-0">
                    {article.category}
                  </Badge>
                  <h3 className="font-semibold text-base mb-2 line-clamp-2">
                    {locale === "ar" ? article.titleAr : article.titleEn}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3 flex-1">
                    {locale === "ar" ? article.excerptAr : article.excerptEn}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(article.publishedAt).toLocaleDateString(locale === "ar" ? "ar-AE" : "en-AE", {
                        year: "numeric", month: "short", day: "numeric"
                      })}
                    </span>
                    <Button variant="ghost" size="sm" className="text-[#1e3a8a] dark:text-[#c9a84c] p-0 h-auto" onClick={(e) => { e.stopPropagation(); openArticle(article) }}>
                      {t("news.readMore")}
                      <ArrowRight className="h-3 w-3 ms-1 ltr-flip" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <NewsDetailsModal article={selected} open={open} onOpenChange={setOpen} />
    </>
  )
}
