"use client"

import { MessageCircle } from "lucide-react"
import { SITE_CONFIG, getWhatsAppLink } from "@/lib/site-config"
import { useI18n } from "@/i18n/provider"

export function WhatsAppButton() {
  const { t } = useI18n()
  const message = t("whatsapp.defaultMessage") || "Hello Al Ain Properties, I'm interested in your services."

  return (
    <a
      href={getWhatsAppLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-white shadow-lg shadow-green-500/30 whatsapp-pulse hover:bg-[#1da851] transition-colors"
    >
      <MessageCircle className="h-6 w-6" />
      <span className="hidden sm:inline font-semibold text-sm">{t("common.actions.whatsappUs")}</span>
    </a>
  )
}
