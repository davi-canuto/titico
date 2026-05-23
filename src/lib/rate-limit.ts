import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const url = process.env.UPSTASH_REDIS_REST_URL
const token = process.env.UPSTASH_REDIS_REST_TOKEN

let redis: Redis | null = null
let sensitive: Ratelimit | null = null
let publicTier: Ratelimit | null = null
let defaultTier: Ratelimit | null = null

if (url && token) {
  redis = new Redis({ url, token })
  sensitive = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, "60 s"), prefix: "rl:sensitive" })
  publicTier = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(60, "60 s"), prefix: "rl:public" })
  defaultTier = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(30, "60 s"), prefix: "rl:default" })
}

const EXCLUDED_ROUTES = ["/api/stripe/webhook"]

const SENSITIVE_PREFIXES = ["/api/auth/", "/api/checkout/"]
const PUBLIC_PREFIXES = ["/api/products", "/api/matchups/", "/api/contents/"]

export function getRateLimiter(pathname: string): Ratelimit | null {
  if (!redis) return null
  if (EXCLUDED_ROUTES.some((r) => pathname.startsWith(r))) return null
  if (SENSITIVE_PREFIXES.some((p) => pathname.startsWith(p))) return sensitive
  if (PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))) return publicTier
  return defaultTier
}
