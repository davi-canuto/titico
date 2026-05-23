## Context

A plataforma tem "Sindicato do Titiltei" espalhado em 12 arquivos: metadata SEO, templates de email, páginas de UI e o seed do Prisma. A mudança é exclusivamente de strings de texto — nenhum schema, rota, lógica de negócio ou dependência externa muda. O único risco não-trivial é o produto no banco de dados, que pode já ter sido criado com o nome antigo.

## Goals / Non-Goals

**Goals:**
- Substituir todas as strings "Sindicato do Titiltei", "Sindicato" (quando usado como nome da marca) e variantes pelo nome "Bar do Tititliei" / "Bar" em todo o código-fonte.
- Atualizar o seed para que novos ambientes já criem o produto com o nome correto.

**Non-Goals:**
- Atualizar registros existentes no banco de produção — fora do escopo desta change; requer decisão separada.
- Alterar slugs de URL, nomes de tabelas ou qualquer identificador técnico.
- Redesenhar logo, cores ou qualquer elemento visual além do nome.

## Decisions

### Substituição textual direta, sem constante centralizada
Cada arquivo recebe a string atualizada inline. Alternativa descartada: extrair o nome da marca para uma constante compartilhada — adiciona indireção desnecessária para o que são literais de texto espalhados organicamente pela UI.

### Produto no seed: renomear a string, não criar upsert por ID
O seed já usa `createMany`/`upsert` por nome. Mudar o nome no seed é suficiente para novos ambientes. Produção fica fora do escopo desta change — se necessário, um script de migração de dados separado pode atualizar o registro existente.

### "Bar" como forma abreviada
Em CTAs curtos (botões, headers) onde hoje aparece "Entrar no Sindicato", o texto passa a "Entrar no Bar" — mantendo a brevidade. Em contextos completos usa-se "Bar do Tititliei".

## Risks / Trade-offs

- [Banco de dados] Produto "Acesso ao Sindicato do Titiltei" em produção não é atualizado → o nome exibido no checkout/planos virá do banco, não do seed. Mitigação: documentar e executar `UPDATE products SET name = 'Acesso ao Bar do Tititliei' WHERE name = 'Acesso ao Sindicato do Titiltei'` em produção separadamente.
- [SEO] Mudança de `<title>` e OpenGraph invalida cache de redes sociais e pode afetar rankings temporariamente → aceitável; é mudança de marca intencional.
- [Email] Emails já enviados mantêm o nome antigo → sem solução necessária, afeta apenas emails históricos.
