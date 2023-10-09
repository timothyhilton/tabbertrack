import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function POST(data: FormData) {
    /*const password = await hash(data.get('password') as string, 12)*/
    
    /*const user = await prisma.user.create({
        data: {
            name: data.get('name') as string,
            email: data.get('email') as string,
            password: password
        }
    })*/
    console.log(data)
    return new NextResponse("good")
}