import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verifyAdmin } from "../properties/route"

export const dynamic = "force-dynamic"

// GET /api/admin/stats — admin dashboard stats
export async function GET(request: NextRequest) {
  const user = await verifyAdmin(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const [
    totalProperties,
    activeListings,
    totalInquiries,
    newInquiries,
    totalViewings,
    newViewings,
    totalViewsAggregate,
    publishedArticles,
  ] = await Promise.all([
    db.property.count(),
    db.property.count({ where: { status: "active" } }),
    db.propertyInquiry.count(),
    db.propertyInquiry.count({ where: { status: "new" } }),
    db.viewingBooking.count(),
    db.viewingBooking.count({ where: { status: "new" } }),
    db.property.aggregate({ _sum: { views: true } }),
    db.newsArticle.count({ where: { status: "published" } }),
  ])

  return NextResponse.json({
    totalProperties,
    activeListings,
    totalInquiries,
    newInquiries,
    totalViewings,
    newViewings,
    totalViews: totalViewsAggregate._sum.views || 0,
    publishedArticles,
  })
}
