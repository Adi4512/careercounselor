import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "@/lib/prisma"

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
    })
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token
        const email = token.email as string | undefined || (profile as any)?.email
        if (email) {
          try {
            await prisma.user.upsert({
              where: { email },
              create: {
                email,
                name: (profile as any)?.name ?? undefined,
                image: (profile as any)?.picture ?? (profile as any)?.image ?? undefined,
              },
              update: {
                name: (profile as any)?.name ?? undefined,
                image: (profile as any)?.picture ?? (profile as any)?.image ?? undefined,
              }
            })
          } catch (error) {
            console.error("Failed to upsert user in Prisma:", error)
          }
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.email = session.user.email || (token.email as string | undefined) || null
      }
      return session
    }
  },
  session: {
    strategy: 'jwt',
  },
})

export { handler as GET, handler as POST }