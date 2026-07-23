import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verifyAdmin } from "../properties/route"

export const dynamic = "force-dynamic"

// GET /api/admin/areas — list all area covers
export async function GET(request: NextRequest) {
  const user = await verifyAdmin(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const covers = await db.areaCover.findMany({ orderBy: { areaValue: "asc" } })
  return NextResponse.json({ covers })
}

// POST /api/admin/areas — upsert area cover photo
export async function POST(request: NextRequest) {
  const user = await verifyAdmin(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { areaValue, coverImage } = await request.json()
    if (!areaValue || !coverImage) {
      return NextResponse.json({ error: "areaValue and coverImage required" }, { status: 400 })
    }

    const cover = await db.areaCover.upsert({
      where: { areaValue },
      update: { coverImage },
      create: { areaValue, coverImage },
    })

    return NextResponse.json({ success: true, cover })
  } catch (error) {
    console.error("POST /api/admin/areas error:", error)
    return NextResponse.json({ error: "Failed to save area cover" }, { status: 500 })
  }
}

// DELETE /api/admin/areas — delete area cover (revert to default)
export async function DELETE(request: NextRequest) {
  const user = await verifyAdmin(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { areaValue } = await request.json()
    await db.areaCover.deleteMany({ where: { areaValue } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE /api/admin/areas error:", error)
    return NextResponse.json({ error: "Failed to delete area cover" }, { status: 500 })
  }
}
