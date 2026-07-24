"use client"

import { PageLayout } from "@/components/page-layout"
import { AboutSection } from "@/components/sections/about"

export default function AboutPage() {
  return (
    <PageLayout>
      <div className="pt-8">
        <AboutSection />
      </div>
    </PageLayout>
  )
}
