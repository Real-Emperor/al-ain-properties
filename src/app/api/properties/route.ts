import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

// Cache for 5 minutes (properties don't change frequently)
export const revalidate = 300
export const dynamic = "force-static"

// GET /api/properties - list all properties (with optional filters)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const area = searchParams.get("area")
    const type = searchParams.get("type")
    const listingType = searchParams.get("listingType")
    const featured = searchParams.get("featured")
    const limit = searchParams.get("limit")
    const status = searchParams.get("status") || "active"

    const where: any = { status }
    if (area && area !== "all") where.area = area
    if (type && type !== "all") where.type = type
    if (listingType && listingType !== "all") where.listingType = listingType
    if (featured === "true") where.featured = true

    const properties = await db.property.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit ? Number(limit) : undefined,
    })

    const response = NextResponse.json({ properties })
    response.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=3600")
    return response
  } catch (error) {
    console.error("GET /api/properties error:", error)
    return NextResponse.json({ error: "Failed to fetch properties" }, { status: 500 })
  }
}
