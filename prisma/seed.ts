import { PrismaClient, ContentType, ContentStatus, Difficulty } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({ connectionString: "postgresql://postgres@localhost:5432/titico_dev" })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("🌱 Seeding...")

  // ── Creator ───────────────────────────────────────────────────────────────────
  const titiltei = await prisma.creator.upsert({
    where: { slug: "titiltei" },
    update: {},
    create: {
      slug: "titiltei",
      name: "Titiltei",
      champion: "Shaco",
      active: true,
    },
  })

  // ── Produtos ──────────────────────────────────────────────────────────────────
  await prisma.purchase.deleteMany()
  await prisma.product.deleteMany()
  await prisma.product.createMany({
    data: [
      {
        name: "PDF",
        description: "Material em PDF com guias, matchups e builds para consulta offline.",
        price: 2990,
        active: true,
        creatorId: titiltei.id,
      },
      {
        name: "Módulos",
        description: "Videoaulas completas de jungle: rota, invade, macro e decisão de jogo.",
        price: 6700,
        active: true,
        creatorId: titiltei.id,
      },
      {
        name: "Análise de Gameplay",
        description: "Análise personalizada da sua gameplay com feedback detalhado por Titiltei.",
        price: 9700,
        active: true,
        creatorId: titiltei.id,
      },
      {
        name: "Coach",
        description: "Sessão de coaching ao vivo com Titiltei para acelerar sua evolução.",
        price: 19700,
        active: true,
        creatorId: titiltei.id,
      },
      {
        name: "Acesso ao Lobby do Titiltei",
        description: "Acesso completo e atualizado a toda a plataforma para subir de elo.",
        price: 4700,
        active: true,
        creatorId: titiltei.id,
      },
    ],
  })

  // ── Trilhas ──────────────────────────────────────────────────────────────────
  const trilhaFundamentos = await prisma.trail.upsert({
    where: { slug: "fundamentos-shaco" },
    update: {},
    create: {
      title: "Fundamentos do Shaco",
      slug: "fundamentos-shaco",
      description: "Do básico ao avançado: tudo que você precisa saber para jogar Shaco jungle.",
      thumbnail: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Shaco_0.jpg",
      active: true,
    },
  })

  const trilhaMatchups = await prisma.trail.upsert({
    where: { slug: "matchups-jungle" },
    update: {},
    create: {
      title: "Matchups no Jungle",
      slug: "matchups-jungle",
      description: "Como se comportar contra os junglers mais jogados do meta.",
      thumbnail: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Shaco_71.jpg",
      active: true,
    },
  })

  const trilhaBuilds = await prisma.trail.upsert({
    where: { slug: "builds-situacionais" },
    update: {},
    create: {
      title: "Builds Situacionais",
      slug: "builds-situacionais",
      description: "Qual build montar dependendo da composição inimiga.",
      thumbnail: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Shaco_14.jpg",
      active: true,
    },
  })

  // ── Conteúdos — Vídeos ───────────────────────────────────────────────────────
  const videos = [
    {
      slug: "introducao-shaco-jungle",
      title: "Introdução ao Shaco Jungle",
      thumbnail: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Shaco_0.jpg",
      youtubeId: "dQw4w9WgXcQ",
      duration: "00:18:42",
    },
    {
      slug: "clear-path-otimizado",
      title: "Clear Path Otimizado — Rota de Farm Perfeita",
      thumbnail: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Shaco_4.jpg",
      youtubeId: "dQw4w9WgXcQ",
      duration: "00:22:10",
    },
    {
      slug: "invade-early-game",
      title: "Como Invadir no Early Game e Não Morrer",
      thumbnail: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Shaco_7.jpg",
      youtubeId: "dQw4w9WgXcQ",
      duration: "00:15:33",
    },
    {
      slug: "shaco-ap-vs-ad",
      title: "AP vs AD Shaco — Quando Jogar Cada Um",
      thumbnail: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Shaco_14.jpg",
      youtubeId: "dQw4w9WgXcQ",
      duration: "00:28:05",
    },
    {
      slug: "macro-decisoes-shaco",
      title: "Macro: Onde Estar em Cada Fase do Jogo",
      thumbnail: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Shaco_71.jpg",
      youtubeId: "dQw4w9WgXcQ",
      duration: "00:31:20",
    },
  ]

  const videoContents = []
  for (const v of videos) {
    const c = await prisma.content.upsert({
      where: { slug: v.slug },
      update: { creatorId: titiltei.id },
      create: {
        type: ContentType.VIDEO,
        title: v.title,
        slug: v.slug,
        thumbnail: v.thumbnail,
        creatorId: titiltei.id,
        status: ContentStatus.PUBLISHED,
        publishedAt: new Date(),
        video: { create: { youtubeId: v.youtubeId, duration: v.duration } },
      },
    })
    videoContents.push(c)
  }

  // ── Conteúdos — Matchups ─────────────────────────────────────────────────────
  const matchups = [
    {
      slug: "matchup-graves",
      title: "Shaco vs Graves — Sobrevivendo ao Canhão",
      thumbnail: "https://ddragon.leagueoflegends.com/cdn/15.5.1/img/champion/Graves.png",
      champion: "Graves",
      difficulty: Difficulty.HARD,
      tips: [
        "Nunca troque cedo — Graves ganha todo duelo 1v1 até o nível 6",
        "Jogue para o mapa, não para o duelo",
        "Use caixas para blocar o recuo do Graves",
        "Invada o lado oposto ao dele no early",
      ],
      strategy: "Graves domina completamente o duelo direto no early game. Sua estratégia deve ser evitar qualquer confronto e capitalizar nos outros lados do mapa enquanto ele faz o farm. No mid-late, suas caixas tornam a visão de mapa sua vantagem principal.",
      itemSuggestion: "Duskblade, Edge of Night para sobreviver ao burst",
    },
    {
      slug: "matchup-hecarim",
      title: "Shaco vs Hecarim — Controlando o Ritmo",
      thumbnail: "https://ddragon.leagueoflegends.com/cdn/15.5.1/img/champion/Hecarim.png",
      champion: "Hecarim",
      difficulty: Difficulty.MEDIUM,
      tips: [
        "Hecarim é mais rápido, então antecipe as rotas",
        "Plante caixas nos buffs inimigos para desacelerar o clear dele",
        "Você ganha o duelo depois do nível 6 com clone",
        "Contrabanque Mortal Reminder se ele buildar tanque",
      ],
      strategy: "Hecarim tem clara velocidade de farm, mas é previsível nas rotas. Use suas caixas defensivamente nos objetivos e surpreenda-o com emboscadas. No mid game com 3 itens você tem vantagem clara no 1v1.",
      itemSuggestion: "Mortal Reminder se tanque, Serpent's Fang se ap",
    },
    {
      slug: "matchup-lee-sin",
      title: "Shaco vs Lee Sin — O Duelo de Assassinos",
      thumbnail: "https://ddragon.leagueoflegends.com/cdn/15.5.1/img/champion/LeeSin.png",
      champion: "LeeSin",
      difficulty: Difficulty.HARD,
      tips: [
        "Lee Sin cai muito depois do nivel 9 — aguente o early",
        "Nunca fique em posição de ser kickado para a equipe inimiga",
        "Suas caixas bloqueiam o Q (Sonic Wave) dele",
        "Clone confunde o Ward Hop — use isso a seu favor",
      ],
      strategy: "Lee Sin é extremamente forte no early e early-mid. Jogue passivo até ele cair de relevância por volta do nível 11-13. Suas caixas são seu maior trunfo — use-as para cobrir entradas e forçar ele a usar habilidades no clone.",
      itemSuggestion: "Edge of Night para bloquear o Q inicial",
    },
    {
      slug: "matchup-vi",
      title: "Shaco vs Vi — Escapando da Perseguição",
      thumbnail: "https://ddragon.leagueoflegends.com/cdn/15.5.1/img/champion/Vi.png",
      champion: "Vi",
      difficulty: Difficulty.MEDIUM,
      tips: [
        "Q no momento errado pode te matar — use E para cancelar",
        "Vi tem ultimate com lock-on, seu Q não escapa dela",
        "Build Stopwatch/Zhonya se estiver sofrendo muito",
        "Você ganha o duelo no late com itens completos",
      ],
      strategy: "Vi é linear e previsível. Sua ultimate te encontra mesmo invisível, então o timing de escapar importa. Foque em ganhar na escala — no late game você claramente a supera em damage e utility.",
      itemSuggestion: "Zhonya's Hourglass para absorver o combo dela",
    },
  ]

  const matchupContents = []
  for (const m of matchups) {
    const c = await prisma.content.upsert({
      where: { slug: m.slug },
      update: { creatorId: titiltei.id },
      create: {
        type: ContentType.MATCHUP,
        title: m.title,
        slug: m.slug,
        thumbnail: m.thumbnail,
        creatorId: titiltei.id,
        status: ContentStatus.PUBLISHED,
        publishedAt: new Date(),
        matchup: {
          create: {
            champion: m.champion,
            difficulty: m.difficulty,
            tips: m.tips,
            strategy: m.strategy,
            itemSuggestion: m.itemSuggestion,
          },
        },
      },
    })
    matchupContents.push(c)
  }

  // ── Conteúdos — Builds ───────────────────────────────────────────────────────
  const builds = [
    {
      slug: "build-ad-assassino",
      title: "Build AD Assassino — Máximo Dano em 3 Itens",
      thumbnail: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Shaco_0.jpg",
      champion: "Shaco",
      items: ["Duskblade of Draktharr", "Edge of Night", "Serpent's Fang", "Axiom Arc", "Ravenous Hydra", "Deaths Dance"],
      runes: ["Electrocute", "Sudden Impact", "Eyeball Collection", "Treasure Hunter", "Legend: Alacrity", "Coup de Grace"],
      notes: "Build padrão para burst máximo. Priorize Duskblade sempre como primeiro item — o passive de invisibilidade pós-kill é essencial para sequenciar abates. Edge of Night bloqueia habilidades de skilshot antes do engage.",
    },
    {
      slug: "build-ap-caixas",
      title: "Build AP Caixas — Controle de Zona Absurdo",
      thumbnail: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Shaco_14.jpg",
      champion: "Shaco",
      items: ["Luden's Tempest", "Shadowflame", "Rabadon's Deathcap", "Void Staff", "Zhonya's Hourglass", "Sorcerer's Shoes"],
      runes: ["Dark Harvest", "Sudden Impact", "Eyeball Collection", "Treasure Hunter", "Transcendence", "Gathering Storm"],
      notes: "Foco total em fazer as caixas explodirem com dano massivo. O medo das caixas dura mais e o slow é mais intenso com AP. Exige mais micro mas é devastador em teamfights.",
    },
    {
      slug: "build-tanque-situacional",
      title: "Build Tanque — Quando Seu Time Precisa de Frontline",
      thumbnail: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Shaco_7.jpg",
      champion: "Shaco",
      items: ["Sunfire Aegis", "Demonic Embrace", "Zhonya's Hourglass", "Force of Nature", "Warmog's Armor", "Plated Steelcaps"],
      runes: ["Grasp of the Undying", "Shield Bash", "Conditioning", "Overgrowth", "Legend: Alacrity", "Coup de Grace"],
      notes: "Build não convencional mas eficaz quando você é o único que pode absorver dano. Grasp com Demonic gera muito dano sustentado. Use quando o time tiver 3+ carries frágeis que precisam de proteção.",
    },
  ]

  const buildContents = []
  for (const b of builds) {
    const c = await prisma.content.upsert({
      where: { slug: b.slug },
      update: { creatorId: titiltei.id },
      create: {
        type: ContentType.BUILD,
        title: b.title,
        slug: b.slug,
        thumbnail: b.thumbnail,
        creatorId: titiltei.id,
        status: ContentStatus.PUBLISHED,
        publishedAt: new Date(),
        build: {
          create: {
            champion: b.champion,
            items: b.items,
            runes: b.runes,
            notes: b.notes,
          },
        },
      },
    })
    buildContents.push(c)
  }

  // ── Conteúdos — Artigo ───────────────────────────────────────────────────────
  const artigo = await prisma.content.upsert({
    where: { slug: "psicologia-shaco-blefar" },
    update: { creatorId: titiltei.id },
    create: {
      type: ContentType.ARTICLE,
      title: "A Psicologia do Shaco: Como Fazer o Inimigo Tomar Decisões Erradas",
      slug: "psicologia-shaco-blefar",
      thumbnail: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Shaco_71.jpg",
      creatorId: titiltei.id,
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date(),
      article: {
        create: {
          body: `O Shaco não é apenas um campeão de dano — ele é um campeão psicológico.

Enquanto outros junglers treinam mecânicas de combate, o jogador de Shaco treina algo muito mais valioso: a capacidade de fazer o inimigo acreditar em coisas que não são verdade.

## O Poder do Clone

O Q (Enganar) e o R (Alucinação) existem no mesmo espaço mental. Quando você usa o clone em situações de pressão, não está apenas tentando confundir — está forçando o inimigo a tomar uma decisão incompleta.

Ele precisa decidir: qual é o real? Ele tem menos de um segundo. Sob pressão, humanos erram.

## Caixas Como Linguagem

Cada caixa que você planta é uma mensagem silenciosa: "eu estive aqui". O inimigo que vê uma caixa no rio começa a questionar: ele está perto? Vai invadir? Está armando uma emboscada?

Você pode estar no lado oposto do mapa. Mas a caixa está falando por você.

## A Regra do Blefe

Em poker, você não blefa com baralho ruim para ganhar aquela mão. Você blefa para que no futuro, quando tiver uma boa mão, o inimigo não acredite em você.

No League, funciona igual. A primeira invasão que você faz — mesmo que fracasse — planta uma semente. Da segunda vez, o inimigo hesita. Na terceira, ele warda diferente. Você mudou o comportamento dele sem nem precisar matar.

Isso é Shaco.`,
        },
      },
    },
  })


  // ── Trail Items ───────────────────────────────────────────────────────────────

  for (let i = 0; i < videoContents.length; i++) {
    await prisma.trailItem.upsert({
      where: { trailId_contentId: { trailId: trilhaFundamentos.id, contentId: videoContents[i].id } },
      update: {},
      create: { trailId: trilhaFundamentos.id, contentId: videoContents[i].id, order: i + 1 },
    })
  }
  await prisma.trailItem.upsert({
    where: { trailId_contentId: { trailId: trilhaFundamentos.id, contentId: artigo.id } },
    update: {},
    create: { trailId: trilhaFundamentos.id, contentId: artigo.id, order: videoContents.length + 1 },
  })

  for (let i = 0; i < matchupContents.length; i++) {
    await prisma.trailItem.upsert({
      where: { trailId_contentId: { trailId: trilhaMatchups.id, contentId: matchupContents[i].id } },
      update: {},
      create: { trailId: trilhaMatchups.id, contentId: matchupContents[i].id, order: i + 1 },
    })
  }

  for (let i = 0; i < buildContents.length; i++) {
    await prisma.trailItem.upsert({
      where: { trailId_contentId: { trailId: trilhaBuilds.id, contentId: buildContents[i].id } },
      update: {},
      create: { trailId: trilhaBuilds.id, contentId: buildContents[i].id, order: i + 1 },
    })
  }

  const total = videoContents.length + matchupContents.length + buildContents.length + 1
  console.log(`✅ Seed completo: 5 produtos, ${total} conteúdos, 3 trilhas`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
