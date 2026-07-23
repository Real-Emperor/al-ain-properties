import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export const dynamic = "force-dynamic"

// GET /api/areas — returns all area cover photos
export async function GET() {
  try {
    const covers = await db.areaCover.findMany()
    const map: Record<string, string> = {}
    for (const c of covers) {
      map[c.areaValue] = c.coverImage
    }
    return NextResponse.json({ covers: map })
  } catch (error) {
    console.error("GET /api/areas error:", error)
    return NextResponse.json({ covers: {} })
  }
}
