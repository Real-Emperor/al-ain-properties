"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Eye, ArrowLeft } from "lucide-react"
import { useI18n } from "@/i18n/provider"
import { useState, useEffect } from "react"

interface NewsArticle {
  id: string
  slug: string
  titleEn: string
  titleAr: string
  excerptEn: string
  excerptAr: string
  contentEn: string
  contentAr: string
  category: string
  coverImage?: string | null
  publishedAt: string
  views: number
}

export function NewsDetailsModal({
  article,
  open,
  onOpenChange,
}: {
  article: NewsArticle | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { t, locale } = useI18n()
  const [views, setViews] = useState(0)

  useEffect(() => {
    if (article) {
      setViews(article.views)
      // Increment views via API
      fetch(`/api/news/${article.slug}`, { method: "PATCH" }).catch(() => {})
      setViews(v => v + 1)
    }
  }, [article])

  if (!article) return null

  const content = locale === "ar" ? article.contentAr : article.contentEn
  // Split content by double newlines to create paragraphs
  const paragraphs = content.split("\n").filter(p => p.trim())

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[95vh] overflow-y-auto p-0">
        {/* Cover image */}
        {article.coverImage && (
          <div className="aspect-[16/9] overflow-hidden bg-muted">
            <img
              src={article.coverImage}
              alt={locale === "ar" ? article.titleAr : article.titleEn}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6 md:p-8">
          <DialogHeader className="p-0 space-y-0 mb-4">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge className="bg-[#c9a84c]/15 text-[#c9a84c] hover:bg-[#c9a84c]/20 border-0">
                {article.category}
              </Badge>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {new Date(article.publishedAt).toLocaleDateString(locale === "ar" ? "ar-AE" : "en-AE", {
                  year: "numeric", month: "long", day: "numeric"
                })}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Eye className="h-3 w-3" />
                {views} {t("property.views")}
              </span>
            </div>
            <DialogTitle className="text-xl md:text-2xl font-bold leading-tight">
              {locale === "ar" ? article.titleAr : article.titleEn}
            </DialogTitle>
            <DialogDescription className="text-base text-foreground/70 mt-2">
              {locale === "ar" ? article.excerptAr : article.excerptEn}
            </DialogDescription>
          </DialogHeader>

          {/* Content */}
          <div className="mt-6 space-y-4">
            {paragraphs.map((para, i) => {
              // Check if paragraph is a heading (starts with ** and ends with **)
              const isHeading = para.trim().startsWith("**") && para.trim().endsWith("**")
              const isListItem = para.trim().startsWith("- ") || /^\d+\./.test(para.trim())

              if (isHeading) {
                const text = para.trim().replace(/^\*\*|\*\*$/g, "")
                return (
                  <h3 key={i} className="text-lg font-bold text-[#1e3a8a] dark:text-[#c9a84c] mt-4">
                    {text}
                  </h3>
                )
              }
              if (isListItem) {
                return (
                  <p key={i} className="text-sm text-foreground/80 leading-relaxed ps-4">
                    {para}
                  </p>
                )
              }
              return (
                <p key={i} className="text-sm text-foreground/80 leading-relaxed">
                  {para}
                </p>
              )
            })}
          </div>

          {/* Back button */}
          <div className="mt-8 pt-6 border-t border-border">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              <ArrowLeft className="h-4 w-4 me-2 ltr-flip" />
              {locale === "ar" ? "العودة للأخبار" : "Back to News"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
