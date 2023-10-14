import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function POST(request: Request) {
    const data = await request.json()

    if(!data.username){
        return NextResponse.json({ error: "No username defined" }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
        where: {
            username: data.username
        }
    })

    if(!user){
        return NextResponse.json({ error: `No user exists with username "${data.username}"` }, { status: 400 });
    }

    return NextResponse.json({ success: 'Friend request sent' }, { status: 201})
}