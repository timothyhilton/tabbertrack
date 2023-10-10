import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'
import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server'
import { Client } from 'postmark';

const postmarkClient = new Client(process.env.POSTMARK_SERVER_TOKEN!)
const prisma = new PrismaClient()

export async function POST(request: Request) {

    // create account for user

    const data = await request.json()

    const password = await hash(data.password as string, 12)
    
    const user = await prisma.user.create({
        data: {
            name: data.name as string,
            email: data.email as string,
            password: password
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

    postmarkClient.sendEmailWithTemplate({
        "From": "verify@tabbertrack.com",
        "To": user.email,
        "TemplateAlias": "verify",
        "TemplateModel": {
          "person": {
            "name": user.name,
            "activationToken": token.token
          },
          "siteUrl": "http://localhost:3000"
        }
    });

    return new NextResponse("created", data)
}