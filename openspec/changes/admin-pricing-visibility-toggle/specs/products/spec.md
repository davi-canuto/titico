## MODIFIED Requirements

### Requirement: Public products listing on landing page
A `PricingSection` da landing page SHALL exibir apenas produtos que satisfaçam ambas as condições: `active: true` E `showOnPricing: true`.

#### Scenario: Produtos existem com showOnPricing true
- **WHEN** a `PricingSection` carrega
- **THEN** são exibidos apenas produtos com `active: true` AND `showOnPricing: true`

#### Scenario: Produto ativo mas showOnPricing false
- **WHEN** um produto tem `active: true` e `showOnPricing: false`
- **THEN** ele não aparece no grid `#pricing` da landing page

#### Scenario: Produto inativo
- **WHEN** um produto tem `active: false`
- **THEN** ele é excluído do grid independentemente do valor de `showOnPricing`
