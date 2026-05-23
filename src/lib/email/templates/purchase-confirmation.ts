export function purchaseConfirmationEmail(
  name: string,
  productName: string,
): { subject: string; html: string } {
  const displayName = name || "invocador"

  return {
    subject: `Compra confirmada — ${productName}`,
    html: `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#0d0d0d;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0d0d0d;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background-color:#161616;border-radius:12px;border:1px solid rgba(255,255,255,0.05);overflow:hidden;">
        <!-- Header -->
        <tr>
          <td style="background-color:#e3001b;padding:24px 32px;">
            <p style="margin:0;font-size:22px;font-weight:900;color:#ffffff;text-transform:uppercase;letter-spacing:0.05em;">TITICO</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:32px;">
            <p style="margin:0 0 8px;font-size:13px;font-weight:900;color:#4ade80;text-transform:uppercase;letter-spacing:0.15em;">Pagamento confirmado</p>
            <p style="margin:0 0 16px;font-size:20px;font-weight:900;color:#ffffff;text-transform:uppercase;letter-spacing:0.03em;">Obrigado, ${displayName}!</p>
            <p style="margin:0 0 8px;font-size:15px;color:rgba(255,255,255,0.7);line-height:1.6;">
              Sua compra de <strong style="color:#ffffff;">${productName}</strong> foi processada com sucesso.
            </p>
            <p style="margin:0 0 32px;font-size:15px;color:rgba(255,255,255,0.7);line-height:1.6;">
              Acesse o dashboard para começar a consumir o conteúdo exclusivo de assinante imediatamente.
            </p>
            <a href="https://titico.app/dashboard" style="display:inline-block;background-color:#e3001b;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:8px;font-size:13px;font-weight:900;text-transform:uppercase;letter-spacing:0.1em;">
              Acessar conteúdo exclusivo
            </a>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:20px 32px;border-top:1px solid rgba(255,255,255,0.05);">
            <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.25);">
              Em caso de dúvidas, responda este email ou entre em contato pelo dashboard.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  }
}
