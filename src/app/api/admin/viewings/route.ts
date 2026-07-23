import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verifyAdmin } from "../properties/route"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const user = await verifyAdmin(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const viewings = await db.viewingBooking.findMany({
    include: { property: { select: { id: true, titleEn: true, titleAr: true, slug: true } } },
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json({ viewings })
}

export async function PUT(request: NextRequest) {
  const user = await verifyAdmin(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { id, status } = await request.json()
    if (!id || !status) return NextResponse.json({ error: "id and status required" }, { status: 400 })

    const viewing = await db.viewingBooking.update({ where: { id }, data: { status } })
    return NextResponse.json({ success: true, viewing })
  } catch (error) {
    console.error("PUT /api/admin/viewings error:", error)
    return NextResponse.json({ error: "Failed to update viewing" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const user = await verifyAdmin(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { id } = await request.json()
    await db.viewingBooking.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE /api/admin/viewings error:", error)
    return NextResponse.json({ error: "Failed to delete viewing" }, { status: 500 })
  }
}
