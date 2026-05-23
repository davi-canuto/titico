## Why

As rotas públicas da API (`/api/products`, `/api/matchups`, `/api/checkout`) estão expostas sem qualquer controle de frequência, permitindo abuso por scraping, brute-force ou flood de requisições. Adicionar rate limiting por IP é a camada de proteção mínima esperada em qualquer API em produção.

## What Changes

- Rate limiting aplicado nas rotas de API via middleware Next.js (Edge Runtime)
- Limites distintos por categoria de rota: rotas públicas (mais permissivas) vs. rotas de checkout/auth (mais restritivas)
- Resposta `429 Too Many Requests` com header `Retry-After` quando o limite é excedido
- Suporte a armazenamento distribuído via Upstash Redis (compatível com Edge Runtime e deploy serverless)

## Capabilities

### New Capabilities
- `api-rate-limiting`: Controle de taxa de requisições por IP nas rotas da API com respostas 429 padronizadas

### Modified Capabilities
*(nenhuma — a lógica de negócio das rotas existentes não muda)*

## Impact

- Nova dependência: `@upstash/ratelimit` + `@upstash/redis`
- Novas env vars: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
- `src/middleware.ts` recebe lógica de rate limiting antes da verificação de autenticação
- Sem mudanças nos route handlers existentes
