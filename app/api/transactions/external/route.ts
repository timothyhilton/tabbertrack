import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/db";

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions)
    const data = await request.json()

    if(!session){ return NextResponse.json({ error: "Unauthorized" }, { status: 401 }) } // todo: find a better way to do this garbage!!
    const userId = parseInt(session.user!.id)
    if(!data.name){ return NextResponse.json({ error: "No name defined" }, { status: 400 }) }
    if(!data.amount){ return NextResponse.json({ error: "No amount defined" }, { status: 400 }) }
    if(!(data.userWhoOwes == "sender" || data.userWhoOwes == "receiver")){ return NextResponse.json({ error: "Invalid owe information defined" }, { status: 400 }) }

    if(data.description.length > 30){ return NextResponse.json({ error: "Description can't be over 30 characters" }, { status: 400 }) }

    function hasTwoOrLessDecimalPlaces(num: number) {
        let decimalPart = (num.toString().split('.')[1] || []).length;
        return decimalPart <= 2;
    }

    if(!hasTwoOrLessDecimalPlaces(data.amount)){ return NextResponse.json({ error: "Amount can't have more than 2 decimal places" }, { status: 400 }) }
    if(data.amount < 0){ return NextResponse.json({ error: "Amount can't be negative" }, { status: 400 }) }

    const externalFriend = await prisma.externalFriend.findFirst({
        where: {
            userId: userId,
            name: data.name
        }
    })
    if(!externalFriend){ return NextResponse.json({ error: "That external friend doesn't exist" }, { status: 400 })}

    await prisma.externalTransaction.create({
        data: {
            userId: userId,
            externalFriendId: externalFriend.id,
            doesUserOwe: (data.userWhoOwes == "sender") ? true : false
        }
    })

    return NextResponse.json({ success: "yay" })
}