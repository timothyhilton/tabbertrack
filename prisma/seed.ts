import { PrismaClient } from "@prisma/client"
import { hash } from "bcrypt"
import prisma from '@/db'

async function main() {
    const password = await hash('asdf', 12)
    const user = await prisma.user.upsert({
        where: { email: 'asdf@asdf' },
        update: {},
        create: {
            email: 'asdf@asdf',
            name: 'asdf',
            username: 'asdfusername',
            active: true,
            password: password,
            credentialsProvider: true
        }
    })
    console.log({ user })
}
main()
    .then(() => prisma.$disconnect())
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
    