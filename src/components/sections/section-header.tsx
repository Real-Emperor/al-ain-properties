"use client"

import { useI18n } from "@/i18n/provider"

export function SectionHeader({
  title,
  subtitle,
  centered = false,
  className = "",
}: {
  title: string
  subtitle?: string
  centered?: boolean
  className?: string
}) {
  return (
    <div className={`${centered ? "text-center mx-auto max-w-2xl" : ""} ${className}`}>
      <div className={`inline-flex items-center gap-2 mb-3 ${centered ? "" : ""}`}>
        <span className="h-px w-8 bg-[#c9a84c]" />
        <span className="text-xs font-semibold uppercase tracking-wider text-[#c9a84c]">
          Al Ain Properties
        </span>
        <span className="h-px w-8 bg-[#c9a84c]" />
      </div>
      <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{title}</h2>
      {subtitle && <p className="text-muted-foreground text-sm md:text-base">{subtitle}</p>}
    </div>
  )
}
