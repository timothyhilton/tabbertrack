import { PrismaClient } from "@prisma/client"
import { hash } from "bcrypt"

const prisma = new PrismaClient()

async function main() {
    const password = await hash('ex', 12)
    const user = await prisma.user.upsert({
        where: { email: 'ex@ex' },
        update: {},
        create: {
            email: 'ex@ex',
            name: 'test',
            password: password
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
    