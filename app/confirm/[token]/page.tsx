import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import prisma from '@/db'
import { compare } from "bcrypt";
import { signOut } from "next-auth/react";
import AwaitingEmailChange from "@/components/inforeset/awaiting-email-change";

interface paramProps{
    params: { token: string }
}

export default async function Confirm({ params }: paramProps) {
    const { token } = params

    const user = await prisma.user.findFirst({
        where: {
            accountInfoChangeAttempts: {
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
    
    // ACIA stands for accountInfoChangeAttempt
    const ACIA = await prisma.accountInfoChangeAttempt.update({
        where: {
            verificationToken: token
        },
        data: {
            activatedAt: new Date()
        }
    })

    if(ACIA.activatedAt){
        return(
            <AwaitingEmailChange email={ACIA.newEmail} />
        )
    }

    if(ACIA.newEmail == user.email){

        if(await compare("", ACIA.newPasswordHash)){
            ACIA.newPasswordHash = ""
        }

        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                username: ACIA.newUsername,
                name: ACIA.newName,

                // if the new password isn't nothing (aka the user is actually changing it) then set it correctly, otherwise don't change it
                password: ACIA.newPasswordHash == "" ? user.password : ACIA.newPasswordHash
            }
        });
        return redirect("/login")

    } else {

        return(
            <AwaitingEmailChange email={ACIA.newEmail} />
        )
    }
}