import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'
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

    // send verification email to user

    const emailData = {
        From: "verify@tabbertrack.com",
        To: user.email,
        Subject: "Account verification for TabberTrack",
        HtmlBody: "hello!",
    };

    try {
        const result = await postmarkClient.sendEmail(emailData);
        console.log('Verification email sent successfully');
    } 
    catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }

    return new NextResponse("created", data)
}