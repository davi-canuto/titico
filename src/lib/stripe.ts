import Stripe from "stripe"

let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) throw new Error("STRIPE_SECRET_KEY is not set")
    _stripe = new Stripe(key, { apiVersion: "2026-04-22.dahlia" })
  }
  return _stripe
}

export function buildPaymentIntentData(amountCentavos: number) {
  const destination = process.env.STRIPE_DESTINATION_ACCOUNT
  if (!destination) return undefined

  const feePercent = Math.min(
    Math.max(parseInt(process.env.STRIPE_PLATFORM_FEE_PERCENT ?? "0", 10), 0),
    99
  )
  const application_fee_amount = Math.round((amountCentavos * feePercent) / 100)

  return {
    transfer_data: { destination },
    ...(application_fee_amount > 0 ? { application_fee_amount } : {}),
  }
}
