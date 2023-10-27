import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions)
    const data = await request.json()

    if(!session){ return NextResponse.json({ error: "Unauthorized" }, { status: 401 }) } // todo: find a better way to do this garbage!!
    if(!data.name){ return NextResponse.json({ error: "No username defined" }, { status: 400 }) }
    if(!data.amount){ return NextResponse.json({ error: "No amount defined" }, { status: 400 }) }
    if(!(data.userWhoOwes == "sender" || data.userWhoOwes == "receiver")){ return NextResponse.json({ error: "Invalid owe information defined" }, { status: 400 }) }


}