## Why

O checkout via Pix já existe, mas 100% do valor vai para a conta da plataforma sem nenhum repasse automático para o creator do produto. Para viabilizar o modelo de negócio, o creator precisa receber sua parte (80%) no ato do pagamento via split da Woovi, sem processos manuais.

## What Changes

- Adicionar campo `pixKey` (opcional) no model `Creator` do Prisma
- Criar migration correspondente
- Adicionar campo de cadastro de chave Pix do creator na UI de admin
- Modificar `createCharge` em `src/lib/woovi.ts` para aceitar e enviar o array `splits`
- Modificar `POST /api/checkout/pix` para buscar o `pixKey` do creator e montar o split 80/20 quando a chave estiver cadastrada

## Capabilities

### New Capabilities

- `creator-pix-split`: Divisão automática 80% creator / 20% plataforma no pagamento via Pix

### Modified Capabilities

- `checkout`: A criação de cobrança Pix agora inclui split quando o creator tiver pixKey cadastrada
- `products`: Creator passa a ter campo pixKey gerenciável via admin

## Impact

- **Prisma schema**: novo campo `pixKey String?` em `Creator`
- **Migration**: nova migration Prisma
- **`src/lib/woovi.ts`**: `createCharge` recebe parâmetro `splits` opcional
- **`src/app/api/checkout/pix/route.ts`**: busca creator e monta splits
- **UI admin de creators**: campo para cadastrar/editar pixKey
- **Sem breaking changes**: split só é aplicado quando `pixKey` está presente; cobranças sem pixKey continuam funcionando normalmente
