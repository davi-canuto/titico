export interface EmailProvider {
  send(opts: { to: string; subject: string; html: string }): Promise<void>
}

export function getEmailProvider(): EmailProvider {
  const provider = process.env.EMAIL_PROVIDER ?? "resend"

  if (provider === "resend") {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { ResendEmailProvider } = require("./providers/resend") as { ResendEmailProvider: new () => EmailProvider }
    return new ResendEmailProvider()
  }

  throw new Error(`Unknown EMAIL_PROVIDER: "${provider}"`)
}
