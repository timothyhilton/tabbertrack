import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import prisma from '@/db'
import { compare } from "bcrypt";
import { signOut } from "next-auth/react";
import AwaitingEmailChange from "@/components/inforeset/awaiting-email-change";
import { Client } from "postmark";

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
                            verificationToken: token
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
            verificationToken: token
        }
    }))!

    if(ECA.activatedAt){return <AwaitingEmailChange email={ECA.newEmail} />}
    
    await prisma.emailChangeAttempt.update({
        where: {
            verificationToken: token
        },
        data: {
            activatedAt: new Date()
        }
    })

    const email = await postmarkClient.sendEmailWithTemplate({
        "From": "reset@tabbertrack.com",
        "To": ECA.newEmail,
        "TemplateAlias": "newemailverify",
        "TemplateModel": {
        "person": {
            "name": user.name,
            "username": user.username,
            "activationToken": ECA.verificationTokenToNewEmail
        },
        "siteUrl": siteUrl
    }})

    return <AwaitingEmailChange email={ECA.newEmail} />
}