## Context

O projeto é uma aplicação Next.js 16 deployada em ambiente serverless (Vercel ou similar). O middleware atual (`edge-middleware`) roda no Edge Runtime e faz apenas verificação JWT. Não há Redis ou qualquer store compartilhado hoje. Rate limiting em memória local não funciona em ambiente serverless multi-instância — exige store externo.

## Goals / Non-Goals

**Goals:**
- Rate limiting por IP implementado no `middleware.ts` (Edge Runtime)
- Limites separados por tier de rota: público, autenticado, sensível (checkout/auth)
- Resposta `429` com headers `Retry-After` e `X-RateLimit-*`
- Store distribuído via Upstash Redis (edge-compatible, sem Node.js runtime)

**Non-Goals:**
- Rate limiting por usuário autenticado (por ora, apenas por IP)
- Banimento persistente de IPs
- Dashboard de métricas de rate limiting
- Rate limiting em rotas de páginas (apenas `/api/*`)

## Decisions

### Upstash Ratelimit + Redis

`@upstash/ratelimit` é a solução padrão para Edge Runtime em Next.js. Usa algoritmo **Sliding Window** para suavizar picos. Requer `UPSTASH_REDIS_REST_URL` e `UPSTASH_REDIS_REST_TOKEN`.

**Alternativa descartada — in-memory (lru-cache):** Funciona apenas por instância; em serverless, cada cold start tem contador zerado e instâncias paralelas não compartilham estado. Ineficaz como proteção real.

**Alternativa descartada — Vercel KV:** Mesmo produto (Upstash por baixo), mas acopla ao vendor Vercel. `@upstash/ratelimit` direto é portátil.

### Tiers de limite

| Tier | Rotas | Limite |
|---|---|---|
| `sensitive` | `/api/auth/*`, `/api/checkout/*` | 10 req / 60s por IP |
| `public` | `/api/products`, `/api/matchups/*`, `/api/contents/*` | 60 req / 60s por IP |
| `default` | demais `/api/*` | 30 req / 60s por IP |

Rotas `/api/stripe/webhook` são **excluídas** do rate limiting — Stripe usa IPs fixos e o webhook tem sua própria validação HMAC.

### Implementação no middleware

O rate limiting é adicionado ao início do middleware, antes da verificação de autenticação. Se o limite for excedido, retorna `429` imediatamente sem processar autenticação.

```
request → [rate limit check] → [auth check] → handler
```

O IP é extraído de `request.headers.get('x-forwarded-for')` (primeiro IP da chain) com fallback para `request.ip`.

### Headers de resposta

Em todas as respostas (incluindo 2xx), adicionar:
- `X-RateLimit-Limit`: limite do tier
- `X-RateLimit-Remaining`: requisições restantes
- `Retry-After`: segundos até reset (apenas no 429)

## Risks / Trade-offs

- [IP spoofing via X-Forwarded-For] Atacante pode forjar o header → Mitigation: confiar apenas no primeiro IP da lista (proxy mais próximo) e, em produção, configurar `trustProxy` no reverse proxy.
- [Upstash cold start latency] Primeira req após cold start tem latência extra (~50ms) → aceito; a alternativa (sem rate limit) é pior.
- [Custo Upstash] Free tier é 10.000 req/dia — suficiente para MVP. Monitorar crescimento.
