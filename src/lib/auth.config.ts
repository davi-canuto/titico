import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"
import type { UserRole } from "@prisma/client"

// Augment next-auth session type — shared across auth.ts and middleware
declare module "next-auth" {
  interface Session {
    user: {
      id?: string
      role?: UserRole
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}

export const authConfig: NextAuthConfig = {
  providers: [
    Google,
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth: session }) {
      return !!session
    },
    jwt({ token, user }) {
      if (user?.id) token.sub = user.id
      return token
    },
    session({ session, token }) {
      if (session.user) {
        if (token.sub) session.user.id = token.sub
        if (token["role"]) session.user.role = token["role"] as UserRole
      }
      return session
    },
  },
}
