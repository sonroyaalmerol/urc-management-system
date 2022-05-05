import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "../../../lib/server/prisma"

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      profile: (_profile) => ({
        id: _profile.sub,
        first_name: _profile.given_name,
        last_name: _profile.family_name,
        name: _profile.name,
        email: _profile.email,
        image: _profile.picture,
      })
    }),
  ],
  pages: {
    signIn: '/login'
  },
  callbacks: {
    async signIn({ account, profile }) {
      if (account.provider === "google") {
        return profile.email_verified && profile.email.endsWith("@addu.edu.ph")
      }
      return true // Do different verification for other providers that don't have `email_verified`
    },
    async session({ session, user }) {
      const userRoles = await prisma.user.findFirst({
        where: {
          id: user.id
        },
        select: {
          id: true,
          roles: true
        }
      })
      session.userId = user.id
      session.userRoles = userRoles.roles

      return Promise.resolve(session)
    }
  }
})