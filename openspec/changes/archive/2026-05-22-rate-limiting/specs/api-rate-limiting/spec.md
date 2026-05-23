## ADDED Requirements

### Requirement: Rate limiting por IP nas rotas de API
O middleware SHALL aplicar rate limiting por IP em todas as rotas `/api/*`, exceto `/api/stripe/webhook`. Quando o limite é excedido, a resposta SHALL ser `429 Too Many Requests` com header `Retry-After`.

#### Scenario: Requisição dentro do limite
- **WHEN** um IP faz requisições dentro do limite do seu tier
- **THEN** a requisição prossegue normalmente e a resposta inclui `X-RateLimit-Limit` e `X-RateLimit-Remaining`

#### Scenario: Requisição que excede o limite
- **WHEN** um IP ultrapassa o limite de requisições do seu tier na janela de 60 segundos
- **THEN** a resposta é `429 Too Many Requests` com `Retry-After: <segundos até reset>` e body `{ "error": "TOO_MANY_REQUESTS" }`

#### Scenario: Rota do webhook Stripe é excluída
- **WHEN** uma requisição chega em `/api/stripe/webhook`
- **THEN** o rate limiting NÃO é aplicado — a requisição prossegue diretamente para o handler

### Requirement: Tiers de limite por categoria de rota
O rate limiting SHALL aplicar limites diferentes conforme a sensibilidade da rota.

#### Scenario: Rota sensível — checkout e auth
- **WHEN** o IP faz mais de 10 requisições em 60 segundos para `/api/auth/*` ou `/api/checkout/*`
- **THEN** a resposta é `429`

#### Scenario: Rota pública — listagens
- **WHEN** o IP faz mais de 60 requisições em 60 segundos para `/api/products`, `/api/matchups/*`, `/api/contents/*`
- **THEN** a resposta é `429`

#### Scenario: Demais rotas de API
- **WHEN** o IP faz mais de 30 requisições em 60 segundos para qualquer outra rota `/api/*`
- **THEN** a resposta é `429`

### Requirement: Extração de IP do cliente
O middleware SHALL extrair o IP real do cliente a partir dos headers do proxy.

#### Scenario: Requisição via proxy/CDN (Vercel, Cloudflare)
- **WHEN** o header `X-Forwarded-For` está presente
- **THEN** o IP utilizado para rate limiting é o primeiro valor da lista

#### Scenario: Requisição direta sem proxy
- **WHEN** `X-Forwarded-For` está ausente
- **THEN** o IP é extraído de `request.ip`

### Requirement: Configuração via variáveis de ambiente
O rate limiter SHALL requerer `UPSTASH_REDIS_REST_URL` e `UPSTASH_REDIS_REST_TOKEN` para inicialização. Se ausentes, o middleware SHALL logar um erro e deixar as requisições passarem sem rate limiting (fail-open).

#### Scenario: Env vars ausentes em desenvolvimento
- **WHEN** `UPSTASH_REDIS_REST_URL` não está definido
- **THEN** o rate limiting é desativado e as requisições prosseguem normalmente (sem erro 429)
