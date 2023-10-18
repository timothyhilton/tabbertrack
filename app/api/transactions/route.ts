import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server"
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from '@/db'

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions)
    const data = await request.json()

    if(!session){ return NextResponse.json({ error: "Unauthorized" }, { status: 401 }) }
    if(!data.username){ return NextResponse.json({ error: "No username defined" }, { status: 400 }) }
    if(!data.amount){ return NextResponse.json({ error: "No amount defined" }, { status: 400 }) }

    function hasTwoOrLessDecimalPlaces(num: number) {
        let decimalPart = (num.toString().split('.')[1] || []).length;
        return decimalPart <= 2;
    }

    if(!hasTwoOrLessDecimalPlaces(data.amount)){ return NextResponse.json({ error: "Amount can't have more than 2 decimal places" }, { status: 400 }) }
    
    return NextResponse.json({ success: "Transaction submitted successfully "}, { status: 201 })
}