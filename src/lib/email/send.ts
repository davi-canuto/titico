import { getEmailProvider } from "./index"
import { welcomeEmail } from "./templates/welcome"
import { purchaseConfirmationEmail } from "./templates/purchase-confirmation"
import { pdfDeliveryEmail } from "./templates/pdf-delivery"

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

export async function sendPdfDelivery(
  to: string,
  downloadUrl: string,
  downloadPassword?: string,
): Promise<void> {
  try {
    const provider = getEmailProvider()
    const { subject, html } = pdfDeliveryEmail(downloadUrl, downloadPassword)
    await provider.send({ to, subject, html })
  } catch (err) {
    console.error("[email] Failed to send PDF delivery:", err)
  }
}
