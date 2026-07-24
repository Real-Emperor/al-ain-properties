import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { AL_AIN_AREAS } from "@/lib/site-config"

// Cache for 1 hour, allow stale-while-revalidate for 1 day
export const revalidate = 3600 // 1 hour in seconds
export const dynamic = "force-static"

// GET /api/areas - returns all visible areas (built-in + custom) with cover photos
// This endpoint is cached for 1 hour to avoid repeated DB queries on every page load.
// The cache is automatically invalidated when the file is redeployed.
export async function GET() {
  try {
    const [covers, customs] = await Promise.all([
      db.areaCover.findMany(),
      db.areaCustom.findMany({ where: { hidden: false }, orderBy: { sortOrder: "asc" } }),
    ])

    const coverMap: Record<string, string> = {}
    const hiddenSet = new Set<string>()
    for (const c of covers) {
      if (c.coverImage) coverMap[c.areaValue] = c.coverImage
      if (c.hidden) hiddenSet.add(c.areaValue)
    }

    // Built-in areas (excluding hidden ones)
    const builtInAreas = AL_AIN_AREAS
      .filter(a => !hiddenSet.has(a.value))
      .map(a => ({
        value: a.value,
        labelEn: a.labelEn,
        labelAr: a.labelAr,
        coverImage: coverMap[a.value] || null,
        isCustom: false,
      }))

    // Custom areas
    const customAreas = customs.map(a => ({
      value: a.areaValue,
      labelEn: a.labelEn,
      labelAr: a.labelAr,
      coverImage: a.coverImage || coverMap[a.areaValue] || null,
      isCustom: true,
    }))

    const allAreas = [...builtInAreas, ...customAreas]

    // Return covers map for backward compat + full areas list
    const response = NextResponse.json({
      covers: coverMap,
      areas: allAreas,
      hiddenAreas: Array.from(hiddenSet),
    })
    // Cache at CDN level for 1 hour
    response.headers.set("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400")
    return response
  } catch (error) {
    console.error("GET /api/areas error:", error)
    return NextResponse.json({ covers: {}, areas: [], hiddenAreas: [] })
  }
}
