"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/i18n/provider"
import { Building, MessageSquare, Calendar, Eye, Newspaper, TrendingUp, ArrowRight } from "lucide-react"

export function AdminOverview({ onNavigate }: { onNavigate: (v: any) => void }) {
  const { t, locale } = useI18n()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("admin_token")
      const res = await fetch("/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        setStats(await res.json())
      }
      setLoading(false)
    }
    fetchStats()
  }, [])

  if (loading) return <div className="text-muted-foreground">Loading...</div>

  const cards = [
    { label: t("admin.dashboard.stats.totalProperties"), value: stats?.totalProperties || 0, icon: Building, color: "text-[#1e3a8a] dark:text-[#c9a84c]", view: "properties" },
    { label: t("admin.dashboard.stats.activeListings"), value: stats?.activeListings || 0, icon: TrendingUp, color: "text-green-600", view: "properties" },
    { label: t("admin.dashboard.stats.newInquiries"), value: stats?.newInquiries || 0, icon: MessageSquare, color: "text-orange-500", view: "inquiries" },
    { label: t("admin.dashboard.stats.newViewings"), value: stats?.newViewings || 0, icon: Calendar, color: "text-blue-500", view: "viewings" },
    { label: t("admin.dashboard.stats.totalViews"), value: stats?.totalViews || 0, icon: Eye, color: "text-purple-500", view: "overview" },
    { label: t("admin.dashboard.stats.publishedArticles"), value: stats?.publishedArticles || 0, icon: Newspaper, color: "text-pink-500", view: "news" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">{t("admin.dashboard.title")}</h1>
        <p className="text-sm text-muted-foreground">
          {locale === "ar" ? "نظرة عامة على نشاط منصة العقارات" : "Overview of your property platform activity"}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {cards.map((card, i) => (
          <Card
            key={i}
            className="p-4 card-hover cursor-pointer"
            onClick={() => onNavigate(card.view !== "overview" ? card.view : "properties")}
          >
            <div className="flex items-center justify-between mb-2">
              <card.icon className={`h-6 w-6 ${card.color}`} />
            </div>
            <div className="text-2xl font-bold">{card.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{card.label}</div>
          </Card>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-lg font-semibold mb-3">
          {locale === "ar" ? "إجراءات سريعة" : "Quick Actions"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="p-4 card-hover cursor-pointer" onClick={() => onNavigate("properties")}>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{t("admin.property.addNew")}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {locale === "ar" ? "أضف عقاراً جديداً للقائمة" : "Add a new property listing"}
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-[#c9a84c] ltr-flip" />
            </div>
          </Card>
          <Card className="p-4 card-hover cursor-pointer" onClick={() => onNavigate("news")}>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{t("admin.news.addNew")}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {locale === "ar" ? "انشر مقالاً إخبارياً جديداً" : "Publish a new news article"}
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-[#c9a84c] ltr-flip" />
            </div>
          </Card>
          <Card className="p-4 card-hover cursor-pointer" onClick={() => onNavigate("inquiries")}>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{t("admin.dashboard.inquiries")}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {locale === "ar" ? "راجع استفسارات العملاء" : "Review customer inquiries"}
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-[#c9a84c] ltr-flip" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
