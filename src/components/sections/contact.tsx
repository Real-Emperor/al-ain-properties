"use client"

import { useState } from "react"
import { useI18n } from "@/i18n/provider"
import { SectionHeader } from "./section-header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Phone, Mail, MapPin, MessageCircle, Send, Clock } from "lucide-react"
import { SITE_CONFIG, getTelLink, getWhatsAppLink } from "@/lib/site-config"
import { toast } from "sonner"

export function ContactSection() {
  const { t, locale } = useI18n()
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.phone || !form.message) {
      toast.error(locale === "ar" ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill all required fields")
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "contact_form" }),
      })
      if (res.ok) {
        toast.success(t("inquiry.success"))
        setForm({ name: "", phone: "", email: "", message: "" })
        const waMessage = locale === "ar"
          ? `مرحباً، أنا ${form.name}.\nهاتفي: ${form.phone}\n${form.email ? `بريدي: ${form.email}\n` : ""}رسالتي: ${form.message}`
          : `Hello, I'm ${form.name}.\nPhone: ${form.phone}\n${form.email ? `Email: ${form.email}\n` : ""}Message: ${form.message}`
        window.open(getWhatsAppLink(waMessage), "_blank")
      } else {
        toast.error(locale === "ar" ? "فشل الإرسال" : "Failed to send")
      }
    } catch (e) {
      toast.error(locale === "ar" ? "فشل الإرسال" : "Failed to send")
    }
    setSubmitting(false)
  }

  return (
    <section id="contact" className="py-12 md:py-16 relative overflow-hidden">
      {/* Faded background photo - VISIBLE between cards */}
      <div className="absolute inset-0 z-0">
        <img
          src="/mohammad-mosa-ali-faded.jpg"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover"
        />
        {/* Very light overlay - photo stays clearly visible */}
        <div className="absolute inset-0 bg-background/25" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <SectionHeader
          title={t("contact.title")}
          subtitle={t("contact.subtitle")}
          centered
        />

        {/* Compact contact info bar - single row */}
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 mt-8 mb-8">
          <a href={getTelLink()} className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 backdrop-blur-md border border-[#c9a84c]/30 hover:bg-background hover:border-[#c9a84c] transition-all">
            <Phone className="h-4 w-4 text-[#c9a84c]" />
            <span className="text-sm font-medium" dir="ltr">{SITE_CONFIG.phoneDisplay}</span>
          </a>
          <a href={getWhatsAppLink(locale === "ar" ? "مرحباً، أود الاستفسار عن عقاراتكم" : "Hello, I'd like to inquire about your properties")} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#25D366]/90 hover:bg-[#25D366] text-white transition-all">
            <MessageCircle className="h-4 w-4" />
            <span className="text-sm font-medium">{t("contact.whatsapp")}</span>
          </a>
          <a href={`mailto:${SITE_CONFIG.email}`} className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 backdrop-blur-md border border-[#c9a84c]/30 hover:bg-background hover:border-[#c9a84c] transition-all">
            <Mail className="h-4 w-4 text-[#c9a84c]" />
            <span className="text-sm font-medium">{SITE_CONFIG.email}</span>
          </a>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 backdrop-blur-md border border-[#c9a84c]/30">
            <MapPin className="h-4 w-4 text-[#c9a84c]" />
            <span className="text-sm font-medium">{locale === "ar" ? SITE_CONFIG.address.ar : SITE_CONFIG.address.en}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 backdrop-blur-md border border-[#c9a84c]/30">
            <Clock className="h-4 w-4 text-[#c9a84c]" />
            <span className="text-sm font-medium">{locale === "ar" ? SITE_CONFIG.workingHours.ar : SITE_CONFIG.workingHours.en}</span>
          </div>
        </div>

        {/* Contact form - single card, compact */}
        <div className="max-w-xl mx-auto">
          <Card className="p-6 bg-background/85 backdrop-blur-md border-[#c9a84c]/20">
            <h3 className="text-lg font-bold mb-4 text-center">{t("contact.formTitle")}</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="name" className="text-xs">{t("inquiry.name")} *</Label>
                  <Input id="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="mt-1 h-9" />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-xs">{t("inquiry.phone")} *</Label>
                  <Input id="phone" type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required className="mt-1 h-9" dir="ltr" />
                </div>
              </div>
              <div>
                <Label htmlFor="email" className="text-xs">{t("inquiry.email")}</Label>
                <Input id="email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="mt-1 h-9" dir="ltr" />
              </div>
              <div>
                <Label htmlFor="message" className="text-xs">{t("inquiry.message")} *</Label>
                <Textarea id="message" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required rows={2} className="mt-1" />
              </div>
              <Button type="submit" disabled={submitting} className="w-full bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 dark:bg-[#c9a84c] dark:hover:bg-[#c9a84c]/90 dark:text-[#0a0f1e]">
                {submitting ? (locale === "ar" ? "جاري الإرسال..." : "Sending...") : (<><Send className="h-4 w-4 me-2" />{t("inquiry.submit")}</>)}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </section>
  )
}
