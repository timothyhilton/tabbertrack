import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server"
import prisma from '@/db'
import { authOptions } from "@/auth_options";

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions)
    const data = await request.json()

    if(!session){ return NextResponse.json({ error: "Unauthorized" }, { status: 401 }) } // todo: find a better way to do this garbage!!
    if(!data.username){ return NextResponse.json({ error: "No username defined" }, { status: 400 }) }
    if(!data.amount){ return NextResponse.json({ error: "No amount defined" }, { status: 400 }) }
    if(!(data.userWhoOwes == "sender" || data.userWhoOwes == "receiver")){ return NextResponse.json({ error: "Invalid owe information defined" }, { status: 400 }) }

    if(data.description.length > 30){ return NextResponse.json({ error: "Description can't be over 30 characters" }, { status: 400 }) }

    function hasTwoOrLessDecimalPlaces(num: number) {
        let decimalPart = (num.toString().split('.')[1] || []).length;
        return decimalPart <= 2;
    }

    if(!hasTwoOrLessDecimalPlaces(data.amount)){ return NextResponse.json({ error: "Amount can't have more than 2 decimal places" }, { status: 400 }) }
    if(data.amount < 0){ return NextResponse.json({ error: "Amount can't be negative" }, { status: 400 }) }
    
    const toUser = await prisma.user.findFirst({
        where: {
            username: data.username
        }
    })
    if(!toUser){ return NextResponse.json({ error: `No user exists with username "${data.username}"` }, { status: 400 }) }
    if(toUser.id == parseInt(session.user!.id)){ return NextResponse.json({ error: "You can't owe money to yourself, silly!" }, { status: 400 }) }

    const friendCheck = await prisma.user.findMany({
        where: {
            friend: {
                some: {
                    id: parseInt(session.user!.id)
                }
            }
        }
    })
    if(!friendCheck.find(user => user.username == data.username)) { return NextResponse.json({ error: `You aren't friends with that user` }, { status: 400 }) }
    
    await prisma.transaction.create({
        data: {
            fromUserId: parseInt(session.user!.id),
            toUserId: toUser.id,
            amount: data.amount,
            userWhoIsOwedId: (data.userWhoOwes == "sender") ? toUser.id : parseInt(session.user!.id),
            userWhoOwesId: (data.userWhoOwes == "receiver") ? toUser.id : parseInt(session.user!.id),
            description: data.description,
            doesSenderOwe: (data.userWhoOwes == "sender") ? true : false
        }
    })

    return NextResponse.json({ success: "Transaction submitted successfully"}, { status: 201 })
}