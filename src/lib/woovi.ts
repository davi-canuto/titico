const WOOVI_BASE = process.env.WOOVI_BASE_URL ?? "https://api.openpix.com.br/api/v1"

export type WooviChargeStatus = "ACTIVE" | "COMPLETED" | "EXPIRED"

export interface WooviCharge {
  correlationID: string
  qrCodeImage: string
  brCode: string
}

function appId(): string {
  const id = process.env.WOOVI_APP_ID
  if (!id) throw new Error("WOOVI_APP_ID is not set")
  return id
}

export async function createCharge(params: {
  correlationID: string
  value: number
  comment: string
}): Promise<WooviCharge> {
  const res = await fetch(`${WOOVI_BASE}/charge`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: appId() },
    body: JSON.stringify(params),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Woovi createCharge failed ${res.status}: ${text}`)
  }
  const data = (await res.json()) as { charge: WooviCharge }
  return {
    correlationID: data.charge.correlationID,
    qrCodeImage: data.charge.qrCodeImage,
    brCode: data.charge.brCode,
  }
}

export async function getCharge(correlationID: string): Promise<{ status: WooviChargeStatus }> {
  const res = await fetch(`${WOOVI_BASE}/charge/${correlationID}`, {
    headers: { Authorization: appId() },
  })
  if (!res.ok) {
    throw new Error(`Woovi getCharge failed ${res.status}`)
  }
  const data = (await res.json()) as { charge: { status: WooviChargeStatus } }
  return { status: data.charge.status }
}
