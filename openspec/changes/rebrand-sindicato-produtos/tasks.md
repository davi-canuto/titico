## 1. Branding — Metadata e Layout

- [x] 1.1 Atualizar `src/app/layout.tsx`: `title`, `description` e `openGraph` para "Sindicato do Titiltei"

## 2. Branding — Dashboard

- [x] 2.1 Atualizar `src/app/dashboard/page.tsx`: heading principal de "Shaco AD" para "Sindicato do Titiltei"
- [x] 2.2 Atualizar subtítulo do dashboard para descrever a plataforma corretamente

## 3. Branding — Página de Planos

- [x] 3.1 Atualizar `src/app/planos/page.tsx`: label do hero de "Titiltei · Guia do Shaco AD" para "Sindicato do Titiltei"
- [x] 3.2 Atualizar `<h1>` e parágrafo descritivo do hero para refletir o novo catálogo de produtos

## 4. Branding — Email de Boas-vindas

- [x] 4.1 Atualizar `src/lib/email/templates/welcome.ts`: subject para "Bem-vindo ao Sindicato do Titiltei"
- [x] 4.2 Atualizar header do email (banner vermelho) para "SINDICATO DO TITILTEI"
- [x] 4.3 Atualizar corpo do email para mencionar módulos, análises e coaching

## 5. Produtos — Seed

- [x] 5.1 Adicionar `prisma.product.deleteMany()` no seed antes de criar produtos
- [x] 5.2 Criar os 5 novos produtos via `prisma.product.createMany()`: PDF (BASIC), Módulos (PAID), Análise de Gameplay (FULL), Coach (FULL), Acesso ao Sindicato do Titiltei (FULL)
- [x] 5.3 Atualizar log final do seed para mencionar os 5 produtos

## 6. Validação

- [ ] 6.1 Rodar `grep -r "Shaco AD" src/` para confirmar que não sobrou nenhuma ocorrência
- [ ] 6.2 Rodar `next build` sem erros de TypeScript
- [ ] 6.3 Rodar `npx prisma db seed` em dev e verificar que os 5 produtos foram criados corretamente
