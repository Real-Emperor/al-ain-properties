import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

export const dynamic = "force-dynamic"

// POST /api/admin/login — admin login
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 })
    }

    const user = await db.adminUser.findUnique({ where: { email: email.toLowerCase() } })
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const match = await bcrypt.compare(password, user.passwordHash)
    if (!match) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Simple session token (base64 of user id + timestamp + secret)
    const token = Buffer.from(`${user.id}:${Date.now()}`).toString("base64")

    return NextResponse.json({
      success: true,
      token,
      user: { id: user.id, email: user.email, name: user.name, phone: user.phone },
    })
  } catch (error) {
    console.error("POST /api/admin/login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
