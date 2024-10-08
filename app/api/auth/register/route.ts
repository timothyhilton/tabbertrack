import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'
import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server'
import { Client } from 'postmark';
import prisma from '@/db';
import { validate } from 'email-validator';

const postmarkClient = new Client(process.env.POSTMARK_SERVER_TOKEN!)
const siteUrl = process.env.SITE_URL
const bypassEmailVerification = process.env.BYPASS_EMAIL_VERIFICATION

export async function POST(request: Request) {

    // create account for user

    const data = await request.json()

    // todo: make this... better?
    if(!data.name){return NextResponse.json({ error: "No name defined" }, { status: 400 });}
    if(!data.email){return NextResponse.json({ error: "No email defined" }, { status: 400 });}
    if(!data.username){return NextResponse.json({ error: "No username defined" }, { status: 400 });}
    if(!data.password){return NextResponse.json({ error: "No password defined" }, { status: 400 });}

    const password = await hash(data.password as string, 12)

    if(!validate(data.email)){
        return NextResponse.json({ error: "Email is invalid" }, { status: 400 })
    }

    if(data.username != data.username.replace(/[^a-zA-Z]/ig, "")){
        return NextResponse.json({ error: "Username must only contain letters" }, { status: 400 })
    }

    if(data.username.length > 20){
        return NextResponse.json({ error: "Username must not exceed 20 characters" }, { status: 400 })
    }

    data.username = data.username.toLowerCase();

    if( // check if email has already been used
        await prisma.user.findFirst({
            where: {
                email: data.email as string
            }
        })
    ){
        return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }

    if( // check if username has already been used
        await prisma.user.findFirst({
            where: {
                username: data.username as string
            }
        })
    ){
        return NextResponse.json({ error: "Username already exists" }, { status: 400 });
    }
    
    const user = await prisma.user.create({
        data: {
            name: data.name as string,
            email: data.email as string,
            username: data.username as string,
            password: password,
            credentialsProvider: true,
            active: bypassEmailVerification === "true" ? true : false
        }
    })

    // make verification token

    const token = await prisma.activateToken.create({
        data: {
            token: `${randomUUID()}${randomUUID()}`.replace(/-/g, ''),
            userId: user.id
        }
    })

    // send verification email to user

    try{ 
        const email = await postmarkClient.sendEmailWithTemplate({
            "From": "verify@tabbertrack.com",
            "To": user.email,
            "TemplateAlias": "verify",
            "TemplateModel": {
            "person": {
                "name": user.name,
                "activationToken": token.token
            },
            "siteUrl": siteUrl
        }})
    }
    catch(e) {
        return NextResponse.json({ error: "Something went wrong" }, { status: 400 })
    }

    return new NextResponse("created", data)
}