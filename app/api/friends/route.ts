import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server"
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient()

export async function POST(request: NextRequest ) {
    const session = await getServerSession(authOptions)
    const data = await request.json()

    if(!session){ return NextResponse.json({ error: "Unauthorized" }, { status: 401 }) }
    if(!data.username){ return NextResponse.json({ error: "No username defined" }, { status: 400 }) }

    const toUser = await prisma.user.findFirst({
        where: {
            username: data.username
        }
    })
    if(!toUser){ return NextResponse.json({ error: `No user exists with username "${data.username}"` }, { status: 400 }) }
    if(toUser.id == parseInt(session.user!.id)){ return NextResponse.json({ error: "You can't friend yourself, silly!" }, { status: 400 }) }

    const duplicateCheck = await prisma.friendRequest.findFirst({
        where: {
            fromUserId: parseInt(session.user!.id),
            toUserId: toUser.id,
            status: "pending"
        }
    })
    if(duplicateCheck) { return NextResponse.json({ error: `You have already sent a pending friend request to that person` }, { status: 400 }) }

    await prisma.friendRequest.create({
        data: {
            fromUserId: parseInt(session.user!.id),
            toUserId: toUser.id
        }
    })

    return NextResponse.json({ success: 'Friend request sent successfully' }, { status: 201})
}