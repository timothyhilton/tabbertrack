import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

const prisma = new PrismaClient()

interface paramProps{
    params: { token: string }
}

export async function GET(request: NextRequest, { params }: paramProps) {
    const { token } = params

    const user = await prisma.user.findFirst({
        where: {
            activateTokens: {
                some: {
                    AND: [
                        {
                            activatedAt: null,
                        },
                        {
                            createdAt: {
                                gt: new Date(Date.now() - 24 * 60 *60 * 1000) // 24 hours ago
                            }
                        },
                        {
                            token
                        }
                    ]
                }
            }
        }
    })

    if(!user){
        throw new Error('Invalid token')
    }

    await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            active: true
        }
    });

    await prisma.activateToken.update({
        where: {
            token
        },
        data: {
            activatedAt: new Date()
        }
    })

    return redirect("/login")
}