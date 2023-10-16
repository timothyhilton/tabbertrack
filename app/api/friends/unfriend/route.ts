import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"
import { authOptions } from "../../auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient() 

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions)
    const data = await request.json()

    if(!session){ return NextResponse.json({ error: "Unauthorized" }, { status: 401 }) }
    if(!data.username){ return NextResponse.json({ error: "No username defined" }, { status: 400 }) }

    const friends = await prisma.user.findMany({ // find every user who is a friend of the current user
        where: {
            friends: {
                some: {
                    username: data.username
                }
            }
        }
    })

    // filter to find if the user to unfriend is actually a friend of the current user
    if(friends.find((friend) => friend.username == session.user!.username)){
        await prisma.user.update({
            where: { 
                username: session.user!.username 
            },
            data: {
                friends: {
                    disconnect: { 
                        username: data.username 
                    }
                },
            }
        })
        await prisma.user.update({
            where: { 
                username: data.username
            },
            data: {
                friends: {
                    disconnect: { 
                        username: session.user!.username
                    }
                },
            }
        })
    }
}