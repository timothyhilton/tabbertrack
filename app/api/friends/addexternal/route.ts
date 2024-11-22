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
            name: data.name
        }
    })
    if(existingExternalFriend){ return NextResponse.json({ error: "Duplicate friend name" }, { status: 400 }) }

    await prisma.externalFriend.create({
        data: {
            name: data.name as string,
            userId: parseInt(session.user!.id)
        }
    })

    return NextResponse.json({ success: "Created external user successfully"}, { status: 201 })
}