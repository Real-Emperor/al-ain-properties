"use client"

import { useState } from "react"
import { useI18n } from "@/i18n/provider"
import { SectionHeader } from "./section-header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from "lucide-react"
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
        // Also open WhatsApp with the message
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

  const contactInfo = [
    {
      icon: Phone,
      label: t("contact.phone"),
      value: SITE_CONFIG.phoneDisplay,
      href: getTelLink(),
    },
    {
      icon: MessageCircle,
      label: t("contact.whatsapp"),
      value: SITE_CONFIG.whatsappDisplay,
      href: getWhatsAppLink(locale === "ar" ? "مرحباً، أود الاستفسار عن عقاراتكم" : "Hello, I'd like to inquire about your properties"),
    },
    {
      icon: Mail,
      label: t("contact.email"),
      value: SITE_CONFIG.email,
      href: `mailto:${SITE_CONFIG.email}`,
    },
    {
      icon: MapPin,
      label: t("contact.address"),
      value: locale === "ar" ? SITE_CONFIG.address.ar : SITE_CONFIG.address.en,
      href: "#",
    },
  ]

  return (
    <section id="contact" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <SectionHeader
          title={t("contact.title")}
          subtitle={t("contact.subtitle")}
          centered
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
          {/* Left — contact info */}
          <div className="space-y-4">
            {contactInfo.map((info, i) => (
              <a
                key={i}
                href={info.href}
                target={info.href.startsWith("http") ? "_blank" : undefined}
                rel={info.href.startsWith("http") ? "noopener noreferrer" : undefined}
              >
                <Card className="p-5 card-hover flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#1e3a8a] to-[#c9a84c] text-white">
                    <info.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">{info.label}</div>
                    <div className="font-semibold text-sm" dir="ltr">{info.value}</div>
                  </div>
                </Card>
              </a>
            ))}

            {/* Working hours */}
            <Card className="p-5 bg-[#1e3a8a]/5 dark:bg-[#c9a84c]/5 border-[#1e3a8a]/20 dark:border-[#c9a84c]/20">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-[#1e3a8a]/10 dark:bg-[#c9a84c]/10">
                  <Clock className="h-6 w-6 text-[#1e3a8a] dark:text-[#c9a84c]" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">{t("contact.workingHours")}</div>
                  <div className="font-semibold text-sm">
                    {locale === "ar" ? SITE_CONFIG.workingHours.ar : SITE_CONFIG.workingHours.en}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right — form */}
          <Card className="p-6 md:p-8">
            <h3 className="text-xl font-bold mb-6">{t("contact.formTitle")}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">{t("inquiry.name")} *</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">{t("inquiry.phone")} *</Label>
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    required
                    type="tel"
                    className="mt-1"
                    dir="ltr"
                  />
                </div>
                <div>
                  <Label htmlFor="email">{t("inquiry.email")}</Label>
                  <Input
                    id="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    type="email"
                    className="mt-1"
                    dir="ltr"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="message">{t("inquiry.message")} *</Label>
                <Textarea
                  id="message"
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  required
                  rows={4}
                  className="mt-1"
                />
              </div>
              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 dark:bg-[#c9a84c] dark:hover:bg-[#c9a84c]/90 dark:text-[#0a0f1e]"
              >
                {submitting ? (
                  <>{locale === "ar" ? "جاري الإرسال..." : "Sending..."}</>
                ) : (
                  <>
                    <Send className="h-4 w-4 me-2" />
                    {t("inquiry.submit")}
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                {locale === "ar"
                  ? "سيتم فتح واتساب أيضاً برسالتك لإرسالها مباشرة"
                  : "WhatsApp will also open with your message for instant delivery"}
              </p>
            </form>
          </Card>
        </div>
      </div>
    </section>
  )
}
