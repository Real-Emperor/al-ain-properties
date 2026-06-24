import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export const dynamic = "force-dynamic"

// GET /api/property/[slug] — fetch single property by slug, increment views
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const property = await db.property.findUnique({ where: { slug } })

    if (!property || property.status === "draft") {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    // Increment views
    await db.property.update({
      where: { id: property.id },
      data: { views: { increment: 1 } },
    })

    return NextResponse.json({ property: { ...property, views: property.views + 1 } })
  } catch (error) {
    console.error("GET /api/property error:", error)
    return NextResponse.json({ error: "Failed to fetch property" }, { status: 500 })
  }
}
