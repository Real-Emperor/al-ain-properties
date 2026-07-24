import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

// Cache stats for 5 minutes (stats don't need to be real-time)
export const revalidate = 300 // 5 minutes
export const dynamic = "force-static"

// GET /api/stats - public stats for homepage
export async function GET() {
  try {
    const [totalProperties, totalAreas, totalViews, totalInquiries, areaCounts, typeCounts] = await Promise.all([
      db.property.count({ where: { status: "active" } }),
      db.property.groupBy({ by: ["area"], where: { status: "active" } }).then(r => r.length),
      db.property.aggregate({ _sum: { views: true } }),
      db.propertyInquiry.count(),
      db.property.groupBy({
        by: ["area"],
        where: { status: "active" },
        _count: { area: true },
      }),
      db.property.groupBy({
        by: ["type", "listingType"],
        where: { status: "active" },
        _count: { type: true },
      }),
    ])

    const propertyCountsByArea: Record<string, number> = {}
    for (const a of areaCounts) {
      propertyCountsByArea[a.area] = a._count.area
    }

    const propertyCountsByCategory: Record<string, number> = {}
    for (const t of typeCounts) {
      let key = t.type
      if (t.type === "villa") key = `villas-${t.listingType}`
      else if (t.type === "apartment") key = `apartments-${t.listingType}`
      else key = `${t.type}s`
      propertyCountsByCategory[key] = (propertyCountsByCategory[key] || 0) + t._count.type
    }

    const response = NextResponse.json({
      totalProperties,
      totalAreas,
      totalViews: totalViews._sum.views || 0,
      totalInquiries,
      propertyCountsByArea,
      propertyCountsByCategory,
    })
    response.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=3600")
    return response
  } catch (error) {
    console.error("GET /api/stats error:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
