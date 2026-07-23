"use client"

import { PageLayout } from "@/components/page-layout"
import { ContactSection } from "@/components/sections/contact"

export default function ContactPage() {
  return (
    <PageLayout>
      <div className="pt-8">
        <ContactSection />
      </div>
    </PageLayout>
  )
}
