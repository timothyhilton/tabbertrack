import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../[...nextauth]/route";
import prisma from "@/db";
import { hash } from "bcrypt";
import { randomUUID } from "crypto";
import { Client } from "postmark";

const postmarkClient = new Client(process.env.POSTMARK_SERVER_TOKEN!)
const siteUrl = process.env.SITE_URL

export async function PUT(request: Request) {

    const data = await request.json()

    if(!data.email){return NextResponse.json({ error: "No email defined" }, { status: 400 });}

    const session = await getServerSession(authOptions)
    if(!session || !session.user){return(NextResponse.json({ error: "Unauthorized" }, { status: 401 }))}

    const emailChangeAttempt = await prisma.emailChangeAttempt.create({
        data: {
            newEmail: data.email,
            userId: parseInt(session.user.id),
            verificationToken: `${randomUUID()}${randomUUID()}`.replace(/-/g, ''),
            verificationTokenToNewEmail: `${randomUUID()}${randomUUID()}`.replace(/-/g, '')
        }
    })

    const email = await postmarkClient.sendEmailWithTemplate({
        "From": "reset@tabbertrack.com",
        "To": session.user!.email!,
        "TemplateAlias": "emailchange",
        "TemplateModel": {
        "person": {
            "name": session.user!.name,
            "activationToken": emailChangeAttempt.verificationToken
        },
        "siteUrl": siteUrl
    }})

    return(NextResponse.json({ success: "Check your email to confirm the changes" }, { status: 201 }))
}