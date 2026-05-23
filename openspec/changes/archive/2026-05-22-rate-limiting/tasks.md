## 1. Dependências e configuração

- [x] 1.1 Instalar `@upstash/ratelimit` e `@upstash/redis`
- [x] 1.2 Adicionar `UPSTASH_REDIS_REST_URL` e `UPSTASH_REDIS_REST_TOKEN` ao `.env.example` com valores placeholder
- [x] 1.3 Criar `src/lib/rate-limit.ts` que inicializa o cliente Redis e exporta instâncias de `Ratelimit` para cada tier (`sensitive`, `public`, `default`) com algoritmo Sliding Window

## 2. Lógica de rate limiting no middleware

- [x] 2.1 No `src/middleware.ts`, adicionar função `getRateLimiter(pathname)` que retorna o tier correto para a rota (ou `null` para `/api/stripe/webhook`)
- [x] 2.2 Implementar extração de IP: `x-forwarded-for` (primeiro valor) com fallback para `request.ip`
- [x] 2.3 Adicionar bloco de rate limiting no início do middleware: skip se não for `/api/*`, skip se rota excluída, chamar `ratelimiter.limit(ip)` e retornar `429` se `!success`
- [x] 2.4 Implementar fail-open: se env vars ausentes, o `getRateLimiter` retorna `null` e o middleware prossegue sem rate limiting

## 3. Resposta 429 e headers

- [x] 3.1 Montar resposta `429` com body `{ "error": "TOO_MANY_REQUESTS" }`, header `Retry-After` (segundos até reset) e `Content-Type: application/json`
- [x] 3.2 Adicionar headers `X-RateLimit-Limit` e `X-RateLimit-Remaining` nas respostas que passam pelo rate limiting (2xx e 429)
