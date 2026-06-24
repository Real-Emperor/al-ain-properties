"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useI18n } from "@/i18n/provider"
import { Phone, Mail, Trash2, MessageCircle } from "lucide-react"
import { toast } from "sonner"
import { getWhatsAppLink } from "@/lib/site-config"

export function AdminInquiries() {
  const { t, locale } = useI18n()
  const [inquiries, setInquiries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchInquiries = async () => {
    const token = localStorage.getItem("admin_token")
    const res = await fetch("/api/admin/inquiries", {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.ok) setInquiries((await res.json()).inquiries)
    setLoading(false)
  }

  useEffect(() => { fetchInquiries() }, [])

  const updateStatus = async (id: string, status: string) => {
    const token = localStorage.getItem("admin_token")
    await fetch("/api/admin/inquiries", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, status }),
    })
    fetchInquiries()
  }

  const remove = async (id: string) => {
    if (!confirm(locale === "ar" ? "حذف هذا الاستفسار؟" : "Delete this inquiry?")) return
    const token = localStorage.getItem("admin_token")
    await fetch("/api/admin/inquiries", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id }),
    })
    toast.success(locale === "ar" ? "تم الحذف" : "Deleted")
    fetchInquiries()
  }

  if (loading) return <div className="text-muted-foreground">Loading...</div>

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{t("admin.dashboard.inquiries")}</h1>
      {inquiries.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          {locale === "ar" ? "لا توجد استفسارات بعد" : "No inquiries yet"}
        </Card>
      ) : (
        <div className="space-y-3">
          {inquiries.map(inq => (
            <Card key={inq.id} className="p-4">
              <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                <div>
                  <div className="font-semibold">{inq.name}</div>
                  {inq.property && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {locale === "ar" ? "عن عقار:" : "About:"} {locale === "ar" ? inq.property.titleAr : inq.property.titleEn}
                    </div>
                  )}
                </div>
                <Badge variant={inq.status === "new" ? "default" : "secondary"} className="text-xs">
                  {inq.status}
                </Badge>
              </div>
              <p className="text-sm text-foreground/80 mb-3">{inq.message}</p>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <a href={`tel:${inq.phone}`} className="flex items-center gap-1 text-[#1e3a8a] dark:text-[#c9a84c]">
                  <Phone className="h-3 w-3" /> {inq.phone}
                </a>
                {inq.email && (
                  <a href={`mailto:${inq.email}`} className="flex items-center gap-1 text-[#1e3a8a] dark:text-[#c9a84c]">
                    <Mail className="h-3 w-3" /> {inq.email}
                  </a>
                )}
                <span className="text-muted-foreground">
                  {new Date(inq.createdAt).toLocaleString(locale === "ar" ? "ar-AE" : "en-AE")}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <a href={getWhatsAppLink(`Hello ${inq.name}, regarding your inquiry: ${inq.message}`)} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" variant="outline" className="h-7 text-xs border-[#25D366] text-[#25D366]">
                    <MessageCircle className="h-3 w-3 me-1" /> WhatsApp
                  </Button>
                </a>
                {inq.status === "new" && (
                  <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => updateStatus(inq.id, "contacted")}>
                    {locale === "ar" ? "تم التواصل" : "Mark Contacted"}
                  </Button>
                )}
                {inq.status !== "closed" && (
                  <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => updateStatus(inq.id, "closed")}>
                    {locale === "ar" ? "إغلاق" : "Close"}
                  </Button>
                )}
                <Button size="sm" variant="ghost" className="h-7 text-xs text-red-500" onClick={() => remove(inq.id)}>
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
