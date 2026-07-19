import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export const dynamic = "force-dynamic"

// Verify admin token helper
async function verifyAdmin(request: NextRequest) {
  const auth = request.headers.get("authorization")
  if (!auth || !auth.startsWith("Bearer ")) return null
  const token = auth.substring(7)
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8")
    const [userId, timestamp] = decoded.split(":")
    // Token valid for 7 days
    const age = Date.now() - Number(timestamp)
    if (age > 7 * 24 * 60 * 60 * 1000) return null
    const user = await db.adminUser.findUnique({ where: { id: userId } })
    return user
  } catch {
    return null
  }
}

// GET /api/admin/properties — list all properties (including drafts)
export async function GET(request: NextRequest) {
  const user = await verifyAdmin(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const properties = await db.property.findMany({ orderBy: { createdAt: "desc" } })
  return NextResponse.json({ properties })
}

// POST /api/admin/properties — create new property
export async function POST(request: NextRequest) {
  const user = await verifyAdmin(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await request.json()
    // Generate slug from titleEn if not provided
    if (!body.slug) {
      body.slug = body.titleEn.toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
      // Ensure uniqueness
      const existing = await db.property.findUnique({ where: { slug: body.slug } })
      if (existing) {
        body.slug = `${body.slug}-${Date.now().toString(36)}`
      }
    }
    // Convert features array to JSON string if array provided
    if (Array.isArray(body.features)) {
      body.features = JSON.stringify(body.features)
    }
    if (Array.isArray(body.photos)) {
      body.photos = JSON.stringify(body.photos)
    }

    const property = await db.property.create({ data: body })
    return NextResponse.json({ success: true, property })
  } catch (error) {
    console.error("POST /api/admin/properties error:", error)
    return NextResponse.json({ error: "Failed to create property", details: String(error) }, { status: 500 })
  }
}

// PUT /api/admin/properties — update property (expects id in body)
export async function PUT(request: NextRequest) {
  const user = await verifyAdmin(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await request.json()
    const { id, ...data } = body
    if (!id) return NextResponse.json({ error: "Property id required" }, { status: 400 })

    if (Array.isArray(data.features)) {
      data.features = JSON.stringify(data.features)
    }
    if (Array.isArray(data.photos)) {
      data.photos = JSON.stringify(data.photos)
    }

    const property = await db.property.update({ where: { id }, data })
    return NextResponse.json({ success: true, property })
  } catch (error) {
    console.error("PUT /api/admin/properties error:", error)
    return NextResponse.json({ error: "Failed to update property" }, { status: 500 })
  }
}

// DELETE /api/admin/properties — delete property (expects id in body)
export async function DELETE(request: NextRequest) {
  const user = await verifyAdmin(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { id } = await request.json()
    if (!id) return NextResponse.json({ error: "Property id required" }, { status: 400 })

    await db.property.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE /api/admin/properties error:", error)
    return NextResponse.json({ error: "Failed to delete property" }, { status: 500 })
  }
}

export { verifyAdmin }
