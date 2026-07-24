import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verifyAdmin } from "../properties/route"
import { AL_AIN_AREAS } from "@/lib/site-config"

export const dynamic = "force-dynamic"

// GET /api/admin/areas - list all areas (built-in + custom) with admin info
export async function GET(request: NextRequest) {
  const user = await verifyAdmin(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const [covers, customs] = await Promise.all([
      db.areaCover.findMany(),
      db.areaCustom.findMany({ orderBy: { sortOrder: "asc" } }),
    ])

    const coverMap: Record<string, { image: string; hidden: boolean }> = {}
    for (const c of covers) {
      coverMap[c.areaValue] = { image: c.coverImage, hidden: c.hidden }
    }

    const builtInAreas = AL_AIN_AREAS.map(a => ({
      value: a.value,
      labelEn: a.labelEn,
      labelAr: a.labelAr,
      coverImage: coverMap[a.value]?.image || null,
      hidden: coverMap[a.value]?.hidden || false,
      isCustom: false,
    }))

    const customAreas = customs.map(a => ({
      value: a.areaValue,
      labelEn: a.labelEn,
      labelAr: a.labelAr,
      coverImage: a.coverImage || coverMap[a.areaValue]?.image || null,
      hidden: a.hidden,
      isCustom: true,
    }))

    return NextResponse.json({ areas: [...builtInAreas, ...customAreas] })
  } catch (error) {
    console.error("GET /api/admin/areas error:", error)
    return NextResponse.json({ areas: [] })
  }
}

// POST /api/admin/areas - upsert cover image, toggle hidden, or add custom area
export async function POST(request: NextRequest) {
  const user = await verifyAdmin(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await request.json()
    const { action, areaValue, coverImage, hidden, labelEn, labelAr, lat, lng } = body

    if (action === "uploadCover") {
      // Upload/update cover photo for a built-in area
      const cover = await db.areaCover.upsert({
        where: { areaValue },
        update: { coverImage },
        create: { areaValue, coverImage },
      })
      return NextResponse.json({ success: true, cover })
    }

    if (action === "toggleHidden") {
      // Toggle visibility of a built-in area
      const existing = await db.areaCover.findUnique({ where: { areaValue } })
      if (existing) {
        const updated = await db.areaCover.update({
          where: { areaValue },
          data: { hidden: !existing.hidden },
        })
        return NextResponse.json({ success: true, hidden: updated.hidden })
      } else {
        // Create a record just to mark as hidden
        const created = await db.areaCover.create({
          data: { areaValue, coverImage: "", hidden: true },
        })
        return NextResponse.json({ success: true, hidden: created.hidden })
      }
    }

    if (action === "addCustom") {
      // Add a new custom area
      const custom = await db.areaCustom.create({
        data: {
          areaValue,
          labelEn,
          labelAr,
          lat: lat || 24.2075,
          lng: lng || 55.7447,
        },
      })
      return NextResponse.json({ success: true, custom })
    }

    if (action === "deleteCustom") {
      // Delete a custom area
      await db.areaCustom.deleteMany({ where: { areaValue } })
      return NextResponse.json({ success: true })
    }

    if (action === "uploadCustomCover") {
      // Upload cover for a custom area
      await db.areaCustom.update({
        where: { areaValue },
        data: { coverImage },
      })
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 })
  } catch (error) {
    console.error("POST /api/admin/areas error:", error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}

// DELETE /api/admin/areas - delete cover (revert to default) or delete custom area
export async function DELETE(request: NextRequest) {
  const user = await verifyAdmin(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { areaValue, isCustom } = await request.json()

    if (isCustom) {
      await db.areaCustom.deleteMany({ where: { areaValue } })
    } else {
      await db.areaCover.deleteMany({ where: { areaValue } })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE /api/admin/areas error:", error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
