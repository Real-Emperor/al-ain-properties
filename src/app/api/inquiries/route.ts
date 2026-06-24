import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export const dynamic = "force-dynamic"

// POST /api/inquiries — create new inquiry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, phone, email, message, propertyId, source } = body

    if (!name || !phone || !message) {
      return NextResponse.json(
        { error: "Missing required fields: name, phone, message" },
        { status: 400 }
      )
    }

    const inquiry = await db.propertyInquiry.create({
      data: {
        name,
        phone,
        email: email || null,
        message,
        propertyId: propertyId || null,
        source: source || "contact_form",
      },
    })

    return NextResponse.json({ success: true, inquiry })
  } catch (error) {
    console.error("POST /api/inquiries error:", error)
    return NextResponse.json({ error: "Failed to create inquiry" }, { status: 500 })
  }
}
