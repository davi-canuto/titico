## Context

Atualmente lógica de negócio está espalhada: queries Prisma diretas em Server Components, validações misturadas com `'use server'` em actions, e autorizações (`auth()`) dentro de funções que deveriam ser agnósticas ao transport. Isso dificulta raciocinar sobre o que o sistema faz sem entender o framework.

## Goals / Non-Goals

**Goals:**
- `src/services/` com módulos por domínio: `content.service.ts`, `user.service.ts`, `trail.service.ts`
- Serviços recebem `userId: string` explícito — sem chamar `auth()` internamente
- Server Actions ficam como thin wrappers: `auth()` → `userId` → `service.fn(userId, ...args)`
- Server Components passam a importar serviços em vez de chamar Prisma diretamente
- Erros de domínio tipados (ex.: `DomainError extends Error`)

**Non-Goals:**
- Repositório pattern com interfaces abstratas — overhead desnecessário para este escopo
- Injeção de dependência ou IoC container
- Testes automatizados nesta iteração (a estrutura os facilita, mas não são criados aqui)

## Decisions

### Serviços recebem userId explícito, não chamam auth()

Isso torna os serviços testáveis sem mock de sessão e reutilizáveis em múltiplos contextos (Server Actions, API routes, jobs futuros).

*Alternativa considerada*: serviços chamam `auth()` internamente — descartado porque acopla lógica de negócio ao transport do Next.js.

### Erros de domínio como strings constantes

```ts
export class DomainError extends Error {
  constructor(public code: 'NOT_FOUND' | 'UNAUTHORIZED' | 'INVALID_INPUT', message: string) {
    super(message)
  }
}
```

Actions capturam `DomainError` e retornam respostas tipadas. Outros erros propagam como 500.

### Tipagem de retorno explícita nos serviços

Cada função de serviço tem retorno tipado. Sem `any`. O tipo da entidade de domínio é definido em `src/types/domain.ts`.

### Migração incremental

Não refatorar tudo de uma vez. Começar pelos domínios de maior acoplamento: `content` (queries em 3+ pages) e `user` (mutations em 2+ actions). `trail` pode ser migrado depois.

## Risks / Trade-offs

[Refactor wide] Muitos arquivos mudam em uma única sessão → mitigado por migração incremental por domínio

[Boilerplate de wrapper] Server Actions ficam com código repetitivo de `auth()` → aceito; o padrão é simples e consistente

[Over-engineering prematura] Com poucos desenvolvedores, a separação adiciona uma camada de indireção → aceito porque o benefício de testabilidade vale o custo

## Migration Plan

1. Criar `src/types/domain.ts` com tipos compartilhados e `DomainError`
2. Criar `src/services/content.service.ts` — migrar queries de conteúdo
3. Criar `src/services/user.service.ts` — migrar mutações de perfil e skin
4. Criar `src/services/trail.service.ts` — migrar queries de trilhas
5. Atualizar Server Actions para delegar aos serviços
6. Atualizar Server Components para usar serviços
7. Verificar que nenhuma page importa Prisma diretamente
8. Rollback: as pages/actions podem referenciar Prisma diretamente a qualquer momento — nenhuma mudança estrutural irreversível
