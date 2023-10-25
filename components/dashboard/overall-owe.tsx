import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/db"
import { getServerSession } from "next-auth"

export default async function OverallOwe() {
    const session = await getServerSession(authOptions)

    const friends = await prisma.user.findMany({
        where: {
            friend: {
                some: {
                    id: parseInt(session!.user!.id)
                }
            }
        }
    })

    const balances: { [key: number]: number } = {}

    friends.forEach(friend => balances[friend.id] = 0)
    
    const transactions = await prisma.transaction.findMany({
        where: {
            OR: [
                {
                    userWhoIsOwedId: parseInt(session!.user!.id)
                },
                {
                    userWhoOwesId: parseInt(session!.user!.id)
                }
            ],
            status: "accepted"
        }
    })
    
    transactions.forEach(transaction => {
        if (transaction.userWhoIsOwedId == parseInt(session!.user!.id)) {
            balances[transaction.userWhoOwesId] += transaction.amount
        } else {
            balances[transaction.userWhoIsOwedId] -= transaction.amount
        }
    })

    let moneyUserOwes = 0;
    let moneyUserIsOwed = 0;

    Object.values(balances).forEach(balance => {
        if (balance > 0) {
            moneyUserIsOwed += balance;
        } else if (balance < 0) {
            moneyUserOwes -= balance;
        }
    });

    return(
        <div className="text-lg flex justify-center space-x-44">
            <div>
                <h2 className="flex justify-center">
                    You collectively owe everyone
                </h2>
                <h1 className="text-8xl flex justify-center">
                    {`$${moneyUserOwes.toFixed(2)}`}
                </h1>
            </div>
            <div>
                <h2 className="flex justify-center">
                    Everyone collectively owes you
                </h2>
                <h1 className="text-8xl flex justify-center">
                    {`$${moneyUserIsOwed.toFixed(2)}`}
                </h1>
            </div>
        </div>
    )
}