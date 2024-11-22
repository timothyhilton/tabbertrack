import { compare } from 'bcrypt'
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import prisma from '@/db'

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!

export const authOptions: NextAuthOptions = {
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
                if(!credentials?.email || !credentials.password) {
                    throw new Error('Invalid credentials')
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                }); 
                
                if(!user){ 
                    throw new Error('Invalid credentials')
                }                

                if(!await compare(
                    credentials.password,
                    user.password!
                )) { throw new Error('Invalid credentials') }

                if(!user.active){
                    throw new Error('Please activate your account')
                }

                return {
                    id: user.id + '',
                    email: user.email,
                    username: user.username,
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
            
            // generates a random username for people using google login
            // generates a new username if by chance it generates one that already exists
            // todo: do something less janky here.
            let username = profile!.name!
            while(true){
                if( // break if username is unique
                    !await prisma.user.findFirst({
                        where: {
                            username: username
                        }
                    })
                ) { break }

                username += Math.floor(Math.random() * 10)
            }

            await prisma.user.upsert({
                where: {
                    email: profile.email,
                },
                create: {
                    email: profile.email,
                    name: profile.name,
                    username: username,
                    credentialsProvider: false
                },
                update: {
                    name: profile.name
                }
            })

            return true
        },
        
        session: ({ session, token }) => {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                    username: token.username
                }
            }
        },

        jwt: async ({ token, user, account }) => {
            if(user && account && account.provider == "google"){ // if googleprovider, get the real ID and Username from the database before returning jwt
                const realUser = await prisma.user.findUnique({
                    where: {
                        email: user.email!
                    }
                })
                
                if(realUser){
                    user.id = realUser.id.toString()
                    user.username = realUser.username
                }
            }

            if(user){
                return {
                    ...token,
                    id: user.id,
                    username: user.username
                }
            }
            return token
        }
    },
    pages: {
        signIn: '/login',
        error: '/login'
    },
    debug: true
}