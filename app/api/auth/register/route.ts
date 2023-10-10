import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function POST(request: Request) {
    const data = await request.json()

    const password = await hash(data.password as string, 12)
    
    const user = await prisma.user.create({
        data: {
            name: data.name as string,
            email: data.email as string,
            password: password
        }
    })

    return new NextResponse("created", data)
}