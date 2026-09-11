import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This middleware checks if PAYMENT_BLOCK env var is "true".
// If so, ALL routes are redirected to /payment-due.
// To remove the block: set PAYMENT_BLOCK to "false" or remove the env var, then redeploy.

export function middleware(request: NextRequest) {
  const paymentBlocked = process.env.PAYMENT_BLOCK === "true"

  if (paymentBlocked) {
    // Allow access ONLY to the payment-due page itself
    const path = request.nextUrl.pathname
    if (path === "/payment-due") {
      return NextResponse.next()
    }

    // Block everything else — redirect to payment-due
    const url = request.nextUrl.clone()
    url.pathname = "/payment-due"
    url.search = ""
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

// Match ALL routes — this is critical for complete access block
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
