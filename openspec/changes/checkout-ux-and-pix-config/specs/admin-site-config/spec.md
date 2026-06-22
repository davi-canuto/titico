## ADDED Requirements

### Requirement: Modelo SiteConfig singleton
O banco de dados SHALL conter um modelo `SiteConfig` com `id String @id @default("global")` e campo `pixEnabled Boolean @default(true)`. Deve existir exatamente um registro com `id = "global"`, criado pela migração.

#### Scenario: Registro global sempre presente
- **WHEN** o sistema inicia após a migração
- **THEN** `prisma.siteConfig.findUnique({ where: { id: "global" } })` retorna um registro (nunca `null`)

### Requirement: Admin pode habilitar e desabilitar Pix
O painel admin SHALL expor um toggle "Pagamento via Pix" que altera `SiteConfig.pixEnabled`. Apenas usuários com `role: ADMIN` podem alterar esta configuração.

#### Scenario: Admin desabilita Pix
- **WHEN** um ADMIN desativa o toggle "Pagamento via Pix"
- **THEN** `SiteConfig.pixEnabled` torna-se `false`, `revalidatePath("/")` é chamado e o botão Pix some da landing page e do modal de pagamento

#### Scenario: Admin habilita Pix
- **WHEN** um ADMIN ativa o toggle "Pagamento via Pix"
- **THEN** `SiteConfig.pixEnabled` torna-se `true`, `revalidatePath("/")` é chamado e o botão Pix volta a aparecer

#### Scenario: Não-admin não pode alterar
- **WHEN** um usuário com `role: MEMBER` tenta chamar a action `updateSiteConfig`
- **THEN** a action retorna erro de autorização e o banco não é alterado

### Requirement: Server action updateSiteConfig
Uma server action `updateSiteConfig(data: Partial<SiteConfig>)` SHALL persistir as alterações e revalidar o cache da landing page.

#### Scenario: Atualização bem-sucedida
- **WHEN** `updateSiteConfig({ pixEnabled: false })` é chamada por um ADMIN
- **THEN** o registro `id = "global"` é atualizado via `upsert` e `revalidatePath("/")` é chamado
