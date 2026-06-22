## ADDED Requirements

### Requirement: Toggle de visibilidade no pricing por produto
O painel admin SHALL expor um toggle "Exibir no Pricing" para cada produto. Quando desabilitado, o produto não aparece no grid `#pricing` da landing page, mas permanece ativo e acessível via link direto ou checkout.

#### Scenario: Toggle visível na lista de produtos
- **WHEN** um ADMIN acessa `/admin/produtos`
- **THEN** cada linha exibe um toggle "Pricing" refletindo o valor atual de `showOnPricing`

#### Scenario: Desabilitar exibição no pricing
- **WHEN** um ADMIN desativa o toggle de um produto com `showOnPricing: true`
- **THEN** `showOnPricing` torna-se `false`, a landing page é revalidada e o produto some do grid `#pricing` sem ser desativado globalmente

#### Scenario: Habilitar exibição no pricing
- **WHEN** um ADMIN ativa o toggle de um produto com `showOnPricing: false`
- **THEN** `showOnPricing` torna-se `true`, a landing page é revalidada e o produto volta a aparecer no grid `#pricing`

#### Scenario: Produto inativo ignorado mesmo com showOnPricing true
- **WHEN** um produto tem `active: false` e `showOnPricing: true`
- **THEN** ele NÃO aparece no grid `#pricing` (ambas as condições devem ser verdadeiras)

### Requirement: Server action para alternar showOnPricing
Uma server action `toggleProductOnPricing(productId: string)` SHALL alternar o campo `showOnPricing` do produto e revalidar o cache da landing page.

#### Scenario: Alternância bem-sucedida
- **WHEN** `toggleProductOnPricing` é chamada com um `productId` válido
- **THEN** `showOnPricing` é invertido no banco, `revalidatePath("/")` é chamado e a action retorna sem erro

#### Scenario: Produto inexistente
- **WHEN** `toggleProductOnPricing` é chamada com um `productId` que não existe
- **THEN** a action lança um erro identificável e o banco não é alterado
