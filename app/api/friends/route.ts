import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server"
import prisma from '@/db'
import { authOptions } from "@/auth_options";

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

    const pendingCheck = await prisma.friendRequest.findFirst({
        where: {
            fromUserId: parseInt(session.user!.id),
            toUserId: toUser.id,
            status: "pending"
        }
    })
    if(pendingCheck) { return NextResponse.json({ error: `You have already sent a pending friend request to that person` }, { status: 400 }) }

    const duplicateCheck = await prisma.user.findMany({
        where: {
            friend: {
                some: {
                    id: parseInt(session.user!.id)
                }
            }
        }
    })
    if(duplicateCheck.find(user => user.username == data.username)) { return NextResponse.json({ error: `You are already friends with that person` }, { status: 400 }) }

    await prisma.friendRequest.create({
        data: {
            fromUserId: parseInt(session.user!.id),
            toUserId: toUser.id
        }
    })

    return NextResponse.json({ success: 'Friend request sent successfully' }, { status: 201})
}

export async function GET(request: NextRequest){
    const session = await getServerSession(authOptions)
    if(!session){ return NextResponse.json({ error: "Unauthorized" }, { status: 401 }) }

    const externalFriends = await prisma.externalFriend.findMany({
        where: {
            userId: parseInt(session.user!.id)
        }
    })

    const friends = await prisma.user.findMany({
        where: {
            friend: {
                some: {
                    id: parseInt(session.user!.id)
                }
            }
        }
    })
    
    return(NextResponse.json({ 
        externalFriends: externalFriends.map(friend => friend.name), 
        friends: friends.map(friend => friend.username)
    }, 
    { status: 200 }))
}