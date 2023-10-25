import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from '@/db'

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions)
    const data = await request.json()

    if(!session){ return NextResponse.json({ error: "Unauthorized" }, { status: 401 }) } // todo: am i supposed to do this differently?
    if(!data.id){ return NextResponse.json({ error: "No username defined" }, { status: 400 }) }
    if(!data.verdict){ return NextResponse.json({ error: "No verdict defined" }, { status: 400 }) }

    const transactionRequest = await prisma.transaction.findFirst({
        where: {
            toUserId: parseInt(session.user!.id),
            status: "pending",
            id: data.id
        }
    })
    if(!transactionRequest){ return NextResponse.json({ error: "Cannot find that transaction request" }, { status: 400 }) }

    if(data.verdict == "accept"){
        await prisma.transaction.update({
            where: {
                id: data.id
            },
            data: {
                status: "accepted"
            }
        })

        return NextResponse.json({ success: "Request accepted successfully" }, { status: 201 })
    }
    else if(data.verdict == "decline"){
        await prisma.transaction.update({
            where: {
                id: data.id
            },
            data: {
                status: "declined"
            }
        })

        return NextResponse.json({ success: "Request declined successfully" }, { status: 200 })
    }
    else { return NextResponse.json({ error: "Invalid verdict" }, { status: 400 }) }
}
