import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  const email = process.argv[2]
  const password = process.argv[3]

  if (!email || !password) {
    console.error("Uso: tsx prisma/create-admin.ts <email> <senha>")
    process.exit(1)
  }

  if (password.length < 12) {
    console.error("Erro: a senha deve ter pelo menos 12 caracteres.")
    process.exit(1)
  }

  const hash = await bcrypt.hash(password, 12)

  const user = await prisma.user.upsert({
    where: { email },
    update: { password: hash, role: "ADMIN" },
    create: {
      email,
      name: "Admin",
      role: "ADMIN",
      password: hash,
    },
  })

  console.log(`✅ Admin criado/atualizado: ${user.email} (id: ${user.id})`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
