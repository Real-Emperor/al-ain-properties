"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { PageLayout } from "@/components/page-layout"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Eye, ArrowLeft } from "lucide-react"
import { useI18n } from "@/i18n/provider"

export default function NewsArticlePage() {
  const params = useParams()
  const slug = params.slug as string
  const { t, locale } = useI18n()
  const [article, setArticle] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/property/${slug}`).catch(() => {})
    fetch(`/api/news`)
      .then(r => r.json())
      .then(data => {
        const found = (data.articles || []).find((a: any) => a.slug === slug)
        setArticle(found)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c9a84c]"></div>
        </div>
      </PageLayout>
    )
  }

  if (!article) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Article not found</h1>
          <Link href="/news"><Button>All News</Button></Link>
        </div>
      </PageLayout>
    )
  }

  const content = locale === "ar" ? article.contentAr : article.contentEn
  const paragraphs = content.split("\n").filter((p: string) => p.trim())

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Link href="/news" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-[#c9a84c] mb-4">
          <ArrowLeft className="h-4 w-4" />
          {locale === "ar" ? "جميع الأخبار" : "All News"}
        </Link>

        {article.coverImage && (
          <div className="aspect-[16/9] rounded-xl overflow-hidden mb-6">
            <img src={article.coverImage} alt={locale === "ar" ? article.titleAr : article.titleEn} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge className="bg-[#c9a84c]/15 text-[#c9a84c] border-0">{article.category}</Badge>
          <span className="flex items-center gap-1 text-xs text-muted-foreground"><Calendar className="h-3 w-3" />{new Date(article.publishedAt).toLocaleDateString(locale === "ar" ? "ar-AE" : "en-AE", { year: "numeric", month: "long", day: "numeric" })}</span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground"><Eye className="h-3 w-3" />{article.views}</span>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold mb-4">{locale === "ar" ? article.titleAr : article.titleEn}</h1>
        <p className="text-base text-foreground/70 mb-6">{locale === "ar" ? article.excerptAr : article.excerptEn}</p>

        <div className="space-y-4">
          {paragraphs.map((para: string, i: number) => {
            const isHeading = para.trim().startsWith("**") && para.trim().endsWith("**")
            if (isHeading) {
              return <h3 key={i} className="text-lg font-bold text-[#1e3a8a] dark:text-[#c9a84c] mt-4">{para.trim().replace(/^\*\*|\*\*$/g, "")}</h3>
            }
            return <p key={i} className="text-sm text-foreground/80 leading-relaxed">{para}</p>
          })}
        </div>
      </div>
    </PageLayout>
  )
}
