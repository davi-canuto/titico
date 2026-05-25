import { NextRequest, NextResponse } from "next/server"
import { createHmac, timingSafeEqual } from "crypto"
import { prisma } from "@/lib/prisma"
import { PurchaseStatus } from "@prisma/client"

function verifySignature(raw: string, signature: string): boolean {
  const appId = process.env.WOOVI_APP_ID
  if (!appId) return false
  const expected = createHmac("sha256", appId).update(raw).digest("hex")
  if (signature.length !== expected.length) return false
  return timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
}

export async function POST(req: NextRequest) {
  const raw = await req.text()
  const signature = req.headers.get("x-woovi-signature") ?? ""

  if (!verifySignature(raw, signature)) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })
  }

  let body: unknown
  try {
    body = JSON.parse(raw)
  } catch {
    return NextResponse.json({ ok: true })
  }

  const charge = (body as Record<string, unknown>)?.charge as Record<string, unknown> | undefined
  if (!charge || charge.status !== "COMPLETED") {
    return NextResponse.json({ ok: true })
  }

  const correlationID = charge.correlationID as string | undefined
  if (!correlationID) return NextResponse.json({ ok: true })

  await prisma.purchase.updateMany({
    where: { stripeSessionId: correlationID },
    data: { status: PurchaseStatus.COMPLETED },
  })

  return NextResponse.json({ ok: true })
}
