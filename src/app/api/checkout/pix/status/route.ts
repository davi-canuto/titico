import { NextRequest, NextResponse } from "next/server"
import { getCharge } from "@/lib/woovi"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const correlationID = req.nextUrl.searchParams.get("correlationID")
  if (!correlationID) {
    return NextResponse.json({ error: "MISSING_CORRELATION_ID" }, { status: 400 })
  }

  try {
    const { status } = await getCharge(correlationID)

    if (status === "COMPLETED") {
      const purchase = await prisma.purchase.findFirst({
        where: { stripeSessionId: correlationID },
        include: { product: { select: { downloadUrl: true, downloadPassword: true } } },
      })
      return NextResponse.json({
        status,
        downloadUrl: purchase?.product.downloadUrl ?? null,
        downloadPassword: purchase?.product.downloadPassword ?? null,
      })
    }

    return NextResponse.json({ status })
  } catch (err) {
    console.error("[checkout/pix/status] Woovi error:", err)
    return NextResponse.json({ error: "WOOVI_ERROR" }, { status: 500 })
  }
}
