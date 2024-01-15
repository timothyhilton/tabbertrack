import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../../[...nextauth]/route";
import prisma from "@/db";
import { hash } from "bcrypt";
import { randomUUID } from "crypto";
import { Client } from "postmark";

const postmarkClient = new Client(process.env.POSTMARK_SERVER_TOKEN!)
const siteUrl = process.env.SITE_URL

export async function POST(request: Request) {

    const token = await request.json()

    if(!token){return NextResponse.json({ error: "No token defined" }, { status: 400 })}

    const session = await getServerSession(authOptions)
    if(!session || !session.user){return(NextResponse.json({ error: "Unauthorized" }, { status: 401 }))}

    const emailChangeAttempt = await prisma.emailChangeAttempt.findFirst({
        where: {
            verificationToken: token
        }
    })

    if(!emailChangeAttempt){return NextResponse.json({ error: "Invalid token" }, { status: 400 })}

    const email = await postmarkClient.sendEmailWithTemplate({
        "From": "reset@tabbertrack.com",
        "To": emailChangeAttempt.newEmail,
        "TemplateAlias": "newemailverify",
        "TemplateModel": {
        "person": {
            "name": session.user.name,
            "username": session.user.username,
            "activationToken": emailChangeAttempt.verificationTokenToNewEmail
        },
        "siteUrl": siteUrl
    }})

    return(NextResponse.json({ success: "Successfully resent the request" }, { status: 201 }))
}