import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getRateLimiter } from "@/lib/rate-limit"

const AUTH_PROTECTED_PREFIXES = [
  "/dashboard",
  "/api/matchups/",
  "/api/videos/",
  "/api/user/",
  "/api/contents/",
]

type AuthFn = (req: NextRequest) => Promise<Response | undefined>

export async function proxy(request: NextRequest): Promise<Response> {
  const { pathname } = request.nextUrl

  // Rate limiting — runs first on all API routes except the Stripe webhook
  if (pathname.startsWith("/api/") && pathname !== "/api/stripe/webhook") {
    const limiter = getRateLimiter(pathname)
    if (limiter) {
      const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        request.headers.get("x-real-ip") ??
        "anonymous"

      const { success, limit, remaining, reset } = await limiter.limit(ip)
      const retryAfter = Math.ceil((reset - Date.now()) / 1000)

      if (!success) {
        return new NextResponse(JSON.stringify({ error: "TOO_MANY_REQUESTS" }), {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(retryAfter),
            "X-RateLimit-Limit": String(limit),
            "X-RateLimit-Remaining": "0",
          },
        })
      }
    }
  }

  // Auth protection for dashboard and specific API routes
  const needsAuth = AUTH_PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))
  if (needsAuth) {
    const authResponse = await (auth as unknown as AuthFn)(request)
    return authResponse ?? NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/:path*",
  ],
}
