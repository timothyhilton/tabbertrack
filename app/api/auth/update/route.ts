import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../[...nextauth]/route";
import prisma from "@/db";
import { hash } from "bcrypt";
import { randomUUID } from "crypto";
import { Client } from "postmark";

const postmarkClient = new Client(process.env.POSTMARK_SERVER_TOKEN!)
const siteUrl = process.env.SITE_URL

export async function PUT(request: Request) {

    const data = await request.json()

    if(!data.name){return NextResponse.json({ error: "No name defined" }, { status: 400 });}
    if(!data.username){return NextResponse.json({ error: "No username defined" }, { status: 400 });}
    if(!data.email){return NextResponse.json({ error: "No email defined" }, { status: 400 });}

    const session = await getServerSession(authOptions)
    if(!session || !session.user){return(NextResponse.json({ error: "Unauthorized" }, { status: 401 }))}

    const existingUserWithUsernameCheck = await prisma.user.findFirst({where: {username: data.username}})
    if(existingUserWithUsernameCheck && !(data.username == session.user.username)){return(NextResponse.json({ error: "Someone already has that username" }, { status: 400 }))}

    // if the user isn't changing any sensitive info, and therefore doesn't require email verification
    if((!data.password || data.password == "") && data.email == session.user.email){
        const successful = await prisma.user.update({
            where: {
                id: parseInt(session.user.id)
            },
            data: {
                name: data.name,
                username: data.username
            }
        })
        if(successful){return(NextResponse.json({ success: "User info updated successfully" }, { status: 201 }))}
    }
    else { // if the user is changing their email or password
        if(data.email != session.user!.email){ // i know this is nested, but it's to avoid an unnecessary db query
            const existingUserWithEmailCheck = await prisma.user.findFirst({where: {email: data.email}})
            if(existingUserWithEmailCheck){return(NextResponse.json({ error: "Someone already has that email" }, { status: 400 }))}
        }

        let newPassHash = ""
        if(data.password != ""){
            newPassHash = await hash(data.password as string, 12)
        }

        const accountInfoChangeAttempt = await prisma.accountInfoChangeAttempt.create({
            data: {
                newName: data.name,
                newUsername: data.username,
                newEmail: data.email,
                userId: parseInt(session.user.id),
                newPasswordHash: newPassHash,
                verificationToken: `${randomUUID()}${randomUUID()}`.replace(/-/g, '')
            }
        })

        const email = await postmarkClient.sendEmailWithTemplate({
            "From": "reset@tabbertrack.com",
            "To": session.user!.email!,
            "TemplateAlias": "infochange",
            "TemplateModel": {
            "person": {
                "name": session.user!.name,
                "activationToken": accountInfoChangeAttempt.verificationToken
            },
            "siteUrl": siteUrl
        }})

        return(NextResponse.json({ success: "Check your email to confirm the changes" }, { status: 201 }))
    }
}