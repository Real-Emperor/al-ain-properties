"use client"

import { PageLayout } from "@/components/page-layout"
import { PopularAreas } from "@/components/sections/popular-areas"
import { useState, useEffect } from "react"
import { SectionHeader } from "@/components/sections/section-header"

export default function AreasPage() {
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    fetch("/api/stats").then(r => r.json()).then(setStats).catch(() => {})
  }, [])

  return (
    <PageLayout>
      <div className="pt-8">
        <PopularAreas propertyCounts={stats?.propertyCountsByArea || {}} />
      </div>
    </PageLayout>
  )
}
