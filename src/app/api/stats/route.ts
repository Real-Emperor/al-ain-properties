import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export const dynamic = "force-dynamic"

// GET /api/stats — public stats for homepage
export async function GET() {
  try {
    const [totalProperties, totalAreas, totalViews, totalInquiries] = await Promise.all([
      db.property.count({ where: { status: "active" } }),
      db.property.groupBy({ by: ["area"], where: { status: "active" } }).then(r => r.length),
      db.property.aggregate({ _sum: { views: true } }),
      db.propertyInquiry.count(),
    ])

    // Count properties per area
    const areaCounts = await db.property.groupBy({
      by: ["area"],
      where: { status: "active" },
      _count: { area: true },
    })
    const propertyCountsByArea: Record<string, number> = {}
    for (const a of areaCounts) {
      propertyCountsByArea[a.area] = a._count.area
    }

    // Count properties per category (type + listingType)
    const typeCounts = await db.property.groupBy({
      by: ["type", "listingType"],
      where: { status: "active" },
      _count: { type: true },
    })
    const propertyCountsByCategory: Record<string, number> = {}
    for (const t of typeCounts) {
      // Match category value (e.g., "villas-rent", "apartments-sale", "shops", "land", etc.)
      let key = t.type
      if (t.type === "villa") key = `villas-${t.listingType}`
      else if (t.type === "apartment") key = `apartments-${t.listingType}`
      else key = `${t.type}s`
      propertyCountsByCategory[key] = (propertyCountsByCategory[key] || 0) + t._count.type
    }

    return NextResponse.json({
      totalProperties,
      totalAreas,
      totalViews: totalViews._sum.views || 0,
      totalInquiries,
      propertyCountsByArea,
      propertyCountsByCategory,
    })
  } catch (error) {
    console.error("GET /api/stats error:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
