import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export const dynamic = "force-dynamic"

// PATCH /api/news/[slug] — increment article views
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const article = await db.newsArticle.findUnique({ where: { slug } })
    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }
    await db.newsArticle.update({
      where: { id: article.id },
      data: { views: { increment: 1 } },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("PATCH /api/news error:", error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
