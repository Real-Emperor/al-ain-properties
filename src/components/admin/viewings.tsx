"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useI18n } from "@/i18n/provider"
import { Phone, Mail, Trash2, MessageCircle, Calendar, Clock } from "lucide-react"
import { toast } from "sonner"
import { getWhatsAppLink } from "@/lib/site-config"

export function AdminViewings() {
  const { t, locale } = useI18n()
  const [viewings, setViewings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchViewings = async () => {
    const token = localStorage.getItem("admin_token")
    const res = await fetch("/api/admin/viewings", {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.ok) setViewings((await res.json()).viewings)
    setLoading(false)
  }

  useEffect(() => { fetchViewings() }, [])

  const updateStatus = async (id: string, status: string) => {
    const token = localStorage.getItem("admin_token")
    await fetch("/api/admin/viewings", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, status }),
    })
    fetchViewings()
  }

  const remove = async (id: string) => {
    if (!confirm(locale === "ar" ? "حذف هذا الحجز؟" : "Delete this viewing?")) return
    const token = localStorage.getItem("admin_token")
    await fetch("/api/admin/viewings", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id }),
    })
    toast.success(locale === "ar" ? "تم الحذف" : "Deleted")
    fetchViewings()
  }

  if (loading) return <div className="text-muted-foreground">Loading...</div>

  const timeLabel = (time: string) => {
    if (time === "morning") return locale === "ar" ? "صباحاً (9-12)" : "Morning (9-12)"
    if (time === "afternoon") return locale === "ar" ? "ظهراً (12-4)" : "Afternoon (12-4)"
    if (time === "evening") return locale === "ar" ? "مساءً (4-7)" : "Evening (4-7)"
    return time
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{t("admin.dashboard.viewings")}</h1>
      {viewings.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          {locale === "ar" ? "لا توجد حجوزات معاينة بعد" : "No viewing bookings yet"}
        </Card>
      ) : (
        <div className="space-y-3">
          {viewings.map(v => (
            <Card key={v.id} className="p-4">
              <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                <div>
                  <div className="font-semibold">{v.name}</div>
                  {v.property && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {locale === "ar" ? "للعقار:" : "Property:"} {locale === "ar" ? v.property.titleAr : v.property.titleEn}
                    </div>
                  )}
                </div>
                <Badge variant={v.status === "new" ? "default" : "secondary"} className="text-xs">
                  {v.status}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm mb-3">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-[#c9a84c]" />
                  {v.preferredDate}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-[#c9a84c]" />
                  {timeLabel(v.preferredTime)}
                </span>
              </div>
              {v.message && (
                <p className="text-sm text-foreground/80 mb-3 italic">"{v.message}"</p>
              )}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <a href={`tel:${v.phone}`} className="flex items-center gap-1 text-[#1e3a8a] dark:text-[#c9a84c]">
                  <Phone className="h-3 w-3" /> {v.phone}
                </a>
                {v.email && (
                  <a href={`mailto:${v.email}`} className="flex items-center gap-1 text-[#1e3a8a] dark:text-[#c9a84c]">
                    <Mail className="h-3 w-3" /> {v.email}
                  </a>
                )}
                <span className="text-muted-foreground">
                  {new Date(v.createdAt).toLocaleString(locale === "ar" ? "ar-AE" : "en-AE")}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <a href={getWhatsAppLink(`Hello ${v.name}, confirming your viewing on ${v.preferredDate} at ${timeLabel(v.preferredTime)}`)} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" variant="outline" className="h-7 text-xs border-[#25D366] text-[#25D366]">
                    <MessageCircle className="h-3 w-3 me-1" /> WhatsApp
                  </Button>
                </a>
                {v.status === "new" && (
                  <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => updateStatus(v.id, "confirmed")}>
                    {locale === "ar" ? "تأكيد" : "Confirm"}
                  </Button>
                )}
                {v.status !== "completed" && v.status !== "cancelled" && (
                  <>
                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => updateStatus(v.id, "completed")}>
                      {locale === "ar" ? "مكتملة" : "Completed"}
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => updateStatus(v.id, "cancelled")}>
                      {locale === "ar" ? "إلغاء" : "Cancel"}
                    </Button>
                  </>
                )}
                <Button size="sm" variant="ghost" className="h-7 text-xs text-red-500" onClick={() => remove(v.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
