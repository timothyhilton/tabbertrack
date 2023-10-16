import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions)
    const data = await request.json()

    if(!session){ return NextResponse.json({ error: "Unauthorized" }, { status: 401 }) } // todo: am i supposed to do this differently?
    if(!data.username){ return NextResponse.json({ error: "No username defined" }, { status: 400 }) }
    if(!data.verdict){ return NextResponse.json({ error: "No verdict defined" }, { status: 400 }) }

    const requestingUser = await prisma.user.findFirst({
        where: {
            username: data.username
        }
    })
    if(!requestingUser){ return NextResponse.json({ error: "Cannot find a friend request from that user" }, { status: 400 }) }

    const friendRequest = await prisma.friendRequest.findFirst({
        where: {
            fromUserId: requestingUser.id,
            toUserId: parseInt(session.user!.id),
            status: "pending"
        }
    })
    if(!friendRequest){ return NextResponse.json({ error: "Cannot find a friend request from that user" }, { status: 400 }) }

    if(data.verdict == "accept"){
        await prisma.friendRequest.update({
            where: {
                id: friendRequest.id,
                status: "pending"
            },
            data: {
                status: "accepted"
            }
        })

        return NextResponse.json({ success: "Request accepted successfully" }, { status: 201 })
    }
    if(data.verdict == "decline"){
        await prisma.friendRequest.update({
            where: {
                id: friendRequest.id,
                status: "pending"
            },
            data: {
                status: "declined"
            }
        })

        return NextResponse.json({ success: "Request declined successfully" }, { status: 201 })
    }

    return NextResponse.json({ success: "Invalid verdict" }, { status: 400 })
}