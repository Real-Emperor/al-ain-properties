import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export const dynamic = "force-dynamic"

// POST /api/viewings — create new viewing booking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, phone, email, preferredDate, preferredTime, message, propertyId } = body

    if (!name || !phone || !preferredDate || !preferredTime) {
      return NextResponse.json(
        { error: "Missing required fields: name, phone, preferredDate, preferredTime" },
        { status: 400 }
      )
    }

    const viewing = await db.viewingBooking.create({
      data: {
        name,
        phone,
        email: email || null,
        preferredDate,
        preferredTime,
        message: message || null,
        propertyId: propertyId || null,
      },
    })

    return NextResponse.json({ success: true, viewing })
  } catch (error) {
    console.error("POST /api/viewings error:", error)
    return NextResponse.json({ error: "Failed to create viewing" }, { status: 500 })
  }
}
