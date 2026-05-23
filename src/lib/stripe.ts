import Stripe from "stripe"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-04-22.dahlia",
})

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
