## 1. Server Actions

- [x] 1.1 Criar `src/lib/admin-actions.ts` — Server Actions com `"use server"` no topo; importar `auth`, `prisma`, `requireAdmin`, `revalidatePath`, `redirect`
- [x] 1.2 Action `publishContent(id: string)` — PATCH status=PUBLISHED, publishedAt=now; `revalidatePath('/dashboard/admin')`
- [x] 1.3 Action `unpublishContent(id: string)` — PATCH status=DRAFT; `revalidatePath('/dashboard/admin')`
- [x] 1.4 Action `deleteContent(id: string)` — DELETE content; `revalidatePath('/dashboard/admin')`
- [x] 1.5 Action `createContent(formData: FormData)` — POST /api/admin/contents via fetch interno com session cookie; em caso de 409 retornar `{ error: "Slug já em uso" }`; em sucesso `redirect('/dashboard/admin')`
- [x] 1.6 Action `toggleTrail(id: string, active: boolean)` — PATCH trail active; `revalidatePath('/dashboard/admin')`
- [x] 1.7 Action `deleteTrail(id: string)` — DELETE trail; `revalidatePath('/dashboard/admin')`
- [x] 1.8 Action `createTrail(formData: FormData)` — POST /api/admin/trails; em 409 retornar `{ error: "Slug já em uso" }`; em sucesso `redirect('/dashboard/admin?tab=trilhas')`

## 2. SlugInput — componente client

- [x] 2.1 Criar `src/components/admin/SlugInput.tsx` com `'use client'`; recebe `{ titleFieldName?: string }` — escuta `onChange` no input de título e preenche o campo slug slugificando o valor (lowercase, substituir espaços e caracteres especiais por `-`, remover acentos)
- [x] 2.2 O slug gerado é editável pelo admin; `name="slug"` para ser capturado pelo FormData

## 3. Página admin principal (`/dashboard/admin`)

- [x] 3.1 Criar `src/app/dashboard/admin/page.tsx` — Server Component; verificar `session.user.role === ADMIN`, redirecionar para `/dashboard` se não for; ler `searchParams.tab` (padrão `"conteudos"`)
- [x] 3.2 Header: "Painel Admin" com badge vermelho "ADMIN"; link "← Dashboard" para `/dashboard`
- [x] 3.3 Tab navigation: "Conteúdos" e "Trilhas" como `<Link href="?tab=conteudos">` e `<Link href="?tab=trilhas">`; tab ativa com `border-b-2 border-[#e3001b] text-white`, inativa `text-white/50`
- [x] 3.4 Tab Conteúdos: buscar `prisma.content.findMany({ orderBy: { createdAt: 'desc' } })`; botão "Novo conteúdo" → `/dashboard/admin/conteudos/novo`; tabela com colunas: Título, Tipo, Status, Publicado em, Ações
- [x] 3.5 Linha de conteúdo: status badge PUBLISHED = `bg-[#4ade80]/20 text-[#4ade80]` "PUBLICADO" / DRAFT = `bg-white/5 text-white/40` "RASCUNHO"; botão "Publicar" ou "Despublicar" (form com action publishContent/unpublishContent); botão "Deletar" (form com action deleteContent + `confirm` via formAction)
- [x] 3.6 Tab Trilhas: buscar `prisma.trail.findMany({ include: { _count: { select: { items: true } } }, orderBy: { createdAt: 'desc' } })`; botão "Nova trilha" → `/dashboard/admin/trilhas/novo`; tabela com: Título, Slug, Status, Itens, Ações
- [x] 3.7 Linha de trilha: badge "ATIVO" / "INATIVO"; botão toggle (form toggleTrail); botão "Deletar" (form deleteTrail)

## 4. Formulário de novo conteúdo

- [x] 4.1 Criar `src/app/dashboard/admin/conteudos/novo/page.tsx` — Server Component; ler `searchParams.tipo`; se ausente renderizar type picker; se presente renderizar form
- [x] 4.2 Type picker: grid de 5 cards `bg-[#161616] border border-white/10 rounded-xl p-6` — cada card com ícone SVG, nome do tipo, descrição curta; cada card é `<Link href="?tipo=VIDEO">` etc.
- [x] 4.3 Campos comuns do form: input Título, `<SlugInput>`, input Thumbnail URL (opcional), select AccessLevel (FREE / PAID)
- [x] 4.4 Campos específicos VIDEO: input YouTube ID, input Duração (`HH:MM:SS`, opcional)
- [x] 4.5 Campos específicos MATCHUP: input Campeão, select Dificuldade (EASY/MEDIUM/HARD), textarea Tips (uma por linha), textarea Estratégia, input Itens sugeridos (opcional)
- [x] 4.6 Campos específicos BUILD: input Campeão, textarea Itens (um por linha), textarea Runas (uma por linha), textarea Notas (opcional)
- [x] 4.7 Campos específicos ARTICLE: textarea Corpo do artigo (grande)
- [x] 4.8 Campos específicos PDF: input URL do arquivo, input Tamanho em bytes (opcional)
- [x] 4.9 `<form action={createContent}>`: campo hidden `name="tipo"` com o valor do tipo; botão submit "Criar conteúdo" vermelho; link "Cancelar" → `/dashboard/admin`
- [x] 4.10 Exibir erro de formulário: se `error` vier do searchParam (redirect com `?error=...`), mostrar banner vermelho no topo do form

## 5. Formulário de nova trilha

- [x] 5.1 Criar `src/app/dashboard/admin/trilhas/novo/page.tsx` — Server Component com form simples
- [x] 5.2 Campos: input Título, `<SlugInput>`, textarea Descrição (opcional), input Thumbnail URL (opcional)
- [x] 5.3 `<form action={createTrail}>`: botão "Criar trilha" vermelho; link "Cancelar" → `/dashboard/admin?tab=trilhas`
- [x] 5.4 Exibir erro de slug duplicado se `?error=slug` no searchParam

## 6. Verificação

- [x] 6.1 `npx tsc --noEmit` — sem erros
- [x] 6.2 Acessar `/dashboard/admin` sem ser ADMIN — confirmar redirect para `/dashboard`
- [x] 6.3 Acessar `/dashboard/admin` como ADMIN — listar conteúdos e trilhas (vazios se DB vazio)
- [x] 6.4 Criar um conteúdo VIDEO via formulário — confirmar aparece na lista como RASCUNHO
- [x] 6.5 Publicar o conteúdo criado — confirmar badge muda para PUBLICADO
- [x] 6.6 Criar uma trilha — confirmar aparece na tab Trilhas
