"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, MessageCircle, Send } from "lucide-react"
import { useI18n } from "@/i18n/provider"
import { getWhatsAppLink } from "@/lib/site-config"
import { toast } from "sonner"

interface Property {
  id: string
  slug: string
  titleEn: string
  titleAr: string
}

interface ViewingBookingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  properties: Property[]
  preselectedPropertyId?: string
}

export function ViewingBookingModal({
  open,
  onOpenChange,
  properties,
  preselectedPropertyId,
}: ViewingBookingModalProps) {
  const { t, locale } = useI18n()
  const [form, setForm] = useState({
    propertyId: preselectedPropertyId || "",
    name: "",
    phone: "",
    email: "",
    preferredDate: "",
    preferredTime: "",
    message: "",
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (preselectedPropertyId) {
      setForm(prev => ({ ...prev, propertyId: preselectedPropertyId }))
    }
  }, [preselectedPropertyId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.phone || !form.preferredDate || !form.preferredTime) {
      toast.error(locale === "ar" ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill all required fields")
      return
    }

    setSubmitting(true)
    try {
      // Save to DB
      await fetch("/api/viewings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      // Build WhatsApp message
      const selectedProperty = properties.find(p => p.id === form.propertyId)
      const propertyTitle = selectedProperty
        ? (locale === "ar" ? selectedProperty.titleAr : selectedProperty.titleEn)
        : (locale === "ar" ? "معاينة عامة" : "General viewing")

      const timeLabel = form.preferredTime === "morning"
        ? (locale === "ar" ? "صباحاً (9 ص - 12 ظ)" : "Morning (9 AM - 12 PM)")
        : form.preferredTime === "afternoon"
        ? (locale === "ar" ? "ظهراً (12 ظ - 4 م)" : "Afternoon (12 PM - 4 PM)")
        : (locale === "ar" ? "مساءً (4 م - 7 م)" : "Evening (4 PM - 7 PM)")

      const waMessage = locale === "ar"
        ? `🏛️ *طلب معاينة عقار - العين العقارية*

🏠 *العقار:* ${propertyTitle}
👤 *الاسم:* ${form.name}
📞 *الهاتف:* ${form.phone}
${form.email ? `📧 *البريد:* ${form.email}\n` : ""}
📅 *التاريخ المفضل:* ${form.preferredDate}
⏰ *الوقت المفضل:* ${timeLabel}
${form.message ? `💬 *ملاحظات:* ${form.message}\n` : ""}
أرجو تأكيد الموعد. شكراً!`
        : `🏛️ *Property Viewing Request — Al Ain Properties*

🏠 *Property:* ${propertyTitle}
👤 *Name:* ${form.name}
📞 *Phone:* ${form.phone}
${form.email ? `📧 *Email:* ${form.email}\n` : ""}
📅 *Preferred Date:* ${form.preferredDate}
⏰ *Preferred Time:* ${timeLabel}
${form.message ? `💬 *Notes:* ${form.message}\n` : ""}
Please confirm the appointment. Thank you!`

      // Open WhatsApp with the message
      window.open(getWhatsAppLink(waMessage), "_blank")
      toast.success(t("booking.success"))
      onOpenChange(false)
      setForm({
        propertyId: preselectedPropertyId || "",
        name: "", phone: "", email: "",
        preferredDate: "", preferredTime: "", message: "",
      })
    } catch (error) {
      toast.error(locale === "ar" ? "فشل الإرسال" : "Failed to send")
    }
    setSubmitting(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-[#c9a84c]" />
            {t("booking.title")}
          </DialogTitle>
          <DialogDescription>{t("booking.subtitle")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Property select */}
          <div>
            <Label htmlFor="property">{t("booking.selectProperty")}</Label>
            <Select
              value={form.propertyId || "none"}
              onValueChange={v => setForm({ ...form, propertyId: v === "none" ? "" : v })}
            >
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{t("booking.noPropertySelected")}</SelectItem>
                {properties.map(p => (
                  <SelectItem key={p.id} value={p.id}>
                    {locale === "ar" ? p.titleAr : p.titleEn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Name + Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="name">{t("booking.name")} *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="phone">{t("booking.phone")} *</Label>
              <Input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                required
                className="mt-1"
                dir="ltr"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">{t("booking.email")}</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="mt-1"
              dir="ltr"
            />
          </div>

          {/* Date + Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="date">{t("booking.preferredDate")} *</Label>
              <Input
                id="date"
                type="date"
                value={form.preferredDate}
                onChange={e => setForm({ ...form, preferredDate: e.target.value })}
                required
                className="mt-1"
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div>
              <Label htmlFor="time">{t("booking.preferredTime")} *</Label>
              <Select
                value={form.preferredTime}
                onValueChange={v => setForm({ ...form, preferredTime: v })}
              >
                <SelectTrigger className="mt-1"><SelectValue placeholder={t("booking.preferredTime")} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">{t("booking.morning")}</SelectItem>
                  <SelectItem value="afternoon">{t("booking.afternoon")}</SelectItem>
                  <SelectItem value="evening">{t("booking.evening")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Message */}
          <div>
            <Label htmlFor="message">{t("booking.message")}</Label>
            <Textarea
              id="message"
              value={form.message}
              onChange={e => setForm({ ...form, message: e.target.value })}
              rows={3}
              className="mt-1"
            />
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#25D366] hover:bg-[#1da851] text-white"
          >
            {submitting ? (
              <>{locale === "ar" ? "جاري الإرسال..." : "Sending..."}</>
            ) : (
              <>
                <MessageCircle className="h-4 w-4 me-2" />
                {t("booking.submit")}
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
            <Clock className="h-3 w-3" />
            {locale === "ar"
              ? "سيتم حفظ طلبك وإرساله مباشرة إلى واتساب"
              : "Your request will be saved and sent directly to WhatsApp"}
          </p>
        </form>
      </DialogContent>
    </Dialog>
  )
}
