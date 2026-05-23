import { Resend } from "resend"
import type { EmailProvider } from "../index"

export class ResendEmailProvider implements EmailProvider {
  private client: Resend
  private from: string

  constructor() {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) throw new Error("RESEND_API_KEY environment variable is not set")
    this.from = process.env.EMAIL_FROM ?? "noreply@titico.app"
    this.client = new Resend(apiKey)
  }

  async send({ to, subject, html }: { to: string; subject: string; html: string }): Promise<void> {
    const { error } = await this.client.emails.send({ from: this.from, to, subject, html })
    if (error) throw new Error(`Resend error: ${error.message}`)
  }
}
