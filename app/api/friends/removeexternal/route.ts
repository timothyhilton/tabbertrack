import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "@/auth_options";

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions)
    const data = await request.json()

    if(!session){ return NextResponse.json({ error: "Unauthorized" }, { status: 401 }) } // todo: am i supposed to do this differently?
    if(!data.name){ return NextResponse.json({ error: "No name defined" }, { status: 400 }) }

    const existingExternalFriend = await prisma.externalFriend.findFirst({
        where: {
            name: data.name,
            userId: parseInt(session.user!.id)
        }
    })
    if(!existingExternalFriend){ return NextResponse.json({ error: "Name not found as external friend" }, { status: 400 }) }

    // first delete all transactions to avoid foreign key restraint fail
    await prisma.externalTransaction.deleteMany({
        where: {
            externalFriendId: existingExternalFriend.id
        }
    })

    await prisma.externalFriend.delete({
        where: {
            id: existingExternalFriend.id
        }
    })

    return NextResponse.json({ success: "Removed external user successfully" }, { status: 201 })
}