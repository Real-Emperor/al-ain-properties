import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verifyAdmin } from "../properties/route"

export const dynamic = "force-dynamic"

// GET /api/admin/inquiries — list all inquiries
export async function GET(request: NextRequest) {
  const user = await verifyAdmin(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const inquiries = await db.propertyInquiry.findMany({
    include: { property: { select: { id: true, titleEn: true, titleAr: true, slug: true } } },
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json({ inquiries })
}

// PUT /api/admin/inquiries — update inquiry status
export async function PUT(request: NextRequest) {
  const user = await verifyAdmin(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { id, status } = await request.json()
    if (!id || !status) return NextResponse.json({ error: "id and status required" }, { status: 400 })

    const inquiry = await db.propertyInquiry.update({ where: { id }, data: { status } })
    return NextResponse.json({ success: true, inquiry })
  } catch (error) {
    console.error("PUT /api/admin/inquiries error:", error)
    return NextResponse.json({ error: "Failed to update inquiry" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const user = await verifyAdmin(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { id } = await request.json()
    await db.propertyInquiry.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE /api/admin/inquiries error:", error)
    return NextResponse.json({ error: "Failed to delete inquiry" }, { status: 500 })
  }
}
