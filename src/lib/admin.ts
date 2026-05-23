import { auth } from "@/lib/auth"
import { UserRole } from "@prisma/client"
import { NextResponse } from "next/server"

export async function requireAdmin() {
  const session = await auth()
  if (!session?.user) {
    return { session: null, error: NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 }) }
  }
  if (session.user.role !== UserRole.ADMIN) {
    return { session: null, error: NextResponse.json({ error: "FORBIDDEN" }, { status: 403 }) }
  }
  return { session, error: null }
}
