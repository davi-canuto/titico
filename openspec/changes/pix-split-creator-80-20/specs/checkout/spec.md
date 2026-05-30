## MODIFIED Requirements

### Requirement: Pix charge creation with split
`POST /api/checkout/pix` cria uma cobrança Pix na Woovi. Quando o creator do produto tiver `pixKey` cadastrada, a cobrança MUST incluir split automático de 80% para o creator e 20% para a plataforma. Quando `pixKey` for `null`, a cobrança é criada normalmente sem split.

#### Scenario: Creator com pixKey — split 80/20 aplicado
- **WHEN** `POST /api/checkout/pix` é chamado com um `productId` cujo creator tem `pixKey` cadastrada
- **THEN** a Woovi recebe a cobrança com `splits: [{ pixAlias: { key: pixKey }, value: Math.floor(product.price * 0.8) }]`
- **THEN** o creator recebe 80% do valor e a plataforma retém 20%

#### Scenario: Creator sem pixKey — sem split
- **WHEN** `POST /api/checkout/pix` é chamado com um `productId` cujo creator não tem `pixKey`
- **THEN** a cobrança é criada normalmente sem o campo `splits`
- **THEN** 100% do valor vai para a conta principal da plataforma

#### Scenario: Erro da Woovi com split
- **WHEN** a Woovi retorna erro ao criar cobrança com split (ex: split não habilitado na conta)
- **THEN** o endpoint retorna `500 WOOVI_ERROR` e faz rollback da `Purchase` criada
