import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verifyAdmin } from "../properties/route"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const user = await verifyAdmin(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const articles = await db.newsArticle.findMany({ orderBy: { publishedAt: "desc" } })
  return NextResponse.json({ articles })
}

export async function POST(request: NextRequest) {
  const user = await verifyAdmin(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await request.json()
    if (!body.slug) {
      body.slug = body.titleEn.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
      const existing = await db.newsArticle.findUnique({ where: { slug: body.slug } })
      if (existing) body.slug = `${body.slug}-${Date.now().toString(36)}`
    }

    const article = await db.newsArticle.create({ data: body })
    return NextResponse.json({ success: true, article })
  } catch (error) {
    console.error("POST /api/admin/news error:", error)
    return NextResponse.json({ error: "Failed to create article" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const user = await verifyAdmin(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await request.json()
    const { id, ...data } = body
    if (!id) return NextResponse.json({ error: "Article id required" }, { status: 400 })

    const article = await db.newsArticle.update({ where: { id }, data })
    return NextResponse.json({ success: true, article })
  } catch (error) {
    console.error("PUT /api/admin/news error:", error)
    return NextResponse.json({ error: "Failed to update article" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const user = await verifyAdmin(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { id } = await request.json()
    if (!id) return NextResponse.json({ error: "Article id required" }, { status: 400 })

    await db.newsArticle.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE /api/admin/news error:", error)
    return NextResponse.json({ error: "Failed to delete article" }, { status: 500 })
  }
}
