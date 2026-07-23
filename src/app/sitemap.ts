import type { MetadataRoute } from "next"
import { AL_AIN_AREAS, PROPERTY_TYPES } from "@/lib/site-config"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://alainroomforrent.com"
  const now = new Date()

  const staticPages = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/admin`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
  ]

  // Generate area-based URLs
  const areaPages = AL_AIN_AREAS.map(area => ({
    url: `${baseUrl}/?area=${area.value}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  // Generate type-based URLs
  const typePages = PROPERTY_TYPES.map(type => ({
    url: `${baseUrl}/?type=${type.value}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  return [...staticPages, ...areaPages, ...typePages]
}
