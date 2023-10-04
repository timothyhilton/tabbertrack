import { PrismaClient } from '@prisma/client'
import { compare } from 'bcrypt'
import { NextAuthOptions } from 'next-auth'
import NextAuth from 'next-auth/next'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!
const prisma = new PrismaClient();

const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt'
    },
    providers: [
        CredentialsProvider({
            name: 'Sign in',
            credentials: {
                email: {
                    label: 'Email',
                    type: 'email',
                    placeholder: 'example@example.com'
                },
                password: { label: 'Password', type: 'password'}
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) {
                    return null
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                });
                if (!user){ return null }

                if(!await compare(
                    credentials.password,
                    user.password!
                )) { return null }

                return {
                    id: user.id + '',
                    email: user.email,
                    name: user.name
                }
            }
        }),
        GoogleProvider(
            { clientId: GOOGLE_CLIENT_ID,
              clientSecret: GOOGLE_CLIENT_SECRET },
              
            )
    ],
    callbacks: {
        async signIn({ account, profile }) {
            if(account?.provider == 'credentials'){
                return true
            }
            
            if(!profile?.email){
                throw new Error('No profile')
            }

            await prisma.user.upsert({
                where: {
                    email: profile.email,
                },
                create: {
                    email: profile.email,
                    name: profile.name,
                },
                update: {
                    name: profile.name
                }
            })

            return true
        },
        
        session: ({ session, token }) => {
            console.log('Session Callback', { session, token })
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id
                }
            }
        },

        jwt: ({ token, user }) => {
            console.log('JWT Callback', { token, user })
            if(user){
                return {
                    ...token,
                    id: user.id
                }
            }
            return token
        }
    },
    debug: true
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST, authOptions }