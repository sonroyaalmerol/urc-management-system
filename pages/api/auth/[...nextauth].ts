import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "../../../lib/server/prisma"
import { profile } from "console"

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: 'select_account',
          hd: 'addu.edu.ph'
        }
      },
      profile: (_profile) => ({
        id: _profile.sub,
        first_name: _profile.given_name,
        last_name: _profile.family_name,
        name: _profile.name,
        email: _profile.email
      })
    }),
  ],
  pages: {
    signIn: '/login'
  },
  callbacks: {
    async signIn({ account, profile }) {
      if (account.provider === "google") {
        const dbProfile = await prisma.profile.findUnique({
          where: {
            email: profile.email
          }
        })
        
        if (dbProfile) {
          
          return profile.email.endsWith("@addu.edu.ph")
        }

        return false
      }
      return true // Do different verification for other providers that don't have `email_verified`
    },
    async session({ session, user }) {
      const [prismaUser] = await prisma.$transaction([
        prisma.user.findFirst({
          where: {
            id: user.id
          },
          select: {
            id: true,
            image: true,
            email: true,
            profile: {
              select: {
                bridge_institutes: {
                  include: {
                    institute: true
                  }
                },
                first_name: true,
                last_name: true,
                middle_initial: true,
                roles: true
              }
            }
          }
        }),
        prisma.user.update({
          where: {
            id: user.id
          },
          data: {
            profile: {
              connect: {
                email: user.email
              }
            }
          }
        })
      ])

      session.profile = prismaUser.profile
      session.user = prismaUser
      return Promise.resolve(session)
    }
  }
})