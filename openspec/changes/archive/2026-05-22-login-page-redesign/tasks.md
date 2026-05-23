## 1. Estrutura e layout

- [x] 1.1 Abrir `src/app/(auth)/login/page.tsx` e substituir o `<main>` por um layout `flex min-h-screen bg-[#0d0d0d]` com dois filhos: painel esquerdo e painel direito
- [x] 1.2 Painel esquerdo: `hidden lg:flex lg:w-1/2 relative overflow-hidden` com `<img>` Shaco splash como `absolute inset-0 w-full h-full object-cover`
- [x] 1.3 Adicionar dois gradients sobre a imagem: `bg-gradient-to-r from-transparent to-[#0d0d0d]` e `bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/40 to-transparent`
- [x] 1.4 Texto do painel esquerdo ancorado ao bottom-left: label "Guia Definitivo" em `text-[#e3001b]`, headline "Shaco AD" em `font-black uppercase text-5xl`, subtítulo em `text-white/60`
- [x] 1.5 Painel direito: `flex-1 flex flex-col items-center justify-center px-8 py-12`

## 2. Cabeçalho mobile

- [x] 2.1 Dentro do painel direito, adicionar `<div className="lg:hidden text-center mb-10">` com label "Guia Definitivo" em vermelho e "Titiltei" em `font-black uppercase text-3xl`

## 3. Card de login

- [x] 3.1 Criar o card `bg-[#161616] border border-white/5 rounded-xl` com largura máxima `max-w-sm w-full`
- [x] 3.2 Acima do card: label "Titiltei" em `text-[#e3001b] text-xs uppercase tracking-[0.25em]`, heading "Acesse sua conta" em `font-black uppercase text-2xl`, subtítulo "Entre para acessar o guia completo" em `text-white/50 text-sm`
- [x] 3.3 Lista de benefícios (`ul`) com 3 itens e dot `bg-[#e3001b]` como bullet: "Todos os matchups do jungle", "Build completa e runas", "Análise de picks inimigos"
- [x] 3.4 Dentro do card: `<form action={googleSignIn}>` com botão `w-full flex items-center justify-center gap-3 border border-white/20 hover:border-white/40 active:bg-white/5 text-white font-semibold rounded-lg px-4 py-3 transition-colors`
- [x] 3.5 Inline no botão: SVG do Google "G" (4 paths: azul `#4285F4`, verde `#34A853`, amarelo `#FBBC05`, vermelho `#EA4335`), width/height 18, seguido do texto "Entrar com Google"
- [x] 3.6 Footer do card: `<p className="text-center text-white/30 text-xs mt-6">Ao entrar, você concorda com os termos de uso</p>`

## 4. Verificação

- [x] 4.1 Confirmar que `"use server"` está no `googleSignIn` e não há `"use client"` no arquivo
- [x] 4.2 Confirmar que `auth()` e redirect para `/dashboard` estão preservados no topo do componente
- [x] 4.3 Rodar `npm run dev` e verificar layout desktop (≥1024px) e mobile (<1024px) no browser
