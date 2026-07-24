"use client"

import { useState, useEffect } from "react"
import { PageLayout } from "@/components/page-layout"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/i18n/provider"
import { NEWS_CATEGORIES } from "@/lib/site-config"
import { Calendar, ArrowRight, Inbox } from "lucide-react"
import Link from "next/link"

export default function NewsPage() {
  const { t, locale } = useI18n()
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState("all")

  useEffect(() => {
    fetch(`/api/news${category !== "all" ? `?category=${encodeURIComponent(category)}` : ""}`)
      .then(r => r.json())
      .then(data => { setArticles(data.articles || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [category])

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c9a84c]"></div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">{t("news.title")}</h1>
        <p className="text-muted-foreground mb-6">{t("news.subtitle")}</p>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Button variant={category === "all" ? "default" : "outline"} size="sm" onClick={() => setCategory("all")}>
            {t("news.categories.all")}
          </Button>
          {NEWS_CATEGORIES.map(c => (
            <Button key={c.value} variant={category === c.value ? "default" : "outline"} size="sm" onClick={() => setCategory(c.value)}>
              {locale === "ar" ? c.labelAr : c.labelEn}
            </Button>
          ))}
        </div>

        {articles.length === 0 ? (
          <Card className="p-12 text-center">
            <Inbox className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">{locale === "ar" ? "لا توجد مقالات حالياً" : "No articles yet"}</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map(article => (
              <Link key={article.id} href={`/news/${article.slug}`}>
                <Card className="overflow-hidden card-hover group cursor-pointer p-0 flex flex-col h-full">
                  <div className="aspect-[16/9] overflow-hidden bg-muted">
                    <img src={article.coverImage || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80"} alt={locale === "ar" ? article.titleAr : article.titleEn} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <Badge className="self-start mb-2 bg-[#c9a84c]/15 text-[#c9a84c] border-0">{article.category}</Badge>
                    <h3 className="font-semibold text-base mb-2 line-clamp-2">{locale === "ar" ? article.titleAr : article.titleEn}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3 flex-1">{locale === "ar" ? article.excerptAr : article.excerptEn}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(article.publishedAt).toLocaleDateString(locale === "ar" ? "ar-AE" : "en-AE", { year: "numeric", month: "short", day: "numeric" })}</span>
                      <span className="text-[#1e3a8a] dark:text-[#c9a84c]">{t("news.readMore")} <ArrowRight className="h-3 w-3 inline ltr-flip" /></span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  )
}
