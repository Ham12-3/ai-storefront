import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { env } from '@/lib/env'
import { roleForEmail } from '@/auth/permissions'

const providers =
  env.AUTH_GOOGLE_ID && env.AUTH_GOOGLE_SECRET
    ? [
        Google({
          clientId: env.AUTH_GOOGLE_ID,
          clientSecret: env.AUTH_GOOGLE_SECRET,
        }),
      ]
    : []

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: env.AUTH_SECRET,
  providers,
  callbacks: {
    signIn({ user }) {
      return Boolean(user.email && roleForEmail(user.email))
    },
    authorized({ auth }) {
      return Boolean(auth?.user?.email && roleForEmail(auth.user.email))
    },
  },
  pages: { signIn: '/admin/sign-in' },
  session: { strategy: 'jwt', maxAge: 8 * 60 * 60 },
  trustHost: true,
})
