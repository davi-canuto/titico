import { getEmailProvider } from "./index"
import { welcomeEmail } from "./templates/welcome"
import { purchaseConfirmationEmail } from "./templates/purchase-confirmation"

export async function sendWelcomeEmail(to: string, name: string): Promise<void> {
  try {
    const provider = getEmailProvider()
    const { subject, html } = welcomeEmail(name)
    await provider.send({ to, subject, html })
  } catch (err) {
    console.error("[email] Failed to send welcome email:", err)
  }
}

export async function sendPurchaseConfirmation(
  to: string,
  name: string,
  productName: string,
): Promise<void> {
  try {
    const provider = getEmailProvider()
    const { subject, html } = purchaseConfirmationEmail(name, productName)
    await provider.send({ to, subject, html })
  } catch (err) {
    console.error("[email] Failed to send purchase confirmation:", err)
  }
}
