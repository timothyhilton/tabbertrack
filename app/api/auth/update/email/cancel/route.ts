import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/db";
import { authOptions } from "@/auth_options";

export async function PUT(request: Request) {

    const token = await request.json()

    if(!token){return NextResponse.json({ error: "No token defined" }, { status: 400 })}

    const session = await getServerSession(authOptions)
    if(!session || !session.user){return(NextResponse.json({ error: "Unauthorized" }, { status: 401 }))}

    const emailChangeAttempt = await prisma.emailChangeAttempt.update({
        where: {
            verificationToken: token
        },
        data: {
            cancelled: true
        }
    })

    if(!emailChangeAttempt){return NextResponse.json({ error: "Invalid token" }, { status: 400 })}

    return(NextResponse.json({ success: "Successfully cancelled the request" }, { status: 201 }))
}