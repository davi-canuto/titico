## Context

O checkout via Pix já está funcional: `POST /api/checkout/pix` cria uma cobrança na Woovi e o webhook em `/api/woovi/webhook` confirma o pagamento. Hoje 100% do valor cai na conta principal da plataforma. A Woovi suporta split nativo via campo `splits` no corpo da cobrança, permitindo distribuição instantânea entre subcontas no momento do pagamento.

O `Creator` existe no schema mas não tem chave Pix. O split só é viável quando o creator tem uma chave Pix cadastrada (qualquer tipo: CPF, CNPJ, email, telefone, aleatória).

## Goals / Non-Goals

**Goals:**
- Adicionar `pixKey` ao model `Creator`
- Expor campo de edição de `pixKey` na UI de admin do creator
- Ao criar cobrança Pix, incluir split 80% creator / 20% plataforma quando `pixKey` estiver presente
- Não quebrar cobranças para creators sem `pixKey` cadastrada

**Non-Goals:**
- Split via Stripe (fora do escopo desta mudança)
- Porcentagem configurável por produto ou creator (sempre 80/20)
- Repasse manual / Pix Out automático (o split é feito pela Woovi no ato do pagamento)
- Validação do formato da chave Pix (responsabilidade da Woovi na criação da subconta)

## Decisions

### 1. `pixKey` como campo direto no `Creator`, não em tabela separada
Um creator tem uma chave Pix. Não há necessidade de histórico ou múltiplas chaves. Campo `String?` no model é suficiente e mantém a query simples.

**Alternativa considerada**: tabela `CreatorPaymentConfig` separada.
**Descartada**: over-engineering para um único campo sem variação prevista.

### 2. Split condicional (sem pixKey = sem split)
Se o creator não tiver `pixKey`, a cobrança é criada normalmente sem splits. Nenhum erro é lançado. Isso garante retrocompatibilidade e permite onboarding gradual dos creators.

**Alternativa considerada**: bloquear checkout Pix para creators sem pixKey.
**Descartada**: quebraria o fluxo existente e impediria vendas enquanto creators não cadastram a chave.

### 3. Split calculado em runtime no endpoint, não pré-calculado
Os 80% são calculados no `POST /api/checkout/pix` no momento da cobrança, usando `Math.floor(product.price * 0.8)`. A plataforma fica com o restante implicitamente (Woovi retém o que não é splitado).

**Alternativa considerada**: armazenar o percentual no banco.
**Descartada**: a porcentagem é fixa (80/20) e mudar isso é uma decisão de negócio que exige mudança de código de qualquer forma.

### 4. `createCharge` recebe `splits` como parâmetro opcional
A função em `src/lib/woovi.ts` é estendida com `splits?: Array<{ pixAlias: { key: string }; value: number }>`. O endpoint monta o array e passa para a função. Isso mantém a lib testável independentemente do endpoint.

## Risks / Trade-offs

- **Chave Pix inválida** → A Woovi retorna erro na criação da cobrança. O endpoint já trata falhas da Woovi retornando `500 WOOVI_ERROR` e fazendo rollback da `Purchase`. Comportamento não muda.
- **Split habilitado na Woovi** → O split precisa estar ativo na conta Woovi da plataforma. Se não estiver, a cobrança falha com erro da API. Mitigação: testar em sandbox antes de ir para produção.
- **Arredondamento de centavos** → `Math.floor` garante que o split nunca ultrapassa o valor total. A plataforma pode receber 1 centavo a mais em valores ímpares, o que é aceitável.

## Migration Plan

1. Adicionar `pixKey String?` ao `Creator` no schema
2. Gerar e rodar migration (`prisma migrate dev`)
3. Deploy do código atualizado (sem downtime — campo nullable, sem breaking change)
4. Cadastrar pixKey dos creators via admin
5. Testar em sandbox com uma cobrança real antes de produção
