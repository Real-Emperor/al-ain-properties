import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { AL_AIN_AREAS } from "@/lib/site-config"
import { verifyAdmin } from "../properties/route"

export const dynamic = "force-dynamic"

// GET /api/admin/areas — list all areas (built-in + custom) with metadata
export async function GET(request: NextRequest) {
  const user = await verifyAdmin(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    // Fetch all area covers (built-in)
    const covers = await db.areaCover.findMany()
    const coverMap = new Map(covers.map(c => [c.areaValue, c]))

    // Fetch all custom areas
    const customs = await db.areaCustom.findMany({ orderBy: { sortOrder: "asc" } })

    // Fetch property counts per area
    const properties = await db.property.findMany({ select: { area: true, status: true } })
    const propCountMap = new Map<string, number>()
    for (const p of properties) {
      if (p.status === "active") {
        propCountMap.set(p.area, (propCountMap.get(p.area) || 0) + 1)
      }
    }

    // Build areas list: built-in + custom
    const builtInAreas = AL_AIN_AREAS.map(a => {
      const cover = coverMap.get(a.value)
      return {
        value: a.value,
        labelEn: a.labelEn,
        labelAr: a.labelAr,
        coverImage: cover?.coverImage || null,
        hidden: cover?.hidden || false,
        isCustom: false,
        propertyCount: propCountMap.get(a.value) || 0,
      }
    })

    const customAreas = customs.map(a => ({
      value: a.areaValue,
      labelEn: a.labelEn,
      labelAr: a.labelAr,
      coverImage: a.coverImage,
      hidden: a.hidden,
      isCustom: true,
      propertyCount: propCountMap.get(a.areaValue) || 0,
    }))

    return NextResponse.json({ areas: [...builtInAreas, ...customAreas] })
  } catch (error) {
    console.error("GET /api/admin/areas error:", error)
    return NextResponse.json({ error: "Failed to fetch areas" }, { status: 500 })
  }
}

// POST /api/admin/areas — multiple actions
export async function POST(request: NextRequest) {
  const user = await verifyAdmin(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await request.json()
    const { action } = body

    // ─── Upload cover for built-in area ───
    if (action === "uploadCover") {
      const { areaValue, coverImage } = body
      if (!areaValue || !coverImage) {
        return NextResponse.json({ error: "areaValue and coverImage required" }, { status: 400 })
      }
      const cover = await db.areaCover.upsert({
        where: { areaValue },
        update: { coverImage },
        create: { areaValue, coverImage },
      })
      return NextResponse.json({ success: true, cover })
    }

    // ─── Upload cover for custom area ───
    if (action === "uploadCustomCover") {
      const { areaValue, coverImage } = body
      if (!areaValue || !coverImage) {
        return NextResponse.json({ error: "areaValue and coverImage required" }, { status: 400 })
      }
      const custom = await db.areaCustom.update({
        where: { areaValue },
        data: { coverImage },
      })
      return NextResponse.json({ success: true, custom })
    }

    // ─── Toggle hidden status ───
    if (action === "toggleHidden") {
      const { areaValue } = body
      if (!areaValue) {
        return NextResponse.json({ error: "areaValue required" }, { status: 400 })
      }
      const isBuiltIn = AL_AIN_AREAS.some(a => a.value === areaValue)
      if (isBuiltIn) {
        const existing = await db.areaCover.findUnique({ where: { areaValue } })
        if (existing) {
          const updated = await db.areaCover.update({
            where: { areaValue },
            data: { hidden: !existing.hidden },
          })
          return NextResponse.json({ success: true, hidden: updated.hidden })
        } else {
          // Create a record with hidden=true (no cover image yet, but mark as hidden)
          const created = await db.areaCover.create({
            data: { areaValue, coverImage: "", hidden: true },
          })
          return NextResponse.json({ success: true, hidden: created.hidden })
        }
      } else {
        const existing = await db.areaCustom.findUnique({ where: { areaValue } })
        if (!existing) {
          return NextResponse.json({ error: "Custom area not found" }, { status: 404 })
        }
        const updated = await db.areaCustom.update({
          where: { areaValue },
          data: { hidden: !existing.hidden },
        })
        return NextResponse.json({ success: true, hidden: updated.hidden })
      }
    }

    // ─── Add custom area (auto-generate slug from English name) ───
    if (action === "addCustom") {
      const { labelEn, labelAr } = body
      if (!labelEn || !labelAr) {
        return NextResponse.json({ error: "English and Arabic names required" }, { status: 400 })
      }
      // Auto-generate slug from English label
      let areaValue = labelEn
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
      if (!areaValue) {
        areaValue = `area-${Date.now().toString(36)}`
      }
      // Ensure uniqueness against both built-in areas and existing custom areas
      const builtInConflict = AL_AIN_AREAS.some(a => a.value === areaValue)
      if (builtInConflict) {
        areaValue = `${areaValue}-${Date.now().toString(36)}`
      } else {
        const existing = await db.areaCustom.findUnique({ where: { areaValue } })
        if (existing) {
          areaValue = `${areaValue}-${Date.now().toString(36)}`
        }
      }
      // Get next sortOrder
      const lastCustom = await db.areaCustom.findFirst({ orderBy: { sortOrder: "desc" } })
      const sortOrder = (lastCustom?.sortOrder || 0) + 1

      const custom = await db.areaCustom.create({
        data: { areaValue, labelEn: labelEn.trim(), labelAr: labelAr.trim(), sortOrder },
      })
      return NextResponse.json({ success: true, custom })
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 })
  } catch (error) {
    console.error("POST /api/admin/areas error:", error)
    return NextResponse.json({ error: "Failed to process area action" }, { status: 500 })
  }
}

// DELETE /api/admin/areas — delete area cover OR delete custom area entirely
export async function DELETE(request: NextRequest) {
  const user = await verifyAdmin(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { areaValue, isCustom } = await request.json()
    if (!areaValue) {
      return NextResponse.json({ error: "areaValue required" }, { status: 400 })
    }

    if (isCustom) {
      // Delete custom area entirely — but first check if it has properties
      const propCount = await db.property.count({ where: { area: areaValue } })
      if (propCount > 0) {
        return NextResponse.json({
          error: "Area has properties",
          propertyCount: propCount,
          message: `This area contains ${propCount} propert${propCount === 1 ? "y" : "ies"}. Please delete or move them before deleting the area.`,
        }, { status: 409 })
      }
      await db.areaCustom.delete({ where: { areaValue } })
      return NextResponse.json({ success: true, deleted: true })
    } else {
      // Built-in area: remove cover photo and unhide (cannot truly delete code-defined area)
      await db.areaCover.deleteMany({ where: { areaValue } })
      return NextResponse.json({ success: true })
    }
  } catch (error) {
    console.error("DELETE /api/admin/areas error:", error)
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
  }
}
