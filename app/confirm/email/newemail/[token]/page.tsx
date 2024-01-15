import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import prisma from '@/db'
import { compare } from "bcrypt";
import { signOut } from "next-auth/react";
import AwaitingEmailChange from "@/components/inforeset/awaiting-email-change";
import { Client } from "postmark";
import ErrorComponent from "@/components/error";

const postmarkClient = new Client(process.env.POSTMARK_SERVER_TOKEN!)
const siteUrl = process.env.SITE_URL

interface paramProps{
    params: { token: string }
}

export default async function Confirm({ params }: paramProps) {
    const { token } = params

    const user = await prisma.user.findFirst({
        where: {
            emailChangeAttempts: {
                some: {
                    AND: [
                        {
                            createdAt: {
                                gt: new Date(Date.now() - 24 * 60 *60 * 1000) // 24 hours ago
                            }
                        },
                        {
                            verificationTokenToNewEmail: token
                        }
                    ]
                }
            }
        }
    })

    if(!user){
        return redirect("/login?error=Invalid token")
    }

    // ECA stands for emailChangeAttempt
    const ECA = (await prisma.emailChangeAttempt.findFirst({
        where: {
            verificationTokenToNewEmail: token
        }
    }))!

    if(ECA.cancelled) {return <ErrorComponent error="This request has been cancelled." />}
    
    await prisma.emailChangeAttempt.update({
        where: {
            id: ECA.id
        },
        data: {
            confirmedAt: new Date()
        }
    })

    await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            email: ECA.newEmail
        }
    })

    return <p>You have successfully changed your email!</p>
}