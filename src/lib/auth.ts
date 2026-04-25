import NextAuth from "next-auth"
import Resend from "next-auth/providers/resend"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db"

const ALLOWED_EMAIL = "strana.vfx@gmail.com"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY,
      from: process.env.EMAIL_FROM ?? "Veretennikov Studio <onboarding@resend.dev>",
    }),
  ],
  pages: {
    signIn: "/admin/signin",
    verifyRequest: "/admin/signin/verify",
    error: "/admin/signin",
  },
  callbacks: {
    async signIn({ user }) {
      if (user.email !== ALLOWED_EMAIL) {
        return false
      }
      return true
    },
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
      }
      return session
    },
  },
  session: { strategy: "database" },
})
