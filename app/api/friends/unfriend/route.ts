import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import prisma from '@/db';
import { authOptions } from "@/auth_options";

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions)
    const data = await request.json()

    if(!session){ return NextResponse.json({ error: "Unauthorized" }, { status: 401 }) }
    if(!data.username){ return NextResponse.json({ error: "No username defined" }, { status: 400 }) }

    const friends = await prisma.user.findMany({ // find every user who is a friend of the current user
        where: {
            friend: {
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
                friend: {
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
                friend: {
                    disconnect: { 
                        username: session.user!.username
                    }
                },
            }
        })
    }
}