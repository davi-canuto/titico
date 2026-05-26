import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Corpo da requisição inválido" }, { status: 400 })
  }

  const { name, email, password } = (body ?? {}) as Record<string, unknown>

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return NextResponse.json({ error: "Nome é obrigatório" }, { status: 400 })
  }
  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Email é obrigatório" }, { status: 400 })
  }
  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: "Formato de email inválido" }, { status: 400 })
  }
  if (!password || typeof password !== "string") {
    return NextResponse.json({ error: "Senha é obrigatória" }, { status: 400 })
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Senha deve ter no mínimo 8 caracteres" }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: "Email já em uso" }, { status: 409 })
  }

  try {
    const hashed = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
      data: { name: name.trim(), email, password: hashed },
      select: { id: true, email: true, name: true },
    })

    return NextResponse.json(user, { status: 201 })
  } catch (err: unknown) {
    if (
      err !== null &&
      typeof err === "object" &&
      "code" in err &&
      (err as { code: unknown }).code === "P2002"
    ) {
      return NextResponse.json({ error: "Email já em uso" }, { status: 409 })
    }
    console.error("[register] Failed to create user:", err)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
