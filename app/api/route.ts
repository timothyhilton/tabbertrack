import { authOptions } from "@/auth_options";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const session = await getServerSession(authOptions)

    if(!session){
        return new NextResponse(JSON.stringify({error: 'unauthorized'}), {
            status: 401
        })
    }

    return NextResponse.json({ authenticated: !!session })
}