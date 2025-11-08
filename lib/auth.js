import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { connectToDB } from './mongodb'
import User from '../models/User'
import bcrypt from 'bcrypt'

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/signin'
  },
  session: { strategy: 'jwt' },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        await connectToDB()
        const user = await User.findOne({ email: credentials.email })
        if (!user || !user.password) return null
        const isValid = await bcrypt.compare(credentials.password, user.password)
        if (!isValid) return null
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id || user.sub
      return token
    },
    async session({ session, token }) {
      if (token?.id) session.user.id = token.id
      return session
    }
  }
}

export default NextAuth(authOptions)
