import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

// Cache for 10 minutes (news changes infrequently)
export const revalidate = 600
export const dynamic = "force-static"

// GET /api/news - list news articles
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const limit = searchParams.get("limit")

    const where: any = { status: "published" }
    if (category && category !== "all") where.category = category

    const articles = await db.newsArticle.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      take: limit ? Number(limit) : undefined,
    })

    const response = NextResponse.json({ articles })
    response.headers.set("Cache-Control", "public, s-maxage=600, stale-while-revalidate=3600")
    return response
  } catch (error) {
    console.error("GET /api/news error:", error)
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 })
  }
}
