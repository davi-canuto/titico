import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./prisma"
import { sendWelcomeEmail } from "./email/send"
import { authConfig } from "./auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  events: {
    createUser({ user }) {
      if (user.email) {
        void sendWelcomeEmail(user.email, user.name ?? "")
      }
    },
  },
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user?.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { role: true },
        })
        token.sub = user.id
        token["role"] = dbUser?.role ?? "MEMBER"
      }
      return token
    },
  },
})
